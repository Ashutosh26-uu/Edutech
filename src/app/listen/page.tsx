import type { Metadata } from "next";
import { AudioRevision } from "@/components/AudioRevision";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Audio revision – listen to key points of your weak topics",
  description: "A commute-friendly playlist that reads aloud the key points and short notes of your weak or due topics, with speed control, Hindi voice and a sleep timer.",
  alternates: { canonical: absoluteUrl("/listen") },
};

export default function ListenPage() {
  return <AudioRevision />;
}
