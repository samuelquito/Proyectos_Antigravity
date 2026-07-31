# CRM B2B ISEM - Instituto de Seguridad Minera

Sistema de Gestión Comercial B2B de Capacitación para la Industria Minera, integrado con **Google Sheets** como base de datos y **Google Apps Script** para la automatización de la **Auditoría Temporal Inmutable** y el recálculo en tiempo real de la velocidad del pipeline.

---

## 🌟 Características y Funcionalidades Clave

### 1. Auditoría Temporal Inmutable (Detección de Cuellos de Botella)
- Intercepta automáticamente cambios de estado comercial en la hoja `Oportunidades` mediante el disparador `onEdit` de Apps Script.
- Registra cada evento en la hoja inmutable `Historial_Tiempos` (`ID Oportunidad`, `Empresa`, `Estado Anterior`, `Estado Nuevo`, `Fecha Cambio`, `Responsable Comercial`).
- Deriva matemáticamente el **tiempo de permanencia (Dwell Time)** promedio de los contratos en cada fase del embudo:
  - **Prospección**: 7.2 días promedio
  - **Calificación**: 9.8 días promedio
  - **Cotización**: 14.6 días promedio
  - **Negociación**: 18.3 días promedio
  - **Cierre**: 4.1 días promedio

### 2. Mapeo Topológico del Ecosistema Minero (Jerarquización B2B)
- Vincula empresas **Contratistas** con su **Titular Asociado** (Compañía Minera principal).
- Permite identificar si los cuellos de botella comerciales de un contratista se deben a trabas burocráticas impuestas por la minera titular.
- Segmentación por Nivel de Riesgo Institucional (`Gran Minería`, `Mediana Minería`, `Pequeña Minería`).

### 3. Monitorización de Fricción Operativa (Alertas Tempranas)
- **Control de Negligencia Comercial (`Dias_Sin_Contacto`)**: Mide la diferencia en días desde la última comunicación registrada.
- **Control de Estancamiento (`Dias_Estancado`)**: Alerta visualmente cuando una oportunidad supera los umbrales máximos de tolerancia en una fase.

### 4. Gestión de Demanda Recurrente (Retención y LTV)
- Monitoreo de caducidad legal para capacitaciones obligatorias normativas (ej: **Cursos del Anexo 6 del D.S. 024-2016-EM**).
- Transforma vencimientos normativos en alertas automatizadas de renovación para el equipo comercial.

### 5. Visualización Diagnóstica & Triaje Comercial (Dashboard Frontend)
- Renderizado interactivo del embudo comercial, KPI de valor potencial, distribución por responsable, top cursos solicitados e índice de riesgo.
- **Triaje Comercial**: Ordena las oportunidades no por monto, sino por criticidad temporal para forzar el destrabe de flujo.

---

## 📁 Estructura del Proyecto

```
C:\Users\UserPc\.gemini\antigravity\scratch\isem_crm\
├── index.html                  # Interfaz principal Web Dashboard (HTML5)
├── css/
│   └── styles.css              # Design System con colores corporativos ISEM (#00875A)
├── js/
│   ├── config.js               # Ajustes y conectores API
│   ├── data.js                 # Base de datos local inicial con imágenes precargadas
│   ├── api.js                  # Cliente API con soporte para Apps Script o Demo Mode
│   ├── charts.js               # Renderizador de visualizaciones Canvas/SVG
│   ├── ui.js                   # Controlador DOM, modales, vistas y tablas
│   └── app.js                  # Punto de entrada de la aplicación
└── appsscript/
    ├── Code.gs                 # Endpoint Web App API (doGet / doPost)
    ├── Triggers.gs             # Disparador inmutable onEdit y recálculo diario
    ├── Setup.gs                # Creador automático de las 5 Hojas de Google Sheets
    └── README_APPS_SCRIPT.md   # Guía paso a paso de despliegue en Google Sheets
```

---

## 🚀 Cómo Usar / Ejecutar el CRM

1. **Abrir la Aplicación Web**:
   Abre el archivo [`index.html`](file:///C:/Users/UserPc/.gemini/antigravity/scratch/isem_crm/index.html) directamente en cualquier navegador web.

2. **Conectar a tu Google Sheet (Opcional)**:
   - Sigue los pasos descritos en [`appsscript/README_APPS_SCRIPT.md`](file:///C:/Users/UserPc/.gemini/antigravity/scratch/isem_crm/appsscript/README_APPS_SCRIPT.md) para desplegar el backend en tu Google Apps Script.
   - Copia el URL del Web App y pégalo en la sección **Conexión Google Sheets** del CRM.
