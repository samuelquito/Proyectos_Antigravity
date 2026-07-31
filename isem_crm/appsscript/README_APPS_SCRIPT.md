# Guía de Instalación del Backend Google Apps Script - CRM B2B ISEM

Para conectar tu hoja de Google Sheets con el CRM B2B ISEM y habilitar la **Auditoría Temporal Inmutable**, sigue estos sencillos pasos:

---

## Paso 1: Abrir el Editor de Apps Script
1. Abre tu hoja de cálculo en **Google Sheets**.
2. En el menú superior, haz clic en **Extensiones** ➔ **Apps Script**.

## Paso 2: Crear los Archivos de Script y Guardar (Ctrl + S)
1. En el panel izquierdo del editor de Apps Script, crea los archivos de script haciendo clic en el botón `+` ➔ **Script**:
   - `Code.gs` ➔ Copia y pega el contenido del archivo `appsscript/Code.gs`
   - `Triggers.gs` ➔ Copia y pega el contenido del archivo `appsscript/Triggers.gs`
   - `Setup.gs` ➔ Copia y pega el contenido del archivo `appsscript/Setup.gs`
2. **MUY IMPORTANTE**: Haz clic en el ícono de **Guardar proyecto** (el disco 💾 o presiona `Ctrl + S`). Si los archivos no están guardados, las funciones no aparecerán en la lista de activadores.

## Paso 3: Inicializar la Estructura de la Base de Datos
1. En la parte superior del editor, selecciona la función `setupDatabase` del menú desplegable de funciones.
2. Haz clic en **Ejecutar** (Run).
3. Concede los permisos que Google te solicite. Esto creará automáticamente las 5 hojas:
   - `Configuración`
   - `Clientes`
   - `Oportunidades`
   - `Renovaciones`
   - `Historial_Tiempos`

## Paso 4: Disparador `onEdit` (Auditoría Temporal)
> [!NOTE]
> La función `onEdit(e)` es un **Disparador Simple reservado de Google Apps Script**. Esto significa que **se ejecuta automáticamente en segundo plano cada vez que edites una celda en Google Sheets** sin necesidad de crear un activador manual.
>
> Si deseas crear un activador manual programado para el recálculo diario (`dailyRecalculateDays`):
> 1. En la barra lateral izquierda, ve a **Activadores** (ícono de reloj).
> 2. Haz clic en **+ Añadir activador**.
> 3. En *Elegir qué función ejecutar*, selecciona `dailyRecalculateDays`.
> 4. En *Seleccionar la fuente del evento*, elige **Según el tiempo**.
> 5. Configúralo para ejecutarse diariamente (ej. entre las 00:00 y las 01:00).

## Paso 5: Desplegar como Aplicación Web (Web App API)
1. En la esquina superior derecha, haz clic en **Desplegar** (Deploy) ➔ **Nuevo despliegue** (New deployment).
2. Haz clic en el ícono de engranaje y elige **Aplicación Web** (Web App).
3. Ajusta la configuración:
   - **Descripción**: CRM B2B ISEM API
   - **Ejecutar como**: Yo (tu correo)
   - **Quién tiene acceso**: Cualquier persona (Anyone)
4. Haz clic en **Desplegar**.
5. Copia la **URL de la aplicación web** generada (ej: `https://script.google.com/macros/s/.../exec`).

## Paso 6: Conectar con el CRM Frontend
1. Abre la aplicación Web CRM B2B ISEM.
2. Ve a la sección **Configuración de Conexión** (última opción del menú lateral).
3. Pega la URL del Web App y presiona **Guardar y Probar Conexión**.

¡Listo! Tu CRM ahora sincronizará en tiempo real con Google Sheets con auditoría temporal inmutable de embudo comercial.
