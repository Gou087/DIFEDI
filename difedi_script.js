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
    {id:"tipo_emp",label:"Tipo de persona",type:"radio",options:["Natural","Juridica","Otro"]},
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
    {id:"software_p",label:"Software a parametrizar",type:"cb",options:["Siigo Nube","World Office","Siigo Pyme","Excel avanzado","Otro Software"]},
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

let selectedSvc = [], detailValues = {}, detailChecks = {}, detailRadios = {};

function selectSvc(el){
  const id = el.dataset.id;
  const idx = selectedSvc.indexOf(id);
  if(idx > -1){
    selectedSvc.splice(idx, 1);
    el.classList.remove('sel');
  } else {
    selectedSvc.push(id);
    el.classList.add('sel');
  }
  document.getElementById('btn1').disabled = selectedSvc.length === 0;
}

function updateSteps(cur){
  for(let i=1;i<=4;i++){
    const sc=document.getElementById('sc'+i), sl=document.getElementById('sl'+i);
    sc.className='sc '+(i<cur?'done':i===cur?'active':'pend');
    sc.textContent=i<cur?'✓':i;
    sl.className='sl '+(i<cur?'done':i===cur?'active':'');
    if(i<4){const l=document.getElementById('l'+i);l.className='line'+(i<cur?' done':'')}
  }
}

function goTo(step){
  [1,2,3,4].forEach(s=>document.getElementById('step'+s).classList.add('hidden'));
  document.getElementById('step'+step).classList.remove('hidden');
  updateSteps(step);
  if(step===2) renderBanner(2);
  if(step===3){renderBanner(3);renderDetailFields();}
}

function renderBanner(n){
  if(!selectedSvc.length)return;
  const b=document.getElementById('svc-banner'+n);
  if(selectedSvc.length===1){
    const s=SERVICES[selectedSvc[0]];
    b.className='sbn '+s.sb;
    b.innerHTML=`<span style="font-size:18px">${s.icon}</span> Servicio: <strong>${s.name}</strong>`;
  } else {
    const names=selectedSvc.map(id=>SERVICES[id]?.name).join(', ');
    b.className='sbn sb-blue';
    b.innerHTML=`📦 Servicios: <strong>${names}</strong>`;
  }
}

function renderDetailFields(){
  const c=document.getElementById('detail-fields'); c.innerHTML='';
  if(!selectedSvc.length)return;
  selectedSvc.forEach(svcId=>{
    const s=SERVICES[svcId]; if(!s)return;
    const sec=document.createElement('div');
    sec.style.marginBottom='24px';
    if(selectedSvc.length>1){
      const hdr=document.createElement('div');
      hdr.style.cssText='font-size:14px;font-weight:600;color:#666;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #F0F3FB';
      hdr.textContent=`${s.icon} ${s.name}`;
      sec.appendChild(hdr);
    }
    s.fields.forEach(f=>{
      if(f.type==='text'){
        const d=document.createElement('div');
        d.innerHTML=`<label class="flbl">${f.label}</label><input class="fi" id="df-${f.id}" placeholder="${f.placeholder||''}" value="${detailValues[f.id]||''}"/>`;
        d.querySelector('input').oninput=e=>{detailValues[f.id]=e.target.value};
        sec.appendChild(d);
      } else if(f.type==='select'){
        const d=document.createElement('div');
        let opts=`<option value="">— Seleccione —</option>`+f.options.map(o=>`<option${detailValues[f.id]===o?' selected':''}>${o}</option>`).join('');
        d.innerHTML=`<label class="flbl">${f.label}</label><select class="fs" id="df-${f.id}">${opts}</select>`;
        d.querySelector('select').onchange=e=>{detailValues[f.id]=e.target.value};
        sec.appendChild(d);
      } else if(f.type==='ta'){
        const d=document.createElement('div'); d.className='fg2';
        d.innerHTML=`<label class="flbl">${f.label}</label><textarea class="fta" id="df-${f.id}" placeholder="${f.placeholder||''}">${detailValues[f.id]||''}</textarea>`;
        d.querySelector('textarea').oninput=e=>{detailValues[f.id]=e.target.value};
        sec.appendChild(d);
      } else if(f.type==='radio'){
        const d=document.createElement('div'); d.className='fg2';
        const btns=f.options.map(o=>`<div class="ri${detailRadios[f.id]===o?' sel':''}" onclick="pickRadio('${f.id}','${o}',this)"><div class="rd"></div>${o}</div>`).join('');
        d.innerHTML=`<label class="flbl">${f.label}</label><div class="rgrp">${btns}</div>`;
        sec.appendChild(d);
      } else if(f.type==='cb'){
        const d=document.createElement('div'); d.className='fg2';
        const items=(detailChecks[f.id]||[]);
        const boxes=f.options.map(o=>`<div class="cbi${items.includes(o)?' on':''}" onclick="toggleCb('${f.id}','${o}',this)"><div class="cbx">${items.includes(o)?'✓':''}</div><span class="cbt">${o}</span></div>`).join('');
        d.innerHTML=`<label class="flbl">${f.label}</label><div class="cbgrid">${boxes}</div>`;
        sec.appendChild(d);
      }
    });
    c.appendChild(sec);
  });
}

