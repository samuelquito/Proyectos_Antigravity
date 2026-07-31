/**
 * CRM B2B ISEM - API Service Client
 * Maneja la sincronización con Google Apps Script o fallback a almacenamiento local Demo.
 */

window.ISEM_API = {
  getScriptUrl: function() {
    return localStorage.getItem("ISEM_APPS_SCRIPT_URL") || "";
  },

  setScriptUrl: function(url) {
    localStorage.setItem("ISEM_APPS_SCRIPT_URL", url.trim());
  },

  isLiveMode: function() {
    var url = this.getScriptUrl();
    return url && url.startsWith("https://script.google.com");
  },

  // Obtener todos los datos
  fetchAllData: async function() {
    if (this.isLiveMode()) {
      try {
        var url = this.getScriptUrl() + "?action=getAllData";
        var response = await fetch(url);
        var json = await response.json();
        if (json.status === "success") {
          return json;
        }
      } catch (err) {
        console.warn("Error consultando Apps Script. Usando base de datos local:", err);
      }
    }
    // Fallback Local
    return {
      status: "success",
      config: window.ISEM_DATABASE.config,
      clientes: window.ISEM_DATABASE.clientes,
      oportunidades: window.ISEM_DATABASE.oportunidades,
      renovaciones: window.ISEM_DATABASE.renovaciones,
      historial: window.ISEM_DATABASE.historial,
      stageMetrics: {
        "Prospección": 7.2,
        "Calificación": 9.8,
        "Cotización": 14.6,
        "Negociación": 18.3,
        "Cierre": 4.1
      }
    };
  },

  // Cambiar estado de Oportunidad
  updateOpportunityStage: async function(opId, newStage, responsable) {
    if (this.isLiveMode()) {
      try {
        var response = await fetch(this.getScriptUrl(), {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            action: "updateOpportunityStage",
            id: opId,
            newStage: newStage,
            responsable: responsable
          })
        });
        return await response.json();
      } catch (e) {
        console.error("Error enviando actualización a Apps Script", e);
      }
    }

    // Actualización en BD Local
    var op = window.ISEM_DATABASE.oportunidades.find(o => o.id === opId);
    if (op) {
      var oldStage = op.estado;
      op.estado = newStage;
      op.fechaCambio = new Date().toISOString().split('T')[0];
      op.diasEstancado = 0;

      // Log a Historial Inmutable
      window.ISEM_DATABASE.historial.unshift({
        id: opId,
        empresa: op.empresa,
        estadoAnterior: oldStage,
        estadoNuevo: newStage,
        fechaCambio: new Date().toLocaleString(),
        responsable: responsable || op.responsable
      });

      return { status: "success", message: "Oportunidad " + opId + " actualizada a " + newStage };
    }
    return { status: "error", message: "Oportunidad no encontrada" };
  },

  // Crear Cliente
  createClient: async function(clientData) {
    if (this.isLiveMode()) {
      try {
        var response = await fetch(this.getScriptUrl(), {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "addClient", data: clientData })
        });
        return await response.json();
      } catch (e) {
        console.error("Error enviando cliente a Apps Script", e);
      }
    }

    var newId = "CLI-" + String(window.ISEM_DATABASE.clientes.length).padStart(4, '0');
    var fullClient = Object.assign({ id: newId }, clientData);
    if (clientData.Unidad_Minera) fullClient.unidad = clientData.Unidad_Minera;
    window.ISEM_DATABASE.clientes.unshift(fullClient);
    return { status: "success", id: newId, message: "Cliente registrado" };
  },

  // Actualizar Cliente
  updateClient: async function(clientId, clientData) {
    if (this.isLiveMode()) {
      try {
        var response = await fetch(this.getScriptUrl(), {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "updateClient", id: clientId, data: clientData })
        });
        return await response.json();
      } catch (e) {
        console.error("Error actualizando cliente en Apps Script", e);
      }
    }

    var client = window.ISEM_DATABASE.clientes.find(c => c.id === clientId);
    if (client) {
      if (clientData.Empresa) client.empresa = clientData.Empresa;
      if (clientData.Tipo_Empresa) client.tipo = clientData.Tipo_Empresa;
      if (clientData.Unidad_Minera !== undefined) client.unidad = clientData.Unidad_Minera;
      if (clientData.Región) client.region = clientData.Región;
      if (clientData.Titular_Asociado !== undefined) client.titular = clientData.Titular_Asociado;
      if (clientData.Responsable_Comercial) client.responsable = clientData.Responsable_Comercial;
      if (clientData.Segmento) client.segmento = clientData.Segmento;
      if (clientData.Contacto_Principal !== undefined) client.contacto = clientData.Contacto_Principal;
      if (clientData.Cargo !== undefined) client.cargo = clientData.Cargo;
      if (clientData.Teléfono !== undefined) client.telefono = clientData.Teléfono;
      if (clientData.Correo_Corporativo !== undefined) client.correo = clientData.Correo_Corporativo;
      return { status: "success", message: "Cliente " + clientId + " actualizado correctamente" };
    }
    return { status: "error", message: "Cliente no encontrado" };
  },

  // Crear Oportunidad
  createOpportunity: async function(opData) {
    if (this.isLiveMode()) {
      try {
        var response = await fetch(this.getScriptUrl(), {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "addOpportunity", data: opData })
        });
        return await response.json();
      } catch (e) {
        console.error("Error enviando oportunidad a Apps Script", e);
      }
    }

    var newId = "OP-" + String(window.ISEM_DATABASE.oportunidades.length + 10).padStart(4, '0');
    var today = new Date().toISOString().split('T')[0];
    var fullOp = Object.assign({
      id: newId,
      fechaCreacion: today,
      fechaContacto: today,
      diasSinContacto: 0,
      fechaCambio: today,
      diasEstancado: 0
    }, opData);

    window.ISEM_DATABASE.oportunidades.unshift(fullOp);
    return { status: "success", id: newId, message: "Oportunidad creada" };
  },

  // Crear Renovación
  createRenewal: async function(renData) {
    if (this.isLiveMode()) {
      try {
        var response = await fetch(this.getScriptUrl(), {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action: "addRenewal", data: renData })
        });
        return await response.json();
      } catch (e) {
        console.error("Error enviando renovación a Apps Script", e);
      }
    }

    var newId = "REN-" + String(window.ISEM_DATABASE.renovaciones.length + 1).padStart(4, '0');
    var fullRen = Object.assign({ id: newId, estado: "Pendiente" }, renData);
    window.ISEM_DATABASE.renovaciones.unshift(fullRen);
    return { status: "success", id: newId, message: "Renovación agendada" };
  }
};
