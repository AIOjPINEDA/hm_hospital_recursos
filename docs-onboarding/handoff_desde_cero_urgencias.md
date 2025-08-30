# Handoff Técnico – Normalización y Auditoría de Documento Clínico de Urgencias

## 1. Propósito
Transformar un documento Markdown clínico heterogéneo (plantillas de Urgencias) en un único documento final reestructurado, ordenado y coherente sin pérdida de información.

## 2. Alcance
Incluye solo la reorganización y estandarización del texto dentro de un documento final. Excluye validación médica, creación de scripts, generación de reportes auxiliares o cualquier artefacto adicional.

## 3. Entrada
Documento Markdown original (única fuente).

## 4. Objetivos
1. Reunificar y ordenar todas las secciones de forma consistente (encabezados y subsecciones homogéneas).
2. Mantener íntegros fármacos, dosis, frecuencias, recomendaciones y cualquier dato clínicamente relevante.
3. No eliminar contenido clínico existente (solo limpieza de formato superficial: espacios, duplicaciones tipográficas, negritas redundantes).
4. Normalizar etiquetas internas (si procede) de forma uniforme en todo el documento.
5. Entregar un único archivo Markdown final legible y consistente.

## 5. Restricciones
- No añadir ni eliminar contenido clínico (solo limpieza formal que no altere significado).
- Mantener literalidad de medicación y dosis.
- Evitar introducir comentarios meta o marcas de auditoría.
- No crear archivos auxiliares (solo el documento final resultante).

## 6. Criterios de Aceptación
Se considera completado cuando:
1. Todas las secciones y entidades clínicas están claramente delimitadas con una jerarquía de encabezados consistente.
2. El contenido clínico (diagnósticos, descripciones, exploraciones, tratamientos, recomendaciones) aparece íntegro respecto al original.
3. Las etiquetas internas usadas (Motivo de consulta:, Antecedentes:, etc.) son uniformes dentro del documento.
4. No existen bloques duplicados innecesarios ni formatos erráticos (espacios y saltos múltiples normalizados).
5. El archivo es legible y preparado para lectura directa sin necesitar notas explicativas adicionales.

## 7. Entregables
Un único archivo Markdown final reestructurado que sustituya al documento original como versión organizada.

## 8. Libertad de Diseño
Libertad para decidir la jerarquía exacta de encabezados y nombres de secciones, siempre que se mantenga consistencia y no se pierda contenido.

## 9. Aspectos Clave a Resolver
- Delimitar claramente cada entidad clínica (diagnóstico o tema) con un encabezado uniforme.
- Unificar etiquetas repetidas o variantes a una forma única (si se opta por normalizarlas).
- Conservar sin alteración sustantiva tablas, listados de fármacos y dosis.
- Mantener coherencia tipográfica (mayúsculas, acentos) sin reinterpretar términos.

## 10. Documentación Mínima
No se requiere documentación adicional: el propio archivo final debe ser autoexplicativo por su estructura clara.

## 11. Evaluación
Basada en la revisión directa del archivo final: completitud, coherencia de estructura y preservación de contenido.

## 12. Resumen
Objetivo: versión única reorganizada del documento clínico original, manteniendo íntegro su contenido y logrando una estructura clara y coherente.

_Fin del handoff._
