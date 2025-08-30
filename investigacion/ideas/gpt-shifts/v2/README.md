# gpt-shifts v2 (Simplificado)

Objetivo
- Instrucciones y archivos mínimos para que un GPT (GPT Builder) interprete cuadros de turnos HM Montepríncipe y produzca CSV/JSON fiables sin sobre-ingeniería.

Estructura propuesta
- SYSTEM_PROMPT.md — Prompt del sistema minimalista específico para GPT Builder.
- diccionario_turnos_hmmp.json — Única fuente de horarios y reglas. No hardcodear en el modelo.
- plantilla_salida_eventos_global.csv — Header de referencia para mode=all_doctors.
- plantilla_salida_eventos_medico.csv — Header de referencia para mode=single_doctor.
- Ejemplo real de cuadrante: ../pdfs/Septiembre prov6.pdf

Uso rápido en GPT Builder
1) Crea el GPT y pega el contenido de SYSTEM_PROMPT.md como mensaje de sistema.
2) Sube como archivos de conocimiento: diccionario_turnos_hmmp.json, las dos plantillas CSV y (opcionalmente) el PDF de ejemplo.
3) Lanza una conversación indicando mode (all_doctors o single_doctor), el mes/año, y adjunta el PDF del mes.
4) Recibirás CSV (y JSON si single_doctor). Si hay ambigüedades, el GPT pedirá sólo lo esencial.

Notas
- Mantén actualizado el diccionario_turnos_hmmp.json con cambios futuros de horarios/reglas.
- El GPT no debe navegar ni inventar horarios.
- Si el PDF es escaneado y mala calidad, sube capturas por filas.

