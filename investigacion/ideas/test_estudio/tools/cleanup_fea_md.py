#!/usr/bin/env python3
import re, sys, json, pathlib

SRC = pathlib.Path(__file__).parents[2] / 'test_estudio' / 'FEA_Neurocirugia_600_preguntas_v2.md'
OUT = pathlib.Path(__file__).parents[2] / 'test_estudio' / 'FEA_Neurocirugia_600_preguntas_clean.md'
LOG = pathlib.Path(__file__).parents[2] / 'test_estudio' / 'FEA_cleanup_log.json'

text = SRC.read_text(encoding='utf-8', errors='ignore')
lines = text.splitlines()

q_re = re.compile(r'^(\*\*)(\d+)(\.\*\*)(\s*)(.*)')
opt_re = re.compile(r'^([A-D])\) (.*)')
hint_tail = re.compile(r'\(([A-D])\)\s*$')

clean = []
log = {
  'duplicates': [],
  'collapsed_option_sets': [],
  'removed_hints': [],
  'missing_options_flagged': [],
}

current_q = None
current_q_start = None
current_opts = []
last_q_line = None
seen_qnums = {}

for idx, raw in enumerate(lines, start=1):
    s = raw.rstrip('\n')
    m = q_re.match(s.strip())
    if m:
        # finalize previous
        if current_q is not None:
            # flag missing options
            if len(current_opts) == 0:
                clean.append('> [!WARNING] Falta el bloque de opciones (A-D) en esta pregunta.')
                log['missing_options_flagged'].append({'q': current_q, 'at_line': len(clean)})
            elif len(current_opts) < 4:
                clean.append(f'> [!WARNING] Opciones incompletas detectadas: {"".join(current_opts)}')
                log['missing_options_flagged'].append({'q': current_q, 'got': ''.join(current_opts), 'at_line': len(clean)})
            elif len(current_opts) > 4:
                # collapse duplicated ABCD sets (A..D A..D)
                if current_opts[:4] == ['A','B','C','D'] and current_opts[4:8] == ['A','B','C','D']:
                    log['collapsed_option_sets'].append({'q': current_q})
                    # nothing to do here, we already appended lines as-is; we will keep the first set implicitly
                else:
                    # leave as-is but mark
                    clean.append(f'> [!WARNING] Número inusual de opciones: {len(current_opts)}')
        # start new question
        current_q = int(m.group(2))
        current_q_start = len(clean) + 1
        last_q_line = None
        current_opts = []
        # check duplicate
        if current_q in seen_qnums:
            clean.append(f'> [!NOTE] Número de pregunta duplicado con la pregunta en línea {seen_qnums[current_q]}')
            log['duplicates'].append({'q': current_q, 'first_at_clean_line': seen_qnums[current_q], 'dup_at_src_line': idx})
        else:
            seen_qnums[current_q] = current_q_start
        # remove embedded hint in same line tail if exists
        q_line = s
        if hint_tail.search(q_line.strip()):
            q_line = hint_tail.sub('', q_line).rstrip()
            log['removed_hints'].append({'q': current_q, 'line': idx, 'where': 'question'})
        clean.append(q_line)
    else:
        # not a question line
        if current_q is not None and opt_re.match(s.strip()):
            # option line
            if hint_tail.search(s.strip()):
                s = hint_tail.sub('', s).rstrip()
                log['removed_hints'].append({'q': current_q, 'line': idx, 'where': 'option'})
            letter = s.strip()[0]
            # if we detect a repeated set, skip duplicates after first ABCD
            if len(current_opts) >= 4 and current_opts[:4] == ['A','B','C','D']:
                # we are in a repeated block if pattern repeats
                # only record but skip appending duplicated options
                if current_opts[4:8] != ['A','B','C','D']:
                    # allow at most 8 to identify duplication
                    pass
                # do not append duplicate block
            else:
                clean.append(s)
            current_opts.append(letter)
        else:
            # any other text
            if current_q is not None and hint_tail.search(s.strip()):
                s = hint_tail.sub('', s).rstrip()
                log['removed_hints'].append({'q': current_q, 'line': idx, 'where': 'trailing'})
            clean.append(s)

# finalize last
if current_q is not None:
    if len(current_opts) == 0:
        clean.append('> [!WARNING] Falta el bloque de opciones (A-D) en esta pregunta.')
        log['missing_options_flagged'].append({'q': current_q, 'at_line': len(clean)})
    elif len(current_opts) < 4:
        clean.append(f'> [!WARNING] Opciones incompletas detectadas: {"".join(current_opts)}')
        log['missing_options_flagged'].append({'q': current_q, 'got': ''.join(current_opts), 'at_line': len(clean)})
    elif len(current_opts) > 4:
        if current_opts[:4] == ['A','B','C','D'] and current_opts[4:8] == ['A','B','C','D']:
            log['collapsed_option_sets'].append({'q': current_q})
        else:
            clean.append(f'> [!WARNING] Número inusual de opciones: {len(current_opts)}')

# write outputs
OUT.write_text('\n'.join(clean) + '\n', encoding='utf-8')
LOG.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding='utf-8')
print('Wrote', OUT)
print('Log at', LOG)
