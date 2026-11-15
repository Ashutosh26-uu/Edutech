// The RSS reader behind the editors' headline list (PIB feed format).
import assert from "node:assert/strict";
import { decodeXml, parseRss } from "../src/lib/rss.ts";

const feed = `﻿<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Press Information Bureau </title>
<item><title>Cabinet approves &amp; notifies the &#8216;New Scheme&#8217;</title><link>https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1</link></item>
<item><title><![CDATA[RBI <b>keeps</b> repo rate unchanged]]></title><link>https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2</link><pubDate>Sun, 15 Nov 2026 09:30:00 GMT</pubDate></item>
<item><title>Duplicate</title><link>https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1</link></item>
<item><title>Plain http is dropped</title><link>http://pib.gov.in/x</link></item>
<item><title>Other host is dropped</title><link>https://evil.example.com/pib.gov.in</link></item>
<item><title>Look-alike host is dropped</title><link>https://pib.gov.in.evil.com/x</link></item>
<item><title>   </title><link>https://pib.gov.in/empty-title</link></item>
<item><title>Bad link is dropped</title><link>not a url</link></item>
<item><title>Bad date is null</title><link>https://pib.gov.in/x?PRID=3</link><pubDate>someday</pubDate></item>
</channel></rss>`;

const items = parseRss(feed, ["pib.gov.in"]);
assert.deepEqual(
  items.map((i) => i.title),
  ["Cabinet approves & notifies the ‘New Scheme’", "RBI keeps repo rate unchanged", "Bad date is null"],
);
assert.equal(items[0].link, "https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1");
assert.equal(items[0].date, null);
assert.equal(items[1].date, Date.parse("2026-11-15T09:30:00Z"));
assert.equal(items[2].date, null);
assert.equal(parseRss(feed, ["pib.gov.in"], 2).length, 2);
assert.deepEqual(parseRss("<html>not a feed</html>", ["pib.gov.in"]), []);
assert.equal(decodeXml("  a&lt;b&gt;  &#x41;\n c "), "a<b> A c");

console.log("headlines: ok");
