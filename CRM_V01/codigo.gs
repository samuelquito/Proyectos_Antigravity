/**
 * CRM B2B - Instituto de Seguridad Minera (ISEM)
 * Backend Controller Script (codigo.gs)
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('CRM B2B - Instituto de Seguridad Minera (ISEM)')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

function obtenerDatos() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    const configSheet = ss.getSheetByName('Configuración') || ss.getSheetByName('Configuracion');
    const clientesSheet = ss.getSheetByName('Clientes');
    const oportunidadesSheet = ss.getSheetByName('Oportunidades');
    const renovacionesSheet = ss.getSheetByName('Renovaciones');
    const historialSheet = ss.getSheetByName('Historial_Tiempos');

    return {
      configuracion: configSheet ? leerHojaMatriz(configSheet) : {},
      clientes: clientesSheet ? leerHojaComoObjetos(clientesSheet) : [],
      oportunidades: oportunidadesSheet ? leerHojaComoObjetos(oportunidadesSheet) : [],
      renovaciones: renovacionesSheet ? leerHojaComoObjetos(renovacionesSheet) : [],
      historial: historialSheet ? leerHojaComoObjetos(historialSheet) : []
    };
  } catch (error) {
    Logger.log('Error en obtenerDatos: ' + error.toString());
    throw new Error('Error al obtener los datos del Spreadsheet: ' + error.message);
  }
}

function leerHojaMatriz(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return {};
  
  const headers = data[0];
  const resultado = {};
  
  headers.forEach((header, colIdx) => {
    if (header) {
      const cleanHeader = String(header).trim();
      const valores = [];
      for (let r = 1; r < data.length; r++) {
        const val = data[r][colIdx];
        if (val !== "" && val !== null && val !== undefined) {
          valores.push(val);
        }
      }
      resultado[cleanHeader] = [...new Set(valores)];
    }
  });
  
  return resultado;
}

function leerHojaComoObjetos(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  const headers = data[0].map(h => String(h).trim());
  const objetos = [];
  
  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
    if (fila.every(cell => cell === "" || cell === null || cell === undefined)) continue;
    
    const obj = {};
    headers.forEach((header, index) => {
      let val = fila[index];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      obj[header] = val !== undefined ? val : "";
    });
    objetos.push(obj);
  }
  return objetos;
}

function generarSiguienteID(sheet, colIndex, prefijo) {
  const data = sheet.getDataRange().getValues();
  let maxNum = 0;
  
  for (let i = 1; i < data.length; i++) {
    const idVal = String(data[i][colIndex] || '');
    if (idVal.startsWith(prefijo)) {
      const parts = idVal.split('-');
      const numPart = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }
  const nuevoNum = maxNum + 1;
  return `${prefijo}-${String(nuevoNum).padStart(3, '0')}`;
}

function registrarCliente(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clientes');
    if (!sheet) throw new Error("La hoja 'Clientes' no existe.");

    const idCliente = datos.idCliente || generarSiguienteID(sheet, 0, 'CLI');
    
    sheet.appendRow([
      idCliente,
      datos.empresa || '',
      datos.tipoEmpresa || '',
      datos.unidadMinera || '',
      datos.companiaMinera || '',
      datos.responsableComercial || '',
      datos.contactoPrincipal || '',
      datos.cargo || '',
      datos.telefono || '',
      datos.correoCorporativo || ''
    ]);

    return { success: true, message: 'Cliente registrado correctamente en Google Sheets.', id: idCliente };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function actualizarCliente(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clientes');
    if (!sheet) throw new Error("La hoja 'Clientes' no existe.");

    const data = sheet.getDataRange().getValues();
    let filaEncontrada = -1;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(datos.idCliente).trim()) {
        filaEncontrada = i + 1;
        break;
      }
    }

    if (filaEncontrada === -1) {
      throw new Error(`No se encontró el cliente con ID: ${datos.idCliente}`);
    }

    sheet.getRange(filaEncontrada, 2, 1, 9).setValues([[
      datos.empresa || '',
      datos.tipoEmpresa || '',
      datos.unidadMinera || '',
      datos.companiaMinera || '',
      datos.responsableComercial || '',
      datos.contactoPrincipal || '',
      datos.cargo || '',
      datos.telefono || '',
      datos.correoCorporativo || ''
    ]]);

    return { success: true, message: 'Cliente actualizado exitosamente en Google Sheets.' };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function registrarOportunidad(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Oportunidades');
    if (!sheet) throw new Error("La hoja 'Oportunidades' no existe.");

    const anoActual = new Date().getFullYear();
    const prefijo = `OP-${anoActual}`;
    const idOportunidad = datos.idOportunidad || generarSiguienteID(sheet, 0, prefijo);

    const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const fechaCreacion = datos.fechaCreacion || fechaHoy;
    const estadoInicial = datos.estadoContrato || 'Prospecto';

    sheet.appendRow([
      idOportunidad,
      datos.empresa || '',
      datos.unidadMinera || '',
      datos.facilitador || '',
      datos.cursosIsem || '',
      datos.modalidad || '',
      datos.responsableComercial || '',
      estadoInicial,
      datos.fuenteLead || '',
      fechaCreacion,
      fechaHoy,
      0,
      fechaHoy,
      0,
      datos.motivoPerdida || ''
    ]);

    const historialSheet = ss.getSheetByName('Historial_Tiempos');
    if (historialSheet) {
      historialSheet.appendRow([
        idOportunidad,
        datos.empresa || '',
        'Creación Inicial',
        estadoInicial,
        fechaHoy,
        datos.responsableComercial || ''
      ]);
    }

    return { success: true, message: 'Oportunidad creada correctamente.', id: idOportunidad };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

// ACTUALIZACIÓN INTEGRAL DE OPORTUNIDAD (ESTADO, CURSO, MODALIDAD, RESPONSABLE, FACILITADOR)
function actualizarEstadoContrato(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Oportunidades');
    if (!sheet) throw new Error("La hoja 'Oportunidades' no existe.");

    const data = sheet.getDataRange().getValues();
    let filaEncontrada = -1;
    let estadoAnterior = '';
    let empresa = '';
    let responsableAnterior = '';

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(datos.idOportunidad).trim()) {
        filaEncontrada = i + 1;
        empresa = data[i][1];
        responsableAnterior = data[i][6];
        estadoAnterior = data[i][7];
        break;
      }
    }

    if (filaEncontrada === -1) {
      throw new Error(`No se encontró la oportunidad con ID: ${datos.idOportunidad}`);
    }

    const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const nuevoEstado = datos.nuevoEstado || estadoAnterior;

    // Actualización de campos en la hoja Oportunidades
    if (datos.facilitador) sheet.getRange(filaEncontrada, 4).setValue(datos.facilitador);
    if (datos.cursosIsem) sheet.getRange(filaEncontrada, 5).setValue(datos.cursosIsem);
    if (datos.modalidad) sheet.getRange(filaEncontrada, 6).setValue(datos.modalidad);
    if (datos.responsableComercial) sheet.getRange(filaEncontrada, 7).setValue(datos.responsableComercial);
    if (datos.nuevoEstado) sheet.getRange(filaEncontrada, 8).setValue(nuevoEstado);

    // Fechas y estancamiento
    sheet.getRange(filaEncontrada, 11).setValue(fechaHoy);
    sheet.getRange(filaEncontrada, 13).setValue(fechaHoy);
    sheet.getRange(filaEncontrada, 14).setValue(0);
    
    if (datos.motivoPerdida) {
      sheet.getRange(filaEncontrada, 15).setValue(datos.motivoPerdida);
    }

    // Registro en Historial_Tiempos
    const historialSheet = ss.getSheetByName('Historial_Tiempos');
    if (historialSheet) {
      historialSheet.appendRow([
        datos.idOportunidad,
        empresa,
        estadoAnterior,
        nuevoEstado,
        fechaHoy,
        datos.responsableComercial || responsableAnterior
      ]);
    }

    return { success: true, message: `Oportunidad ${datos.idOportunidad} actualizada correctamente en Google Sheets.` };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function programarRenovacion(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Renovaciones');
    if (!sheet) throw new Error("La hoja 'Renovaciones' no existe.");

    const idRenovacion = datos.idRenovacion || generarSiguienteID(sheet, 0, 'REN');

    sheet.appendRow([
      idRenovacion,
      datos.empresa || '',
      datos.cursosIsem || '',
      datos.fechaEstimadaRenovacion || '',
      datos.estadoSeguimiento || 'Nuevo'
    ]);

    return { success: true, message: 'Renovación programada exitosamente.', id: idRenovacion };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

function cambiarEstadoRenovacion(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Renovaciones');
    if (!sheet) throw new Error("La hoja 'Renovaciones' no existe.");

    const data = sheet.getDataRange().getValues();
    let filaEncontrada = -1;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(datos.idRenovacion).trim()) {
        filaEncontrada = i + 1;
        break;
      }
    }

    if (filaEncontrada === -1) {
      throw new Error(`No se encontró la renovación con ID: ${datos.idRenovacion}`);
    }

    sheet.getRange(filaEncontrada, 5).setValue(datos.nuevoEstado);

    return { success: true, message: `Estado de renovación cambiado a '${datos.nuevoEstado}'.` };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}
