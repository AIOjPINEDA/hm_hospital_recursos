#!/usr/bin/env python3
from __future__ import annotations
"""
Generate an answer key for the normalized Markdown by extracting
the "Respuesta Correcta: X" from the source PDF for each question.

Outputs:
  - FEA_Neurocirugia_600_preguntas_answer_key.json
  - FEA_Neurocirugia_600_preguntas_answer_key.md

Usage:
  python generate_answer_key.py \
      --pdf "TEST estudios - Certificación Repertorio Definitivo FEA Neurocirugíapdf.pdf" \
      --md  "FEA_Neurocirugia_600_preguntas_normalized.md"
"""

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Tuple


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
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if qnorm and qnorm in pnorm:
            return i
    words = [w for w in re.split(r"\W+", qnorm) if len(w) > 2]
    if not words:
        return None
    anchor = words[: min(10, len(words))]
    for i, p in enumerate(pages):
        pnorm = normalize_ws(p).lower()
        if all(w in pnorm for w in anchor):
            return i
    return None


def extract_block_from_index(text: str, start_idx: int, max_len: int = 2000) -> str:
    return text[start_idx : start_idx + max_len]


def find_query_index(text: str, query: str) -> int:
    # Try exact whitespace-insensitive search
    qpattern = re.sub(r"\s+", r"\\s+", re.escape(query))
    m = re.search(qpattern, text, flags=re.IGNORECASE | re.DOTALL)
    if m:
        return m.start()
    # Fallback: find first significant word and locate it
    words = [w for w in re.split(r"\W+", query) if len(w) > 3]
    for w in words[:5]:
        m = re.search(re.escape(w), text, flags=re.IGNORECASE)
        if m:
            return max(0, m.start() - 80)
    return 0


def parse_correct_answer(block: str) -> Optional[str]:
    m = re.search(r"Respuesta\s+Correcta\s*:\s*([A-D])", block, flags=re.IGNORECASE)
    if m:
        return m.group(1).upper()
    return None


class Question:
    def __init__(self, number: int, prompt: str):
        self.number = number
        self.prompt = prompt


def parse_md_questions(md_text: str) -> List[Question]:
    lines = md_text.splitlines()
    i = 0
    qs: List[Question] = []
    while i < len(lines):
        m = re.match(r"^\*\*(\d+)\.\*\*\s*$", lines[i])
        if not m:
            i += 1
            continue
        num = int(m.group(1))
        i += 1
        prompt_parts: List[str] = []
        while i < len(lines) and not re.match(r"^[A-D]\)\s", lines[i]) and not re.match(r"^\*\*\d+\.\*\*\s*$", lines[i]):
            if lines[i].strip():
                prompt_parts.append(lines[i].strip())
            i += 1
        prompt = " ".join(prompt_parts).strip()
        qs.append(Question(num, prompt))
        # Skip options
        while i < len(lines) and re.match(r"^[A-D]\)\s", lines[i]):
            i += 1
    return qs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--md", required=True)
    args = ap.parse_args()

    with open(args.md, "r", encoding="utf-8") as f:
        md_text = f.read()
    questions = parse_md_questions(md_text)
    pages = load_pdf_text(args.pdf)

    answer_key: Dict[int, str] = {}
    log: List[Dict[str, object]] = []
    for q in questions:
        query = q.prompt
        if len(query) > 240:
            query = query[:240]
        page_idx = find_page_with_query(pages, query)
        if page_idx is None:
            log.append({"number": q.number, "status": "page_not_found"})
            continue
        page_text = pages[page_idx]
        start_idx = find_query_index(page_text, query)
        block = extract_block_from_index(page_text, start_idx, max_len=2200)
        ans = parse_correct_answer(block)
        if ans is None:
            # Try extending into the next page
            if page_idx + 1 < len(pages):
                combined = block + "\n\n" + pages[page_idx + 1][:1000]
                ans = parse_correct_answer(combined)
        if ans is None:
            log.append({"number": q.number, "status": "answer_not_found", "page": page_idx})
            continue
        answer_key[q.number] = ans
        log.append({"number": q.number, "status": "ok", "page": page_idx, "answer": ans})

    # Write JSON
    base_dir = os.path.dirname(os.path.abspath(args.md))
    json_path = os.path.join(base_dir, "FEA_Neurocirugia_600_preguntas_answer_key.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"answers": answer_key, "log": log}, f, ensure_ascii=False, indent=2)

    # Write Markdown
    md_out_path = os.path.join(base_dir, "FEA_Neurocirugia_600_preguntas_answer_key.md")
    lines_out = ["# Clave de respuestas — FEA Neurocirugía (normalizado)", ""]
    for num in sorted(answer_key.keys()):
        lines_out.append(f"- {num}. {answer_key[num]}")
    lines_out.append("")
    # Summary of missing
    missing = [q.number for q in questions if q.number not in answer_key]
    if missing:
        lines_out.append("## No localizadas")
        lines_out.append("")
        lines_out.append(", ".join(str(n) for n in missing))
        lines_out.append("")
    with open(md_out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines_out))

    print(f"Answers found: {len(answer_key)} / {len(questions)}")
    if missing:
        print(f"Missing answers for {len(missing)} questions. See Markdown output for list.")


if __name__ == "__main__":
    main()