function pickRadio(fid,opt,el){
  detailRadios[fid]=opt;
  el.closest('.rgrp').querySelectorAll('.ri').forEach(r=>r.classList.remove('sel'));
  el.classList.add('sel');
}
function toggleCb(fid,opt,el){
  detailChecks[fid]=detailChecks[fid]||[];
  const i=detailChecks[fid].indexOf(opt);
  if(i>-1){detailChecks[fid].splice(i,1);el.classList.remove('on');el.querySelector('.cbx').textContent=''}
  else{detailChecks[fid].push(opt);el.classList.add('on');el.querySelector('.cbx').textContent='✓'}
}

function checkStep2(){
  const ok=document.getElementById('f-nombre').value&&document.getElementById('f-email').value&&document.getElementById('f-tel').value;
  document.getElementById('btn2').disabled=!ok;
}

function buildMessage(){
  let m=`🔔 NUEVA COTIZACIÓN DIFEDI\n\n`;
  if(selectedSvc.length===1){
    const s=SERVICES[selectedSvc[0]]||{};
    m+=`📋 Servicio: ${s.name||selectedSvc[0]}\n`;
  } else {
    const names=selectedSvc.map(id=>SERVICES[id]?.name||id).join(', ');
    m+=`📦 Servicios: ${names}\n`;
  }
  m+=`👤 Nombre: ${document.getElementById('f-nombre').value}\n`;
  const emp=document.getElementById('f-empresa').value; if(emp) m+=`🏢 Empresa: ${emp}\n`;
  const car=document.getElementById('f-cargo').value; if(car) m+=`💼 Cargo: ${car}\n`;
  m+=`📧 Email: ${document.getElementById('f-email').value}\n`;
  m+=`📱 Teléfono: ${document.getElementById('f-tel').value}\n`;
  const ciu=document.getElementById('f-ciudad').value; if(ciu) m+=`📍 Ciudad: ${ciu}\n`;
  const cbE=Object.entries(detailChecks).filter(([,v])=>v.length>0);
  if(cbE.length){m+=`\n✅ Opciones seleccionadas:\n`;cbE.forEach(([,v])=>m+=`  • ${v.join(', ')}\n`);}
  const rE=Object.entries(detailRadios).filter(([,v])=>v);
  if(rE.length){m+=`\n🔘 Preferencias:\n`;rE.forEach(([,v])=>m+=`  • ${v}\n`);}
  if(detailValues.notas) m+=`\n💬 Notas: ${detailValues.notas}\n`;
  m+=`\n📅 ${new Date().toLocaleString('es-CO',{timeZone:'America/Bogota'})}`;
  return m;
}


function sendEmail(){
  const svcNames=selectedSvc.length===1 ? SERVICES[selectedSvc[0]]?.name : `${selectedSvc.length} servicios`;
  const subject=encodeURIComponent(`🔔 Nueva Cotización DIFEDI – ${svcNames} – ${document.getElementById('f-nombre').value}`);
  const body=encodeURIComponent(buildMessage());
  window.open(`mailto:difediemp@gmail.com?subject=${subject}&body=${body}`);
  return true;
}

function submitForm(){
  goTo(4);
  setTimeout(()=>sendEmail(),300);
  setTimeout(()=>{
    const ne=document.getElementById('notif-email');
    ne.className='nc ok'; ne.innerHTML='✅ Correo preparado para enviar';
  },1800);
  renderSummary();
}

function renderSummary(){
  const svcText=selectedSvc.length===1 ? SERVICES[selectedSvc[0]]?.name : selectedSvc.map(id=>SERVICES[id]?.name).join(', ');
  let rows=[
    ['Servicio(s)',svcText],
    ['Nombre',document.getElementById('f-nombre').value+(document.getElementById('f-empresa').value?' — '+document.getElementById('f-empresa').value:'')],
    ['Correo',document.getElementById('f-email').value],
    ['Teléfono',document.getElementById('f-tel').value],
  ];
  if(document.getElementById('f-ciudad').value) rows.push(['Ciudad',document.getElementById('f-ciudad').value]);
  let html=rows.map(([k,v])=>`<div class="sr"><span class="sk">${k}</span><span class="sv">${v}</span></div>`).join('');
  const cbE=Object.entries(detailChecks).filter(([,v])=>v.length>0);
  cbE.forEach(([,v])=>{html+=`<div class="sr"><span class="sk">Opciones</span><span class="sv">${v.map(o=>`<span class="tag">${o}</span>`).join('')}</span></div>`;});
  document.getElementById('summary-box').innerHTML=html;
}

function resetForm(){
  selectedSvc=[];detailValues={};detailChecks={};detailRadios={};
  ['f-nombre','f-empresa','f-cargo','f-ciudad','f-email','f-tel'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('btn1').disabled=true;
  document.getElementById('btn2').disabled=true;
  document.querySelectorAll('.svc').forEach(s=>s.classList.remove('sel'));
  document.getElementById('summary-box').innerHTML='';
  document.querySelector('.success .info-box') && document.querySelector('.success .info-box').remove();
  goTo(1);
}


