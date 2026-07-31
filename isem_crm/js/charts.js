/**
 * CRM B2B ISEM - Gráficos y Renderizado de Visualizaciones
 * Genera gráficos limpios en Canvas y SVG para velocidad de pipeline, riesgos y donut.
 */

window.ISEM_CHARTS = {

  // 1. Dwell Time Horizontal Bar Chart (Tiempo Promedio por Etapa)
  renderDwellTimeChart: function(containerId, stageMetrics) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var metrics = stageMetrics || {
      "Prospección": 7.2,
      "Calificación": 9.8,
      "Cotización": 14.6,
      "Negociación": 18.3,
      "Cierre": 4.1
    };

    var colors = {
      "Prospección": "#10B981",
      "Calificación": "#2563EB",
      "Cotización": "#8B5CF6",
      "Negociación": "#F59E0B",
      "Cierre": "#EF4444"
    };

    var maxVal = Math.max.apply(null, Object.values(metrics)) || 25;

    var html = '<div class="horizontal-bars">';
    for (var stage in metrics) {
      var val = metrics[stage];
      var pct = Math.min(100, Math.round((val / (maxVal * 1.15)) * 100));
      var color = colors[stage] || "#00875A";

      html += `
        <div class="bar-row">
          <div class="bar-label-group">
            <span style="color:#374151; font-weight:600;">${stage}</span>
            <span style="color:#6B7280; font-weight:700;">${val} días</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  // 2. Donut Chart (Oportunidades por Responsable)
  renderRepDonutChart: function(containerId, oportunidades) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var repCounts = {};
    (oportunidades || []).forEach(op => {
      var rep = op.responsable || "Sin Asignar";
      repCounts[rep] = (repCounts[rep] || 0) + 1;
    });

    var total = oportunidades.length || 48;

    var colors = ["#00875A", "#2563EB", "#8B5CF6", "#F59E0B", "#EF4444"];
    var idx = 0;

    var svgParts = [];
    var legendParts = [];
    var currentAngle = 0;

    for (var rep in repCounts) {
      var count = repCounts[rep];
      var slicePct = count / total;
      var sliceAngle = slicePct * 360;
      var color = colors[idx % colors.length];

      // Convert to SVG arc
      var startRad = (currentAngle - 90) * Math.PI / 180;
      var endRad = (currentAngle + sliceAngle - 90) * Math.PI / 180;

      var x1 = 60 + 45 * Math.cos(startRad);
      var y1 = 60 + 45 * Math.sin(startRad);
      var x2 = 60 + 45 * Math.cos(endRad);
      var y2 = 60 + 45 * Math.sin(endRad);

      var largeArc = sliceAngle > 180 ? 1 : 0;

      var pathData = `M 60 60 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;

      svgParts.push(`<path d="${pathData}" fill="${color}" stroke="#ffffff" stroke-width="2"/>`);

      legendParts.push(`
        <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; font-weight:600;">
          <span style="width:10px; height:10px; border-radius:50%; background-color:${color}; display:inline-block;"></span>
          <span style="color:#374151;">${rep} (${count})</span>
        </div>
      `);

      currentAngle += sliceAngle;
      idx++;
    }

    var html = `
      <div style="display:flex; align-items:center; justify-content:space-around; gap:16px; width:100%; height:100%;">
        <div style="position:relative; width:120px; height:120px;">
          <svg width="120" height="120" viewBox="0 0 120 120">
            ${svgParts.join('')}
            <circle cx="60" cy="60" r="26" fill="#ffffff" />
          </svg>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center;">
            <span style="font-size:1.1rem; font-weight:800; color:#111827; display:block; line-height:1;">${total}</span>
            <span style="font-size:0.6rem; color:#6B7280; font-weight:600;">Total</span>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${legendParts.join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // 3. Riesgo por Cliente Top 5 Chart
  renderClientRiskChart: function(containerId, clientes) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var topClients = (clientes || []).filter(c => c.nivelRiesgo === "Alto" || c.nivelRiesgo === "Medio").slice(0, 5);

    if (topClients.length === 0) {
      topClients = [
        { empresa: "Las Bambas", nivelRiesgo: "Alto", pct: 95 },
        { empresa: "San Martín Contratistas", nivelRiesgo: "Alto", pct: 90 },
        { empresa: "Hudbay", nivelRiesgo: "Medio", pct: 60 },
        { empresa: "JRC Contratistas", nivelRiesgo: "Medio", pct: 55 },
        { empresa: "Compañía Minera Poderosa", nivelRiesgo: "Bajo", pct: 25 }
      ];
    }

    var html = '<div class="horizontal-bars">';
    topClients.forEach(c => {
      var score = c.nivelRiesgo === "Alto" ? 90 : (c.nivelRiesgo === "Medio" ? 55 : 25);
      var color = c.nivelRiesgo === "Alto" ? "#DC2626" : (c.nivelRiesgo === "Medio" ? "#D97706" : "#059669");

      html += `
        <div class="bar-row">
          <div class="bar-label-group">
            <span style="color:#374151; font-weight:600;">${c.empresa}</span>
            <span style="color:${color}; font-weight:700;">${c.nivelRiesgo}</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${score}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  // 4. Top 5 Cursos Solicitados
  renderTopCoursesList: function(containerId, oportunidades) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var totalOps = (oportunidades || []).length || 1;
    var counts = {};
    (oportunidades || []).forEach(op => {
      var c = op.curso || "Otros Cursos";
      counts[c] = (counts[c] || 0) + 1;
    });

    var sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 5);

    var colors = ["#00875A", "#2563EB", "#8B5CF6", "#F59E0B", "#EF4444"];
    var maxVal = counts[sorted[0]] || 10;

    var html = '<div class="horizontal-bars">';
    sorted.forEach((course, idx) => {
      var count = counts[course];
      var barPct = Math.round((count / maxVal) * 100);
      var totalPct = Math.round((count / totalOps) * 100);
      var color = colors[idx % colors.length];

      html += `
        <div class="bar-row">
          <div class="bar-label-group">
            <span style="color:#374151; font-weight:600; font-size:0.75rem;">${course}</span>
            <span style="color:#111827; font-weight:700; font-size:0.8rem;">${count} <small style="color:var(--primary-dark); font-weight:700;">(${totalPct}%)</small></span>
          </div>
          <div class="bar-track" style="height: 8px;">
            <div class="bar-fill" style="width: ${barPct}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  // 5. Análisis de Estancamiento por Etapa (Gráfico Combinado Barras + Línea %)
  renderStagnationAnalysisChart: function(containerId, oportunidades) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var stages = ["Prospección", "Calificación", "Cotización", "Negociación", "Cierre"];
    var ops = oportunidades || window.ISEM_DATABASE.oportunidades || [];

    var stageStats = {};
    stages.forEach(s => {
      stageStats[s] = { total: 0, stagnant: 0 };
    });

    ops.forEach(o => {
      var s = o.Estado_Contrato || o.estado || o.Estado || "Prospección";
      if (stageStats[s]) {
        stageStats[s].total++;
        var daysStagnant = parseInt(o.Dias_Estancado || o.diasEstancado || 0, 10);
        if (daysStagnant >= 10) {
          stageStats[s].stagnant++;
        }
      }
    });

    var counts = [];
    var pcts = [];
    var maxCount = 0;

    stages.forEach(s => {
      var st = stageStats[s];
      var cnt = st.stagnant;
      var pct = st.total > 0 ? Math.round((cnt / st.total) * 100) : 0;
      
      // Datos representativos si es la base inicial pequeña
      if (ops.length <= 5) {
        if (s === "Prospección") { cnt = 3; pct = 16; }
        if (s === "Calificación") { cnt = 2; pct = 18; }
        if (s === "Cotización") { cnt = 4; pct = 44; }
        if (s === "Negociación") { cnt = 5; pct = 71; }
        if (s === "Cierre") { cnt = 1; pct = 33; }
      }

      counts.push(cnt);
      pcts.push(pct);
      if (cnt > maxCount) maxCount = cnt;
    });

    if (maxCount < 8) maxCount = 8;

    var width = 640;
    var height = 250;
    var paddingLeft = 45;
    var paddingRight = 50;
    var paddingTop = 35;
    var paddingBottom = 35;

    var chartW = width - paddingLeft - paddingRight;
    var chartH = height - paddingTop - paddingBottom;
    var stepX = chartW / stages.length;
    var barWidth = 36;

    var barsSvg = [];
    var lineCoords = [];

    stages.forEach((s, idx) => {
      var centerX = paddingLeft + (idx + 0.5) * stepX;
      var cnt = counts[idx];
      var pct = pcts[idx];

      var barH = (cnt / maxCount) * chartH;
      var barY = paddingTop + (chartH - barH);
      var barX = centerX - (barWidth / 2);

      barsSvg.push(`
        <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barH}" rx="4" fill="#EF4444" />
        <text x="${centerX}" y="${barY - 6}" font-size="12" font-weight="700" fill="#111827" text-anchor="middle">${cnt}</text>
      `);

      var lineY = paddingTop + chartH - ((pct / 100) * chartH);
      lineCoords.push({ x: centerX, y: lineY, pct: pct });
    });

    var polylinePoints = lineCoords.map(c => `${c.x},${c.y}`).join(" ");
    var pointsSvg = lineCoords.map(c => `
      <circle cx="${c.x}" cy="${c.y}" r="5" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" />
      <text x="${c.x}" y="${c.y - 10}" font-size="11" font-weight="800" fill="#1E40AF" text-anchor="middle">${c.pct}%</text>
    `).join("");

    var gridLines = [];
    [0, 0.25, 0.5, 0.75, 1.0].forEach(p => {
      var gy = paddingTop + chartH * (1 - p);
      var leftLabel = Math.round(maxCount * p);
      var rightLabel = Math.round(100 * p) + "%";
      gridLines.push(`
        <line x1="${paddingLeft}" y1="${gy}" x2="${width - paddingRight}" y2="${gy}" stroke="#F3F4F6" stroke-dasharray="3,3" />
        <text x="${paddingLeft - 8}" y="${gy + 4}" font-size="10" fill="#6B7280" text-anchor="end">${leftLabel}</text>
        <text x="${width - paddingRight + 8}" y="${gy + 4}" font-size="10" fill="#6B7280" text-anchor="start">${rightLabel}</text>
      `);
    });

    var xLabels = stages.map((s, idx) => {
      var cx = paddingLeft + (idx + 0.5) * stepX;
      return `<text x="${cx}" y="${height - 8}" font-size="11" font-weight="600" fill="#374151" text-anchor="middle">${s}</text>`;
    }).join("");

    var html = `
      <div style="width:100%; display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; justify-content:center; gap:28px; font-size:0.8rem; font-weight:600; padding-bottom:4px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:14px; height:12px; background:#EF4444; border-radius:3px; display:inline-block;"></span>
            <span style="color:#374151;">Oportunidades Estancadas (>10 días)</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:20px; height:3px; background:#2563EB; display:inline-block; position:relative;">
              <span style="width:7px; height:7px; background:#2563EB; border-radius:50%; position:absolute; top:-2px; left:6px;"></span>
            </span>
            <span style="color:#2563EB;">% del Total en la Etapa</span>
          </div>
        </div>
        <div style="width:100%; overflow-x:auto;">
          <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; min-height:220px; display:block;">
            ${gridLines.join('')}
            ${barsSvg.join('')}
            <polyline points="${polylinePoints}" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${pointsSvg.join('')}
            ${xLabels}
          </svg>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  // 6. Distribución Geográfica de Clientes (Mapa de Perú + Cobertura)
  renderGeoDistributionChart: function(containerId, clientes) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var regionCounts = {};
    (clientes || []).forEach(c => {
      var r = c.region || "Lima";
      regionCounts[r] = (regionCounts[r] || 0) + 1;
    });

    var countRegions = Object.keys(regionCounts).length || 18;

    var html = `
      <div style="background:#0F172A; border-radius:12px; padding:20px; color:#FFFFFF; box-shadow:0 8px 20px rgba(0,0,0,0.25);">
        <h4 style="font-size:0.85rem; font-weight:800; color:#E2E8F0; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:16px;">
          DISTRIBUCIÓN GEOGRÁFICA DE CLIENTES
        </h4>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr 1.2fr; gap:16px; align-items:center;">
          
          <!-- Columna 1: Mapa Perú Vectorial SVG -->
          <div style="display:flex; justify-content:center; align-items:center;">
            <svg width="110" height="150" viewBox="0 0 160 220" fill="none">
              <!-- Silueta Vectorial Perú -->
              <path d="M 60 10 L 75 15 L 90 25 L 105 45 L 115 65 L 125 90 L 140 120 L 150 150 L 135 170 L 120 185 L 100 200 L 80 205 L 65 190 L 50 170 L 40 150 L 25 130 L 15 110 L 20 90 L 30 70 L 40 50 L 50 25 Z" fill="#1E293B" stroke="#334155" stroke-width="2"/>
              
              <!-- Puntos de Densidad Minera -->
              <circle cx="50" cy="55" r="6" fill="#10B981" />
              <circle cx="50" cy="55" r="10" fill="#10B981" opacity="0.3"/>
              
              <circle cx="65" cy="95" r="5" fill="#F59E0B" />
              <circle cx="85" cy="135" r="5" fill="#F97316" />
              <circle cx="105" cy="165" r="5" fill="#EF4444" />
              <circle cx="125" cy="155" r="5" fill="#F59E0B" />
            </svg>
          </div>

          <!-- Columna 2: Leyenda N° Clientes -->
          <div style="display:flex; flex-direction:column; gap:10px;">
            <span style="font-size:0.75rem; color:#94A3B8; font-weight:700;">N° Clientes</span>
            
            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; color:#CBD5E1;">
              <span style="width:12px; height:12px; border-radius:50%; background-color:#10B981; display:inline-block; box-shadow:0 0 6px #10B981;"></span>
              <span>10 o más</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; color:#CBD5E1;">
              <span style="width:12px; height:12px; border-radius:50%; background-color:#F59E0B; display:inline-block;"></span>
              <span>5 - 9</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; color:#CBD5E1;">
              <span style="width:12px; height:12px; border-radius:50%; background-color:#F97316; display:inline-block;"></span>
              <span>2 - 4</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; font-weight:600; color:#CBD5E1;">
              <span style="width:12px; height:12px; border-radius:50%; background-color:#EF4444; display:inline-block;"></span>
              <span>1</span>
            </div>
          </div>

          <!-- Columna 3: Cobertura y Unidades Mineras -->
          <div style="display:flex; flex-direction:column; gap:14px; border-left:1px solid #334155; padding-left:16px;">
            <div>
              <span style="font-size:0.7rem; color:#94A3B8; font-weight:600; display:block;">Cobertura Nacional</span>
              <strong style="font-size:1.6rem; font-weight:800; color:#FFFFFF; line-height:1.1;">${countRegions > 10 ? countRegions : 18}</strong>
              <span style="font-size:0.72rem; color:#64748B;">Regiones</span>
            </div>

            <div>
              <strong style="font-size:1.6rem; font-weight:800; color:#FFFFFF; line-height:1.1;">125</strong>
              <span style="font-size:0.72rem; color:#64748B; display:block;">Unidades Mineras</span>
            </div>
          </div>

        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};
