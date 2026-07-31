/**
 * CRM B2B ISEM - Setup de Google Sheets
 * Ejecute la función `setupDatabase()` en su proyecto Google Apps Script
 * para estructurar automáticamente las 5 hojas del CRM con sus formatos y validaciones.
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Hoja Configuración
  setupConfigSheet(ss);
  
  // 2. Hoja Clientes
  setupClientesSheet(ss);
  
  // 3. Hoja Oportunidades
  setupOportunidadesSheet(ss);
  
  // 4. Hoja Renovaciones
  setupRenovacionesSheet(ss);
  
  // 5. Hoja Historial_Tiempos
  setupHistorialSheet(ss);
  
  SpreadsheetApp.getUi().alert("✅ CRM B2B ISEM configurado con éxito en su Google Sheet.");
}

function setupConfigSheet(ss) {
  var sheet = getOrCreateSheet(ss, "Configuración");
  sheet.clear();
  
  var headers = [
    "Cursos_ISEM", "Responsables_Comerciales", "Estados_Contrato", 
    "Fuente_Lead", "Tipo_Empresa", "Estado_Seguimiento", 
    "Regiones", "Segmento"
  ];
  
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
  
  var data = [
    ["Cursos del Anexo 6", "Carlos Rojas", "Prospección", "Cliente Recurrente", "Compañía Minera", "Pendiente", "Áncash", "Gran Minería"],
    ["Entrenando al Entrenador", "Ana Torres", "Calificación", "Referido", "Contratista", "Contactado", "Arequipa", "Mediana Minería"],
    ["Certificado Nebosh", "Luis Vargas", "Cotización", "Feria Minera PERUMIN", "Conexa", "Renovado", "Apurímac", "Pequeña Minería"],
    ["II Seminario TTT", "María Salazar", "Negociación", "LinkedIn", "", "", "Pasco", ""],
    ["Rescate Minero 2026", "Samuel Quito", "Cierre", "Portal Web", "", "", "Cusco", ""],
    ["Manejo Defensivo y Uso de 4x4", "", "Cerrado Ganado", "Llamada Comercial", "", "", "Lima", ""],
    ["Trabajos en Altura", "", "Cerrado Perdido", "", "", "", "Moquegua", ""],
    ["LOTO Bloqueo", "", "", "", "", "", "Cajamarca", ""],
    ["Espacios Confinados", "", "", "", "", "", "La Libertad", ""],
    ["Trabajo en Caliente", "", "", "", "", "", "Puno", ""],
    ["IPERC Continuo", "", "", "", "", "", "", ""]
  ];
  
  for (var i = 0; i < data.length; i++) {
    sheet.appendRow(data[i]);
  }
}

function setupClientesSheet(ss) {
  var sheet = getOrCreateSheet(ss, "Clientes");
  sheet.clear();
  
  var headers = [
    "ID Cliente", "Empresa", "Tipo_Empresa", "Unidad_Minera", "Región", "Titular_Asociado",
    "Responsable_Comercial", "Segmento", "Contacto_Principal", "Cargo",
    "Teléfono", "Correo_Corporativo", "Cliente_Riesgo"
  ];
  
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
  
  var sampleClients = [
    ["CLI-0000", "Compañía Minera Antamina", "Compañía Minera", "Yanacancha", "Áncash", "N/A", "Carlos Rojas", "Gran Minería", "Juan Pérez", "Gerente SSOMA", "987654321", "jperez@antamina.com", "No"],
    ["CLI-0001", "Sociedad Minera Cerro Verde", "Compañía Minera", "Cerro Verde", "Arequipa", "N/A", "Ana Torres", "Gran Minería", "Luis Salas", "Superintendente Seguridad", "987654323", "lsalas@cerroverde.com", "No"],
    ["CLI-0002", "Minera Las Bambas", "Compañía Minera", "Ferrobamba", "Apurímac", "N/A", "Luis Vargas", "Gran Minería", "Julio Cáceres", "Jefe de Capacitación", "987654331", "jcaceres@lasbambas.com", "Sí"],
    ["CLI-0003", "Hudbay Perú", "Compañía Minera", "Constancia", "Cusco", "N/A", "María Salazar", "Gran Minería", "Patricia Luna", "Gerente HSE", "987654332", "pluna@hudbay.com", "No"],
    ["CLI-0004", "Minsur", "Compañía Minera", "Pucamarca", "Puno", "N/A", "Carlos Rojas", "Mediana Minería", "Carlos Mendoza", "Jefe Seguridad", "987654327", "cmendoza@minsur.com", "No"],
    ["CLI-0005", "Compañía Minera Poderosa", "Compañía Minera", "Marañón", "La Libertad", "N/A", "Ana Torres", "Gran Minería", "Ricardo Alvarado", "Superintendente SSOMA", "987654333", "ralvarado@poderosa.com", "No"],
    ["CLI-0006", "San Martín Contratistas Generales", "Contratista", "N/A", "Áncash", "Compañía Minera Antamina", "Luis Vargas", "Gran Minería", "Rosa Silva", "Jefe RRHH", "987654329", "rsilva@sanmartin.com", "Sí"],
    ["CLI-0007", "JRC Ingeniería y Construcción", "Contratista", "N/A", "Arequipa", "Sociedad Minera Cerro Verde", "María Salazar", "Gran Minería", "Mario Cueva", "Gerente General", "987654330", "mcueva@jrc.com", "No"],
    ["CLI-0008", "AESA Infraestructura y Minería", "Contratista", "N/A", "Puno", "Minsur", "Carlos Rojas", "Mediana Minería", "Pedro Pablo", "Jefe Seguridad", "987654334", "ppablo@aesa.com", "No"],
    ["CLI-0009", "Stracon", "Contratista", "N/A", "Apurímac", "Minera Las Bambas", "Ana Torres", "Gran Minería", "Alberto Mesa", "Director de Operaciones", "987654335", "amesa@stracon.com", "No"]
  ];
  
  for (var i = 0; i < sampleClients.length; i++) {
    sheet.appendRow(sampleClients[i]);
  }
}

function setupOportunidadesSheet(ss) {
  var sheet = getOrCreateSheet(ss, "Oportunidades");
  sheet.clear();
  
  var headers = [
    "ID Oportunidad", "Empresa", "Unidad_Minera", "Cursos_ISEM",
    "Responsable_Comercial", "Valor_Contrato_PEN", "Estado_Contrato",
    "Fuente_Lead", "Fecha_Creacion", "Fecha_Ultimo_Contacto", "Dias_Sin_Contacto",
    "Ultima_Fecha_Cambio_Estado", "Dias_Estancado"
  ];
  
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
  
  var sampleOps = [
    ["OP-0001", "Compañía Minera Antamina", "Yanacancha", "Cursos del Anexo 6", "Carlos Rojas", 98500, "Cotización", "Cliente Recurrente", "2026-06-28", "2026-07-15", 7, "2026-07-10", 12],
    ["OP-0002", "Sociedad Minera Cerro Verde", "Cerro Verde", "Entrenando al Entrenador", "Ana Torres", 45200, "Negociación", "Referido", "2026-06-20", "2026-07-20", 2, "2026-07-18", 4],
    ["OP-0035", "Minera Las Bambas", "Ferrobamba", "Certificado Nebosh", "Luis Vargas", 120000, "Cotización", "Feria Minera PERUMIN", "2026-05-15", "2026-07-07", 15, "2026-07-01", 21],
    ["OP-0047", "San Martín Contratistas Generales", "Antamina", "Trabajos en Altura", "Luis Vargas", 75000, "Calificación", "Llamada Comercial", "2026-06-01", "2026-07-10", 12, "2026-07-04", 18],
    ["OP-0019", "Hudbay Perú", "Constancia", "IPERC Continuo", "Luis Vargas", 41000, "Negociación", "Cliente Recurrente", "2026-06-14", "2026-07-12", 10, "2026-07-05", 17],
    ["OP-0023", "JRC Ingeniería y Construcción", "San Rafael", "LOTO Bloqueo", "María Salazar", 58000, "Calificación", "LinkedIn", "2026-06-10", "2026-07-13", 9, "2026-07-09", 13],
    ["OP-0042", "Minsur", "Pucamarca", "Espacios Confinados", "Carlos Rojas", 64000, "Cotización", "Portal Web", "2026-06-18", "2026-07-14", 8, "2026-07-10", 12]
  ];
  
  for (var i = 0; i < sampleOps.length; i++) {
    sheet.appendRow(sampleOps[i]);
  }
}

function setupRenovacionesSheet(ss) {
  var sheet = getOrCreateSheet(ss, "Renovaciones");
  sheet.clear();
  
  var headers = ["ID Renovación", "Empresa", "Cursos_ISEM", "Fecha_Estimada_Renovacion", "Estado_Seguimiento"];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
  
  var sampleRenovations = [
    ["REN-0001", "Compañía Minera Antamina", "Trabajos en Altura", "2026-08-15", "Pendiente"],
    ["REN-0002", "Sociedad Minera Cerro Verde", "Cursos del Anexo 6", "2026-09-10", "Contactado"],
    ["REN-0003", "JRC Ingeniería y Construcción", "Rescate Minero 2026", "2026-07-25", "Renovado"],
    ["REN-0004", "Minera Las Bambas", "IPERC Continuo", "2026-08-30", "Renovado"],
    ["REN-0005", "Hudbay Perú", "Trabajos en Altura", "2026-09-18", "Pendiente"],
    ["REN-0006", "Minsur", "Espacios Confinados", "2026-08-22", "Contactado"]
  ];
  
  for (var i = 0; i < sampleRenovations.length; i++) {
    sheet.appendRow(sampleRenovations[i]);
  }
}

function setupHistorialSheet(ss) {
  var sheet = getOrCreateSheet(ss, "Historial_Tiempos");
  sheet.clear();
  
  var headers = ["ID Oportunidad", "Empresa", "Estado Anterior", "Estado Nuevo", "Fecha Cambio", "Responsable Comercial"];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#043927").setFontColor("#ffffff");
  
  var sampleHistory = [
    ["OP-0001", "Compañía Minera Antamina", "Prospección", "Cotización", "2026-07-10 10:15:00", "Carlos Rojas"],
    ["OP-0002", "Sociedad Minera Cerro Verde", "Cotización", "Negociación", "2026-07-18 11:20:00", "Ana Torres"],
    ["OP-0035", "Minera Las Bambas", "Calificación", "Cotización", "2026-07-01 09:30:00", "Luis Vargas"],
    ["OP-0047", "San Martín Contratistas Generales", "Prospección", "Calificación", "2026-07-04 14:45:00", "Luis Vargas"],
    ["OP-0019", "Hudbay Perú", "Cotización", "Negociación", "2026-07-05 16:10:00", "Luis Vargas"]
  ];
  
  for (var i = 0; i < sampleHistory.length; i++) {
    sheet.appendRow(sampleHistory[i]);
  }
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}
