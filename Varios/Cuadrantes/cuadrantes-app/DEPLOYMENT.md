# 🚀 Guía de Despliegue - Cuadrantes App

## Despliegue en GitHub Pages

Esta aplicación está configurada para desplegarse automáticamente en GitHub Pages.

### URL de Producción
https://aiojpineda.github.io/hm_hospital_recursos/

### Despliegue Automático
- Se activa automáticamente con cada push a `main` que modifique archivos en `Varios/Cuadrantes/cuadrantes-app/`
- También puede ejecutarse manualmente desde la pestaña "Actions" en GitHub

### Despliegue Manual
```bash
cd Varios/Cuadrantes/cuadrantes-app
npm install
npm run build
npm run deploy
```

### Configuración de GitHub Pages
1. Ve a Settings → Pages
2. Source: GitHub Actions
3. La URL estará disponible después del primer despliegue

### Estructura de Build
- Comando de build: `npm run build`
- Directorio de salida: `dist/`
- Base path: `/hm_hospital_recursos/`

### Troubleshooting
- Si las rutas no funcionan, verifica que `base` en `vite.config.ts` sea correcto
- Si hay errores de CORS, asegúrate de que los archivos CSV estén en la carpeta `public/`
- Si el despliegue falla, revisa los logs en la pestaña "Actions"

### Monitoreo
- Estado del despliegue: https://github.com/AIOjPINEDA/hm_hospital_recursos/actions
- Configuración de Pages: https://github.com/AIOjPINEDA/hm_hospital_recursos/settings/pages
