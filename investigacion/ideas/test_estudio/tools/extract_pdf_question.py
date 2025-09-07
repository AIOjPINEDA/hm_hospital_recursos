#!/usr/bin/env python3
"""
Extract a multiple-choice question and its options from a PDF by fuzzy-searching the prompt.

Usage:
  python extract_pdf_question.py \
      --pdf "TEST estudios - Certificación Repertorio Definitivo FEA Neurocirugíapdf.pdf" \
      --query "En cuanto al tratamiento quirúrgico de los pacientes con síndrome de espalda fallida es cierto"

Notes:
  - Requires the 'pypdf' package (pure Python). Install with: pip install pypdf
  - Falls back to 'PyPDF2' if 'pypdf' not available.
  - Prints the matching block and attempts to parse A) .. D) options.
"""
from __future__ import annotations
import argparse
import re
import sys
from typing import List, Optional, Tuple

def load_pdf_text(pdf_path: str) -> List[str]:
    try:
        from pypdf import PdfReader  # type: ignore
        reader = PdfReader(pdf_path)
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)
        return pages
    except Exception:
        try:
            from PyPDF2 import PdfReader  # type: ignore
            reader = PdfReader(pdf_path)
            pages = []
            for page in reader.pages:
                text = page.extract_text() or ""
                pages.append(text)
            return pages
        except Exception as e:
            print(f"ERROR: Unable to read PDF: {e}", file=sys.stderr)
            sys.exit(2)

def normalize_ws(s: str) -> str:
    # Collapse multiple spaces/newlines to single spaces for robust searching
    return re.sub(r"\s+", " ", s).strip()

def find_page_with_query(pages: List[str], query: str) -> Optional[int]:
    qnorm = normalize_ws(query).lower()
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if qnorm in pnorm:
            return i
    # Try a looser match: all words must appear
    words = [w for w in re.split(r"\W+", qnorm) if w]
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if all(w in pnorm for w in words[: min(6, len(words))]):
            return i
    return None

def extract_block(text: str, start_pattern: str) -> str:
    # Return text from the first match of start_pattern to the next double newline or until end
    m = re.search(start_pattern, text, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return ""
    start = m.start()
    snippet = text[start:]
    # Heuristic: cut at next question number (e.g., "**302.**" might not exist in PDF), so cut at lines starting with number + dot or at ~1500 chars
    # Here, we simply cap length to avoid dumping entire page.
    return snippet[:1500]

def parse_options(block: str) -> List[Tuple[str, str]]:
    # Try to collect A) ... D) lines, allowing line breaks after the letter.
    lines = block.splitlines()
    out: List[Tuple[str, str]] = []
    current_key = None
    current_text = []
    for ln in lines:
        m = re.match(r"^\s*([A-D])\)\s*(.*)$", ln)
        if m:
            # flush prior
            if current_key is not None:
                out.append((current_key, " ".join(t.strip() for t in current_text).strip()))
            current_key = m.group(1)
            current_text = [m.group(2)]
        else:
            if current_key is not None:
                # continuation of the current option
                current_text.append(ln)
    if current_key is not None:
        out.append((current_key, " ".join(t.strip() for t in current_text).strip()))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True, help="Path to PDF")
    ap.add_argument("--query", required=True, help="Text snippet to locate the question")
    args = ap.parse_args()

    pages = load_pdf_text(args.pdf)
    page_idx = find_page_with_query(pages, args.query)
    if page_idx is None:
        print("No page matched the query.")
        sys.exit(1)
    page_text = pages[page_idx]
    # Build a tolerant start pattern from the query allowing whitespace variations
    qpattern = re.sub(r"\s+", r"\\s+", re.escape(args.query))
    block = extract_block(page_text, qpattern)
    if not block:
        # Fallback to using the first 2000 chars of the page to try parsing options
        block = page_text[:2000]
    print("=== MATCHED PAGE INDEX:", page_idx, "===")
    print(block)
    print("\n--- Parsed options ---")
    options = parse_options(block)
    for k, v in options:
        print(f"{k}) {v}")

if __name__ == "__main__":
    main()
