// ─────────────────────────────────────────────
// DIFEDI – Script principal
// Correo destino: difediemp@gmail.com
// ─────────────────────────────────────────────

const EMAILJS_PUBLIC_KEY = 'iOxKsG9fkqUU1Iq1';
const EMAILJS_SERVICE_ID = 'service_hl0v0lo';
const EMAILJS_TEMPLATE_ID = 'template_dmg5vbl';

// ─────────────────────────────────────────────
// SERVICIOS
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
    {id:"notas",label:"Situación o reto financiero",type:"ta",placeholder:"Explíquenos el contexto..."},
    ]},
  parametrizacion:{name:"Parametrización y Automatización",icon:"⚙️",sb:"sb-teal",fields:[
    {id:"software_p",label:"Software a parametrizar",type:"cb",options:["Siigo Nube","World Office","SAP","QuickBooks","Excel avanzado","Otro ERP"]},
    {id:"procesos",label:"Procesos a automatizar",type:"cb",options:["Facturación electrónica","Nómina electrónica","Reportes automáticos","Conciliaciones","Inventarios","Cartera"]},
    {id:"nivel",label:"Nivel tecnológico actual",type:"radio",options:["Muy básico (papel/Excel)","Básico (software simple)","Intermedio","Avanzado"]},
    {id:"usuarios",label:"Usuarios del sistema",type:"select",options:["1–3","4–10","11–30","30+"]},
    {id:"notas",label:"Proceso a automatizar",type:"ta",placeholder:"¿Qué tareas consume más tiempo?"},
    ]},
  marketing:{name:"Marketing Empresarial",icon:"📣",sb:"sb-rose",fields:[
    {id:"objetivo",label:"Objetivo principal",type:"radio",options:["Conseguir más clientes","Posicionamiento de marca","Presencia en redes","Lanzar un producto","Mejorar reputación"]},
    {id:"canales",label:"Canales de interés",type:"cb",options:["Instagram","Facebook","LinkedIn","TikTok","Google Ads","Email marketing","WhatsApp Business","Página web"]},
    {id:"presupuesto",label:"Presupuesto mensual marketing",type:"select",options:["Menos de $500K","$500K–$2M","$2M–$8M","Más de $8M"]},
    {id:"web",label:"¿Tiene sitio web activo?",type:"radio",options:["Sí, funcional","Sí, pero desactualizado","No tengo","En construcción"]},
    {id:"notas",label:"¿A quién le vende y qué lo hace diferente?",type:"ta",placeholder:"Cuéntenos sobre su producto/servicio..."},
    ]}
};

// ─────────────────────────────────────────────
// ESTADO
// ─────────────────────────────────────────────
let selectedSvc = [];   // ← ahora es un arreglo para múltiple selección
let waKey = '';
let detailValues = {};
let detailChecks = {};
let detailRadios = {};

// ─────────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────────
function selectSvc(el) {
    const id = el.dataset.id;
    const idx = selectedSvc.indexOf(id);
    if (idx > -1) {
          // Ya estaba seleccionado → deseleccionar
      selectedSvc.splice(idx, 1);
          el.classList.remove('sel');
    } else {
          // No estaba seleccionado → agregar
      selectedSvc.push(id);
          el.classList.add('sel');
    }
    document.getElementById('btn1').disabled = selectedSvc.length === 0;
}

function updateSteps(cur) {
  for (let i = 1; i <= 4; i++) {
    const sc = document.getElementById('sc' + i);
    const sl = document.getElementById('sl' + i);
    sc.className = 'sc ' + (i < cur ? 'done' : i === cur ? 'active' : 'pend');
    sc.textContent = i < cur ? '✓' : i;
    sl.className = 'sl ' + (i < cur ? 'done' : i === cur ? 'active' : '');
    if (i < 4) document.getElementById('l' + i).className = 'line' + (i < cur ? ' done' : '');
  }
}

function goTo(step) {
  [1,2,3,4].forEach(s => document.getElementById('step'+s).classList.add('hidden'));
  document.getElementById('step'+step).classList.remove('hidden');
  updateSteps(step);
  if (step === 2) renderBanner(2);
  if (step === 3) { renderBanner(3); renderDetailFields(); }
}

// ─────────────────────────────────────────────
// BANNER
// ─────────────────────────────────────────────
function renderBanner(n) {
    const names = selectedSvc.map(id => SERVICES[id] ? SERVICES[id].icon + ' ' + SERVICES[id].name : id).join('  |  ');
    const b = document.getElementById('svc-banner' + n);
    // Usar la clase sb del primer servicio seleccionado
  const firstSb = selectedSvc.length > 0 && SERVICES[selectedSvc[0]] ? SERVICES[selectedSvc[0]].sb : '';
    b.className = 'sbn ' + firstSb;
    b.innerHTML = `Servicio(s): <strong>${names}</strong>`;
}

