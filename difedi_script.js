// ─────────────────────────────────────────────
//  DIFEDI – Script principal
//  Correo destino: difediemp@gmail.com
//  Servicio:       EmailJS (emailjs.com)
// ─────────────────────────────────────────────

// ⚙️  CONFIGURACIÓN EMAILJS
// Reemplaza estos 3 valores con los tuyos de emailjs.com
const EMAILJS_PUBLIC_KEY  = 'iOxKsG9fkqUU1Iq1';   // Ej: "user_xxxxxxxxxxx"
const EMAILJS_SERVICE_ID  = 'service_hl0v0lo';   // Ej: "service_xxxxxxx"
const EMAILJS_TEMPLATE_ID = 'template_dmg5vbl';  // Ej: "template_xxxxxxx"

// ─────────────────────────────────────────────
//  DATOS DE LOS 5 SERVICIOS
// ─────────────────────────────────────────────
const SERVICES = {
  contable:{name:"Servicios Contables",icon:"📊",sb:"sb-blue",fields:[
    {id:"regimen",label:"Régimen tributario actual",type:"radio",options:["Régimen Simple","Régimen Ordinario","No declarante","No sé"]},
    {id:"empleados",label:"¿Cuántos empleados tiene?",type:"select",options:["1–5","6–15","16–50","50+","Sin empleados"]},
    {id:"facturas",label:"Facturación mensual aprox.",type:"select",options:["Menos de $5M","$5M–$20M","$20M–$80M","Más de $80M"]},
    {id:"svc_cont",label:"¿Qué servicios requiere?",type:"cb",options:["Contabilidad mensual","Declaración de renta","IVA bimestral","Medios magnéticos","Revisión fiscal","Conciliaciones bancarias"]},
    {id:"software",label:"Software contable actual",type:"text",placeholder:"Ej: Siigo, World Office, Excel, Ninguno..."},
    {id:"notas",label:"Comentarios adicionales",type:"ta",placeholder:"Cuéntenos más sobre su situación contable..."},
  ]},
  administrativa:{name:"Gestión Administrativa",icon:"🏢",sb:"sb-orange",fields:[
    {id:"tipo_emp",label:"Tipo de empresa",type:"radio",options:["SAS","Ltda","Persona natural","Corporación / Fundación","Otro"]},
    {id:"sector",label:"Sector económico",type:"text",placeholder:"Ej: Comercio, Servicios, Manufactura..."},
    {id:"nec_adm",label:"¿Qué necesita gestionar?",type:"cb",options:["Estructura organizacional","Manual de funciones","Procesos internos","Trámites legales","RRHH y nómina","Archivo y documentación"]},
    {id:"urgencia",label:"Urgencia del servicio",type:"radio",options:["Inmediata","Este mes","En 1–3 meses","Explorando opciones"]},
    {id:"notas",label:"Descripción de su necesidad",type:"ta",placeholder:"Describa los problemas administrativos actuales..."},
  ]},
  asesoria:{name:"Asesoría Financiera",icon:"💡",sb:"sb-purple",fields:[
    {id:"objetivo",label:"Objetivo principal",type:"radio",options:["Reducir impuestos","Obtener créditos","Planear inversiones","Restructurar deudas","Diagnóstico financiero"]},
    {id:"ingresos",label:"Ingresos anuales aprox.",type:"select",options:["Menos de $50M","$50M–$200M","$200M–$1.000M","Más de $1.000M"]},
    {id:"svc_fin",label:"Servicios de interés",type:"cb",options:["Planeación tributaria","Análisis financiero","Flujo de caja","Presupuestos","Valoración de empresa","Asesoría NIIF"]},
    {id:"periodicidad",label:"Frecuencia de asesoría",type:"radio",options:["Consulta puntual","Mensual","Trimestral","Anual"]},
    {id:"notas",label:"Situación o reto financiero",type:"ta",placeholder:"Explíquenos el contexto para personalizar nuestra propuesta..."},
  ]},
  parametrizacion:{name:"Parametrización y Automatización",icon:"⚙️",sb:"sb-teal",fields:[
    {id:"software_p",label:"Software a parametrizar",type:"cb",options:["Siigo Nube","World Office","SAP","QuickBooks","Excel avanzado","Otro ERP"]},
    {id:"procesos",label:"Procesos a automatizar",type:"cb",options:["Facturación electrónica","Nómina electrónica","Reportes automáticos","Conciliaciones","Inventarios","Cartera"]},
    {id:"nivel",label:"Nivel tecnológico actual",type:"radio",options:["Muy básico (papel/Excel)","Básico (software simple)","Intermedio","Avanzado"]},
    {id:"usuarios",label:"Usuarios del sistema",type:"select",options:["1–3","4–10","11–30","30+"]},
    {id:"notas",label:"Proceso a automatizar",type:"ta",placeholder:"¿Qué tareas consume más tiempo y quisiera optimizar?"},
  ]},
  marketing:{name:"Marketing Empresarial",icon:"📣",sb:"sb-rose",fields:[
    {id:"objetivo",label:"Objetivo principal",type:"radio",options:["Conseguir más clientes","Posicionamiento de marca","Presencia en redes","Lanzar un producto","Mejorar reputación"]},
    {id:"canales",label:"Canales de interés",type:"cb",options:["Instagram","Facebook","LinkedIn","TikTok","Google Ads","Email marketing","WhatsApp Business","Página web"]},
    {id:"presupuesto",label:"Presupuesto mensual marketing",type:"select",options:["Menos de $500K","$500K–$2M","$2M–$8M","Más de $8M"]},
    {id:"web",label:"¿Tiene sitio web activo?",type:"radio",options:["Sí, funcional","Sí, pero desactualizado","No tengo","En construcción"]},
    {id:"notas",label:"¿A quién le vende y qué lo hace diferente?",type:"ta",placeholder:"Cuéntenos sobre su producto/servicio y cliente ideal..."},
  ]}
};

