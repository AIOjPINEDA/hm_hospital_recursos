#!/usr/bin/env python3
from __future__ import annotations
import json
import os
import random
import re
from pathlib import Path
from typing import Dict, List

from flask import Flask, jsonify, render_template, request, session

BASE_DIR = Path(__file__).resolve().parent.parent  # points to test_estudio
# Canonical bank paths (single source of truth)
MD_PATH = BASE_DIR / "FEA_Neurocirugia_600_preguntas_normalized.md"
ANS_JSON_PATH = BASE_DIR / "FEA_Neurocirugia_600_preguntas_answer_key.json"
ANS_MD_PATH = BASE_DIR / "FEA_Neurocirugia_600_preguntas_answer_key.md"


def parse_md_questions(md_text: str) -> List[Dict]:
    lines = md_text.splitlines()
    i = 0
    questions: List[Dict] = []
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
        options: Dict[str, str] = {}
        for key in ["A", "B", "C", "D"]:
            if i < len(lines) and re.match(fr"^{key}\)\s", lines[i]):
                options[key] = lines[i].split(")", 1)[1].strip()
                i += 1
        if prompt and len(options) == 4:
            questions.append({
                "number": num,
                "prompt": prompt,
                "options": options,
            })
    return questions


def parse_md_answer_key(md_text: str) -> Dict[str, str]:
    answers: Dict[str, str] = {}
    for line in md_text.splitlines():
        m = re.match(r"^\s*[-*]\s*(\d+)\.?\s*([A-D])\s*$", line.strip())
        if m:
            answers[m.group(1)] = m.group(2).upper()
    return answers


def load_data():
    # Always load the canonical normalized bank
    md_text = MD_PATH.read_text(encoding="utf-8")
    questions = parse_md_questions(md_text)
    answers: Dict[str, str] = {}
    if ANS_JSON_PATH.exists():
        ans_data = json.loads(ANS_JSON_PATH.read_text(encoding="utf-8"))
        answers = {str(k): v for k, v in ans_data.get("answers", {}).items()}
    elif ANS_MD_PATH.exists():
        answers = parse_md_answer_key(ANS_MD_PATH.read_text(encoding="utf-8"))
    else:
        # No answer file found; proceed without answers (checks will error)
        answers = {}
    return questions, answers


app = Flask(__name__, template_folder=str(Path(__file__).parent / "templates"), static_folder=str(Path(__file__).parent / "static"))
# Secret key for client sessions (for local dev; override with env QUIZ_SECRET in production)
app.secret_key = os.environ.get("QUIZ_SECRET", "dev-secret-change-me")

QUESTIONS, ANSWERS = load_data()


@app.route("/")
def index():
    return render_template("index.html", total=len(QUESTIONS))


@app.get("/healthz")
def healthz():
    """Lightweight health endpoint for Render and uptime checks."""
    return "ok", 200


@app.get("/api/info")
def api_info():
    """Return loaded bank metadata (file and totals)."""
    return jsonify({
        "mdFile": str(MD_PATH.name),
        "total": len(QUESTIONS),
    })


def get_question_by_number(num: int):
    # You can optimize by indexing a dict; list scan is fine for 603 items
    for q in QUESTIONS:
        if q["number"] == num:
            return q
    return None


@app.route("/api/random")
def api_random():
    # Session-based non-repeating random draw
    served = session.get("served", [])
    served_set = set(int(x) for x in served if str(x).isdigit())
    remaining = [q for q in QUESTIONS if q["number"] not in served_set]
    if not remaining:
        return jsonify({
            "done": True,
            "message": "No quedan preguntas sin repetir en esta sesión. Pulsa reiniciar para comenzar de nuevo.",
            "total": len(QUESTIONS),
            "servedCount": len(served_set),
        }), 200
    q = random.choice(remaining)
    # Mark as served
    served_set.add(q["number"])
    session["served"] = list(sorted(served_set))
    session.modified = True
    return jsonify({
        "number": q["number"],
        "prompt": q["prompt"],
        "options": q["options"],
        "total": len(QUESTIONS),
        "servedCount": len(served_set),
    })


@app.route("/api/question/<int:number>")
def api_question(number: int):
    q = get_question_by_number(number)
    if not q:
        return jsonify({"ok": False, "error": "Número de pregunta fuera de rango."}), 404
    return jsonify({
        "ok": True,
        "number": q["number"],
        "prompt": q["prompt"],
        "options": q["options"],
        "total": len(QUESTIONS),
    })


@app.route("/api/reset", methods=["POST"])
def api_reset():
    session["served"] = []
    session.modified = True
    return jsonify({"ok": True, "message": "Sesión reiniciada"})


@app.route("/api/check", methods=["POST"])
def api_check():
    data = request.get_json(force=True) or {}
    number = str(data.get("number"))
    choice = str(data.get("choice", "")).strip().upper()
    correct = ANSWERS.get(number)
    if not correct:
        return jsonify({"ok": False, "error": "No se encontró la respuesta de esta pregunta."}), 400
    return jsonify({
        "ok": True,
        "correct": choice == correct,
        "correctAnswer": correct,
    })


def main():
    port = int(os.environ.get("PORT", "5000"))
    host = os.environ.get("HOST", "127.0.0.1")
    app.run(host=host, port=port, debug=True)


if __name__ == "__main__":
    main()