// ─────────────────────────────────────────────
// CAMPOS DINÁMICOS
// ─────────────────────────────────────────────
function renderDetailFields() {
    const c = document.getElementById('detail-fields');
    c.innerHTML = '';

  selectedSvc.forEach((svcId, svcIdx) => {
        const s = SERVICES[svcId];
        if (!s) return;

                          // Encabezado de sección si hay más de un servicio
                          if (selectedSvc.length > 1) {
                                  const header = document.createElement('div');
                                  header.className = 'svc-section-header';
                                  header.innerHTML = `<h3 style="margin:18px 0 8px;font-size:15px;color:#555;border-bottom:1px solid #e0e0e0;padding-bottom:6px;">${s.icon} ${s.name}</h3>`;
                                  c.appendChild(header);
                          }

                          s.fields.forEach(f => {
                                  const fieldId = svcId + '_' + f.id;
                                  if (f.type === 'text') {
                                            const d = document.createElement('div');
                                            d.innerHTML = `<label class="flbl">${f.label}</label>
                                            <input class="fi" id="df-${fieldId}" placeholder="${f.placeholder||''}" value="${detailValues[fieldId]||''}"/>`;
                                            d.querySelector('input').oninput = e => { detailValues[fieldId] = e.target.value; };
                                            c.appendChild(d);
                                  } else if (f.type === 'select') {
                                            const d = document.createElement('div');
                                            const opts = `<option value="">— Seleccione —</option>` +
                                                        f.options.map(o => `<option${detailValues[fieldId]===o?' selected':''}>${o}</option>`).join('');
                                            d.innerHTML = `<label class="flbl">${f.label}</label><select class="fs" id="df-${fieldId}">${opts}</select>`;
                                            d.querySelector('select').onchange = e => { detailValues[fieldId] = e.target.value; };
                                            c.appendChild(d);
                                  } else if (f.type === 'ta') {
                                            const d = document.createElement('div'); d.className = 'fg2';
                                            d.innerHTML = `<label class="flbl">${f.label}</label>
                                            <textarea class="fta" id="df-${fieldId}" placeholder="${f.placeholder||''}">${detailValues[fieldId]||''}</textarea>`;
                                            d.querySelector('textarea').oninput = e => { detailValues[fieldId] = e.target.value; };
                                            c.appendChild(d);
                                  } else if (f.type === 'radio') {
                                            const d = document.createElement('div'); d.className = 'fg2';
                                            const btns = f.options.map(o =>
                                                        `<div class="ri${detailRadios[fieldId]===o?' sel':''}" onclick="pickRadio('${fieldId}','${o}',this)">
                                                        <div class="rd"></div>${o}</div>`).join('');
                                            d.innerHTML = `<label class="flbl">${f.label}</label><div class="rgrp">${btns}</div>`;
                                            c.appendChild(d);
                                  } else if (f.type === 'cb') {
                                            const d = document.createElement('div'); d.className = 'fg2';
                                            const items = detailChecks[fieldId] || [];
                                            const boxes = f.options.map(o =>
                                                        `<div class="cbi${items.includes(o)?' on':''}" onclick="toggleCb('${fieldId}','${o}',this)">
                                                        <div class="cbx">${items.includes(o)?'✓':''}</div>
                                                        <span class="cbt">${o}</span></div>`).join('');
                                            d.innerHTML = `<label class="flbl">${f.label}</label><div class="cbgrid">${boxes}</div>`;
                                            c.appendChild(d);
                                  }
                          });
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
  if (i > -1) { detailChecks[fid].splice(i,1); el.classList.remove('on'); el.querySelector('.cbx').textContent=''; }
  else { detailChecks[fid].push(opt); el.classList.add('on'); el.querySelector('.cbx').textContent='✓'; }
}

function checkStep2() {
  const ok = document.getElementById('f-nombre').value &&
    document.getElementById('f-email').value &&
    document.getElementById('f-tel').value;
  document.getElementById('btn2').disabled = !ok;
}

// ─────────────────────────────────────────────
// CONSTRUIR PARÁMETROS DEL CORREO
// ─────────────────────────────────────────────
function buildParams() {
    const svcNames = selectedSvc.map(id => SERVICES[id] ? SERVICES[id].name : id).join(', ');
    const nombre = document.getElementById('f-nombre').value;
    const empresa= document.getElementById('f-empresa').value;
    const cargo = document.getElementById('f-cargo').value;
    const ciudad = document.getElementById('f-ciudad').value;
    const email = document.getElementById('f-email').value;
    const tel = document.getElementById('f-tel').value;

  let opciones = '';
    Object.entries(detailChecks).filter(([,v])=>v.length>0)
      .forEach(([k,v]) => { opciones += `• ${v.join(', ')}\n`; });

  let preferencias = '';
    Object.entries(detailRadios).filter(([,v])=>v)
      .forEach(([,v]) => { preferencias += `• ${v}\n`; });

  // Notas de todos los servicios seleccionados
  let notasTexto = '';
    selectedSvc.forEach(svcId => {
          const notaKey = svcId + '_notas';
          if (detailValues[notaKey]) {
                  const sName = SERVICES[svcId] ? SERVICES[svcId].name : svcId;
                  notasTexto += `[${sName}]: ${detailValues[notaKey]}\n`;
          }
    });

  const message =
    `SERVICIO(S): ${svcNames}

    ── DATOS DEL CLIENTE ──────────────────
    Nombre: ${nombre}
    Empresa: ${empresa || '—'}
    Cargo: ${cargo || '—'}
    Ciudad: ${ciudad || '—'}
    Email: ${email}
    Teléfono: ${tel}

    ── DETALLES DEL SERVICIO ──────────────
    ${opciones ? 'Opciones:\n' + opciones : ''}
    ${preferencias ? 'Preferencias:\n' + preferencias : ''}
    ${notasTexto ? 'Notas:\n' + notasTexto : ''}

    Fecha: ${new Date().toLocaleString('es-CO',{timeZone:'America/Bogota'})}
    Formulario: https://gou087.github.io/DIFEDI/`;

  return {
        to_email: 'difediemp@gmail.com',
        subject: `🔔 Nueva Cotización DIFEDI – ${svcNames} – ${nombre}`,
        message,
        nombre, empresa: empresa||'—', cargo: cargo||'—',
        ciudad: ciudad||'—', email_cliente: email, telefono: tel,
        servicio: svcNames,
  };
}

// ─────────────────────────────────────────────
// ENVÍO EMAILJS (sin ningún fallback mailto)
// ─────────────────────────────────────────────
async function submitForm() {
  goTo(4);
  renderSummary();

const neEl = document.getElementById('notif-email');
  const nwEl = document.getElementById('notif-wa');
  neEl.className = 'nc send'; neEl.innerHTML = '<span class="spin">⏳</span> Enviando correo...';
  nwEl.className = 'nc send'; nwEl.innerHTML = '<span class="spin">⏳</span> WhatsApp...';

// — EmailJS —
let emailOk = false;
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildParams());
    emailOk = true;
  } catch (err) {
    console.error('EmailJS error:', err);
  }

// — WhatsApp CallMeBot —
let waOk = false;
  if (waKey) {
    try {
      const p = buildParams();
      const txt = encodeURIComponent(
        `🔔 NUEVA COTIZACIÓN DIFEDI\n\n📋 ${p.servicio}\n👤 ${p.nombre}\n📧 ${p.email_cliente}\n📱 ${p.telefono}\n📍 ${p.ciudad}\n\n📅 ${new Date().toLocaleString('es-CO',{timeZone:'America/Bogota'})}`
        );
      new Image().src = `https://api.callmebot.com/whatsapp.php?phone=573057509432&text=${txt}&apikey=${waKey}`;
      waOk = true;
    } catch(e){}
  }

// — Actualizar chips —
setTimeout(() => {
  neEl.className = emailOk ? 'nc ok' : 'nc err';
  neEl.innerHTML = emailOk
  ? '✅ Correo enviado a difediemp@gmail.com'
    : '⚠️ Error al enviar — revisa EmailJS';

           nwEl.className = waOk ? 'nc ok' : 'nc err';
  nwEl.innerHTML = waOk
  ? '✅ WhatsApp enviado a +57 305 750 9432'
    : '🔕 WhatsApp sin configurar';

           if (!waOk && !document.querySelector('.success .info-box')) {
             const ib = document.createElement('div');
             ib.className = 'info-box';
             ib.innerHTML = '💡 <strong>Activa WhatsApp:</strong> Toca "Configurar avisos" para recibir notificaciones en tu celular.';
             document.querySelector('.success').insertBefore(ib, document.getElementById('summary-box'));
           }
}, 2200);
}

