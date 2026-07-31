/**
 * CRM B2B ISEM - Initial Dataset
 * Datos precargados extraídos directamente de las imágenes de Google Sheets provistas por el usuario.
 */

window.ISEM_DATABASE = {
  config: {
    cursos: [
      "Cursos del Anexo 6",
      "Entrenando al Entrenador",
      "Certificado Nebosh",
      "II Seminario TTT",
      "Rescate Minero 2026",
      "Manejo Defensivo y Uso de 4x4",
      "Trabajos en Altura",
      "LOTO Bloqueo",
      "Espacios Confinados",
      "Trabajo en Caliente",
      "IPERC Continuo"
    ],
    responsables: [
      "Carlos Rojas",
      "Ana Torres",
      "Luis Vargas",
      "María Salazar",
      "Samuel Quito"
    ],
    estados: [
      "Prospección",
      "Calificación",
      "Cotización",
      "Negociación",
      "Cerrado Ganado",
      "Cerrado Perdido"
    ],
    fuentes: [
      "Cliente Recurrente",
      "Referido",
      "Feria Minera PERUMIN",
      "LinkedIn",
      "Portal Web",
      "Llamada Comercial"
    ],
    tiposEmpresa: [
      "Compañía Minera",
      "Contratista",
      "Conexa"
    ],
    estadosSeguimiento: [
      "Pendiente",
      "Contactado",
      "Renovado"
    ],
    regiones: [
      "Áncash", "Arequipa", "Apurímac", "Pasco", "Cusco", "Lima", "Moquegua", "Cajamarca", "La Libertad", "Puno"
    ],
    segmentos: [
      "Gran Minería", "Mediana Minería", "Pequeña Minería"
    ]
  },

  usuarios: [
    { id: "USR-001", nombre: "Carlos Rojas", correo: "crojas@isem.org.pe", pass: "carlos123", rol: "Comercial Senior", avatar: "CR" },
    { id: "USR-002", nombre: "Ana Torres", correo: "atorres@isem.org.pe", pass: "ana123", rol: "Ejecutiva Comercial", avatar: "AT" },
    { id: "USR-003", nombre: "Luis Vargas", correo: "lvargas@isem.org.pe", pass: "luis123", rol: "Jefe de Cuentas Mineras", avatar: "LV" },
    { id: "USR-004", nombre: "María Salazar", correo: "msalazar@isem.org.pe", pass: "maria123", rol: "Especialista B2B", avatar: "MS" },
    { id: "USR-005", nombre: "Administrador ISEM", correo: "admin@isem.org.pe", pass: "admin123", rol: "Administrador Sistema", avatar: "AD" }
  ],

  clientes: [
    { id: "CLI-0000", empresa: "Compañía Minera Antamina", tipo: "Compañía Minera", unidad: "Yanacancha", region: "Áncash", titular: "N/A", responsable: "Carlos Rojas", segmento: "Gran Minería", contacto: "Juan Pérez", cargo: "Gerente SSOMA", telefono: "987654321", correo: "jperez@antamina.com", clienteRiesgo: "No" },
    { id: "CLI-0001", empresa: "Sociedad Minera Cerro Verde", tipo: "Compañía Minera", unidad: "Cerro Verde", region: "Arequipa", titular: "N/A", responsable: "Ana Torres", segmento: "Gran Minería", contacto: "Luis Salas", cargo: "Superintendente Seguridad", telefono: "987654323", correo: "lsalas@cerroverde.com", clienteRiesgo: "No" },
    { id: "CLI-0002", empresa: "Minera Las Bambas", tipo: "Compañía Minera", unidad: "Ferrobamba", region: "Apurímac", titular: "N/A", responsable: "Luis Vargas", segmento: "Gran Minería", contacto: "Julio Cáceres", cargo: "Jefe de Capacitación", telefono: "987654331", correo: "jcaceres@lasbambas.com", clienteRiesgo: "Sí" },
    { id: "CLI-0003", empresa: "Hudbay Perú", tipo: "Compañía Minera", unidad: "Constancia", region: "Cusco", titular: "N/A", responsable: "María Salazar", segmento: "Gran Minería", contacto: "Patricia Luna", cargo: "Gerente HSE", telefono: "987654332", correo: "pluna@hudbay.com", clienteRiesgo: "No" },
    { id: "CLI-0004", empresa: "Minsur", tipo: "Compañía Minera", unidad: "Pucamarca", region: "Puno", titular: "N/A", responsable: "Carlos Rojas", segmento: "Mediana Minería", contacto: "Carlos Mendoza", cargo: "Jefe Seguridad", telefono: "987654327", correo: "cmendoza@minsur.com", clienteRiesgo: "No" },
    { id: "CLI-0005", empresa: "Compañía Minera Poderosa", tipo: "Compañía Minera", unidad: "Poderosa", region: "La Libertad", titular: "N/A", responsable: "Ana Torres", segmento: "Gran Minería", contacto: "Ricardo Alvarado", cargo: "Superintendente SSOMA", telefono: "987654333", correo: "ralvarado@poderosa.com", clienteRiesgo: "No" },
    { id: "CLI-0006", empresa: "San Martín Contratistas Generales", tipo: "Contratista", unidad: "Antamina", region: "Áncash", titular: "Compañía Minera Antamina", responsable: "Luis Vargas", segmento: "Gran Minería", contacto: "Rosa Silva", cargo: "Jefe RRHH", telefono: "987654329", correo: "rsilva@sanmartin.com", clienteRiesgo: "Sí" },
    { id: "CLI-0007", empresa: "JRC Ingeniería y Construcción", tipo: "Contratista", unidad: "San Rafael", region: "Arequipa", titular: "Sociedad Minera Cerro Verde", responsable: "María Salazar", segmento: "Gran Minería", contacto: "Mario Cueva", cargo: "Gerente General", telefono: "987654330", correo: "mcueva@jrc.com", clienteRiesgo: "No" },
    { id: "CLI-0008", empresa: "AESA Infraestructura y Minería", tipo: "Contratista", unidad: "San Rafael", region: "Puno", titular: "Minsur", responsable: "Carlos Rojas", segmento: "Mediana Minería", contacto: "Pedro Pablo", cargo: "Jefe Seguridad", telefono: "987654334", correo: "ppablo@aesa.com", clienteRiesgo: "No" },
    { id: "CLI-0009", empresa: "Stracon", tipo: "Contratista", unidad: "Las Bambas", region: "Apurímac", titular: "Minera Las Bambas", responsable: "Ana Torres", segmento: "Gran Minería", contacto: "Alberto Mesa", cargo: "Director de Operaciones", telefono: "987654335", correo: "amesa@stracon.com", clienteRiesgo: "No" },
    { id: "CLI-0010", empresa: "Incimmet", tipo: "Contratista", unidad: "Constancia", region: "Cusco", titular: "Hudbay Perú", responsable: "Luis Vargas", segmento: "Mediana Minería", contacto: "Sofía Rojas", cargo: "Coordinadora SSOMA", telefono: "987654336", correo: "srojas@incimmet.com", clienteRiesgo: "No" },
    { id: "CLI-0011", empresa: "Robcon Melgar", tipo: "Contratista", unidad: "Pucamarca", region: "Puno", titular: "Minsur", responsable: "María Salazar", segmento: "Pequeña Minería", contacto: "Edgar Melgar", cargo: "Gerente Operaciones", telefono: "987654337", correo: "emelgar@robcon.com", clienteRiesgo: "Sí" },
    { id: "CLI-0012", empresa: "Famesa Explosivos", tipo: "Conexa", unidad: "Planta Puente Piedra", region: "Lima", titular: "N/A", responsable: "Carlos Rojas", segmento: "Mediana Minería", contacto: "Christian Ramos", cargo: "Jefe de Planta", telefono: "987654338", correo: "cramos@famesa.com", clienteRiesgo: "No" },
    { id: "CLI-0013", empresa: "Exsa", tipo: "Conexa", unidad: "Lurín", region: "Lima", titular: "N/A", responsable: "Ana Torres", segmento: "Mediana Minería", contacto: "Elena Campos", cargo: "Subgerente HSE", telefono: "987654339", correo: "ecampos@exsa.com", clienteRiesgo: "No" },
    { id: "CLI-0014", empresa: "Volcan Compañía Minera", tipo: "Compañía Minera", unidad: "Yauli", region: "Pasco", titular: "N/A", responsable: "Luis Vargas", segmento: "Gran Minería", contacto: "Daniel Lozano", cargo: "Jefe SSOMA", telefono: "987654340", correo: "dlozano@volcan.com", clienteRiesgo: "Sí" },
    { id: "CLI-0015", empresa: "Opsimex", tipo: "Contratista", unidad: "Chungar", region: "Pasco", titular: "Volcan Compañía Minera", responsable: "María Salazar", segmento: "Pequeña Minería", contacto: "Lucía Vargas", cargo: "Coordinadora SIG", telefono: "987654341", correo: "lvargas@opsimex.com", clienteRiesgo: "No" },
    { id: "CLI-0016", empresa: "Compañía de Minas Buenaventura", tipo: "Compañía Minera", unidad: "Orcopampa", region: "Lima", titular: "N/A", responsable: "Carlos Rojas", segmento: "Gran Minería", contacto: "Kevin Alarcón", cargo: "Gerente Seguridad", telefono: "987654342", correo: "kalarcon@buenaventura.com", clienteRiesgo: "No" },
    { id: "CLI-0017", empresa: "Zicsa Contratistas Mineros", tipo: "Contratista", unidad: "Atacocha", region: "Pasco", titular: "Volcan Compañía Minera", responsable: "Ana Torres", segmento: "Mediana Minería", contacto: "Roberto Flores", cargo: "Supervisora HSE", telefono: "987654343", correo: "rflores@zicsa.com", clienteRiesgo: "No" },
    { id: "CLI-0018", empresa: "Eiffage Infrastructures", tipo: "Contratista", unidad: "Antamina", region: "Áncash", titular: "Compañía Minera Antamina", responsable: "Luis Vargas", segmento: "Gran Minería", contacto: "Natalia Ríos", cargo: "Jefa Capacitación", telefono: "987654344", correo: "nrios@eiffage.com", clienteRiesgo: "No" },
    { id: "CLI-0019", empresa: "Prodac Bekaert", tipo: "Conexa", unidad: "Callao", region: "Lima", titular: "N/A", responsable: "María Salazar", segmento: "Mediana Minería", contacto: "Juan Carlos Ramírez", cargo: "Superintendente", telefono: "987654345", correo: "jramirez@prodac.com", clienteRiesgo: "No" }
  ],

  oportunidades: [
    { id: "OP-0001", empresa: "Compañía Minera Antamina", unidad: "Yanacancha", curso: "Cursos del Anexo 6", responsable: "Carlos Rojas", valor: 98500, estado: "Cotización", fuente: "Cliente Recurrente", fechaCreacion: "2026-06-28", fechaContacto: "2026-07-15", diasSinContacto: 7, fechaCambio: "2026-07-10", diasEstancado: 12 },
    { id: "OP-0002", empresa: "Sociedad Minera Cerro Verde", unidad: "Cerro Verde", curso: "Entrenando al Entrenador", responsable: "Ana Torres", valor: 45200, estado: "Negociación", fuente: "Referido", fechaCreacion: "2026-06-20", fechaContacto: "2026-07-20", diasSinContacto: 2, fechaCambio: "2026-07-18", diasEstancado: 4 },
    { id: "OP-0035", empresa: "Minera Las Bambas", unidad: "Ferrobamba", curso: "Certificado Nebosh", responsable: "Luis Vargas", valor: 120000, estado: "Cotización", fuente: "Feria Minera PERUMIN", fechaCreacion: "2026-05-15", fechaContacto: "2026-07-07", diasSinContacto: 15, fechaCambio: "2026-07-01", diasEstancado: 21 },
    { id: "OP-0047", empresa: "San Martín Contratistas Generales", unidad: "Antamina", curso: "Trabajos en Altura", responsable: "Luis Vargas", valor: 75000, estado: "Calificación", fuente: "Llamada Comercial", fechaCreacion: "2026-06-01", fechaContacto: "2026-07-10", diasSinContacto: 12, fechaCambio: "2026-07-04", diasEstancado: 18 },
    { id: "OP-0019", empresa: "Hudbay Perú", unidad: "Constancia", curso: "IPERC Continuo", responsable: "Luis Vargas", valor: 41000, estado: "Negociación", fuente: "Cliente Recurrente", fechaCreacion: "2026-06-14", fechaContacto: "2026-07-12", diasSinContacto: 10, fechaCambio: "2026-07-05", diasEstancado: 17 },
    { id: "OP-0023", empresa: "JRC Ingeniería y Construcción", unidad: "San Rafael", curso: "LOTO Bloqueo", responsable: "María Salazar", valor: 58000, estado: "Calificación", fuente: "LinkedIn", fechaCreacion: "2026-06-10", fechaContacto: "2026-07-13", diasSinContacto: 9, fechaCambio: "2026-07-09", diasEstancado: 13 },
    { id: "OP-0042", empresa: "Minsur", unidad: "Pucamarca", curso: "Espacios Confinados", responsable: "Carlos Rojas", valor: 64000, estado: "Cotización", fuente: "Portal Web", fechaCreacion: "2026-06-18", fechaContacto: "2026-07-14", diasSinContacto: 8, fechaCambio: "2026-07-10", diasEstancado: 12 },
    { id: "OP-0010", empresa: "Stracon", unidad: "Las Bambas", curso: "IPERC Continuo", responsable: "Ana Torres", valor: 42000, estado: "Prospección", fuente: "Llamada Comercial", fechaCreacion: "2026-07-12", fechaContacto: "2026-07-13", diasSinContacto: 9, fechaCambio: "2026-07-12", diasEstancado: 10 },
    { id: "OP-0011", empresa: "Incimmet", unidad: "Constancia", curso: "Trabajo en Caliente", responsable: "Luis Vargas", valor: 54000, estado: "Cotización", fuente: "Portal Web", fechaCreacion: "2026-06-18", fechaContacto: "2026-07-08", diasSinContacto: 14, fechaCambio: "2026-06-25", diasEstancado: 27 },
    { id: "OP-0012", empresa: "Robcon Melgar", unidad: "San Rafael", curso: "LOTO Bloqueo", responsable: "María Salazar", valor: 15000, estado: "Cierre", fuente: "Llamada Comercial", fechaCreacion: "2026-07-01", fechaContacto: "2026-07-21", diasSinContacto: 1, fechaCambio: "2026-07-20", diasEstancado: 2 },
    { id: "OP-0013", empresa: "Famesa Explosivos", unidad: "Planta Lurín", curso: "Espacios Confinados", responsable: "Carlos Rojas", valor: 33000, estado: "Calificación", fuente: "Cliente Recurrente", fechaCreacion: "2026-07-08", fechaContacto: "2026-07-10", diasSinContacto: 12, fechaCambio: "2026-07-08", diasEstancado: 14 },
    { id: "OP-0014", empresa: "Exsa", unidad: "Planta Lurín", curso: "II Seminario TTT", responsable: "Ana Torres", valor: 19000, estado: "Prospección", fuente: "LinkedIn", fechaCreacion: "2026-07-15", fechaContacto: "2026-07-16", diasSinContacto: 6, fechaCambio: "2026-07-15", diasEstancado: 7 },
    { id: "OP-0015", empresa: "Volcan Compañía Minera", unidad: "Yauli", curso: "Rescate Minero 2026", responsable: "Luis Vargas", valor: 145000, estado: "Negociación", fuente: "Feria Minera PERUMIN", fechaCreacion: "2026-06-05", fechaContacto: "2026-07-11", diasSinContacto: 11, fechaCambio: "2026-07-01", diasEstancado: 21 },
    { id: "OP-0016", empresa: "Opsimex", unidad: "Yauli", curso: "Cursos del Anexo 6", responsable: "María Salazar", valor: 62000, estado: "Cotización", fuente: "Referido", fechaCreacion: "2026-07-04", fechaContacto: "2026-07-18", diasSinContacto: 4, fechaCambio: "2026-07-15", diasEstancado: 7 },
    { id: "OP-0017", empresa: "Compañía de Minas Buenaventura", unidad: "Orcopampa", curso: "Manejo Defensivo y Uso de 4x4", responsable: "Carlos Rojas", valor: 88000, estado: "Calificación", fuente: "Cliente Recurrente", fechaCreacion: "2026-06-22", fechaContacto: "2026-07-03", diasSinContacto: 19, fechaCambio: "2026-06-22", diasEstancado: 30 },
    { id: "OP-0018", empresa: "Zicsa Contratistas Mineros", unidad: "Yauli", curso: "Trabajos en Altura", responsable: "Ana Torres", valor: 22000, estado: "Cierre", fuente: "Llamada Comercial", fechaCreacion: "2026-07-01", fechaContacto: "2026-07-19", diasSinContacto: 3, fechaCambio: "2026-07-19", diasEstancado: 3 }
  ],

  renovaciones: [
    { id: "REN-0001", empresa: "Compañía Minera Antamina", curso: "Cursos del Anexo 6", fecha: "15/08/2026", diasRestantes: 26, ingresoEstimado: 85400, estado: "Pendiente" },
    { id: "REN-0002", empresa: "Sociedad Minera Cerro Verde", curso: "LOTO Bloqueo", fecha: "20/08/2026", diasRestantes: 31, ingresoEstimado: 42800, estado: "Contactado" },
    { id: "REN-0003", empresa: "Minera Las Bambas", curso: "Trabajos en Altura", fecha: "30/08/2026", diasRestantes: 41, ingresoEstimado: 56700, estado: "Pendiente" },
    { id: "REN-0004", empresa: "Minsur", curso: "IPERC Continuo", fecha: "25/08/2026", diasRestantes: 36, ingresoEstimado: 30500, estado: "Contactado" },
    { id: "REN-0005", empresa: "Hudbay Perú", curso: "Manejo Defensivo y Uso de 4x4", fecha: "18/08/2026", diasRestantes: 29, ingresoEstimado: 25900, estado: "Pendiente" },
    { id: "REN-0006", empresa: "JRC Ingeniería y Construcción", curso: "Rescate Minero 2026", fecha: "25/07/2026", diasRestantes: 5, ingresoEstimado: 38000, estado: "Renovado" },
    { id: "REN-0007", empresa: "Compañía Minera Poderosa", curso: "Certificado Nebosh", fecha: "12/09/2026", diasRestantes: 54, ingresoEstimado: 62000, estado: "Pendiente" },
    { id: "REN-0008", empresa: "San Martín Contratistas Generales", curso: "Espacios Confinados", fecha: "27/08/2026", diasRestantes: 38, ingresoEstimado: 48000, estado: "Renovado" }
  ],

  historial: [
    { id: "OP-0001", empresa: "Compañía Minera Antamina", estadoAnterior: "Prospección", estadoNuevo: "Cotización", fechaCambio: "2026-07-10 10:15:00", responsable: "Carlos Rojas" },
    { id: "OP-0002", empresa: "Sociedad Minera Cerro Verde", estadoAnterior: "Cotización", estadoNuevo: "Negociación", fechaCambio: "2026-07-18 11:20:00", responsable: "Ana Torres" },
    { id: "OP-0035", empresa: "Minera Las Bambas", estadoAnterior: "Calificación", estadoNuevo: "Cotización", fechaCambio: "2026-07-01 09:30:00", responsable: "Luis Vargas" },
    { id: "OP-0047", empresa: "San Martín Contratistas Generales", estadoAnterior: "Prospección", estadoNuevo: "Calificación", fechaCambio: "2026-07-04 14:45:00", responsable: "Luis Vargas" },
    { id: "OP-0019", empresa: "Hudbay Perú", estadoAnterior: "Cotización", estadoNuevo: "Negociación", fechaCambio: "2026-07-05 16:10:00", responsable: "Luis Vargas" }
  ],

  actividades: [
    { fecha: "20/07/2026 10:30", tipo: "Llamada", empresa: "Antamina", opId: "OP-0001", actividad: "Llamada comercial con Gerente SSOMA", responsable: "Carlos Rojas", resultado: "Interés confirmado", proximaAccion: "Enviar propuesta final" },
    { fecha: "20/07/2026 09:15", tipo: "Correo", empresa: "Cerro Verde", opId: "OP-0010", actividad: "Envío de cotización Anexo 6", responsable: "Ana Torres", resultado: "Propuesta enviada", proximaAccion: "Esperar feedback" },
    { fecha: "19/07/2026 16:45", tipo: "Reunión", empresa: "Las Bambas", opId: "OP-0035", actividad: "Reunión virtual de calibración", responsable: "Luis Vargas", resultado: "En evaluación interna", proximaAccion: "Seguimiento 25/07" },
    { fecha: "19/07/2026 11:20", tipo: "WhatsApp", empresa: "Hudbay", opId: "OP-0020", actividad: "Mensaje a Superintendente", responsable: "María Salazar", resultado: "Solicitan información", proximaAccion: "Enviar brochure" }
  ]
};
