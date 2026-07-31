/**
 * CRM B2B ISEM - UI Components & DOM Manipulator
 * Maneja el renderizado dinámico de tablas, vistas, modales, alertas y autenticación.
 */

window.ISEM_UI = {

  currentView: "dashboard",
  currentUser: null,

  init: function() {
    this.checkAuth();
    this.bindNavigation();
    this.bindSearch();
    this.bindModals();
    this.bindUserDropdown();
    this.bindNotificationBell();
    this.populateDynamicDropdowns();
    this.loadDashboardData();
  },

  checkAuth: function() {
    var stored = localStorage.getItem("ISEM_CURRENT_USER");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      this.updateUserHeader();
      var loginOverlay = document.getElementById("loginOverlay");
      if (loginOverlay) loginOverlay.classList.add("hidden");
    } else {
      var loginOverlay = document.getElementById("loginOverlay");
      if (loginOverlay) loginOverlay.classList.remove("hidden");
    }

    var loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var email = document.getElementById("loginEmail").value.trim().toLowerCase();
        var pass = document.getElementById("loginPass").value;

        var user = window.ISEM_DATABASE.usuarios.find(u => u.correo.toLowerCase() === email && u.pass === pass);
        if (user) {
          window.ISEM_UI.currentUser = user;
          localStorage.setItem("ISEM_CURRENT_USER", JSON.stringify(user));
          window.ISEM_UI.updateUserHeader();
          document.getElementById("loginOverlay").classList.add("hidden");
        } else {
          // Si es un usuario nuevo personalizado
          var nameFromEmail = email.split('@')[0];
          user = { nombre: nameFromEmail.toUpperCase(), correo: email, rol: "Comercial ISEM", avatar: nameFromEmail.slice(0,2).toUpperCase() };
          window.ISEM_UI.currentUser = user;
          localStorage.setItem("ISEM_CURRENT_USER", JSON.stringify(user));
          window.ISEM_UI.updateUserHeader();
          document.getElementById("loginOverlay").classList.add("hidden");
        }
      });
    }
  },

  updateUserHeader: function() {
    if (!this.currentUser) return;
    var nameEl = document.getElementById("headerUserName");
    var roleEl = document.getElementById("headerUserRole");
    var avatarEl = document.getElementById("headerUserAvatar");

    if (nameEl) nameEl.textContent = this.currentUser.nombre;
    if (roleEl) roleEl.textContent = this.currentUser.rol;
    if (avatarEl) avatarEl.textContent = this.currentUser.avatar || "US";

    var opRespSelect = document.getElementById("opResponsable");
    if (opRespSelect && this.currentUser.nombre) {
      opRespSelect.value = this.currentUser.nombre;
    }
  },

  logout: function() {
    localStorage.removeItem("ISEM_CURRENT_USER");
    this.currentUser = null;
    document.getElementById("loginOverlay").classList.remove("hidden");
    var menu = document.getElementById("userDropdown");
    if (menu) menu.classList.remove("active");
  },

  bindUserDropdown: function() {
    var trigger = document.getElementById("userProfileTrigger");
    var menu = document.getElementById("userDropdown");

    if (trigger && menu) {
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        menu.classList.toggle("active");
      });

      document.addEventListener("click", function() {
        menu.classList.remove("active");
      });
    }
  },

  bindNotificationBell: function() {
    var bell = document.getElementById("notificationBell");
    if (bell) {
      bell.addEventListener("click", function() {
        var modal = document.getElementById("modalNotifications");
        if (modal) modal.classList.add("active");
      });
    }
  },

  bindNavigation: function() {
    var self = this;
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", function(e) {
        var targetView = this.getAttribute("data-view");
        if (targetView) {
          e.preventDefault();
          document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
          this.classList.add("active");
          self.switchView(targetView);
        }
      });
    });

    var mobileToggle = document.getElementById("mobileToggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", function() {
        document.querySelector(".sidebar").classList.toggle("mobile-open");
      });
    }
  },

  switchView: function(viewId) {
    this.currentView = viewId;
    document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
    
    var activePanel = document.getElementById("view-" + viewId);
    if (activePanel) {
      activePanel.classList.add("active");
    }

    var titleEl = document.getElementById("pageTitle");
    var subEl = document.getElementById("pageSubtitle");

    switch(viewId) {
      case "dashboard":
        titleEl.textContent = "CRM B2B ISEM";
        subEl.textContent = "Gestión Comercial de Capacitación para la Industria Minera";
        this.renderDashboard();
        break;
      case "oportunidades":
        titleEl.textContent = "Oportunidades Comerciales";
        subEl.textContent = "Seguimiento de propuestas, etapas del embudo y cotizaciones";
        this.renderOportunidadesTable();
        break;
      case "clientes":
        titleEl.textContent = "Clientes & Ecosistema Minero";
        subEl.textContent = "Mapeo topológico de Titulares Mineros y Contratistas";
        this.renderClientesTable();
        break;
      case "renovaciones":
        titleEl.textContent = "Gestión de Renovaciones de Servicios";
        subEl.textContent = "Retención de clientes y previsión de vencimiento de contratos";
        this.renderRenovacionesTable();
        break;
      case "historial":
        titleEl.textContent = "Auditoría Temporal Inmutable";
        subEl.textContent = "Trazabilidad de cambios de estado y velocidad del pipeline";
        this.renderHistorialTable();
        break;
      case "configuracion":
        titleEl.textContent = "Conexión a Google Sheets API";
        subEl.textContent = "Configuración del Web App URL de Google Apps Script";
        this.renderConfigPanel();
        break;
    }

    // Re-aplicar filtro si hay una búsqueda activa
    var searchInput = document.getElementById("globalSearch");
    if (searchInput && searchInput.value.trim()) {
      this.filterActiveTable(searchInput.value.trim().toLowerCase());
    }
  },

  bindSearch: function() {
    var self = this;
    var searchInput = document.getElementById("globalSearch");
    var dropdown = document.getElementById("searchResultsDropdown");

    if (!searchInput) return;

    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.id = "searchResultsDropdown";
      dropdown.className = "search-results-dropdown hidden";
      searchInput.parentNode.appendChild(dropdown);
    }

    searchInput.addEventListener("input", function(e) {
      var query = e.target.value.trim().toLowerCase();
      self.performSearch(query, dropdown);
      self.filterActiveTable(query);
    });

    searchInput.addEventListener("focus", function(e) {
      var query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        self.performSearch(query, dropdown);
      }
    });

    document.addEventListener("click", function(e) {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        dropdown.classList.add("hidden");
      }
    });
  },

  performSearch: function(query, dropdown) {
    if (!query || query.length === 0) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    var clients = (this.crmData && this.crmData.clientes) || window.ISEM_DATABASE.clientes || [];
    var ops = (this.crmData && this.crmData.oportunidades) || window.ISEM_DATABASE.oportunidades || [];
    var rens = (this.crmData && this.crmData.renovaciones) || window.ISEM_DATABASE.renovaciones || [];
    var configLists = this.getConfigLists();

    // 1. Contactos Directos
    var matchingContacts = clients.filter(c => 
      c.contacto && (
        c.contacto.toLowerCase().includes(query) ||
        (c.cargo && c.cargo.toLowerCase().includes(query)) ||
        (c.correo && c.correo.toLowerCase().includes(query)) ||
        (c.telefono && c.telefono.toLowerCase().includes(query))
      )
    );

    // 2. Responsables Comerciales (Extraídos dinámicamente de la Hoja Configuración)
    var listResponsables = configLists.responsables;
    var matchingResponsables = listResponsables.filter(r => r.toLowerCase().includes(query));

    // 3. Cursos ISEM (Extraídos dinámicamente de la Hoja Configuración)
    var listCursos = configLists.cursos;
    var matchingCursos = listCursos.filter(c => c.toLowerCase().includes(query));

    // 4. Clientes y Empresas
    var matchingClients = clients.filter(c => 
      (c.empresa && c.empresa.toLowerCase().includes(query)) ||
      (c.titular && c.titular.toLowerCase().includes(query)) ||
      (c.region && c.region.toLowerCase().includes(query))
    );

    // 5. Oportunidades Comerciales
    var matchingOps = ops.filter(o => 
      (o.id && o.id.toLowerCase().includes(query)) ||
      (o.empresa && o.empresa.toLowerCase().includes(query)) ||
      (o.curso && o.curso.toLowerCase().includes(query)) ||
      (o.unidad && o.unidad.toLowerCase().includes(query)) ||
      (o.estado && o.estado.toLowerCase().includes(query))
    );

    // 6. Renovaciones
    var matchingRens = rens.filter(r => 
      (r.id && r.id.toLowerCase().includes(query)) ||
      (r.empresa && r.empresa.toLowerCase().includes(query)) ||
      (r.curso && r.curso.toLowerCase().includes(query))
    );

    var totalMatches = matchingContacts.length + matchingResponsables.length + matchingCursos.length + matchingClients.length + matchingOps.length + matchingRens.length;

    if (totalMatches === 0) {
      dropdown.innerHTML = `<div class="search-no-results"><i class="ri-search-2-line" style="font-size:1.5rem; display:block; margin-bottom:6px; color:#9CA3AF;"></i>No se encontraron resultados para "<strong>${query}</strong>"</div>`;
      dropdown.classList.remove("hidden");
      return;
    }

    var html = "";

    // Render 1: Contactos
    if (matchingContacts.length > 0) {
      html += `<div class="search-category-title"><i class="ri-user-search-line"></i> Contactos Directos (${matchingContacts.length})</div>`;
      matchingContacts.slice(0, 4).forEach(c => {
        html += `
          <div class="search-result-item" onclick="ISEM_UI.navigateToResult('clientes', '${c.contacto.replace(/'/g, "\\'")}')">
            <div class="search-result-icon" style="background:#E0F2FE; color:#0284C7;"><i class="ri-user-3-line"></i></div>
            <div class="search-result-info">
              <div class="search-result-title">${c.contacto} <small style="font-weight:normal; color:#6B7280;">(${c.cargo || 'Contacto'})</small></div>
              <div class="search-result-sub">🏢 ${c.empresa} • 📧 ${c.correo || c.telefono}</div>
            </div>
            <span class="badge-stage prospeccion" style="font-size:0.65rem;">Contacto</span>
          </div>
        `;
      });
    }

    // Render 2: Responsables Comerciales
    if (matchingResponsables.length > 0) {
      html += `<div class="search-category-title"><i class="ri-user-star-line"></i> Responsables Comerciales ISEM (${matchingResponsables.length})</div>`;
      matchingResponsables.forEach(r => {
        var countOps = ops.filter(o => o.responsable === r).length;
        html += `
          <div class="search-result-item" onclick="ISEM_UI.navigateToResult('oportunidades', '${r.replace(/'/g, "\\'")}')">
            <div class="search-result-icon" style="background:#F3E8FF; color:#7E22CE;"><i class="ri-user-tie-line"></i></div>
            <div class="search-result-info">
              <div class="search-result-title">${r}</div>
              <div class="search-result-sub">Ejecutivo Comercial ISEM • ${countOps} Oportunidades asignadas</div>
            </div>
            <span class="badge-stage negociacion" style="font-size:0.65rem;">Comercial</span>
          </div>
        `;
      });
    }

    // Render 3: Cursos ISEM
    if (matchingCursos.length > 0) {
      html += `<div class="search-category-title"><i class="ri-book-read-line"></i> Cursos de Capacitación ISEM (${matchingCursos.length})</div>`;
      matchingCursos.slice(0, 4).forEach(c => {
        var countOps = ops.filter(o => o.curso === c).length;
        html += `
          <div class="search-result-item" onclick="ISEM_UI.navigateToResult('oportunidades', '${c.replace(/'/g, "\\'")}')">
            <div class="search-result-icon" style="background:#FEF3C7; color:#B45309;"><i class="ri-book-open-line"></i></div>
            <div class="search-result-info">
              <div class="search-result-title">${c}</div>
              <div class="search-result-sub">Programa Oficial ISEM • ${countOps} propuestas activas</div>
            </div>
            <span class="badge-stage cotizacion" style="font-size:0.65rem;">Curso</span>
          </div>
        `;
      });
    }

    // Render 4: Clientes
    if (matchingClients.length > 0) {
      html += `<div class="search-category-title"><i class="ri-building-4-line"></i> Empresas & Titulares (${matchingClients.length})</div>`;
      matchingClients.slice(0, 4).forEach(c => {
        html += `
          <div class="search-result-item" onclick="ISEM_UI.navigateToResult('clientes', '${c.empresa.replace(/'/g, "\\'")}')">
            <div class="search-result-icon"><i class="ri-building-line"></i></div>
            <div class="search-result-info">
              <div class="search-result-title">${c.empresa}</div>
              <div class="search-result-sub">${c.tipo} • ${c.region} ${c.titular !== 'N/A' ? '• Titular: ' + c.titular : ''}</div>
            </div>
            <span class="badge-stage ${c.tipo === 'Compañía Minera' ? 'prospeccion' : 'calificacion'}" style="font-size:0.65rem;">${c.tipo}</span>
          </div>
        `;
      });
    }

    // Render 5: Oportunidades
    if (matchingOps.length > 0) {
      html += `<div class="search-category-title"><i class="ri-focus-3-line"></i> Oportunidades Comerciales (${matchingOps.length})</div>`;
      matchingOps.slice(0, 4).forEach(o => {
        html += `
          <div class="search-result-item" onclick="ISEM_UI.navigateToResult('oportunidades', '${o.id}')">
            <div class="search-result-icon" style="background:#EEF2FF; color:#4F46E5;"><i class="ri-file-list-3-line"></i></div>
            <div class="search-result-info">
              <div class="search-result-title">${o.empresa} - ${o.curso}</div>
              <div class="search-result-sub">${o.id} • Resp: ${o.responsable} • S/ ${(o.valor || 0).toLocaleString()}</div>
            </div>
            <span class="badge-stage ${(o.estado||'').toLowerCase().replace(/ /g,'')}" style="font-size:0.65rem;">${o.estado}</span>
          </div>
        `;
      });
    }

    dropdown.innerHTML = html;
    dropdown.classList.remove("hidden");
  },

  navigateToResult: function(viewId, filterQuery) {
    var dropdown = document.getElementById("searchResultsDropdown");
    if (dropdown) dropdown.classList.add("hidden");

    var searchInput = document.getElementById("globalSearch");
    if (searchInput) searchInput.value = filterQuery;

    // Cambiar de vista activa
    var navItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (navItem) {
      navItem.click();
    } else {
      this.switchView(viewId);
    }

    this.filterActiveTable(filterQuery.toLowerCase());
  },

  filterActiveTable: function(query) {
    if (!query) query = "";
    var currentView = this.currentView;

    var tbodyIdMap = {
      "oportunidades": "tableOpsBody",
      "clientes": "tableClientsBody",
      "renovaciones": "tableRenovacionesBody",
      "historial": "tableHistorialBody"
    };

    var tbodyId = tbodyIdMap[currentView];
    if (!tbodyId) return;

    var tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    var rows = tbody.querySelectorAll("tr");
    rows.forEach(row => {
      var text = row.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  },

  bindModals: function() {
    var self = this;
    document.querySelectorAll("[data-modal-target]").forEach(btn => {
      btn.addEventListener("click", function() {
        var modalId = this.getAttribute("data-modal-target");
        self.populateDynamicDropdowns();
        var modal = document.getElementById(modalId);
        if (modal) modal.classList.add("active");
      });
    });

    document.querySelectorAll(".close-modal, .modal-overlay").forEach(el => {
      el.addEventListener("click", function(e) {
        if (e.target === this || this.classList.contains("close-modal")) {
          document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
        }
      });
    });

    // Formulario Nueva Oportunidad
    var formOp = document.getElementById("formNewOpportunity");
    if (formOp) {
      formOp.addEventListener("submit", async function(e) {
        e.preventDefault();
        var formData = {
          Empresa: document.getElementById("opEmpresa").value,
          Unidad_Minera: document.getElementById("opUnidad").value,
          Cursos_ISEM: document.getElementById("opCurso").value,
          Responsable_Comercial: document.getElementById("opResponsable").value,
          Valor_Contrato_PEN: parseFloat(document.getElementById("opValor").value) || 0,
          Estado_Contrato: document.getElementById("opEstado").value,
          Fuente_Lead: document.getElementById("opFuente").value
        };

        var res = await window.ISEM_API.createOpportunity(formData);
        alert(res.message);
        document.getElementById("modalNewOpportunity").classList.remove("active");
        formOp.reset();
        window.ISEM_UI.loadDashboardData();
      });
    }

    // Formulario Nuevo Cliente
    var formCli = document.getElementById("formNewClient");
    if (formCli) {
      formCli.addEventListener("submit", async function(e) {
        e.preventDefault();
        var formData = {
          Empresa: document.getElementById("cliEmpresa").value,
          Tipo_Empresa: document.getElementById("cliTipo").value,
          Unidad_Minera: document.getElementById("cliUnidad").value,
          Región: document.getElementById("cliRegion").value,
          Titular_Asociado: document.getElementById("cliTitular").value,
          Responsable_Comercial: document.getElementById("cliResponsable").value,
          Segmento: document.getElementById("cliSegmento").value,
          Contacto_Principal: document.getElementById("cliContacto").value,
          Cargo: document.getElementById("cliCargo").value,
          Teléfono: document.getElementById("cliTelefono").value,
          Correo_Corporativo: document.getElementById("cliCorreo").value
        };

        var res = await window.ISEM_API.createClient(formData);
        alert(res.message);
        document.getElementById("modalNewClient").classList.remove("active");
        formCli.reset();
        window.ISEM_UI.loadDashboardData();
      });
    }

    // Formulario Editar / Actualizar Cliente
    var formEditCli = document.getElementById("formEditClient");
    if (formEditCli) {
      formEditCli.addEventListener("submit", async function(e) {
        e.preventDefault();
        var clientId = document.getElementById("editCliId").value;
        var formData = {
          Empresa: document.getElementById("editCliEmpresa").value,
          Tipo_Empresa: document.getElementById("editCliTipo").value,
          Unidad_Minera: document.getElementById("editCliUnidad").value,
          Región: document.getElementById("editCliRegion").value,
          Titular_Asociado: document.getElementById("editCliTitular").value,
          Responsable_Comercial: document.getElementById("editCliResponsable").value,
          Segmento: document.getElementById("editCliSegmento").value,
          Contacto_Principal: document.getElementById("editCliContacto").value,
          Cargo: document.getElementById("editCliCargo").value,
          Teléfono: document.getElementById("editCliTelefono").value,
          Correo_Corporativo: document.getElementById("editCliCorreo").value
        };

        var res = await window.ISEM_API.updateClient(clientId, formData);
        alert(res.message);
        document.getElementById("modalEditClient").classList.remove("active");
        window.ISEM_UI.loadDashboardData();
        window.ISEM_UI.renderClientesTable();
      });
    }

    // Formulario Nueva Renovación
    var formRen = document.getElementById("formNewRenewal");
    if (formRen) {
      formRen.addEventListener("submit", async function(e) {
        e.preventDefault();
        var formData = {
          Empresa: document.getElementById("renEmpresa").value,
          Cursos_ISEM: document.getElementById("renCurso").value,
          Fecha_Estimada_Renovacion: document.getElementById("renFecha").value
        };

        var res = await window.ISEM_API.createRenewal(formData);
        alert(res.message);
        document.getElementById("modalNewRenewal").classList.remove("active");
        formRen.reset();
        window.ISEM_UI.loadDashboardData();
      });
    }

    // Formulario Actualizar Estado de Contrato
    var formChangeStage = document.getElementById("formChangeOpStage");
    if (formChangeStage) {
      formChangeStage.addEventListener("submit", async function(e) {
        e.preventDefault();
        var opId = document.getElementById("changeOpId").value;
        var newStage = document.getElementById("changeOpNewStage").value;
        
        var currentResp = (window.ISEM_UI.currentUser && window.ISEM_UI.currentUser.nombre) ? window.ISEM_UI.currentUser.nombre : "Carlos Rojas";
        var res = await window.ISEM_API.updateOpportunityStage(opId, newStage, currentResp);
        alert(res.message);
        document.getElementById("modalChangeOpStage").classList.remove("active");
        window.ISEM_UI.loadDashboardData();
        window.ISEM_UI.renderOportunidadesTable();
      });
    }
  },

  loadDashboardData: async function() {
    var data = await window.ISEM_API.fetchAllData();
    this.crmData = data;
    this.populateDynamicDropdowns();
    this.renderDashboard();
  },

  getConfigLists: function() {
    var cData = this.crmData || window.ISEM_DATABASE;
    var config = (cData && cData.config) ? cData.config : window.ISEM_DATABASE.config;

    var responsables = [];
    var cursos = [];
    var estados = [];
    var fuentes = [];
    var tiposEmpresa = [];
    var estadosSeguimiento = [];
    var regiones = [];
    var segmentos = [];

    // 1. Extraer dinámicamente desde las filas de la Hoja Configuración de Google Sheets
    if (Array.isArray(config) && config.length > 0) {
      config.forEach(row => {
        var r = row.Responsables_Comerciales || row.Responsable_Comercial || row.Responsables || row.Responsable;
        if (r && r.toString().trim() && !responsables.includes(r.toString().trim())) {
          responsables.push(r.toString().trim());
        }

        var c = row.Cursos_ISEM || row.Curso_ISEM || row.Cursos || row.Curso;
        if (c && c.toString().trim() && !cursos.includes(c.toString().trim())) {
          cursos.push(c.toString().trim());
        }

        var e = row.Estados_Contrato || row.Estado_Contrato || row.Estados;
        if (e && e.toString().trim() && !estados.includes(e.toString().trim())) {
          estados.push(e.toString().trim());
        }

        var f = row.Fuente_Lead || row.Fuentes || row.Fuente;
        if (f && f.toString().trim() && !fuentes.includes(f.toString().trim())) {
          fuentes.push(f.toString().trim());
        }

        var t = row.Tipo_Empresa || row.Tipos || row.Tipo;
        if (t && t.toString().trim() && !tiposEmpresa.includes(t.toString().trim())) {
          tiposEmpresa.push(t.toString().trim());
        }

        var s = row.Estado_Seguimiento;
        if (s && s.toString().trim() && !estadosSeguimiento.includes(s.toString().trim())) {
          estadosSeguimiento.push(s.toString().trim());
        }

        var reg = row.Regiones || row.Region || row.Región;
        if (reg && reg.toString().trim() && !regiones.includes(reg.toString().trim())) {
          regiones.push(reg.toString().trim());
        }

        var seg = row.Segmento || row.Segmentos;
        if (seg && seg.toString().trim() && !segmentos.includes(seg.toString().trim())) {
          segmentos.push(seg.toString().trim());
        }
      });
    } else if (config && typeof config === "object" && !Array.isArray(config)) {
      // 2. Si config viene como objeto (ej. base local)
      (config.responsables || []).forEach(r => { if (r && !responsables.includes(r)) responsables.push(r); });
      (config.cursos || []).forEach(c => { if (c && !cursos.includes(c)) cursos.push(c); });
      (config.estados || []).forEach(e => { if (e && !estados.includes(e)) estados.push(e); });
      (config.fuentes || []).forEach(f => { if (f && !fuentes.includes(f)) fuentes.push(f); });
      (config.tiposEmpresa || []).forEach(t => { if (t && !tiposEmpresa.includes(t)) tiposEmpresa.push(t); });
      (config.estadosSeguimiento || []).forEach(s => { if (s && !estadosSeguimiento.includes(s)) estadosSeguimiento.push(s); });
      (config.regiones || []).forEach(r => { if (r && !regiones.includes(r)) regiones.push(r); });
      (config.segmentos || []).forEach(s => { if (s && !segmentos.includes(s)) segmentos.push(s); });
    }

    // 3. Fallbacks de respaldo SOLO SI la lista extraída estuvo vacía
    var dbConfig = (window.ISEM_DATABASE && window.ISEM_DATABASE.config) ? window.ISEM_DATABASE.config : {};
    if (responsables.length === 0) responsables = dbConfig.responsables || [];
    if (cursos.length === 0) cursos = dbConfig.cursos || [];
    if (estados.length === 0) estados = dbConfig.estados || [];
    if (fuentes.length === 0) fuentes = dbConfig.fuentes || [];
    if (tiposEmpresa.length === 0) tiposEmpresa = dbConfig.tiposEmpresa || [];
    if (estadosSeguimiento.length === 0) estadosSeguimiento = dbConfig.estadosSeguimiento || [];
    if (regiones.length === 0) regiones = dbConfig.regiones || [];
    if (segmentos.length === 0) segmentos = dbConfig.segmentos || [];

    return {
      responsables: responsables,
      cursos: cursos,
      estados: estados,
      fuentes: fuentes,
      tiposEmpresa: tiposEmpresa,
      estadosSeguimiento: estadosSeguimiento,
      regiones: regiones,
      segmentos: segmentos
    };
  },

  populateDynamicDropdowns: function() {
    var configLists = this.getConfigLists();

    // 1. Responsables Comerciales
    var opRespSelect = document.getElementById("opResponsable");
    var cliRespSelect = document.getElementById("cliResponsable");
    if (configLists.responsables.length > 0) {
      var optionsResp = configLists.responsables.map(r => `<option value="${r}">${r}</option>`).join('');
      if (opRespSelect) opRespSelect.innerHTML = optionsResp;
      if (cliRespSelect) cliRespSelect.innerHTML = optionsResp;
    }

    // 2. Cursos ISEM
    var opCursoSelect = document.getElementById("opCurso");
    var renCursoSelect = document.getElementById("renCurso");
    if (configLists.cursos.length > 0) {
      var optionsCursos = configLists.cursos.map(c => `<option value="${c}">${c}</option>`).join('');
      if (opCursoSelect) opCursoSelect.innerHTML = optionsCursos;
      if (renCursoSelect) renCursoSelect.innerHTML = optionsCursos;
    }

    // 3. Fuentes Lead
    var opFuenteSelect = document.getElementById("opFuente");
    if (configLists.fuentes.length > 0 && opFuenteSelect) {
      opFuenteSelect.innerHTML = configLists.fuentes.map(f => `<option value="${f}">${f}</option>`).join('');
    }

    // 4. Tipo Empresa
    var cliTipoSelect = document.getElementById("cliTipo");
    if (configLists.tiposEmpresa.length > 0 && cliTipoSelect) {
      cliTipoSelect.innerHTML = configLists.tiposEmpresa.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    // 5. Regiones
    var cliRegionSelect = document.getElementById("cliRegion");
    if (configLists.regiones.length > 0 && cliRegionSelect) {
      cliRegionSelect.innerHTML = configLists.regiones.map(r => `<option value="${r}">${r}</option>`).join('');
    }

    // 6. Segmentos
    var cliSegmentoSelect = document.getElementById("cliSegmento");
    if (configLists.segmentos.length > 0 && cliSegmentoSelect) {
      cliSegmentoSelect.innerHTML = configLists.segmentos.map(s => `<option value="${s}">${s}</option>`).join('');
    }

    // 7. Estados de Contrato (Pipeline / Cierre)
    var opEstadoSelect = document.getElementById("opEstado");
    var changeOpNewStageSelect = document.getElementById("changeOpNewStage");
    if (configLists.estados.length > 0) {
      var optionsEstados = configLists.estados.map(e => `<option value="${e}">${e}</option>`).join('');
      if (opEstadoSelect) opEstadoSelect.innerHTML = optionsEstados;
      if (changeOpNewStageSelect) changeOpNewStageSelect.innerHTML = optionsEstados;
    }
  },

  renderDashboard: function() {
    var cData = this.crmData || window.ISEM_DATABASE;
    var ops = (cData.oportunidades && cData.oportunidades.length > 0) ? cData.oportunidades : window.ISEM_DATABASE.oportunidades;
    var clients = (cData.clientes && cData.clientes.length > 0) ? cData.clientes : window.ISEM_DATABASE.clientes;
    var rens = (cData.renovaciones && cData.renovaciones.length > 0) ? cData.renovaciones : window.ISEM_DATABASE.renovaciones;

    window.ISEM_CHARTS.renderDwellTimeChart("chartPipelineVelocity", cData.stageMetrics || { "Prospección": 7.2, "Calificación": 9.8, "Cotización": 14.6, "Negociación": 18.3, "Cierre": 4.1 });
    window.ISEM_CHARTS.renderRepDonutChart("chartRepDistribution", ops);
    window.ISEM_CHARTS.renderTopCoursesList("chartTopCourses", ops);

    var criticalOps = ops.filter(o => (o.diasEstancado >= 10 || o.diasSinContacto >= 10))
                         .sort((a,b) => b.diasEstancado - a.diasEstancado)
                         .slice(0, 6);

    var tbodyCritical = document.getElementById("tableCriticalBody");
    if (tbodyCritical) {
      if (criticalOps.length === 0) {
        tbodyCritical.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#6B7280; padding:16px;">Sin oportunidades estancadas. ¡Excelente gestión comercial!</td></tr>';
      } else {
        tbodyCritical.innerHTML = criticalOps.map(o => `
          <tr>
            <td><strong style="color:var(--primary-dark);">${o.id}</strong></td>
            <td><strong>${o.empresa}</strong></td>
            <td><span class="badge-stage ${(o.estado||'').toLowerCase().replace(/ /g,'')}">${o.estado}</span></td>
            <td style="color:${o.diasEstancado > 15 ? 'var(--danger)' : '#374151'}; font-weight:700;">${o.diasEstancado} días</td>
            <td style="color:${o.diasSinContacto > 10 ? 'var(--warning)' : '#374151'}; font-weight:600;">${o.diasSinContacto} días</td>
          </tr>
        `).join('');
      }
    }

    var nextRens = rens.slice(0, 5);
    var renContainer = document.getElementById("upcomingRenewalsList");
    if (renContainer) {
      if (nextRens.length === 0) {
        renContainer.innerHTML = '<p style="font-size:0.8rem; color:#6B7280; padding:16px; text-align:center;">No hay renovaciones programadas.</p>';
      } else {
        var dotColors = ["#EF4444", "#2563EB", "#F59E0B", "#10B981", "#8B5CF6"];
        renContainer.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:10px; padding:4px 0;">
            ${nextRens.map((r, idx) => {
              var dotColor = dotColors[idx % dotColors.length];
              var daysLeft = r.diasRestantes || (12 + idx * 5);
              var badgeColor = daysLeft <= 20 ? "#DC2626" : "#D97706";
              return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#F8FAFC; border-radius:8px; border-left:4px solid ${dotColor};">
                  <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:10px; height:10px; border-radius:50%; background-color:${dotColor}; display:inline-block; flex-shrink:0;"></span>
                      <strong style="font-size:0.85rem; color:#1E293B;">${r.empresa} - ${r.curso}</strong>
                    </div>
                    <div style="color:${badgeColor}; font-size:0.75rem; font-weight:600; margin-top:3px; margin-left:18px;">
                      Vence en ${daysLeft} días
                    </div>
                  </div>
                  <div style="font-size:0.85rem; font-weight:700; color:#334155; text-align:right;">
                    ${r.fecha}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="text-align:right; margin-top:12px;">
            <a class="card-action" style="font-weight:700; color:var(--primary); font-size:0.85rem; cursor:pointer;" onclick="ISEM_UI.switchView('renovaciones')">Ver todas las renovaciones →</a>
          </div>
        `;
      }
    }
  },

  renderOportunidadesTable: function() {
    var ops = (this.crmData && this.crmData.oportunidades) || window.ISEM_DATABASE.oportunidades;
    var clients = (this.crmData && this.crmData.clientes) || window.ISEM_DATABASE.clientes || [];
    var tbody = document.getElementById("tableOpsBody");
    if (!tbody) return;

    if (ops.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#6B7280;">No hay oportunidades registradas. Haz clic en "+ Nueva Oportunidad" para agregar la primera.</td></tr>';
      return;
    }

    tbody.innerHTML = ops.map(o => {
      var clientObj = clients.find(c => c.empresa === o.empresa);
      var contactoName = clientObj ? clientObj.contacto : '';
      return `
        <tr data-contacto="${contactoName}">
          <td><strong>${o.id}</strong></td>
          <td>
            <strong>${o.empresa}</strong><br>
            <small style="color:#6B7280;">${o.unidad || 'N/A'}${contactoName ? ' • 👤 ' + contactoName : ''}</small>
          </td>
          <td>${o.curso}</td>
          <td>${o.responsable}</td>
          <td><strong>S/ ${(o.valor || 0).toLocaleString()}</strong></td>
          <td><span class="badge-stage ${(o.estado||'').toLowerCase().replace(/ /g,'')}">${o.estado}</span></td>
          <td>${o.diasEstancado||0}d / ${o.diasSinContacto||0}d</td>
          <td>
            <button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;" onclick="ISEM_UI.openChangeStageModal('${o.id}')">
              <i class="ri-edit-line"></i> Actualizar Estado
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderClientesTable: function() {
    var clients = (this.crmData && this.crmData.clientes) || window.ISEM_DATABASE.clientes;
    var tbody = document.getElementById("tableClientsBody");
    var badgeNav = document.getElementById("sidebarBadgeClients");
    if (badgeNav) badgeNav.textContent = clients.length;
    if (!tbody) return;

    if (clients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:20px; color:#6B7280;">No hay clientes registrados. Haz clic en "+ Registrar Nuevo Cliente".</td></tr>';
      return;
    }

    tbody.innerHTML = clients.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td><strong>${c.empresa}</strong></td>
        <td><span class="badge-stage ${c.tipo === 'Compañía Minera' ? 'prospeccion' : 'calificacion'}">${c.tipo}</span></td>
        <td><strong>${c.unidad || c.Unidad_Minera || 'N/A'}</strong></td>
        <td>${c.region}</td>
        <td><strong style="color:var(--primary-dark);">${c.titular}</strong></td>
        <td>${c.responsable}</td>
        <td>${c.segmento}</td>
        <td>${c.contacto}<br><small style="color:#6B7280;">${c.cargo}</small></td>
        <td><a href="mailto:${c.correo}" style="color:var(--info);">${c.correo}</a><br><small>${c.telefono}</small></td>
        <td>
          <button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem; display:inline-flex; align-items:center; gap:3px;" onclick="ISEM_UI.openEditClientModal('${c.id}')">
            <i class="ri-edit-line"></i> Actualizar
          </button>
        </td>
      </tr>
    `).join('');
  },

  openEditClientModal: function(clientId) {
    var clients = (this.crmData && this.crmData.clientes) || window.ISEM_DATABASE.clientes || [];
    var client = clients.find(c => c.id === clientId);
    if (!client) return;

    document.getElementById("editCliId").value = client.id;
    document.getElementById("editCliEmpresa").value = client.empresa || '';
    document.getElementById("editCliUnidad").value = client.unidad || client.Unidad_Minera || '';
    document.getElementById("editCliRegion").value = client.region || client.Región || '';
    document.getElementById("editCliTitular").value = client.titular || client.Titular_Asociado || '';
    document.getElementById("editCliContacto").value = client.contacto || client.Contacto_Principal || '';
    document.getElementById("editCliCargo").value = client.cargo || client.Cargo || '';
    document.getElementById("editCliTelefono").value = client.telefono || client.Teléfono || '';
    document.getElementById("editCliCorreo").value = client.correo || client.Correo_Corporativo || '';

    var configLists = this.getConfigLists();

    // Poblar Tipo Empresa
    var editCliTipo = document.getElementById("editCliTipo");
    if (editCliTipo && configLists.tiposEmpresa.length > 0) {
      editCliTipo.innerHTML = configLists.tiposEmpresa.map(t => `<option value="${t}" ${(t === client.tipo || t === client.Tipo_Empresa) ? 'selected' : ''}>${t}</option>`).join('');
    }

    // Poblar Responsable Comercial
    var editCliResp = document.getElementById("editCliResponsable");
    if (editCliResp && configLists.responsables.length > 0) {
      editCliResp.innerHTML = configLists.responsables.map(r => `<option value="${r}" ${(r === client.responsable || r === client.Responsable_Comercial) ? 'selected' : ''}>${r}</option>`).join('');
    }

    // Poblar Segmento
    var editCliSeg = document.getElementById("editCliSegmento");
    if (editCliSeg && configLists.segmentos.length > 0) {
      editCliSeg.innerHTML = configLists.segmentos.map(s => `<option value="${s}" ${(s === client.segmento || s === client.Segmento) ? 'selected' : ''}>${s}</option>`).join('');
    }

    var modal = document.getElementById("modalEditClient");
    if (modal) modal.classList.add("active");
  },

  renderRenovacionesTable: function() {
    var rens = (this.crmData && this.crmData.renovaciones) || window.ISEM_DATABASE.renovaciones;
    var tbody = document.getElementById("tableRenovacionesBody");
    if (!tbody) return;

    if (rens.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#6B7280;">No hay renovaciones programadas. Haz clic en "+ Programar Renovación".</td></tr>';
      return;
    }

    tbody.innerHTML = rens.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td><strong>${r.empresa}</strong></td>
        <td>${r.curso}</td>
        <td><strong style="color:#DC2626;">${r.fecha}</strong></td>
        <td><span class="badge-risk ${r.estado === 'Renovado' ? 'bajo' : 'alto'}">${r.estado}</span></td>
        <td>
          <button class="btn btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick="ISEM_UI.toggleRenewalState('${r.id}')">Cambiar Estado</button>
        </td>
      </tr>
    `).join('');
  },

  renderHistorialTable: function() {
    var hist = (this.crmData && this.crmData.historial) || window.ISEM_DATABASE.historial;
    var tbody = document.getElementById("tableHistorialBody");
    if (!tbody) return;

    if (hist.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#6B7280;">Sin historial registrado. Los cambios de estado generarán automáticamente la auditoría inmutable.</td></tr>';
      return;
    }

    tbody.innerHTML = hist.map(h => `
      <tr>
        <td><strong>${h.id}</strong></td>
        <td><strong>${h.empresa}</strong></td>
        <td><span class="badge-stage prospeccion">${h.estadoAnterior}</span></td>
        <td><span class="badge-stage cierre">${h.estadoNuevo}</span></td>
        <td><i class="ri-time-line" style="color:var(--primary);"></i> ${h.fechaCambio}</td>
        <td>${h.responsable}</td>
      </tr>
    `).join('');
  },

  renderConfigPanel: function() {
    var input = document.getElementById("appsScriptUrlInput");
    if (input) {
      input.value = window.ISEM_API.getScriptUrl();
    }
  },

  saveAppsScriptConfig: function() {
    var input = document.getElementById("appsScriptUrlInput");
    if (input) {
      window.ISEM_API.setScriptUrl(input.value);
      alert("✅ Configuración guardada. Sincronizando con Google Sheets...");
      this.loadDashboardData();
    }
  },

  openChangeStageModal: function(opId) {
    var ops = (this.crmData && this.crmData.oportunidades) || window.ISEM_DATABASE.oportunidades || [];
    var op = ops.find(o => o.id === opId);
    if (!op) return;

    var inputId = document.getElementById("changeOpId");
    var infoEl = document.getElementById("changeOpInfo");
    var badgeEl = document.getElementById("changeOpCurrentBadge");
    var selectEl = document.getElementById("changeOpNewStage");

    if (inputId) inputId.value = op.id;
    if (infoEl) infoEl.textContent = `${op.id} • ${op.empresa} (${op.curso})`;
    if (badgeEl) {
      badgeEl.textContent = op.estado;
      badgeEl.className = "badge-stage " + (op.estado || '').toLowerCase().replace(/ /g, '');
    }

    var configLists = this.getConfigLists();
    if (selectEl && configLists.estados.length > 0) {
      selectEl.innerHTML = configLists.estados.map(e => `<option value="${e}" ${e === op.estado ? 'selected' : ''}>${e}</option>`).join('');
    }

    var modal = document.getElementById("modalChangeOpStage");
    if (modal) modal.classList.add("active");
  },

  changeOpStage: async function(opId) {
    this.openChangeStageModal(opId);
  }
};
