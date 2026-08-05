import e01 from "@/assets/evidencce/e-01.jpg";
import e02 from "@/assets/evidencce/e-02.jpg";
import e03 from "@/assets/evidencce/e-03.jpg";
import e04 from "@/assets/evidencce/e-04.jpg";
import e05 from "@/assets/evidencce/e-05.jpg";
import e06 from "@/assets/evidencce/e-06.jpg";
import e07 from "@/assets/evidencce/e-07.jpg";
import e08 from "@/assets/evidencce/e-08.jpg";
import e09 from "@/assets/evidencce/e-09.jpg";
import e10 from "@/assets/evidencce/e-10.jpg";
import e11 from "@/assets/evidencce/e-11.jpg";
import e12 from "@/assets/evidencce/e-12.jpg";

export type EvidenceItem = {
  code: string;
  alt: string;
  src: string;
  rot: number;
  /** 0..100 percent of board width */
  x: number;
  /** 0..100 percent of board height */
  y: number;
  note: string;
};

export const EVIDENCE: EvidenceItem[] = [
  { code: "E-01", alt: "Voicemail transcript", src: e01, rot: -3, x: 12, y: 20, note: "Last voicemail, 02:14." },
  { code: "E-02", alt: "Business card", src: e02, rot: 2.5, x: 30, y: 12, note: "Business card under the desk." },
  { code: "E-03", alt: "Receipt", src: e03, rot: -2, x: 50, y: 22, note: "Receipt for two, unsigned." },
  { code: "E-04", alt: "Door key", src: e04, rot: 3.5, x: 70, y: 13, note: "Door key, no matching lock." },
  { code: "E-05", alt: "Photograph", src: e05, rot: -3.5, x: 88, y: 24, note: "Photograph torn in half." },
  { code: "E-06", alt: "Handwritten note", src: e06, rot: 2, x: 14, y: 52, note: "Handwritten note, ink fresh." },
  { code: "E-07", alt: "Fingerprint sheet", src: e07, rot: -2.5, x: 34, y: 45, note: "Fingerprint sheet, partial." },
  { code: "E-08", alt: "Hotel key", src: e08, rot: 3, x: 54, y: 54, note: "Hotel key — room 404." },
  { code: "E-09", alt: "Map fragment", src: e09, rot: -2, x: 74, y: 46, note: "Map with route marked." },
  { code: "E-10", alt: "Blood report", src: e10, rot: 2.5, x: 25, y: 78, note: "Blood report, type O." },
  { code: "E-11", alt: "Phone log", src: e11, rot: -3, x: 50, y: 86, note: "Phone log, one call out." },
  { code: "E-12", alt: "Diary page", src: e12, rot: 2, x: 75, y: 76, note: "Diary page, final entry." },
];

export const EVIDENCE_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [1, 6],
  [2, 7],
  [3, 8],
  [4, 8],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [6, 10],
  [7, 11],
  [8, 11],
  [9, 10],
  [10, 11],
];
