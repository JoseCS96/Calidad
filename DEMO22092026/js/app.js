let currentLot=lots[0], values=Array(8).fill(""), closed=false;
const titles={ets:"Especificaciones Técnicas",etdetail:"Detalle de Especificación Técnica",lotes:"Lotes y Evaluaciones",lotdetail:"Detalle del Lote",eval:"Evaluación en Línea",decision:"Evaluación Automática",release:"Liberación de Lote",certificates:"Certificados de Calidad",certificate:"Certificado de Calidad",inbox:"Bandeja de Alertas",etbuilder:"Mantenimiento de Especificación Técnica",etversions:"Historial de Versiones ET",demo:"Demo End-to-End"};
function go(p){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.querySelector("#page-"+p).classList.add("active");document.querySelector("#title").textContent=titles[p];document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===p || ((p==="lotdetail"||p==="eval"||p==="decision"||p==="release")&&n.dataset.page==="lotes") || (p==="certificate"&&n.dataset.page==="certificates")));scrollTo(0,0)}
document.querySelectorAll("[data-page]").forEach(x=>x.onclick=()=>go(x.dataset.page));document.querySelector("#view-et").onclick=()=>go("etdetail");document.querySelector("#versions-et").onclick=()=>go("etversions");document.querySelector("#version-create").onclick=()=>{document.querySelector("#builder-title").textContent="Nueva versión V10 · Basada en V09";setVersionState("BORRADOR");renderEtList();go("etbuilder")};
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".tabbody").forEach(x=>x.classList.add("hidden"));t.classList.add("active");document.querySelector("#tab-"+t.dataset.tab).classList.remove("hidden")});
const labels={ORGANOLEPTICA:"Organolépticas",FISICOQUIMICA:"Fisicoquímicas",MICROBIOLOGICA:"Microbiológicas"};
function master(){document.querySelector("#char-master").innerHTML=Object.keys(labels).map(type=>`<div class="type"><strong>${labels[type]}</strong><table><tr><th>Característica</th><th>Criterio</th><th>Especificación</th><th>Unidad</th><th>Método</th></tr>${chars.filter(c=>c.type===type).map(c=>`<tr><td><b>${c.name}</b></td><td><span class="pill ${c.required?"red":"blue"}">${c.required?"SÍ":"NO"}</span></td><td>${c.criterion}</td><td>${c.spec}</td><td>${c.unit}</td><td>${c.method}</td></tr>`).join("")}</table></div>`).join("")}
function pillClass(s){return s==="PENDIENTE"?"":s==="EVALUACIÓN PARCIAL"?"yellow":s==="COMPLETA - ABIERTA"?"blue":"green"}
function renderLots(){document.querySelector("#lot-list").innerHTML=lots.map((l,i)=>`<tr><td><b>${l.id}</b></td><td>CL01</td><td>${l.date}</td><td>OVOPE-CA-E-001 · V09</td><td>${l.done}/8</td><td><span class="pill ${pillClass(l.state)}">${l.state}</span></td><td>${l.result}</td><td><button class="link detail" data-i="${i}">Ver detalle</button> ${l.state!=="CERRADA"?`<button class="link evaluate" data-i="${i}">${l.done?"Continuar":"Evaluar"}</button>`:""}</td></tr>`).join("");document.querySelectorAll(".detail").forEach(b=>b.onclick=()=>openDetail(+b.dataset.i));document.querySelectorAll(".evaluate").forEach(b=>b.onclick=()=>{openDetail(+b.dataset.i);openEval()})}
function openDetail(i){currentLot=lots[i];document.querySelector("#detail-lot").textContent=currentLot.id;document.querySelector("#detail-state").textContent=currentLot.state;document.querySelector("#detail-state").className="pill "+pillClass(currentLot.state);document.querySelector("#m-done").textContent=currentLot.done;document.querySelector("#m-pending").textContent=8-currentLot.done;renderControls();go("lotdetail")}
function renderControls(){document.querySelector("#lot-controls").innerHTML=`<table><tr><th>Tipo</th><th>Característica</th><th>Obligatoria</th><th>Especificación</th><th>Estado</th></tr>${chars.map((c,i)=>`<tr><td>${labels[c.type]}</td><td><b>${c.name}</b></td><td>${c.required?"Sí":"No"}</td><td>${c.spec}</td><td><span class="status ${i<currentLot.done?"ok":""}">${i<currentLot.done?"APLICADA":"PENDIENTE"}</span></td></tr>`).join("")}</table>`;document.querySelector("#go-eval").style.display=currentLot.state==="CERRADA"?"none":"inline-block"}
function control(c,i){if(c.criterion==="CUALITATIVO")return `<select class="result" data-i="${i}"><option></option><option>Característico</option><option>No característico</option></select>`;if(c.criterion==="AUSENCIA")return `<select class="result" data-i="${i}"><option></option><option>Ausencia</option><option>Presencia</option></select>`;return `<input class="result" type="number" step="any" data-i="${i}">`}
function openEval(){closed=false;values=Array(8).fill("");if(currentLot.done===4)values=["Característico","Característico","11.6","14.4","","","",""];if(currentLot.done===8)values=["Característico","Característico","11.6","14.4","8.9","3200","4","Ausencia"];document.querySelector("#eval-lot").textContent=currentLot.id;document.querySelector("#eval-table").innerHTML=`<table><tr><th>Tipo</th><th>Característica</th><th>Obligatoria</th><th>Especificación</th><th>Resultado</th><th>Unidad</th><th>Estado</th></tr>${chars.map((c,i)=>`<tr><td>${labels[c.type]}</td><td><b>${c.name}</b></td><td><span class="pill ${c.required?"red":"blue"}">${c.required?"SÍ":"NO"}</span></td><td>${c.spec}</td><td>${control(c,i)}</td><td>${c.unit}</td><td><span id="s-${i}" class="status">PENDIENTE</span></td></tr>`).join("")}</table>`;document.querySelectorAll(".result").forEach((el,i)=>{el.value=values[i];el.oninput=live});live();go("eval")}
document.querySelector("#go-eval").onclick=openEval;document.querySelector("#back-detail").onclick=()=>openDetail(lots.indexOf(currentLot));
function test(c,v){if(v==="")return null;if(c.criterion==="CUALITATIVO")return v.toLowerCase()===c.expected.toLowerCase();if(c.criterion==="AUSENCIA")return v.toLowerCase()==="ausencia";let n=+v;if(c.criterion==="RANGO")return n>=c.min&&n<=c.max;if(c.criterion==="MAXIMO")return n<=c.max;return true}
function live(){let done=0,requiredDone=0,requiredTotal=chars.filter(c=>c.required).length;document.querySelectorAll(".result").forEach((el,i)=>{values[i]=el.value;let r=test(chars[i],el.value),s=document.querySelector("#s-"+i);if(r!==null)done++;if(chars[i].required&&r!==null)requiredDone++;s.className="status "+(r===null?"":r?"ok":"fail");s.textContent=r===null?(chars[i].required?"PENDIENTE":"OPCIONAL"):r?"CUMPLE":"NO CUMPLE"});let state=done===0?"PENDIENTE":requiredDone<requiredTotal?"EVALUACIÓN PARCIAL":"COMPLETA - ABIERTA";document.querySelector("#eval-state").textContent=state;document.querySelector("#eval-state").className="pill "+pillClass(state);document.querySelector("#progress").textContent=`${done} resultados registrados · ${requiredDone}/${requiredTotal} obligatorios completos`;document.querySelector("#close-eval").disabled=requiredDone<requiredTotal}
document.querySelector("#load-partial").onclick=()=>{["Característico","Característico","11.6","14.4"].forEach((v,i)=>document.querySelectorAll(".result")[i].value=v);live()}
document.querySelector("#save-eval").onclick=()=>{let d=values.filter(Boolean).length;currentLot.done=d;currentLot.state=d===0?"PENDIENTE":d<8?"EVALUACIÓN PARCIAL":"COMPLETA - ABIERTA";renderLots();openDetail(lots.indexOf(currentLot))}
document.querySelector("#close-eval").onclick=()=>{if(!confirm("Al cerrar la evaluación, los resultados quedarán bloqueados y el sistema ejecutará la evaluación automática de conformidad. ¿Desea continuar?"))return;currentLot.done=values.filter(Boolean).length;currentLot.state="CERRADA";let res=chars.map((c,i)=>test(c,values[i]));let requiredFails=res.map((r,i)=>({r,i})).filter(x=>chars[x.i].required && x.r===false);let optionalFails=res.map((r,i)=>({r,i})).filter(x=>!chars[x.i].required && x.r===false);currentLot.result=requiredFails.length?"NO CONFORME":"CONFORME";renderLots();if(requiredFails.length)createAlert(requiredFails);showDecision(requiredFails,optionalFails)}
function showDecision(fails,optionalFails=[]){let requiredTotal=chars.filter(c=>c.required).length,ok=requiredTotal-fails.length;document.querySelector("#decision-summary").textContent=`${ok}/${requiredTotal} controles obligatorios cumplen · ${fails.length} no cumplen`;let out=document.querySelector("#outcome"),disp=document.querySelector("#dispositions"),rel=document.querySelector("#release-link"),det=document.querySelector("#failure-detail");out.classList.remove("fail");disp.classList.add("hidden");rel.classList.add("hidden");det.innerHTML="";if(!fails.length){document.querySelector("#out-icon").textContent="✓";document.querySelector("#out-title").textContent="LOTE CONFORME";document.querySelector("#out-text").textContent="Todos los controles obligatorios cumplen la Especificación Técnica. Habilitado para Liberación Directa · Escenario 1.";rel.classList.remove("hidden")}else{out.classList.add("fail");document.querySelector("#out-icon").textContent="×";document.querySelector("#out-title").textContent="LOTE NO CONFORME";document.querySelector("#out-text").textContent="No puede continuar por Liberación Directa. Calidad debe tomar una decisión adicional.";det.innerHTML=fails.map(x=>`<div class="failbox"><b>${chars[x.i].name}</b><br>Resultado: ${values[x.i]} · Especificación: ${chars[x.i].spec}</div>`).join("");disp.classList.remove("hidden")}go("decision")}
document.querySelector("#release-link").onclick=()=>{document.querySelector("#release-lot").textContent=currentLot.id;go("release")};let alerts=[],certificates=[];
document.querySelector("#release-btn").onclick=()=>{document.querySelector("#released").classList.remove("hidden");document.querySelector("#release-btn").disabled=true;document.querySelector("#release-btn").textContent="Lote liberado"};
document.querySelector("#generate-cert").onclick=()=>{let n=`CC-2026-${String(certificates.length+1).padStart(4,"0")}`;let cert={number:n,lot:currentLot.id,date:"22/09/2026",product:"CL01"};certificates.push(cert);renderCertificates();showCertificate(cert)};
function renderCertificates(){let tb=document.querySelector("#cert-list");if(!certificates.length){tb.innerHTML='<tr><td colspan="7" class="emptyrow">No hay certificados emitidos en esta sesión.</td></tr>';return}tb.innerHTML=certificates.map((c,i)=>`<tr><td><b>${c.number}</b></td><td>${c.lot}</td><td>CL01 · Clara Líquida Pasteurizada</td><td>${c.date}</td><td>FT vinculada</td><td><span class="pill green">EMITIDO</span></td><td><button class="link cert-view" data-i="${i}">Ver certificado</button></td></tr>`).join("");document.querySelectorAll(".cert-view").forEach(b=>b.onclick=()=>showCertificate(certificates[+b.dataset.i]))}
function showCertificate(cert){document.querySelector("#cert-number").textContent=cert.number;document.querySelector("#cert-lot").textContent=cert.lot;document.querySelector("#cert-results").innerHTML=`<table><tr><th>Característica</th><th>Especificación</th><th>Resultado</th><th>Unidad</th><th>Conformidad</th></tr>${chars.filter((c,i)=>c.required||values[i]).map((c)=>{let i=chars.indexOf(c),v=values[i]||"No evaluada";return `<tr><td>${c.name}${c.required?' <small class="req">*</small>':''}</td><td>${c.spec}</td><td>${v}</td><td>${c.unit}</td><td>${v==="No evaluada"?"—":test(c,v)?"CUMPLE":"NO CUMPLE"}</td></tr>`}).join("")}</table>`;go("certificate")}
function createAlert(fails){let a={id:Date.now(),lot:currentLot.id,date:"22/09/2026 14:10",read:false,fails:fails.map(x=>({name:chars[x.i].name,value:values[x.i],spec:chars[x.i].spec}))};alerts.unshift(a);renderAlerts()}
function renderAlerts(){let unread=alerts.filter(a=>!a.read).length,b=document.querySelector("#alert-badge");b.textContent=unread;b.classList.toggle("hidden",unread===0);let box=document.querySelector("#alert-list");if(!alerts.length){box.innerHTML='<div class="empty-alert">No hay alertas nuevas.</div>';return}box.innerHTML=alerts.map(a=>`<div class="alert-item ${a.read?"":"unread"}"><div class="alert-dot">!</div><div><div class="alert-top"><b>Lote ${a.lot} · Evaluación no conforme</b><span>${a.date}</span></div><p>La evaluación fue cerrada y se detectaron ${a.fails.length} parámetro(s) obligatorio(s) fuera de especificación. Requiere decisión de Calidad.</p>${a.fails.map(f=>`<small><b>${f.name}</b>: resultado ${f.value} · especificación ${f.spec}</small>`).join("")}<button class="link alert-open">Revisar lote</button></div></div>`).join("");document.querySelectorAll(".alert-open").forEach(b=>b.onclick=()=>go("decision"))}
document.querySelector("#mark-read").onclick=()=>{alerts.forEach(a=>a.read=true);renderAlerts()};

