#!/usr/bin/env python3
from __future__ import annotations
"""
Fill placeholder options [pendiente] in the normalized Markdown by extracting the
true options from the source PDF using fuzzy matching on the question prompt.

Usage:
  python fill_placeholders_from_pdf.py \
      --pdf "TEST estudios - Certificación Repertorio Definitivo FEA Neurocirugíapdf.pdf" \
      --md  "FEA_Neurocirugia_600_preguntas_normalized.md" \
      [--dry-run]

Output:
  - Updates the Markdown in place unless --dry-run is used.
  - Prints a compact summary and writes a JSON log alongside the MD file.
"""

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Tuple


# --- PDF helpers (embedded to avoid import path issues) ---
def load_pdf_text(pdf_path: str) -> List[str]:
    try:
        from pypdf import PdfReader  # type: ignore
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
    return re.sub(r"\s+", " ", s).strip()


def find_page_with_query(pages: List[str], query: str) -> Optional[int]:
    qnorm = normalize_ws(query).lower()
    # Exact containment
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if qnorm and qnorm in pnorm:
            return i
    # Relaxed match: require first ~6 significant words exist in page
    words = [w for w in re.split(r"\W+", qnorm) if len(w) > 2]
    if not words:
        return None
    anchor = words[: min(8, len(words))]
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if all(w in pnorm for w in anchor):
            return i
    return None


def extract_block(text: str, query: str) -> str:
    # Build tolerant regex from query allowing whitespace variations
    qpattern = re.sub(r"\s+", r"\\s+", re.escape(query))
    m = re.search(qpattern, text, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        # fallback: return start of page
        return text[:2000]
    start = m.start()
    snippet = text[start:]
    return snippet[:1800]


def parse_options(block: str) -> List[Tuple[str, str]]:
    lines = block.splitlines()
    out: List[Tuple[str, str]] = []
    current_key: Optional[str] = None
    current_text: List[str] = []
    for ln in lines:
        m = re.match(r"^\s*([A-D])\)\s*(.*)$", ln)
        if m:
            if current_key is not None:
                out.append((current_key, " ".join(t.strip() for t in current_text).strip()))
            current_key = m.group(1)
            current_text = [m.group(2)]
        else:
            if current_key is not None:
                current_text.append(ln)
    if current_key is not None:
        out.append((current_key, " ".join(t.strip() for t in current_text).strip()))
    # Clean option tails: cut if another question number starts mid-line
    cleaned: List[Tuple[str, str]] = []
    qnum_re = re.compile(r"\b\d{1,3}\.(?:\s|$)")
    for k, v in out:
        # Remove obvious artifacts like 'Respuesta Correcta: X'
        v = re.split(r"Respuesta\s+Correcta\s*:\s*[A-D]", v, flags=re.IGNORECASE)[0].strip()
        # Truncate at URLs or verification footers
        v = re.split(r"https?://|código_nde|numero de documento electrónico", v, flags=re.IGNORECASE)[0].strip()
        # Truncate at next question number pattern if present
        v = qnum_re.split(v)[0].strip()
        cleaned.append((k, v))
    # Deduplicate by key (keep first non-empty)
    seen: Dict[str, str] = {}
    for k, v in cleaned:
        if k not in seen and v:
            seen[k] = v
    return [(k, seen.get(k, "").strip()) for k in ["A", "B", "C", "D"]]


# --- Markdown parser ---
class Question:
    def __init__(self, number: int, prompt: str, options: Dict[str, str], start_idx: int, end_idx: int):
        self.number = number
        self.prompt = prompt
        self.options = options
        self.start_idx = start_idx
        self.end_idx = end_idx


def parse_md_questions(lines: List[str]) -> List[Question]:
    qs: List[Question] = []
    i = 0
    while i < len(lines):
        m = re.match(r"^\*\*(\d+)\.\*\*\s*$", lines[i])
        if not m:
            i += 1
            continue
        qnum = int(m.group(1))
        start_idx = i
        i += 1
        # Next non-empty line(s) until an option starts are the prompt
        prompt_parts: List[str] = []
        while i < len(lines) and not re.match(r"^[A-D]\)\s", lines[i]):
            if lines[i].strip():
                prompt_parts.append(lines[i].strip())
            i += 1
            # stop if we hit another question (robustness)
            if i < len(lines) and re.match(r"^\*\*\d+\.\*\*\s*$", lines[i]):
                break
        prompt = " ".join(prompt_parts).strip()
        # Collect up to A-D options
        options: Dict[str, str] = {}
        for key in ["A", "B", "C", "D"]:
            if i < len(lines) and re.match(fr"^{key}\)\s", lines[i]):
                options[key] = lines[i].split(")", 1)[1].strip()
                i += 1
        end_idx = i
        if prompt:
            qs.append(Question(qnum, prompt, options, start_idx, end_idx))
    return qs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--md", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    md_path = args.md
    pdf_path = args.pdf
    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()

    questions = parse_md_questions(lines)
    pages = load_pdf_text(pdf_path)

    updated = 0
    results: List[Dict[str, object]] = []
    for q in questions:
        # Check if any option is placeholder
        placeholders = {k: v for k, v in q.options.items() if v.strip().lower() == "[pendiente]"}
        if not placeholders:
            continue
        # Build a stable query from the prompt (strip punctuation and long spaces)
        query = q.prompt
        # Reduce very long prompts
        if len(query) > 220:
            query = query[:220]
        page_idx = find_page_with_query(pages, query)
        if page_idx is None:
            results.append({
                "number": q.number,
                "status": "no_match",
                "prompt": q.prompt,
            })
            continue
        block = extract_block(pages[page_idx], q.prompt)
        opts = parse_options(block)
        filled = 0
        for key, text in opts:
            if key in q.options and (q.options[key].strip().lower() == "[pendiente]" or not q.options[key].strip()):
                if text:
                    # Update the corresponding line in 'lines'
                    # Options start at q.start_idx + 1 + (prompt lines count)
                    # We will search within [q.start_idx, q.end_idx) for the exact option line
                    for li in range(q.start_idx, q.end_idx):
                        if re.match(fr"^{key}\)\s", lines[li]):
                            lines[li] = f"{key}) {text}"
                            filled += 1
                            break
        if filled:
            updated += 1
            results.append({
                "number": q.number,
                "status": "updated",
                "page": page_idx,
                "filled_count": filled,
            })
        else:
            results.append({
                "number": q.number,
                "status": "no_options_parsed",
                "page": page_idx,
            })

    if not args.dry_run:
        with open(md_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")

    # Re-parse the updated content to compute accurate remaining placeholders
    updated_questions = parse_md_questions(lines)
    remaining = sum(1 for q in updated_questions if any(v.strip().lower() == "[pendiente]" for v in q.options.values()))

    log_path = os.path.join(os.path.dirname(md_path), "fill_placeholders_log.json")
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump({
            "updated_questions": updated,
            "remaining_placeholders": remaining,
            "results": results,
        }, f, ensure_ascii=False, indent=2)

    print(f"Questions updated: {updated}")
    print(f"Questions still with placeholders: {remaining}")


if __name__ == "__main__":
    main()
