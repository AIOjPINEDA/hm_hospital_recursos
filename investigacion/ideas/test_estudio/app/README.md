# Simulacro — FEA Neurocirugía (App)

App web mínima para practicar preguntas del banco normalizado.

## Requisitos
- Python 3 (usa el venv del repo)
- Dependencias: Flask
- Ficheros necesarios (en `investigacion/ideas/test_estudio/`):
  - `FEA_Neurocirugia_600_preguntas_normalized.md` (banco, canónico)
  - `FEA_Neurocirugia_600_preguntas_answer_key.md` (clave)

Instala Flask si hace falta:
```zsh
"/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/.venv/bin/pip" install flask
```

## Ejecutar
Recomendado (puerto 8787, accesible en 127.0.0.1):
```zsh
HOST=0.0.0.0 PORT=8787 \
"/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/.venv/bin/python" \
"investigacion/ideas/test_estudio/app/quiz_app.py"
```
Abrir en el navegador:
- http://127.0.0.1:8787
- Salud/health local: http://127.0.0.1:8787/healthz

Variables útiles:
- `PORT`: puerto (p. ej. 5000, 8787)
- `HOST`: interfaz (por defecto 127.0.0.1; usar `0.0.0.0` si hay restricciones)
- `QUIZ_SECRET`: clave de sesión (cookies)

Ejemplos:
```zsh
# Puerto por defecto 5000
"/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/.venv/bin/python" \
"investigacion/ideas/test_estudio/app/quiz_app.py"

# Cambiar puerto
PORT=8000 \
"/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/.venv/bin/python" \
"investigacion/ideas/test_estudio/app/quiz_app.py"

# Definir clave de sesión
QUIZ_SECRET="cambia-esta-clave" \
"/Users/jaimepm/Library/Mobile Documents/com~apple~CloudDocs/Work/HM Hospital/.venv/bin/python" \
"investigacion/ideas/test_estudio/app/quiz_app.py"
```

## Uso
- Aleatorio (sin repetir):
  - “Siguiente” para nueva pregunta; no se repite en la sesión.
  - Indicador “servidas X/Y”.
- Manual:
  - Selecciona “Manual”, escribe nº y pulsa “Ir” o “Siguiente”.
- Reiniciar sesión:
  - Botón “Reiniciar sesión”.
- Corrección:
  - Tras elegir opción, muestra correcto/incorrecto (no revela antes).

## Solución de problemas
- 403 “Access denied”:
  - Ejecuta con `HOST=0.0.0.0` y usa puerto alternativo (p. ej. `PORT=8787`).
  - Prueba en modo incógnito o desactiva extensiones de seguridad.
- 404 `favicon.ico`:
  - Esperado; no afecta.
- Puerto ocupado:
  - Cambia `PORT`.
- Flask no instalado:
  - Instala con el comando de Requisitos.

## Despliegue en Render
- URL: https://hm-hospital-recursos.onrender.com/
- Health check: https://hm-hospital-recursos.onrender.com/healthz
- Root Directory (Blueprint): `investigacion/ideas/test_estudio`
- Build: `pip install -r app/requirements.txt`
- Start: `cd app && gunicorn -b 0.0.0.0:$PORT quiz_app:app`
  - La app usa siempre el banco canónico `FEA_Neurocirugia_600_preguntas_normalized.md`.

## Estructura
- `quiz_app.py`: servidor Flask y APIs (`/api/random`, `/api/question/<n>`, `/api/check`, `/api/reset`).
- `templates/index.html`: UI.
- `static/styles.css`: estilos.

Para parar el servidor: `Ctrl + C` en la terminal.