// Bandeja dinámica de Especificaciones Técnicas
const productMaster=[{"name": "CLARA LIQUIDA PASTEURIZADA", "code": "CL01"}, {"name": "CLARA LIQUIDA PASTEURIZADA", "code": "CL06"}, {"name": "HUEVO LIQUIDO PASTEURIZADO", "code": "HL01C"}, {"name": "HUEVO LÍQUIDO PASTEURIZADO", "code": "HL02"}, {"name": "HUEVO LIQUIDO PASTEURIZADO", "code": "HL01"}, {"name": "HUEVO LIQUIDO PASTEURIZADO", "code": "HL08"}, {"name": "HUEVO LÍQUIDO PASTEURIZADO", "code": "HL07"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO", "code": "HD01"}, {"name": "PREMEZCLA EN POLVO ESTABILIZADA Y ENDULZADA PARA PANADERIA", "code": "CD05P2"}, {"name": "YEMA LIQUIDA PASTEURIZADA", "code": "YL03"}, {"name": "YEMA LIQUIDA PASTEURIZADA", "code": "YL04"}, {"name": "YEMA LIQUIDA PASTEURIZADA", "code": "YL10"}, {"name": "YEMA LIQUIDA PASTEURIZADA", "code": "YL11"}, {"name": "YEMA LIQUIDA PASTEURIZADA SALADA", "code": "YL12"}, {"name": "CLARA LIQUIDA PASTEURIZADA", "code": "CL06B"}, {"name": "YEMA PASTEURIZADA DESHIDRATADA", "code": "YD05"}, {"name": "OVOPOWER VAINILLA", "code": "CD0201"}, {"name": "OVOPOWER CHOCOLATE", "code": "CD0202"}, {"name": "HUEVO LÍQUIDO PASTEURIZADO", "code": "HL20"}, {"name": "CLARA DESHIDRATADA PASTEURIZADA", "code": "CD15"}, {"name": "TORTILLA DE HUEVO EN POLVO", "code": "HD12"}, {"name": "CLARA PASTEURIZADA DESHIDRATADA", "code": "CD12"}, {"name": "HUEVO LIQUIDO PASTEURIZADO - BATIHUEVO", "code": "HL30P"}, {"name": "HUEVO LIQUIDO PASTEURIZADO", "code": "HL06"}, {"name": "CLARA DESHIDRATADA PASTEURIZADA - ALTO GEL", "code": "CD11"}, {"name": "PREMEZCLA EN POLVO ESTABILIZADA Y ENDULZADA PARA PANADERIA", "code": "CD05P1"}, {"name": "HUEVO LÍQUIDO PASTEURIZADO", "code": "HL25"}, {"name": "HUEVO LIQUIDO PASTEURIZADO PARA PROCESO", "code": "HFL13"}, {"name": "CLARA PASTEURIZADA DESHIDRATADA EN POLVO DE ALTO LEVANTE", "code": "CD27P"}, {"name": "YEMA EN POLVO PARA SALSAS", "code": "YD02P"}, {"name": "YEMA LIQUIDA PASTEURIZADA CON EMULSIFICANTE", "code": "YL21"}, {"name": "ALIMENTO EN POLVO PARA PREPARAR BEBIDA CON PROTEINA DE SOYA LECHE Y HUEVO", "code": "HD40P1"}, {"name": "CLARA DESHIDRATADA PARA PROCESO", "code": "CFD08"}, {"name": "CLARA DESHIDRATADA PARA PROCESO", "code": "CFD02"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO", "code": "HD07"}, {"name": "YEMA PASTEURIZADA DESHIDRATADA", "code": "YD01"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO (USO INTERNO)", "code": "HD01"}, {"name": "CLARA ENZIMATICA DESHIDRATADA PASTEURIZADA DE ALTO LEVANTE", "code": "CD16"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO", "code": "HD02"}, {"name": "YEMA EN POLVO PARA SALSAS", "code": "YD03P"}, {"name": "BAKERY PREMIX", "code": "CD13P1"}, {"name": "BAKERY PREMIX", "code": "CD13P2"}, {"name": "HUEVO EN POLVO PARA SALSAS", "code": "HD18P"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO", "code": "HD10"}, {"name": "YEMA HIDROLIZADA PASTEURIZADA DESHIDRATADA", "code": "YD22P"}, {"name": "ALIMENTO EN POLVO PARA PREPARAR BEBIDA CON PROTEINA DE SOYA LECHE Y HUEVO", "code": "HD40P"}, {"name": "CLARA DESHIDRATADA PASTEURIZADA AGLOMERADA", "code": "CD21P"}, {"name": "CLARA DESHIDRATADA PASTEURIZADA AGLOMERADA", "code": "CD18P"}, {"name": "MEZCLA EN POLVO PARA PREPARAR BEBIDA SABOR VAINILLA CON HUEVO DESHIDRATADO", "code": "HDW4P1"}, {"name": "CLARA DESHIDRATADA PASTEURIZADA DE ALTO GEL", "code": "CD05P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "YD26P2"}, {"name": "YEMA HIDROLIZADA PASTEURIZADA DESHIDRATADA", "code": "YD25P"}, {"name": "CLARA DE HUEVO DESHIDRATADA PASTEURIZADA", "code": "CD06P"}, {"name": "PREMEZCLA EN POLVO ENDULZADA PARA PANADERIA", "code": "CD06P1"}, {"name": "YEMA LIQUIDA PASTEURIZADA", "code": "YL05P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD16P1"}, {"name": "MEZCLA EN POLVO PARA BEBIDA INSTANTANEA CON LECHE - KALEL KIDS", "code": "HD43P"}, {"name": "CLARA DE HUEVO HIDROLIZADA PASTEURIZADA DESHIDRATADA", "code": "CD07P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD07P1"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD07P2"}, {"name": "ALBUMINA DE HUEVO", "code": "CD23P1"}, {"name": "ALBUMINA DE HUEVO", "code": "CD23P2"}, {"name": "MEZCLA EN POLVO A BASE DE HUEVO PARA PREPARAR TORTILLA", "code": "HD44P"}, {"name": "PREMEZCLA EN POLVO ENDULZADA PARA PANADERIA", "code": "CD06P2"}, {"name": "HUEVO EN FASE DESHIDRATADO CAGE FREE SIN AJUSTE DE SOLIDOS TOTALES", "code": "HFD50P"}, {"name": "HUEVO PASTEURIZADO DESHIDRATADO CAGE FREE - EC", "code": "HD01-EC"}, {"name": "YEMA LIQUIDA PASTEURIZADA CON EMULSIFICANTES", "code": "YL24P"}, {"name": "MEZCLA EN POLVO A BASE DE YEMA DE HUEVO PARA PANETON", "code": "YD28P"}, {"name": "YEMA HIDROLIZADA PASTEURIZADA DESHIDRATADA CAGE FREE", "code": "YD31P"}, {"name": "PASTA PREMIX N2", "code": "CD31P"}, {"name": "PASTA PREMIX N3", "code": "HD49P"}, {"name": "BAKERY PREMIX", "code": "HD99P1"}, {"name": "MEZCLA EN POLVO A BASE DE YEMA PARA PREPARAR SALSAS", "code": "YD32P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD32P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD33P"}, {"name": "HUEVO EN FASE DESHIDRATADO", "code": "HFD01-2"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "HD54P"}, {"name": "HUEVO LIQUIDO PASTEURIZADO PARA PROCESO", "code": "H3"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "HD50P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD35P"}, {"name": "PREMEZCLA PARA PANADERIA", "code": "CD38P"}, {"name": "HUEVO PASTEURIZADO EN POLVO CAGE FREE", "code": "HD01-EC-CF"}, {"name": "HUEVO PASTEURIZADO EN POLVO", "code": "HD01-EC"}, {"name": "OVOPOWER VAINILLA", "code": "CD42P"}];
let etRecords=[
{id:1,code:"OVOPE-CA-E-001",product:"CL01",description:"Clara Líquida Pasteurizada",version:"09",validity:"28/03/2018",state:"VIGENTE"},
{id:2,code:"OVOPE-CA-E-252",product:"CD42P",description:"OVOPOWER VAINILLA",version:"01",validity:"26/08/2026",state:"VIGENTE"}
], currentEtRecord=null, nextEtId=3;
function loadProducts(){let s=document.querySelector("#product-select");if(!s)return;s.innerHTML='<option value="">Seleccione un producto...</option>'+productMaster.map(p=>`<option value="${p.code}">${p.name} - ${p.code}</option>`).join("");s.value="CL01"}
function selectedProduct(){let s=document.querySelector("#product-select");return productMaster.find(x=>x.code===s?.value)||{code:"",name:""}}
function etStateClass(s){return s==="BORRADOR"?"draft":s==="PENDIENTE DE REVISIÓN"?"review":s==="VERIFICADO"?"verified":s==="VIGENTE"?"green":s==="FINALIZADA"?"ended":""}
function renderEtList(){
 let tb=document.querySelector("#et-list");if(!tb)return;
 tb.innerHTML=etRecords.map(r=>`<tr class="${r.state==="BORRADOR"?"row-draft":""}">
 <td><b>${r.code||"SIN CÓDIGO"}</b></td><td>${r.product||"—"}</td><td>${r.description||"Nueva Especificación Técnica"}</td>
 <td>${r.version||"—"}</td><td>${r.validity||"—"}</td><td><span class="pill ${etStateClass(r.state)}">${r.state}</span></td>
 <td><button class="link et-view" data-id="${r.id}">Ver</button> <button class="link et-versions" data-id="${r.id}">Versiones</button>
 ${r.state==="BORRADOR"?`<button class="link et-edit" data-id="${r.id}">Continuar edición</button>`:r.state==="VIGENTE"?`<button class="link et-newversion" data-id="${r.id}">Nueva versión</button> <button class="link et-end" data-id="${r.id}">Finalizar vigencia</button>`:""} ${r.state==="FINALIZADA"?`<button class="link admin-lock" data-id="${r.id}">${r.adminLocked?"Bloqueo Admin":"Bloquear Admin"}</button>`:""}</td></tr>`).join("");
 tb.querySelectorAll(".et-view").forEach(b=>b.onclick=()=>go("etdetail"));
 tb.querySelectorAll(".et-versions").forEach(b=>b.onclick=()=>go("etversions"));
 tb.querySelectorAll(".et-edit").forEach(b=>b.onclick=()=>{currentEtRecord=etRecords.find(x=>x.id==b.dataset.id);loadEtRecord(currentEtRecord);go("etbuilder")});
 tb.querySelectorAll(".et-newversion").forEach(b=>b.onclick=()=>startNewVersion(etRecords.find(x=>x.id==b.dataset.id)));
 tb.querySelectorAll(".et-end").forEach(b=>b.onclick=()=>tryEndValidity(etRecords.find(x=>x.id==b.dataset.id)));
 tb.querySelectorAll(".admin-lock").forEach(b=>b.onclick=()=>toggleAdminLock(etRecords.find(x=>x.id==b.dataset.id)));
}
function formValue(selector){let e=document.querySelector(selector);return e?e.value:""}
function captureEtRecord(existing=null){
 let inputs=[...document.querySelector("#bs-general").querySelectorAll("input,select")];
 return {id:existing?.id||nextEtId++,code:inputs[2]?.value||"SIN CÓDIGO",product:selectedProduct().code||"—",description:inputs[6]?.value||selectedProduct().name||"Nueva Especificación Técnica",version:inputs[3]?.value||"—",validity:inputs[4]?.value?inputs[4].value.split("-").reverse().join("/"):"—",state:versionState,chars:JSON.parse(JSON.stringify(builderChars)),baseSections:JSON.parse(JSON.stringify(baseSections)),dynamicSections:JSON.parse(JSON.stringify(dynamicSections)),adminLocked:existing?.adminLocked||false};
}
function loadEtRecord(r){
 document.querySelector("#builder-title").textContent=`Continuar ET · ${r.code} V${r.version}`;
 if(r.chars)builderChars=JSON.parse(JSON.stringify(r.chars));
 if(r.baseSections)baseSections=JSON.parse(JSON.stringify(r.baseSections));
 if(r.dynamicSections)dynamicSections=JSON.parse(JSON.stringify(r.dynamicSections));
 let ps=document.querySelector("#product-select");if(ps)ps.value=r.product;
 renderBuilderChars();applyStructure();renderStructure();setVersionState(r.state);
}
function startNewVersion(base){
 currentEtRecord=null;document.querySelector("#builder-title").textContent=`Nueva versión · Basada en ${base.code} V${base.version}`;
 builderChars=JSON.parse(JSON.stringify(base.chars||chars.map((c,i)=>({...c,order:i+1}))));
 if(base.baseSections)baseSections=JSON.parse(JSON.stringify(base.baseSections));
 dynamicSections=JSON.parse(JSON.stringify(base.dynamicSections||[]));
 let inputs=[...document.querySelector("#bs-general").querySelectorAll("input,select")];
 if(document.querySelector("#product-select"))document.querySelector("#product-select").value=base.product;if(inputs[2])inputs[2].value=base.code;if(inputs[3])inputs[3].value=String((parseInt(base.version)||0)+1).padStart(2,"0");
 renderBuilderChars();applyStructure();setVersionState("BORRADOR");go("etbuilder");
}
// Gobierno de versiones de ET
let versionState="BORRADOR";
const stateOrder=["BORRADOR","PENDIENTE DE REVISIÓN","VERIFICADO","VIGENTE","FINALIZADA"];
function isEditable(){return versionState==="BORRADOR"}
function setVersionState(s){
 versionState=s;
 let badge=document.querySelector("#builder-status");badge.textContent=s;
 badge.className="pill "+(s==="BORRADOR"?"yellow":s==="PENDIENTE DE REVISIÓN"?"blue":s==="VERIFICADO"?"green":s==="VIGENTE"?"green":"");
 document.querySelectorAll(".wf-step").forEach((x,i)=>{let ix=stateOrder.indexOf(s);x.classList.toggle("active",i===ix);x.classList.toggle("done",i<ix)});
 let note=document.querySelector("#workflow-note"),map={
 "BORRADOR":"<b>BORRADOR:</b> Calidad puede modificar estructura, contenido y características. Las secciones adicionales pueden eliminarse.",
 "PENDIENTE DE REVISIÓN":"<b>PENDIENTE DE REVISIÓN:</b> la versión se encuentra en revisión de Calidad. La estructura queda bloqueada; para corregir debe volver a Borrador.",
 "VERIFICADO":"<b>VERIFICADO:</b> Calidad aprobó la versión. El siguiente paso es Publicar. No se permite modificar la estructura.",
 "VIGENTE":"<b>VIGENTE:</b> la versión está publicada y en uso. No puede editarse. Para reemplazarla se crea una nueva versión; su vigencia puede finalizarse.",
 "FINALIZADA":"<b>VIGENCIA FINALIZADA:</b> versión histórica de solo lectura. Conserva estructura, reglas y trazabilidad."
 };note.innerHTML=map[s];
 document.querySelector("#save-draft").style.display=isEditable()?"inline-block":"none";
 let adv=document.querySelector("#advance-status");
 if(s==="BORRADOR"){adv.style.display="inline-block";adv.textContent="Enviar a revisión"}
 else if(s==="PENDIENTE DE REVISIÓN"){adv.style.display="inline-block";adv.textContent="Marcar como verificado"}
 else if(s==="VERIFICADO"){adv.style.display="inline-block";adv.textContent="Publicar versión"}
 else {adv.style.display="none"}
 document.querySelector("#structure-config").classList.toggle("locked-overlay",!isEditable());
 document.querySelector("#add-section").disabled=!isEditable();document.querySelector("#add-section-top").disabled=!isEditable();
 renderStructure();
}
// Constructor de Especificación Técnica
let builderChars=chars.map((c,i)=>({...c,order:i+1})), editingChar=-1;
document.querySelector("#new-et").onclick=()=>{currentEtRecord=null;builderChars=[];dynamicSections=[];baseSections.forEach(s=>s.active=true);document.querySelector("#builder-title").textContent="Nueva Especificación Técnica";renderBuilderChars();applyStructure();setVersionState("BORRADOR");go("etbuilder")};
document.querySelector("#edit-et").onclick=()=>{alert("La versión V09 está VIGENTE y es de solo lectura. No puede editarse. Para realizar cambios cree una Nueva versión.");go("etversions")};
document.querySelector("#new-version").onclick=()=>{document.querySelector("#builder-title").textContent="Nueva versión V10 · Basada en V09";setVersionState("BORRADOR");go("etbuilder")};
function bindBuilderNav(){document.querySelectorAll(".bnav").forEach(b=>b.onclick=(e)=>{if(e.target.closest(".section-actions"))return;document.querySelectorAll(".bnav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".bsection").forEach(x=>x.classList.remove("active"));b.classList.add("active");let s=document.querySelector("#bs-"+b.dataset.section);if(s)s.classList.add("active")})}bindBuilderNav();
function specOf(c){if(c.criterion==="RANGO")return `${c.min??""} – ${c.max??""}`;if(c.criterion==="MAXIMO")return `≤ ${c.max??""}`;if(c.criterion==="MINIMO")return `≥ ${c.min??""}`;return c.expected||c.spec||""}
function renderBuilderChars(){document.querySelector("#builder-char-list").innerHTML=builderChars.map((c,i)=>`<tr><td>${c.type}</td><td><b>${c.name}</b></td><td><span class="pill ${c.required?"red":"blue"}">${c.required?"SÍ":"NO"}</span></td><td>${c.criterion}</td><td>${specOf(c)}</td><td>${c.unit}</td><td>${c.method||"—"}</td><td>${c.order}</td><td><button class="link ce-edit" data-i="${i}">Editar</button> ${isEditable()?`<button class="link ce-delete" data-i="${i}">Eliminar</button>`:""}</td></tr>`).join("");document.querySelectorAll(".ce-edit").forEach(b=>b.onclick=()=>openChar(+b.dataset.i));document.querySelectorAll(".ce-delete").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(confirm("¿Eliminar esta característica de la versión en borrador?")){builderChars.splice(i,1);builderChars.forEach((x,j)=>x.order=j+1);renderBuilderChars()}})}
function criterionFields(){let c=document.querySelector("#ce-criterion").value;document.querySelector("#ce-min-wrap").classList.toggle("hidden",!(c==="RANGO"||c==="MINIMO"));document.querySelector("#ce-max-wrap").classList.toggle("hidden",!(c==="RANGO"||c==="MAXIMO"));document.querySelector("#ce-value-wrap").classList.toggle("hidden",!(c==="CUALITATIVO"||c==="AUSENCIA"))}
document.querySelector("#ce-criterion").onchange=criterionFields;
function openChar(i=-1){if(!isEditable()){alert("Las características solo pueden modificarse mientras la versión esté en BORRADOR.");return;}editingChar=i;let c=i>=0?builderChars[i]:{type:"FISICOQUIMICA",name:"",required:true,criterion:"RANGO",min:"",max:"",expected:"",unit:"",method:"",order:builderChars.length+1};document.querySelector("#char-editor").classList.remove("hidden");document.querySelector("#char-editor-title").textContent=i>=0?"Editar característica":"Nueva característica";document.querySelector("#ce-type").value=c.type;document.querySelector("#ce-name").value=c.name;document.querySelector("#ce-required").value=String(c.required);document.querySelector("#ce-criterion").value=c.criterion;document.querySelector("#ce-min").value=c.min??"";document.querySelector("#ce-max").value=c.max??"";document.querySelector("#ce-value").value=c.expected??"";document.querySelector("#ce-unit").value=c.unit??"";document.querySelector("#ce-method").value=c.method??"";document.querySelector("#ce-order").value=c.order??"";criterionFields()}
document.querySelector("#add-char").onclick=()=>openChar();document.querySelector("#cancel-char").onclick=()=>document.querySelector("#char-editor").classList.add("hidden");
document.querySelector("#save-char").onclick=()=>{if(!isEditable())return;let criterion=document.querySelector("#ce-criterion").value,c={type:document.querySelector("#ce-type").value,name:document.querySelector("#ce-name").value||"Nueva característica",required:document.querySelector("#ce-required").value==="true",criterion,unit:document.querySelector("#ce-unit").value||"N.A.",method:document.querySelector("#ce-method").value,order:+document.querySelector("#ce-order").value||builderChars.length+1};if(criterion==="RANGO"||criterion==="MINIMO")c.min=+document.querySelector("#ce-min").value;if(criterion==="RANGO"||criterion==="MAXIMO")c.max=+document.querySelector("#ce-max").value;if(criterion==="CUALITATIVO"||criterion==="AUSENCIA")c.expected=document.querySelector("#ce-value").value||"Ausencia";c.spec=specOf(c);if(editingChar>=0)builderChars[editingChar]=c;else builderChars.push(c);if(currentEtRecord&&currentEtRecord.state==="BORRADOR"){currentEtRecord.chars=JSON.parse(JSON.stringify(builderChars));let ri=etRecords.findIndex(x=>x.id===currentEtRecord.id);if(ri>=0)etRecords[ri]=currentEtRecord}renderBuilderChars();document.querySelector("#char-editor").classList.add("hidden")};
document.querySelector("#publish-et").onclick=()=>{if(versionState!=="VERIFICADO"){alert("Para publicar, la versión debe estar en estado VERIFICADO.");return}if(!validatePublication(true)){alert("Publicación bloqueada. Calidad debe finalizar primero la ET vigente.");return}if(confirm("¿Publicar la versión verificada?")){setVersionState("VIGENTE");syncCurrentEtState();if(confirm("Versión publicada. ¿Continuar la demo?"))openDetail(0)}};

// Secciones dinámicas por versión

function pendingLotsForEt(code,version){
 if(code!=="OVOPE-CA-E-001"||String(version)!=="09")return [];
 return lots.filter(l=>l.state!=="CERRADA");
}
function tryEndValidity(record){
 let pend=pendingLotsForEt(record.code,record.version);
 if(pend.length){alert(`ACCIÓN BLOQUEADA\n\nNo puede finalizar la vigencia de ${record.code} V${record.version}.\nExisten ${pend.length} lote(s) pendientes de evaluación: ${pend.map(x=>x.id).join(", ")}.\n\nDebe cerrar sus evaluaciones antes de finalizar la vigencia.`);return false}
 if(record.adminLocked){alert("La versión está protegida por Bloqueo Admin. Solo la Jefa de Calidad puede modificar esta protección.");return false}
 if(confirm(`¿Finalizar la vigencia de ${record.code} V${record.version}?`)){record.state="FINALIZADA";record.adminLocked=true;renderEtList();alert("Vigencia finalizada. La versión quedó histórica y con BLOQUEO ADMIN para impedir su reactivación accidental.");return true}
 return false;
}
function toggleAdminLock(record){
 let action=record.adminLocked?"desbloquear":"bloquear";
 if(confirm(`Acción restringida a Jefa de Calidad. ¿Desea ${action} administrativamente ${record.code} V${record.version}?`)){record.adminLocked=!record.adminLocked;renderEtList();alert(record.adminLocked?"Bloqueo Admin activado.":"Bloqueo Admin retirado por Jefa de Calidad.");}
}
function activeConflict(){let inputs=[...document.querySelector("#bs-general").querySelectorAll("input,select")],code=(inputs[2]?.value||"").trim().toUpperCase(),prod=selectedProduct().code;return etRecords.find(r=>r.state==="VIGENTE"&&r.id!==currentEtRecord?.id&&(r.code.toUpperCase()===code||r.product===prod))}
function validatePublication(show=true){let c=activeConflict(),b=document.querySelector("#publish-validation");if(!selectedProduct().code){if(show){b.className="publish-validation error";b.innerHTML="<b>Producto requerido</b>Seleccione un producto de la lista maestra."}return false}if(c){if(show){b.className="publish-validation error";b.innerHTML=`<b>Publicación bloqueada</b>El producto ${c.product} ya tiene vigente ${c.code} V${c.version}. Calidad debe finalizar esa vigencia antes de publicar.`}return false}if(show){b.className="publish-validation ok";b.innerHTML="<b>Validación correcta</b>No existe otra ET vigente para el producto ni con el mismo código."}return true}
function syncCurrentEtState(){if(!currentEtRecord){currentEtRecord=captureEtRecord(null);etRecords.push(currentEtRecord)}currentEtRecord.state=versionState;let i=etRecords.findIndex(x=>x.id===currentEtRecord.id);if(i>=0)etRecords[i]=currentEtRecord;renderEtList()}
document.querySelector("#save-draft").onclick=()=>{
 let rec=captureEtRecord(currentEtRecord);
 rec.state="BORRADOR";
 if(currentEtRecord){let i=etRecords.findIndex(x=>x.id===currentEtRecord.id);etRecords[i]=rec}else{etRecords.push(rec)}
 currentEtRecord=rec;renderEtList();
 if(confirm("Borrador guardado correctamente. Ya aparece en la bandeja de Especificaciones Técnicas con estado BORRADOR. ¿Volver a la bandeja?"))go("ets");
};
document.querySelector("#advance-status").onclick=()=>{
 if(versionState==="BORRADOR"){if(confirm("¿Enviar esta versión a revisión? La estructura quedará bloqueada mientras esté en revisión.")){setVersionState("PENDIENTE DE REVISIÓN");syncCurrentEtState()}}
 else if(versionState==="PENDIENTE DE REVISIÓN"){if(confirm("¿Confirmar que Calidad verificó y aprobó el contenido?")){setVersionState("VERIFICADO");syncCurrentEtState()}}
 else if(versionState==="VERIFICADO"){if(!validatePublication(true)){alert("Publicación bloqueada. Finalice primero la ET vigente.");return}if(confirm("¿Publicar esta versión?")){setVersionState("VIGENTE");syncCurrentEtState();alert("Versión publicada y vigente.")}}
};
document.querySelector("#end-validity").onclick=()=>{let r=etRecords.find(x=>x.code==="OVOPE-CA-E-001"&&x.version==="09");if(r)tryEndValidity(r)};
let baseSections=[
{id:"general",name:"Información general",desc:"Identificación documental",active:true},
{id:"responsables",name:"Responsables",desc:"Elaboración, revisión y aprobación",active:true},
{id:"descripcion",name:"Descripción",desc:"Descripción del producto",active:true},
{id:"ingredientes",name:"Ingredientes",desc:"Ingredientes de la versión",active:true},
{id:"recetas",name:"Recetas",desc:"Recetas o formulaciones",active:true},
{id:"procedimientos",name:"Procedimientos",desc:"Secuencia de preparación",active:true},
{id:"tratamientos",name:"Tratamientos",desc:"Tratamientos de conservación",active:true},
{id:"caracteristicas",name:"Características",desc:"Características y reglas evaluables",active:true},
{id:"presentacion",name:"Presentación / Envases",desc:"Envases y embalajes",active:true},
{id:"almacenamiento",name:"Almacenamiento",desc:"Condiciones de almacenamiento y distribución",active:true},
{id:"vida",name:"Vida útil",desc:"Periodo de vida útil",active:true},
{id:"descongelamiento",name:"Descongelamiento",desc:"Condiciones de descongelamiento",active:true},
{id:"instrucciones",name:"Instrucciones",desc:"Instrucciones de uso",active:true},
{id:"rotulado",name:"Rotulado",desc:"Contenido declarado",active:true},
{id:"cambios",name:"Cambios de versión",desc:"Historial de cambios",active:true}
];
let dynamicSections=[], sectionSeq=17;
function renumberSections(){
 let menu=document.querySelector("#dynamic-menu"), buttons=[...menu.querySelectorAll(".bnav")];
 buttons.forEach((b,i)=>b.querySelector(":scope > b").textContent=i+1);
 document.querySelector("#section-count-validation").textContent=`${buttons.length-1} secciones documentales configuradas`;
}

function renderStructure(){
 let box=document.querySelector("#structure-list");
 let all=[...baseSections,...dynamicSections.map(s=>({id:s.id,name:s.name,desc:"Sección personalizada · "+s.type,active:s.active,dynamic:true}))];
 box.innerHTML=all.map((s,i)=>`<div class="structure-item ${s.active?"":"disabled"}" data-id="${s.id}" data-dyn="${s.dynamic?"1":"0"}"><div class="seq"><button class="move-up" title="Subir">↑</button><button class="move-down" title="Bajar">↓</button></div><div><strong>${i+1}. ${s.name}</strong><small>${s.desc}</small></div><button class="toggle-btn">${s.active?"INCLUIDA":"NO INCLUIDA"}</button>${s.dynamic?'<span><button class="link edit-structure">Editar</button><button class="link delete-section">Eliminar</button></span>':'<button class="link remove-basic">Quitar</button>'}</div>`).join("");
 box.querySelectorAll(".structure-item").forEach(row=>{
   let id=row.dataset.id,isDyn=row.dataset.dyn==="1";
   row.querySelectorAll("button").forEach(b=>b.disabled=!isEditable());
   row.querySelector(".toggle-btn").onclick=()=>{if(!isEditable())return;let arr=isDyn?dynamicSections:baseSections,s=arr.find(x=>x.id===id);s.active=!s.active;applyStructure();renderStructure()};
   row.querySelector(".move-up").onclick=()=>{if(isEditable())moveSection(id,isDyn,-1)};
   row.querySelector(".move-down").onclick=()=>{if(isEditable())moveSection(id,isDyn,1)};
   let ed=row.querySelector(".edit-structure");if(ed)ed.onclick=()=>{if(isEditable())openSectionEditor(id)};
   let del=row.querySelector(".delete-section");if(del)del.onclick=()=>{if(!isEditable())return;if(confirm("¿Eliminar esta sección adicional de la versión en borrador?")){dynamicSections=dynamicSections.filter(x=>x.id!==id);applyStructure();renderStructure()}};
   let rb=row.querySelector(".remove-basic");if(rb)rb.onclick=()=>{if(!isEditable())return;let s=baseSections.find(x=>x.id===id);if(s&&confirm("¿Quitar esta sección de la nueva ET? Puede volver a incluirla mientras siga en borrador.")){s.active=false;applyStructure();renderStructure()}};
 });
}
function moveSection(id,isDyn,dir){
 let arr=isDyn?dynamicSections:baseSections,idx=arr.findIndex(x=>x.id===id),ni=idx+dir;if(ni<0||ni>=arr.length)return;
 [arr[idx],arr[ni]]=[arr[ni],arr[idx]];arr.forEach((x,i)=>x.order=i+1);applyStructure();renderStructure();
}
function applyStructure(){
 baseSections.forEach(s=>{let nav=document.querySelector(`.bnav[data-section="${s.id}"]`),sec=document.querySelector("#bs-"+s.id);if(nav)nav.style.display=s.active?"flex":"none";if(sec&&!s.active)sec.classList.remove("active")});
 renderDynamicSections(false);renumberSections();
}
function renderDynamicSections(refreshStructure=true){
 document.querySelectorAll(".bnav.dynamic").forEach(x=>x.remove());
 document.querySelectorAll(".bsection.dynamic-section").forEach(x=>x.remove());
 let preview=document.querySelector(".fixed-preview");
 dynamicSections.sort((a,b)=>a.order-b.order).forEach(s=>{
   let btn=document.createElement("button");btn.className="bnav dynamic"+(s.active?"":" inactive");btn.dataset.section=s.id;
   btn.innerHTML=`<b>0</b> ${s.name}<span class="section-actions"><button title="Editar">✎</button><button title="Desactivar">${s.active?"×":"↺"}</button></span>`;
   preview.parentNode.insertBefore(btn,preview);
   let sec=document.createElement("div");sec.className="bsection dynamic-section";sec.id="bs-"+s.id;
   let body=s.type==="texto"?`<textarea placeholder="Registre el contenido de ${s.name}"></textarea>`:s.type==="lista"?`<div class="repeat-list"><div class="repeat-row"><input placeholder="Nuevo elemento"><button class="danger">Eliminar</button></div></div><button class="ghost">+ Agregar elemento</button>`:`<div class="dynamic-content-note">Tabla configurable para esta sección. En implementación se definirán sus columnas según la necesidad documental.</div><table><tr><th>Campo 1</th><th>Campo 2</th><th>Campo 3</th></tr><tr><td>—</td><td>—</td><td>—</td></tr></table>`;
   sec.innerHTML=`<div class="card"><label>SECCIÓN DINÁMICA</label><h3>${s.name}</h3><div class="dynamic-content-note">Esta sección pertenece únicamente a esta versión de la ET y puede cambiar en versiones futuras.</div>${body}</div>`;
   document.querySelector(".builder-content").insertBefore(sec,document.querySelector("#section-editor"));
   let acts=btn.querySelectorAll(".section-actions button");acts[0].onclick=(e)=>{e.stopPropagation();openSectionEditor(s.id)};acts[1].onclick=(e)=>{e.stopPropagation();s.active=!s.active;renderDynamicSections()};
 });
 bindBuilderNav();renumberSections();if(refreshStructure)renderStructure();
}
function openSectionEditor(id=null){if(!isEditable()){alert("Solo una versión en BORRADOR puede modificar su estructura.");return;}
 let s=id?dynamicSections.find(x=>x.id===id):null;
 document.querySelector("#section-editor").classList.remove("hidden");
 document.querySelector("#section-editor").dataset.edit=id||"";
 document.querySelector("#section-editor-title").textContent=s?"Editar sección":"Nueva sección";
 document.querySelector("#section-name").value=s?.name||"";
 document.querySelector("#section-type").value=s?.type||"texto";
 document.querySelector("#section-order").value=s?.order||document.querySelectorAll("#dynamic-menu .bnav").length;
 document.querySelector("#section-active").value=String(s?.active??true);
 document.querySelector("#section-editor").scrollIntoView({behavior:"smooth",block:"center"});
}
document.querySelector("#add-section").onclick=()=>openSectionEditor();document.querySelector("#add-section-top").onclick=()=>openSectionEditor();document.querySelector("#structure-ready").onclick=()=>{document.querySelector("#structure-config").classList.add("hidden");alert("Estructura definida. Ahora puede completar el contenido de las secciones incluidas.")};
document.querySelector("#cancel-section").onclick=()=>document.querySelector("#section-editor").classList.add("hidden");
document.querySelector("#save-section").onclick=()=>{if(!isEditable())return;
 let id=document.querySelector("#section-editor").dataset.edit,name=document.querySelector("#section-name").value.trim();
 if(!name){alert("Ingrese el nombre de la sección.");return}
 let obj={id:id||"dyn"+sectionSeq++,name,type:document.querySelector("#section-type").value,order:+document.querySelector("#section-order").value||99,active:document.querySelector("#section-active").value==="true"};
 if(id){let ix=dynamicSections.findIndex(x=>x.id===id);dynamicSections[ix]=obj}else dynamicSections.push(obj);
 document.querySelector("#section-editor").classList.add("hidden");renderDynamicSections();
};

// Demo guiada para Calidad
document.querySelector("#start-demo").onclick=()=>document.querySelector("#demo-conforme").click();
document.querySelector("#demo-conforme").onclick=()=>{
 document.querySelector("#builder-title").textContent="Demo · Crear ET CL01";setVersionState("BORRADOR");
 document.querySelector("#structure-config").classList.remove("hidden");
 go("etbuilder");
 alert("PASO 1: Defina qué secciones tendrá la ET, descarte las que no apliquen, ordénelas y agregue nuevas si fuera necesario. Luego configure Características.");
};
document.querySelector("#demo-noconforme").onclick=()=>{
 currentLot=lots[0];openEval();
 setTimeout(()=>{let els=document.querySelectorAll(".result"),vals=["Característico","Característico","11.6","14.4","8.20","3200","4","Ausencia"];els.forEach((e,i)=>e.value=vals[i]);live();alert("Caso no conforme preparado: pH = 8.20 frente a especificación 8.50–9.50. Cierre la evaluación para mostrar la alerta y la decisión de Calidad.")},50)
};
loadProducts();
renderDynamicSections();
renderStructure();
renderBuilderChars();
setVersionState("BORRADOR");
master();renderLots();renderCertificates();renderAlerts();
