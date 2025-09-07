#!/usr/bin/env python3
import re
import sys
import json
import pathlib
from typing import List, Dict, Tuple

q_header_re = re.compile(r'^\*\*(\d+)\.\*\*\s*(.*)')
opt_start_re = re.compile(r'^([A-D])\)\s*(.*)')
hint_tail_re = re.compile(r'\(([A-D])\)\s*$')

STOP_SECTIONS = [
    re.compile(r'^##\s*Plantilla\s+de\s+respuestas', re.IGNORECASE),
]

class Question:
    def __init__(self, orig_num: int):
        self.orig_num = orig_num
        self.prompt_lines: List[str] = []
        self.options: Dict[str, List[str]] = {}
        self.option_order: List[str] = []

    def add_prompt_line(self, line: str):
        self.prompt_lines.append(line)

    def add_option_line(self, letter: str, text: str):
        if letter not in self.options:
            self.options[letter] = []
            self.option_order.append(letter)
        self.options[letter].append(text)

    def finalize(self):
        # strip trailing hints from prompt last line
        if self.prompt_lines:
            self.prompt_lines[-1] = hint_tail_re.sub('', self.prompt_lines[-1]).rstrip()
        # strip trailing hints from each option's last line
        for L in list(self.options.keys()):
            if self.options[L]:
                self.options[L][-1] = hint_tail_re.sub('', self.options[L][-1]).rstrip()

    def normalized(self, new_num: int, fill_placeholders=True) -> List[str]:
        # join wrapped prompt lines, collapse extra spaces
        prompt = ' '.join(s.strip() for s in self.prompt_lines if s.strip())
        prompt = re.sub(r'\s{2,}', ' ', prompt).strip()
        out = [f"**{new_num}.** {prompt}"]
        # determine letters A-D
        have = set(self.option_order)
        for letter in ['A','B','C','D']:
            if letter in have:
                text = ' '.join(s.strip() for s in self.options[letter])
                text = re.sub(r'\s{2,}', ' ', text).strip()
                out.append(f"{letter}) {text}")
            else:
                if fill_placeholders:
                    out.append(f"{letter}) [pendiente]")
        return out


def parse_questions(lines: List[str]) -> List[Question]:
    questions: List[Question] = []
    current: Question | None = None
    in_stop = False
    last_option_letter: str | None = None

    for raw in lines:
        line = raw.rstrip('\n')
        s = line.strip()
        if any(rx.search(s) for rx in STOP_SECTIONS):
            in_stop = True
        if in_stop:
            continue
        m = q_header_re.match(s)
        if m:
            # close previous
            if current is not None:
                current.finalize()
                questions.append(current)
            current = Question(int(m.group(1)))
            last_option_letter = None
            # Add prompt remainder on header line
            rest = m.group(2) or ''
            if rest:
                current.add_prompt_line(rest)
            continue
        if current is None:
            # ignore lines before first question
            continue
        # Option start?
        mo = opt_start_re.match(s)
        if mo:
            letter, text = mo.group(1), mo.group(2)
            # detect duplicated blocks: if we already saw A-D and see A again, assume a duplicate set and skip
            if last_option_letter == 'D' and letter == 'A' and set(current.option_order) == {'A','B','C','D'}:
                # skip duplicate ABCD block
                last_option_letter = letter
                continue
            current.add_option_line(letter, text)
            last_option_letter = letter
            continue
        # Continuation line: belongs to last option if exists, else part of prompt
        if last_option_letter is not None and current.option_order:
            current.add_option_line(last_option_letter, s)
        else:
            current.add_prompt_line(s)

    if current is not None:
        current.finalize()
        questions.append(current)
    return questions


def normalize_file(src_path: pathlib.Path, dst_path: pathlib.Path, log_path: pathlib.Path | None = None):
    text = src_path.read_text(encoding='utf-8', errors='ignore')
    lines = text.splitlines()
    qs = parse_questions(lines)
    # Remove exact duplicate option blocks already handled; strip hints handled in finalize
    # Renumber sequentially and emit
    out_lines: List[str] = []
    mapping: List[Tuple[int,int]] = []
    for i, q in enumerate(qs, start=1):
        mapping.append((q.orig_num, i))
        out_lines.extend(q.normalized(i))
        out_lines.append('')
    dst_path.write_text('\n'.join(out_lines).rstrip() + '\n', encoding='utf-8')
    if log_path:
        log = {
            'count': len(qs),
            'mapping': [{'orig': a, 'new': b} for (a,b) in mapping],
        }
        log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding='utf-8')

if __name__ == '__main__':
    # CLI: normalize_fea_md.py [src] [dst]
    base = pathlib.Path(__file__).parents[2] / 'test_estudio'
    default_src = base / 'FEA_Neurocirugia_600_preguntas_v2.md'
    default_dst = base / 'FEA_Neurocirugia_600_preguntas_normalized.md'
    default_log = base / 'FEA_normalize_log.json'
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else default_src
    dst = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else default_dst
    log = default_log
    normalize_file(src, dst, log)
    print('Normalized ->', dst)