// ─────────────────────────────────────────────
//  ESTADO GLOBAL
// ─────────────────────────────────────────────
let selectedSvc   = null;
let waKey         = '';
let detailValues  = {};
let detailChecks  = {};
let detailRadios  = {};

// ─────────────────────────────────────────────
//  PASOS / NAVEGACIÓN
// ─────────────────────────────────────────────
function selectSvc(el) {
  document.querySelectorAll('.svc').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
  selectedSvc = el.dataset.id;
  document.getElementById('btn1').disabled = false;
}

function updateSteps(cur) {
  for (let i = 1; i <= 4; i++) {
    const sc = document.getElementById('sc' + i);
    const sl = document.getElementById('sl' + i);
    sc.className = 'sc ' + (i < cur ? 'done' : i === cur ? 'active' : 'pend');
    sc.textContent = i < cur ? '✓' : i;
    sl.className = 'sl ' + (i < cur ? 'done' : i === cur ? 'active' : '');
    if (i < 4) {
      const l = document.getElementById('l' + i);
      l.className = 'line' + (i < cur ? ' done' : '');
    }
  }
}

function goTo(step) {
  [1, 2, 3, 4].forEach(s => document.getElementById('step' + s).classList.add('hidden'));
  document.getElementById('step' + step).classList.remove('hidden');
  updateSteps(step);
  if (step === 2) renderBanner(2);
  if (step === 3) { renderBanner(3); renderDetailFields(); }
}

// ─────────────────────────────────────────────
//  BANNER DE SERVICIO SELECCIONADO
// ─────────────────────────────────────────────
function renderBanner(n) {
  const s = SERVICES[selectedSvc];
  if (!s) return;
  const b = document.getElementById('svc-banner' + n);
  b.className = 'sbn ' + s.sb;
  b.innerHTML = `<span style="font-size:18px">${s.icon}</span> Servicio: <strong>${s.name}</strong>`;
}

