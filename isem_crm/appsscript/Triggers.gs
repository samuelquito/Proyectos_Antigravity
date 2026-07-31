/**
 * CRM B2B ISEM - Google Apps Script Triggers
 * Auditoría Temporal Inmutable & Recálculo en Tiempo Real
 */

/**
 * Disparador onEdit para capturar cambios de estado en Oportunidades
 * Registra eventos en Historial_Tiempos e inmutabiliza marcas temporales.
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    
    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();
    
    // Solo actuar si la edición ocurre en la hoja "Oportunidades"
    if (sheetName !== "Oportunidades") return;
    
    var row = e.range.getRow();
    var col = e.range.getColumn();
    
    // Asumiendo la estructura de columnas de Oportunidades:
    // A: ID Oportunidad (1)
    // B: Empresa (2)
    // C: Unidad_Minera (3)
    // D: Cursos_ISEM (4)
    // E: Responsable_Comercial (5)
    // F: Valor_Contrato_PEN (6)
    // G: Estado_Contrato (7) <-- COLUMNA EDITADA
    // H: Fuente_Lead (8)
    // I: Fecha_Creacion (9)
    // J: Fecha_Ultimo_Contacto (10)
    // K: Dias_Sin_Contacto (11)
    // L: Ultima_Fecha_Cambio_Estado (12)
    // M: Dias_Estancado (13)
    // N: Probabilidad_Cierre (14)
    // O: IA_Recomendacion (15)
    // P: IA_Prioridad (16)

    var ESTADO_COL = 7;
    
    // Si no es la fila de encabezado y es la columna de Estado_Contrato
    if (row > 1 && col === ESTADO_COL) {
      var oldValue = e.oldValue || "N/A";
      var newValue = e.value;
      
      if (!newValue || oldValue === newValue) return;
      
      var rowData = sheet.getRange(row, 1, 1, 16).getValues()[0];
      var opId = rowData[0];
      var empresa = rowData[1];
      var responsable = rowData[4];
      
      var now = new Date();
      var formattedNow = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      var formattedDateOnly = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
      
      // 1. Registrar Auditoría Inmutable en Historial_Tiempos
      var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();
      var historialSheet = ss.getSheetByName("Historial_Tiempos");
      
      if (!historialSheet) {
        historialSheet = ss.insertSheet("Historial_Tiempos");
        historialSheet.appendRow([
          "ID Oportunidad", "Empresa", "Estado Anterior", "Estado Nuevo", "Fecha Cambio", "Responsable Comercial"
        ]);
        historialSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
      }
      
      historialSheet.appendRow([
        opId,
        empresa,
        oldValue,
        newValue,
        formattedNow,
        responsable
      ]);
      
      // 2. Actualizar Ultima_Fecha_Cambio_Estado (Col L = 12)
      sheet.getRange(row, 12).setValue(formattedDateOnly);
      
      // 3. Recalcular Dias_Estancado (Col M = 13) -> 0 días ya que acaba de cambiar
      sheet.getRange(row, 13).setValue(0);
      
      // 4. Actualizar Fecha_Ultimo_Contacto si no existe
      if (!rowData[9]) {
        sheet.getRange(row, 10).setValue(formattedDateOnly);
        sheet.getRange(row, 11).setValue(0);
      }
    }
  } catch (err) {
    Logger.log("Error en onEdit CRM ISEM: " + err.toString());
  }
}

/**
 * Función programada / ejecutable manualmente para recalcular días sin contacto y estancado.
 * Se sugiere configurar un activador (trigger) diario a la medianoche.
 */
function dailyRecalculateDays() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var opSheet = ss.getSheetByName("Oportunidades");
  if (!opSheet) return;
  
  var data = opSheet.getDataRange().getValues();
  if (data.length <= 1) return;
  
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (var i = 1; i < data.length; i++) {
    var rowNum = i + 1;
    var fechaContacto = data[i][9]; // Col J (10)
    var fechaCambio = data[i][11];  // Col L (12)
    
    // Dias sin contacto
    if (fechaContacto) {
      var dContacto = new Date(fechaContacto);
      dContacto.setHours(0, 0, 0, 0);
      var diffContacto = Math.floor((today - dContacto) / (1000 * 60 * 60 * 24));
      opSheet.getRange(rowNum, 11).setValue(Math.max(0, diffContacto));
    }
    
    // Dias estancado
    if (fechaCambio) {
      var dCambio = new Date(fechaCambio);
      dCambio.setHours(0, 0, 0, 0);
      var diffCambio = Math.floor((today - dCambio) / (1000 * 60 * 60 * 24));
      opSheet.getRange(rowNum, 13).setValue(Math.max(0, diffCambio));
    }
  }
}
