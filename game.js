const state = {
  destination: null,
  budget: 100,
  energy: 100,
  mass: 0,
  maxMass: 1000,
  safety: 50,
  science: 0,
  components: [],
  eventIndex: 0,
  decisions: []
};

const destinations = [
  { id:'moon', icon:'🌙', name:'Luna', desc:'Misión de corta duración con alta exigencia de precisión y recursos limitados.', difficulty:'Media', distance:'384 mil km', radiation:'Media', mods:{budget:0, energy:0, safety:5, science:5}},
  { id:'mars', icon:'🔴', name:'Marte', desc:'Viaje largo, mayor exposición a radiación y decisiones críticas de energía.', difficulty:'Alta', distance:'225 M km', radiation:'Alta', mods:{budget:-10, energy:-10, safety:-5, science:10}},
  { id:'asteroid', icon:'☄️', name:'Asteroide', desc:'Misión robótica de precisión con gran valor científico y maniobras complejas.', difficulty:'Alta', distance:'Variable', radiation:'Media', mods:{budget:-5, energy:-5, safety:0, science:15}}
];

const components = [
  { id:'solar', icon:'☀️', name:'Panel solar avanzado', cost:12, mass:90, energy:25, safety:0, science:0, desc:'Aumenta la generación eléctrica disponible.' },
  { id:'battery', icon:'🔋', name:'Baterías de respaldo', cost:9, mass:110, energy:18, safety:4, science:0, desc:'Reserva energía para emergencias y eclipses.' },
  { id:'shield', icon:'🛡️', name:'Blindaje contra radiación', cost:16, mass:140, energy:-3, safety:20, science:0, desc:'Reduce el riesgo durante eventos solares.' },
  { id:'antenna', icon:'📡', name:'Antena de alta ganancia', cost:8, mass:70, energy:-5, safety:5, science:8, desc:'Mejora comunicaciones y envío de datos.' },
  { id:'lab', icon:'🧪', name:'Laboratorio científico', cost:18, mass:180, energy:-15, safety:0, science:25, desc:'Aumenta fuertemente el valor científico de la misión.' },
  { id:'life', icon:'🫁', name:'Soporte vital reforzado', cost:15, mass:160, energy:-10, safety:18, science:0, desc:'Protege a la tripulación durante fallos o retrasos.' }
];

const events = [
  {
    day:'DÍA 47', icon:'☀️', title:'Tormenta solar detectada',
    description:'Los sensores registran un aumento rápido de partículas energéticas. Debes decidir cómo proteger la misión.',
    advice:'Priorizar la seguridad puede costar energía y tiempo, pero una mala decisión puede afectar seriamente a la tripulación.',
    choices:[
      {text:'Refugiar a la tripulación y apagar instrumentos', changes:{energy:-12,safety:18,science:-4}, note:'Protegiste a la tripulación, aunque perdiste parte del tiempo científico.'},
      {text:'Mantener todos los instrumentos activos', changes:{energy:-4,safety:-18,science:8}, note:'Ganaste ciencia, pero asumiste un riesgo importante.'},
      {text:'Cambiar la orientación de la nave y usar blindaje', changes:{energy:-10,safety:12,science:0}, note:'Una respuesta equilibrada redujo la exposición.'}
    ]
  },
  {
    day:'DÍA 103', icon:'⚡', title:'Caída inesperada de energía',
    description:'La producción eléctrica ha descendido y no puedes mantener todos los sistemas al máximo rendimiento.',
    advice:'En exploración espacial, la energía es un recurso de misión. No todos los sistemas pueden operar simultáneamente.',
    choices:[
      {text:'Pausar temporalmente el laboratorio', changes:{energy:14,safety:2,science:-7}, note:'Recuperaste margen energético sacrificando observaciones.'},
      {text:'Reducir comunicaciones', changes:{energy:9,safety:-3,science:-3}, note:'Ahorraste energía, pero redujiste el contacto con control de misión.'},
      {text:'Consumir reservas de batería', changes:{energy:6,safety:-6,science:4}, note:'Continuaste la ciencia a costa de disminuir tu margen de emergencia.'}
    ]
  },
  {
    day:'DÍA 171', icon:'📡', title:'Ventana científica extraordinaria',
    description:'Aparece una oportunidad única para realizar observaciones, pero exige energía y puede retrasar la trayectoria planificada.',
    advice:'Las misiones reales equilibran objetivos científicos con restricciones de ingeniería, tiempo y riesgo.',
    choices:[
      {text:'Realizar observación completa', changes:{energy:-14,safety:-4,science:18}, note:'Aprovechaste una oportunidad científica excepcional.'},
      {text:'Tomar una muestra limitada', changes:{energy:-7,safety:0,science:10}, note:'Lograste un buen equilibrio entre ciencia y recursos.'},
      {text:'Omitir la observación y preservar recursos', changes:{energy:5,safety:6,science:-2}, note:'Priorizaste la confiabilidad de la misión.'}
    ]
  }
];

