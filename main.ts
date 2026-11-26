// One Honest Line — make.fun one-line bounty entry.
// The program's whole job: emit one brutally honest sentence about
// prompts into entry.txt, exactly as authored, nothing appended.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, kept as fragments so a stray edit cannot silently
// change the wording — the pieces join into the final sentence.
const opening = "Your prompt said 'quick question' and then attached";
const evidence = [
  "a 40-page PDF",
  "a screenshot of a screenshot",
  "and the words 'as discussed.'",
];

const line = `${opening} ${evidence.join(", ")}`;

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
mkdirSync(outDir, { recursive: true });

// Mirror the sealed scorer's gate before anything is emitted:
// UTF-8 text of 1 to 200 characters, never whitespace only.
const charCount = [...line].length;
if (charCount < 1 || charCount > 200 || line.trim().length === 0) {
  throw new Error(`entry fails the gate: ${charCount} chars`);
}

// writeFileSync writes exactly these bytes — no newline is added.
const target = join(outDir, "entry.txt");
writeFileSync(target, line, "utf8");

// Read it back and confirm the file on disk is the line itself,
// byte for byte, so a partial write can never slip through.
if (readFileSync(target, "utf8") !== line) {
  throw new Error("entry.txt does not match the authored line");
}