// ─────────────────────────────────────────────
// RESUMEN
// ─────────────────────────────────────────────
function renderSummary() {
    const svcNames = selectedSvc.map(id => SERVICES[id] ? SERVICES[id].icon + ' ' + SERVICES[id].name : id).join(', ');
    const empresa = document.getElementById('f-empresa').value;
    let rows = [
          ['Servicio(s)', svcNames],
          ['Nombre', document.getElementById('f-nombre').value + (empresa ? ` — ${empresa}` : '')],
          ['Correo', document.getElementById('f-email').value],
          ['Teléfono', document.getElementById('f-tel').value],
        ];
    const ciudad = document.getElementById('f-ciudad').value;
    if (ciudad) rows.push(['Ciudad', ciudad]);

  let html = rows.map(([k,v]) =>
        `<div class="sr"><span class="sk">${k}</span><span class="sv">${v}</span></div>`).join('');

  Object.entries(detailChecks).filter(([,v])=>v.length>0).forEach(([,v]) => {
        html += `<div class="sr"><span class="sk">Opciones</span><span class="sv">${v.map(o=>`<span class="tag">${o}</span>`).join('')}</span></div>`;
  });
    document.getElementById('summary-box').innerHTML = html;
}

// ─────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────
function resetForm() {
    selectedSvc = []; detailValues = {}; detailChecks = {}; detailRadios = {};
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
// WHATSAPP CONFIG
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
