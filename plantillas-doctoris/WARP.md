# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is a medical documentation system containing SOAP (Subjective, Objective, Assessment, Plan) templates for emergency department clinical documentation at HM Montepríncipe Hospital. The repository contains structured Markdown templates optimized for integration with the Doctoris clinical system.

## Architecture & Structure

```
plantillas-doctoris/
├── 01_subjetivo/       # Subjective section templates (S in SOAP)
├── 02_objetivo/        # Objective section templates (O in SOAP)  
├── 03_analisis-plan/   # Analysis & Plan templates (A+P in SOAP)
├── 04_resultados/      # Results interpretation templates
├── 00_ejemplos/        # Example documents and workflow guides
└── _meta/              # Technical documentation and metadata
```

### Template Format Standards

All templates follow a strict YAML frontmatter structure:
```yaml
---
id: template-name
tipo: subjetivo|objetivo|analisis-plan|resultados
tags: [tag1, tag2, tag3]
ultima_revision: YYYY-MM-DD
autor: dr_surname
estado: activo
version: 1.0
---
```

### Content Patterns

- **Subjective templates**: Use `[bracketed examples]` that should be modified per case
- **Objective templates**: Complete descriptive text for manual modification
- **Analysis-Plan templates**: Realistic cases with specific medication doses and timing
- **Results templates**: Use `{{VARIABLE}}` placeholders for numerical values

### Naming Convention

| Suffix | SOAP Section | Example |
|--------|--------------|---------|
| `-sub` | Subjective | `abdominal-sub.md` |
| `-obj` | Objective | `cardiaco-obj.md` |
| `-plan` | Analysis-Plan | `toracico-plan.md` |
| `-res` | Results | `analitica-res.md` |

## Common Commands

### Search and Navigation
```bash
# Find templates by symptom/condition
grep -r "dolor abdominal" 01_subjetivo/
grep -r "cefalea" 03_analisis-plan/

# List all templates by type
find 01_subjetivo/ -name "*.md" | sort
find 02_objetivo/ -name "*.md" | sort
find 03_analisis-plan/ -name "*.md" | sort
find 04_resultados/ -name "*.md" | sort

# Search for specific medical terms across all templates
grep -r "apendicitis\|appendicitis" .
grep -r "dosis\|mg\|ml" 03_analisis-plan/
```

### Content Validation
```bash
# Check template format consistency
grep -r "^---$" . | wc -l  # Should be even number (opening/closing frontmatter)

# Verify all templates have required frontmatter fields
find . -name "*.md" -exec sh -c 'echo "=== $1 ===" && head -10 "$1" | grep -E "^(id|tipo|tags|ultima_revision|autor|estado|version):"' _ {} \;

# Find templates missing content sections
find . -name "*.md" -exec sh -c 'if ! grep -q "## CONTENIDO" "$1"; then echo "Missing CONTENIDO: $1"; fi' _ {} \;
```

### Template Analysis
```bash
# Count templates by type
echo "Subjetivo: $(find 01_subjetivo/ -name "*.md" | wc -l)"
echo "Objetivo: $(find 02_objetivo/ -name "*.md" | wc -l)"  
echo "Análisis-Plan: $(find 03_analisis-plan/ -name "*.md" | wc -l)"
echo "Resultados: $(find 04_resultados/ -name "*.md" | wc -l)"

# Find templates with variables/placeholders
grep -r "\[.*\]" 01_subjetivo/ | head -5  # Subjective examples
grep -r "{{.*}}" 04_resultados/ | head -5  # Result variables
```

### Content Maintenance
```bash
# Find templates needing updates (older than 6 months)
find . -name "*.md" -exec sh -c 'if grep -q "ultima_revision: 2024" "$1"; then echo "Needs review: $1"; fi' _ {} \;

# Validate medical abbreviation consistency
grep -r "FRCV\|FID\|EEII\|ROT\|TVP\|MAP" . | cut -d: -f1 | sort -u
```

## Medical Abbreviation Standards

When working with templates, maintain consistency with these standard medical abbreviations:

| Abbreviation | Meaning |
|--------------|---------|
| `h` | horas (hours) |
| `d` | días (days) |
| `FID` | fosa ilíaca derecha (right iliac fossa) |
| `EEII` | extremidades inferiores (lower extremities) |
| `FRCV` | factores riesgo cardiovascular (cardiovascular risk factors) |
| `ROT` | reflejos osteotendinosos (deep tendon reflexes) |
| `TVP` | trombosis venosa profunda (deep vein thrombosis) |
| `MAP` | médico atención primaria (primary care physician) |

## Template Development Guidelines

### Creating New Templates
1. Use existing templates as reference for format consistency
2. Follow the established naming convention (`condition-type.md`)
3. Include proper YAML frontmatter with all required fields
4. For subjective templates: Use `[bracketed examples]` for customizable content
5. For objective templates: Write complete, descriptive text
6. For analysis-plan templates: Include specific medications, doses, and timing
7. For results templates: Use `{{VARIABLE}}` format for numerical values

### Content Quality Standards
- Use concise, efficient medical language
- Include realistic clinical scenarios from emergency medicine
- Avoid generic development practices or obvious instructions
- Focus on emergency department workflows and decision-making
- Maintain medical accuracy and current clinical guidelines

### File Handling
- Templates are stored in iCloud Drive for synchronization
- Always work with absolute paths when referencing files programmatically
- Be aware of spaces in the directory path structure
- Respect the existing folder organization for clinical workflow efficiency

## Integration Notes

Templates are designed for the Doctoris clinical documentation system:
- Vital signs are automatically integrated (not included in objective templates)
- Patient history goes in separate Doctoris fields (excluded from templates)
- Templates should be copied to Doctoris and customized per patient case
- Focus on efficiency and clinical decision support rather than comprehensive documentation

## Version Control

This repository uses semantic versioning (v1.0) and tracks revision dates in each template's frontmatter. When modifying templates, update the `ultima_revision` field and consider version implications for clinical workflows.