// ─────────────────────────────────────────────
//  CAMPOS DINÁMICOS (paso 3)
// ─────────────────────────────────────────────
function renderDetailFields() {
  const s = SERVICES[selectedSvc];
  if (!s) return;
  const c = document.getElementById('detail-fields');
  c.innerHTML = '';
  s.fields.forEach(f => {
    if (f.type === 'text') {
      const d = document.createElement('div');
      d.innerHTML = `<label class="flbl">${f.label}</label>
        <input class="fi" id="df-${f.id}" placeholder="${f.placeholder || ''}" value="${detailValues[f.id] || ''}"/>`;
      d.querySelector('input').oninput = e => { detailValues[f.id] = e.target.value; };
      c.appendChild(d);
    } else if (f.type === 'select') {
      const d = document.createElement('div');
      const opts = `<option value="">— Seleccione —</option>` +
        f.options.map(o => `<option${detailValues[f.id] === o ? ' selected' : ''}>${o}</option>`).join('');
      d.innerHTML = `<label class="flbl">${f.label}</label><select class="fs" id="df-${f.id}">${opts}</select>`;
      d.querySelector('select').onchange = e => { detailValues[f.id] = e.target.value; };
      c.appendChild(d);
    } else if (f.type === 'ta') {
      const d = document.createElement('div');
      d.className = 'fg2';
      d.innerHTML = `<label class="flbl">${f.label}</label>
        <textarea class="fta" id="df-${f.id}" placeholder="${f.placeholder || ''}">${detailValues[f.id] || ''}</textarea>`;
      d.querySelector('textarea').oninput = e => { detailValues[f.id] = e.target.value; };
      c.appendChild(d);
    } else if (f.type === 'radio') {
      const d = document.createElement('div');
      d.className = 'fg2';
      const btns = f.options.map(o =>
        `<div class="ri${detailRadios[f.id] === o ? ' sel' : ''}" onclick="pickRadio('${f.id}','${o}',this)">
          <div class="rd"></div>${o}</div>`).join('');
      d.innerHTML = `<label class="flbl">${f.label}</label><div class="rgrp">${btns}</div>`;
      c.appendChild(d);
    } else if (f.type === 'cb') {
      const d = document.createElement('div');
      d.className = 'fg2';
      const items = detailChecks[f.id] || [];
      const boxes = f.options.map(o =>
        `<div class="cbi${items.includes(o) ? ' on' : ''}" onclick="toggleCb('${f.id}','${o}',this)">
          <div class="cbx">${items.includes(o) ? '✓' : ''}</div>
          <span class="cbt">${o}</span></div>`).join('');
      d.innerHTML = `<label class="flbl">${f.label}</label><div class="cbgrid">${boxes}</div>`;
      c.appendChild(d);
    }
  });
}

function pickRadio(fid, opt, el) {
  detailRadios[fid] = opt;
  el.closest('.rgrp').querySelectorAll('.ri').forEach(r => r.classList.remove('sel'));
  el.classList.add('sel');
}

function toggleCb(fid, opt, el) {
  detailChecks[fid] = detailChecks[fid] || [];
  const i = detailChecks[fid].indexOf(opt);
  if (i > -1) {
    detailChecks[fid].splice(i, 1);
    el.classList.remove('on');
    el.querySelector('.cbx').textContent = '';
  } else {
    detailChecks[fid].push(opt);
    el.classList.add('on');
    el.querySelector('.cbx').textContent = '✓';
  }
}

function checkStep2() {
  const ok = document.getElementById('f-nombre').value &&
             document.getElementById('f-email').value &&
             document.getElementById('f-tel').value;
  document.getElementById('btn2').disabled = !ok;
}

