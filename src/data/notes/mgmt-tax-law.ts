import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "GST: supply, value and place of supply",
      points: [
        "Supply includes sale, transfer, barter, exchange, licence, rental and lease for consideration in the course of business; Schedule I makes some transactions supplies even without consideration (business assets transferred after ITC, supplies between distinct persons)",
        "Schedule III items are neither goods nor services: employee-to-employer services, sale of land, and sale of a building after its completion certificate",
        "Value includes other taxes, incidental charges by the supplier, interest or late fee, and non-government subsidies linked to price; discounts on the invoice at the time of supply are excluded",
        "Intra-state supply (supplier and place of supply in the same state) → CGST + SGST; inter-state → IGST; supplies to SEZ units and exports are inter-state and zero-rated",
        "Goods with movement: place of supply is where movement ends; bill-to-ship-to: the principal place of business of the person who directs the delivery",
        "Services, general rule: a registered recipient's location; services on immovable property: where the property is",
        "Composite supply is taxed at the rate of its principal supply; a mixed supply at the highest rate among its items",
      ],
    },
    {
      heading: "GST: input tax credit, reverse charge, composition",
      points: [
        "ITC conditions: tax invoice, goods or services received, tax actually paid by the supplier, return filed; unpaid suppliers after 180 days → reverse with interest, re-avail on payment",
        "Set-off: IGST credit first, against IGST and then CGST/SGST in any order; CGST credit → CGST then IGST; SGST credit → SGST then IGST; CGST ↔ SGST never",
        "Reverse-charge tax is paid in cash (not from the credit ledger) and can then be claimed as ITC if used for business",
        "Common credit used for taxable and exempt supplies is reversed in proportion to exempt turnover",
        "No ITC on the tax component of capital goods if depreciation is claimed on that tax",
        "Composition taxpayers issue bills of supply, cannot collect tax or claim ITC, and cannot make inter-state outward supplies of goods",
      ],
    },
    {
      heading: "Income tax",
      points: [
        "Five heads: salaries, house property, profits and gains of business or profession, capital gains, other sources",
        "Residential status is determined each year by days of physical presence in India; citizenship is irrelevant except for certain extended rules",
        "Residents are taxed on global income; non-residents only on income received or accruing in India",
        "Capital gain = full value of consideration − cost of acquisition (indexed only where the law still allows) − transfer expenses; holding period decides short-term or long-term",
        "Loss under 'house property' and business losses have their own set-off and carry-forward limits; speculation and capital losses are ring-fenced",
        "TDS: the payer deducts tax at source and deposits it; the payee claims credit against final liability",
      ],
    },
    {
      heading: "Indian Contract Act: formation",
      points: [
        "An invitation to treat (price lists, display of goods, tenders invited) is not an offer",
        "Acceptance must be absolute and communicated; a counter-offer rejects the original offer; silence is not acceptance",
        "Revocation of an offer is possible until the acceptance is posted; revocation of acceptance until it reaches the offeror",
        "Consideration may move from the promisee or any other person; it need not be adequate but must be real and lawful",
        "Exceptions to 'no consideration, no contract': written registered agreement out of natural love and affection, compensation for past voluntary service, promise to pay a time-barred debt in writing",
        "Minor's agreement is void ab initio (Mohori Bibee); necessaries supplied to a minor are paid from his estate, without personal liability",
      ],
    },
    {
      heading: "Void, voidable, quasi-contracts and breach",
      points: [
        "Coercion, undue influence, fraud and misrepresentation → voidable at the option of the aggrieved party; mutual mistake of fact → void",
        "Agreements in restraint of trade, of marriage or of legal proceedings and wagers are void (sale-of-goodwill restraint is an exception)",
        "Quasi-contracts: necessaries to incapable persons, payment by an interested person, non-gratuitous acts, finder of goods, money paid by mistake or coercion",
        "Damages (Hadley v Baxendale): losses arising naturally or within the parties' contemplation; remote losses are not recoverable",
        "Anticipatory breach lets the other party sue at once; supervening impossibility makes the contract void (Section 56)",
      ],
    },
    {
      heading: "Special contracts and Sale of Goods",
      points: [
        "Indemnity: two parties, the indemnifier's liability is primary; guarantee: three parties, the surety's liability is secondary but co-extensive with the debtor's",
        "Surety is discharged by variance in terms without consent, release of the debtor, or loss of security by the creditor",
        "Bailee must take the care a prudent person takes of his own goods; a pledge is a bailment as security for a debt",
        "Agent's authority may be express, implied or apparent; the principal is bound by acts within authority and by ratified acts",
        "Sale of Goods: conditions are essential (breach → repudiate), warranties collateral (breach → damages); caveat emptor has exceptions for fitness for purpose and merchantable quality",
        "Unpaid seller's rights: lien, stoppage in transit (when the buyer is insolvent) and resale",
      ],
    },
    {
      heading: "Negotiable instruments, companies, LLP, consumers, IPR",
      points: [
        "Holder in due course: took the instrument for value, before maturity, in good faith; gets a better title than the transferor",
        "Section 138 cheque dishonour: presentment within validity, notice within 30 days of the bank's memo, payment within 15 days of notice, else complaint within a month",
        "One person company and private company: restrictions on transfer of shares; public company: free transferability",
        "Memorandum defines objects and powers; acts outside it are ultra vires and void, even if ratified (Ashbury Railway)",
        "LLP is a body corporate with perpetual succession; partners' liability is limited to their agreed contribution",
        "Consumer Protection Act, 2019: a person buying for resale or a commercial purpose is not a consumer (except self-employment); commissions are at district, state and national levels",
        "IPR: patents protect inventions, copyright protects original expression, trademarks protect brand identifiers, designs protect visual appearance",
      ],
    },
  ],
};

export default notes;