const screens = ['home','destination','build','flight','results'];
const $ = s => document.querySelector(s);

function go(screen){
  screens.forEach(s => $('#screen-'+s).classList.toggle('active', s===screen));
  $('#hud').classList.toggle('hidden', screen==='home' || screen==='destination');
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateHud(){
  $('#hudBudget').textContent = Math.max(0, Math.round(state.budget));
  $('#hudEnergy').textContent = Math.max(0, Math.round(state.energy));
  $('#hudMass').textContent = Math.round(state.mass);
  $('#hudSafety').textContent = clamp(state.safety);
  $('#hudScience').textContent = clamp(state.science);
}

function clamp(v){ return Math.max(0,Math.min(100,Math.round(v))); }

function renderDestinations(){
  $('#destinationCards').innerHTML = destinations.map(d => `
    <article class="game-card ${state.destination?.id===d.id?'selected':''}" data-destination="${d.id}">
      <div class="big-icon">${d.icon}</div><h3>${d.name}</h3><p>${d.desc}</p>
      <div class="stats"><span class="stat-chip">Dificultad: ${d.difficulty}</span><span class="stat-chip">${d.distance}</span><span class="stat-chip">Radiación: ${d.radiation}</span></div>
    </article>`).join('');
  document.querySelectorAll('[data-destination]').forEach(card => card.onclick = () => selectDestination(card.dataset.destination));
}

function selectDestination(id){
  state.destination = destinations.find(d=>d.id===id);
  renderDestinations();
  $('#destinationNext').disabled = false;
}

function applyDestination(){
  const m=state.destination.mods;
  state.budget += m.budget; state.energy += m.energy; state.safety += m.safety; state.science += m.science;
  updateHud(); renderComponents(); go('build');
}

function renderComponents(){
  $('#componentCards').innerHTML = components.map(c => {
    const selected=state.components.includes(c.id);
    return `<article class="game-card ${selected?'selected':''}" data-component="${c.id}">
      <div class="big-icon">${c.icon}</div><h3>${c.name}</h3><p>${c.desc}</p>
      <div class="stats"><span class="stat-chip">💰 ${c.cost}M</span><span class="stat-chip">⚖️ ${c.mass}kg</span><span class="stat-chip">⚡ ${c.energy>=0?'+':''}${c.energy}</span>${c.safety?`<span class="stat-chip">🛡️ +${c.safety}</span>`:''}${c.science?`<span class="stat-chip">🔬 +${c.science}</span>`:''}</div>
    </article>`}).join('');
  document.querySelectorAll('[data-component]').forEach(card => card.onclick=()=>toggleComponent(card.dataset.component));
  validateBuild();
}

function toggleComponent(id){
  const c=components.find(x=>x.id===id);
  const selected=state.components.includes(id);
  if(selected){
    state.components=state.components.filter(x=>x!==id);
    state.budget+=c.cost; state.mass-=c.mass; state.energy-=c.energy; state.safety-=c.safety; state.science-=c.science;
  } else {
    if(state.budget-c.cost<0 || state.mass+c.mass>state.maxMass) return flashBuild('No tienes recursos suficientes para añadir ese componente.');
    state.components.push(id);
    state.budget-=c.cost; state.mass+=c.mass; state.energy+=c.energy; state.safety+=c.safety; state.science+=c.science;
  }
  updateHud(); renderComponents();
}

function validateBuild(){
  const ok=state.components.length>=3 && state.energy>20 && state.budget>=0 && state.mass<=state.maxMass;
  $('#buildNext').disabled=!ok;
  $('#buildMessage').textContent = ok ? 'Configuración lista para lanzamiento.' : 'Selecciona al menos 3 componentes y conserva energía suficiente.';
}
function flashBuild(msg){ $('#buildMessage').textContent=msg; }

function startFlight(){
  state.eventIndex=0; $('#flightSubtitle').textContent=`Destino: ${state.destination.name}. La misión ha comenzado.`;
  updateHud(); renderEvent(); go('flight');
}

function renderEvent(){
  const e=events[state.eventIndex];
  if(!e) return finishMission();
  $('#eventDay').textContent=e.day; $('#eventIcon').textContent=e.icon; $('#eventTitle').textContent=e.title; $('#eventDescription').textContent=e.description;
  $('#astraText').textContent='ASTRA está analizando la situación. Puedes pedir una recomendación antes de decidir.';
  $('#eventChoices').innerHTML=e.choices.map((c,i)=>`<button class="choice-btn" data-choice="${i}">${c.text}</button>`).join('');
  document.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>chooseEvent(Number(btn.dataset.choice)));
  $('#astraAdvice').onclick=()=>{$('#astraText').textContent=e.advice;};
}