// ─────────────────────────────────────────────
//  CONSTRUIR MENSAJE DE COTIZACIÓN
// ─────────────────────────────────────────────
function buildEmailBody() {
  const s = SERVICES[selectedSvc] || {};
  const nombre  = document.getElementById('f-nombre').value;
  const empresa = document.getElementById('f-empresa').value;
  const cargo   = document.getElementById('f-cargo').value;
  const ciudad  = document.getElementById('f-ciudad').value;
  const email   = document.getElementById('f-email').value;
  const tel     = document.getElementById('f-tel').value;

  let opciones = '';
  const cbE = Object.entries(detailChecks).filter(([, v]) => v.length > 0);
  cbE.forEach(([, v]) => { opciones += `• ${v.join(', ')}\n`; });

  let preferencias = '';
  Object.entries(detailRadios).filter(([, v]) => v).forEach(([, v]) => {
    preferencias += `• ${v}\n`;
  });

  return {
    to_email:     'difediemp@gmail.com',
    subject:      `🔔 Nueva Cotización DIFEDI – ${s.name} – ${nombre}`,
    servicio:     s.name || selectedSvc,
    nombre,
    empresa:      empresa || '—',
    cargo:        cargo   || '—',
    ciudad:       ciudad  || '—',
    email_cliente: email,
    telefono:     tel,
    opciones:     opciones  || 'No especificadas',
    preferencias: preferencias || 'No especificadas',
    notas:        detailValues.notas || '—',
    fecha:        new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
    // Cuerpo completo en texto plano (para la variable {{message}} del template)
    message: `
SERVICIO SOLICITADO: ${s.name || selectedSvc}

── DATOS DEL CLIENTE ──────────────────
Nombre:   ${nombre}
Empresa:  ${empresa || '—'}
Cargo:    ${cargo   || '—'}
Ciudad:   ${ciudad  || '—'}
Email:    ${email}
Teléfono: ${tel}

── DETALLES DEL SERVICIO ──────────────
${opciones ? 'Opciones seleccionadas:\n' + opciones : ''}
${preferencias ? 'Preferencias:\n' + preferencias : ''}
${detailValues.notas ? 'Notas:\n' + detailValues.notas : ''}

── INFO ───────────────────────────────
Fecha: ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
Formulario: https://gou087.github.io/DIFEDI/
    `.trim()
  };
}

// ─────────────────────────────────────────────
//  ENVÍO DE CORREO VÍA EMAILJS
// ─────────────────────────────────────────────
async function sendEmailJS(params) {
  // Inicializar EmailJS con la clave pública
  emailjs.init(EMAILJS_PUBLIC_KEY);
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

// ─────────────────────────────────────────────
//  ENVÍO VÍA WHATSAPP (CallMeBot)
// ─────────────────────────────────────────────
function sendWhatsApp() {
  if (!waKey) return false;
  const params = buildEmailBody();
  const msg = encodeURIComponent(
    `🔔 NUEVA COTIZACIÓN DIFEDI\n\n📋 ${params.servicio}\n👤 ${params.nombre}\n📧 ${params.email_cliente}\n📱 ${params.telefono}\n📍 ${params.ciudad}\n\n${params.notas !== '—' ? '💬 ' + params.notas : ''}\n\n📅 ${params.fecha}`
  );
  new Image().src = `https://api.callmebot.com/whatsapp.php?phone=573057509432&text=${msg}&apikey=${waKey}`;
  return true;
}

// ─────────────────────────────────────────────
//  SUBMIT PRINCIPAL
// ─────────────────────────────────────────────
async function submitForm() {
  goTo(4);

  const neEl = document.getElementById('notif-email');
  const nwEl = document.getElementById('notif-wa');

  neEl.className = 'nc send';
  neEl.innerHTML = '<span class="spin">⏳</span> Enviando correo...';
  nwEl.className = 'nc send';
  nwEl.innerHTML = '<span class="spin">⏳</span> WhatsApp...';

  renderSummary();

  // ── Correo vía EmailJS ──
  let emailOk = false;
  if (EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY') {
    // EmailJS no configurado → fallback a mailto
    const p = buildEmailBody();
    const subject = encodeURIComponent(p.subject);
    const body    = encodeURIComponent(p.message);
    window.open(`mailto:difediemp@gmail.com?subject=${subject}&body=${body}`);
    emailOk = true; // abrió el cliente de correo
  } else {
    try {
      await sendEmailJS(buildEmailBody());
      emailOk = true;
    } catch (err) {
      console.error('EmailJS error:', err);
    }
  }

  // ── WhatsApp vía CallMeBot ──
  const waOk = sendWhatsApp();

  // ── Actualizar chips de estado ──
  setTimeout(() => {
    if (emailOk) {
      neEl.className = 'nc ok';
      neEl.innerHTML = EMAILJS_PUBLIC_KEY === 'TU_PUBLIC_KEY'
        ? '✅ Correo preparado (revisa tu app de correo)'
        : '✅ Correo enviado a difediemp@gmail.com';
    } else {
      neEl.className = 'nc err';
      neEl.innerHTML = '⚠️ Error al enviar correo — revisa la configuración EmailJS';
    }

    if (waOk) {
      nwEl.className = 'nc ok';
      nwEl.innerHTML = '✅ WhatsApp enviado a +57 305 750 9432';
    } else {
      nwEl.className = 'nc err';
      nwEl.innerHTML = '🔕 WhatsApp sin configurar';
      if (!document.querySelector('.success .info-box')) {
        const ib = document.createElement('div');
        ib.className = 'info-box';
        ib.innerHTML = '💡 <strong>Activa WhatsApp:</strong> Toca "Configurar avisos" arriba para recibir notificaciones en tu celular.';
        document.querySelector('.success').insertBefore(ib, document.getElementById('summary-box'));
      }
    }
  }, 2000);
}

// ─────────────────────────────────────────────
//  RESUMEN FINAL
// ─────────────────────────────────────────────
function renderSummary() {
  const s = SERVICES[selectedSvc] || {};
  const empresa = document.getElementById('f-empresa').value;
  let rows = [
    ['Servicio', s.name || selectedSvc],
    ['Nombre', document.getElementById('f-nombre').value + (empresa ? ` — ${empresa}` : '')],
    ['Correo', document.getElementById('f-email').value],
    ['Teléfono', document.getElementById('f-tel').value],
  ];
  const ciudad = document.getElementById('f-ciudad').value;
  if (ciudad) rows.push(['Ciudad', ciudad]);

  let html = rows.map(([k, v]) =>
    `<div class="sr"><span class="sk">${k}</span><span class="sv">${v}</span></div>`
  ).join('');

  const cbE = Object.entries(detailChecks).filter(([, v]) => v.length > 0);
  cbE.forEach(([, v]) => {
    html += `<div class="sr"><span class="sk">Opciones</span><span class="sv">${v.map(o => `<span class="tag">${o}</span>`).join('')}</span></div>`;
  });

  document.getElementById('summary-box').innerHTML = html;
}

// ─────────────────────────────────────────────
//  RESET FORMULARIO
// ─────────────────────────────────────────────
function resetForm() {
  selectedSvc = null;
  detailValues = {}; detailChecks = {}; detailRadios = {};
  ['f-nombre','f-empresa','f-cargo','f-ciudad','f-email','f-tel']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('btn1').disabled = true;
  document.getElementById('btn2').disabled = true;
  document.querySelectorAll('.svc').forEach(s => s.classList.remove('sel'));
  document.getElementById('summary-box').innerHTML = '';
  const ib = document.querySelector('.success .info-box');
  if (ib) ib.remove();
  goTo(1);
}

// ─────────────────────────────────────────────
//  CONFIGURACIÓN WHATSAPP (CallMeBot)
// ─────────────────────────────────────────────
function saveWaKey() {
  const v = document.getElementById('wa-key-input').value.trim();
  if (!v) return;
  waKey = v;
  document.getElementById('wa-saved-msg').style.display = 'block';
  document.getElementById('wa-pill').style.background = '#DCFCE7';
  document.getElementById('wa-pill').style.color = '#166534';
  document.getElementById('wa-pill').textContent = '✓ Activado';
  document.getElementById('wa-dot').className = 'dot on';
  document.getElementById('cfg-label').textContent = 'Notificaciones ON';
}