function chooseEvent(i){
  const e=events[state.eventIndex], c=e.choices[i], ch=c.changes;
  state.energy += ch.energy||0; state.safety += ch.safety||0; state.science += ch.science||0;
  state.decisions.push({event:e.title,choice:c.text,note:c.note});
  updateHud();
  $('#astraText').textContent=c.note;
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  setTimeout(()=>{state.eventIndex++; renderEvent();},900);
}

function finishMission(){
  const energy=clamp(state.energy), safety=clamp(state.safety), science=clamp(state.science);
  const budgetScore=clamp(state.budget);
  const score=Math.round(science*.35+safety*.35+energy*.15+budgetScore*.15);
  $('#finalScore').textContent=score;
  const ring=$('.score-ring'); ring.style.background=`radial-gradient(circle at center,#0b1c2e 58%,transparent 59%),conic-gradient(var(--accent) ${score*3.6}deg,#1f3a53 0)`;
  let title,summary,badge,badgeText;
  if(score>=80){title='MISIÓN SOBRESALIENTE';summary='Tu diseño logró un equilibrio excepcional entre ciencia, seguridad y recursos.';badge='🏆 Systems Architect';badgeText='Diseñaste una misión robusta con una visión integral de ingeniería.';}
  else if(score>=65){title='MISIÓN EXITOSA';summary='La misión cumplió sus objetivos principales, aunque todavía existen decisiones que pueden optimizarse.';badge='🚀 Mission Strategist';badgeText='Mostraste buen criterio para manejar recursos y riesgos.';}
  else {title='MISIÓN EN RIESGO';summary='La misión sobrevivió, pero el diseño necesita mejoras importantes antes de considerarse listo para vuelo.';badge='🧭 Flight Learner';badgeText='Cada fallo es información: revisa dónde sacrificaste demasiado un recurso crítico.';}
  $('#resultTitle').textContent=title; $('#resultSummary').textContent=summary; $('#badgeTitle').textContent=badge; $('#badgeText').textContent=badgeText;
  const metrics=[['Ciencia',science],['Seguridad',safety],['Energía',energy],['Presupuesto',budgetScore]];
  $('#resultBars').innerHTML=metrics.map(([n,v])=>`<div class="bar-row"><span>${n}</span><div class="bar-track"><div class="bar-fill" style="width:${v}%"></div></div><strong>${v}</strong></div>`).join('');
  $('#scienceLesson').innerHTML=`<strong>Principio aprendido:</strong> una misión espacial es un sistema de compromisos. Aumentar ciencia, protección o capacidad suele costar masa, energía o presupuesto. El objetivo no es maximizar una sola variable, sino diseñar un conjunto coherente para el objetivo de misión.`;
  go('results');
}

function resetGame(){
  Object.assign(state,{destination:null,budget:100,energy:100,mass:0,maxMass:1000,safety:50,science:0,components:[],eventIndex:0,decisions:[]});
  $('#destinationNext').disabled=true; renderDestinations(); updateHud(); go('home');
}

document.querySelectorAll('[data-go="destination"]').forEach(b=>b.onclick=()=>go('destination'));
$('#destinationNext').onclick=applyDestination;
$('#buildNext').onclick=startFlight;
$('#resetBtn').onclick=resetGame;
$('#playAgain').onclick=resetGame;
renderDestinations(); updateHud();
