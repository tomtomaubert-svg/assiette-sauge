import {detectMeal} from './scan.mjs?v=9';
import {mealTypes, foods, recipes, nutrition, suitableMeals, generateWeek, allowsWeightGoal} from './food.mjs?v=9';

const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const dialogContent = document.querySelector('#dialog-content');
const pages = ['aujourdhui', 'semaine', 'scan', 'journal', 'profil'];
const paths = {
  leaf:'<path d="M20 4c-8 0-14 3-14 9a5 5 0 0 0 5 5c6 0 9-6 9-14Z"/><path d="M4 20c3-5 6-8 10-10"/>',
  home:'<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  camera:'<path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3"/>',
  journal:'<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M3 7h4M3 12h4M3 17h4M10 8h6M10 12h5"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const fillIcons = root => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem('sauge-' + key)) ?? fallback; }
  catch { return fallback; }
}

function save(key, value) {
  try {
    localStorage.setItem('sauge-' + key, JSON.stringify(value));
    return true;
  } catch {
    window.alert('Le navigateur ne peut pas sauvegarder les données sur cet appareil.');
    return false;
  }
}

let journal = read('journal', []);
let settings = read('settings', null);
let day = 0;
let activeScan = 0;
let photoURL;
let installPrompt;

const weekday = new Intl.DateTimeFormat('fr-FR', {weekday:'long'});
const shortWeekday = new Intl.DateTimeFormat('fr-FR', {weekday:'short'});
const longDate = new Intl.DateTimeFormat('fr-FR', {weekday:'long', day:'numeric', month:'long'});
const dateAt = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};
const dateKey = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
const calendarDay = date => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
if (!settings) settings = {profile:null, plan:generateWeek(null), start:calendarDay(dateAt())};
let {profile, plan} = settings;
const planIndex = dayIndex => ((calendarDay(dateAt(dayIndex)) - settings.start) % 7 + 7) % 7;
const formatNutrition = values => `<div class="nutrition">${values.map((value, index) => `<span><strong>${value}${index ? ' g' : ' kcal'}</strong>${['Énergie estimée','Protéines','Glucides','Lipides'][index]}</span>`).join('')}</div>`;

function heading(title, subtitle, category) {
  return `<div class="page-heading"><p class="eyebrow">${category}</p><h1>${title}</h1><p>${subtitle}</p></div>`;
}

function mealCards(dayIndex, canSwap) {
  return `<div class="meal-grid">${plan[planIndex(dayIndex)].map((recipeIndex, slot) => {
    const meal = recipes[slot][recipeIndex];
    return `<article class="meal-card">
      <img src="./${meal.photo}.jpg" alt="" loading="lazy" width="400" height="200">
      <div class="meal-body"><p class="eyebrow">${mealTypes[slot]}</p><h3>${meal.name}</h3>
      <p class="muted small">${meal.minutes} min de préparation</p>
      <div class="meal-actions"><button class="text-button" data-recipe="${dayIndex},${slot}">Voir la recette</button>
      ${canSwap ? `<button class="text-button" data-swap="${dayIndex},${slot}">Remplacer</button>` : ''}</div></div>
    </article>`;
  }).join('')}</div>`;
}

function renderHome() {
  const count = journal.filter(entry => dateKey(new Date(entry.time)) === dateKey(dateAt())).length;
  app.innerHTML = `<section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${longDate.format(dateAt())}</p>
        <h1>À table, <em>à ton rythme.</em></h1>
        <p>Photographie ton assiette et retrouve des idées de repas pour les sept prochains jours.</p>
        <div class="actions"><a class="button primary" href="#scan">${icon('camera')} Scanner un repas</a>
        <a class="button secondary" href="#semaine">Voir mon menu</a></div>
      </div>
      <img src="./hero.jpg" alt="Assiette de légumes colorés et de céréales" width="650" height="450" fetchpriority="high">
    </section>
    <section aria-labelledby="todays-meals">
      <div class="section-top"><div><p class="eyebrow">MENU DU JOUR</p><h2 id="todays-meals">Dans ton assiette</h2></div>
      <a class="text-button" href="#semaine">Les 7 jours</a></div>
      ${mealCards(0, false)}
    </section>
    <section class="panel home-journal">
      <span class="feature-icon">${icon('journal')}</span><div><h3>Mon journal</h3>
      <p class="muted">${count ? `${count} repas enregistré${count > 1 ? 's' : ''} aujourd’hui` : 'Aucun repas enregistré aujourd’hui.'}</p></div>
      <a class="button secondary" href="#journal">Ouvrir le journal</a>
    </section>`;
}

function renderWeek() {
  const tabs = Array.from({length:7}, (_, index) => {
    const date = dateAt(index);
    return `<button type="button" aria-pressed="${index === day}" aria-label="${longDate.format(date)}" data-day="${index}">${shortWeekday.format(date)}<span>${date.getDate()}</span></button>`;
  }).join('');
  const goal = profile?.goal === 'perte' ? `Objectif progressif · ${profile.target} kg` : 'Menu équilibré';
  app.innerHTML = `${heading('Ma <em>semaine.</em>','Trois repas par jour, avec des recettes que tu peux remplacer.', 'PLAN DE REPAS')}
    <div class="notice section-top"><p>${profile ? goal : 'Ton menu d’exemple est prêt.'}</p><a href="#profil" class="text-button">${profile ? 'Modifier mon profil' : 'Personnaliser'}</a></div>
    <div class="week-tabs" aria-label="Jours du menu">${tabs}</div>
    <div class="section-top"><h2>${day === 0 ? 'Aujourd’hui' : weekday.format(dateAt(day)).replace(/^./, letter => letter.toUpperCase())}</h2></div>
    ${mealCards(day, true)}`;
}

function openDialog(html) {
  dialogContent.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}

function showRecipe(dayIndex, slot) {
  const meal = recipes[slot][plan[planIndex(dayIndex)][slot]];
  const items = Object.entries(meal.ingredients);
  openDialog(`<p class="eyebrow">${mealTypes[slot]} · ${meal.minutes} min</p><h2>${meal.name}</h2>
    <p>Pour une personne. Les poids correspondent aux aliments tels qu’indiqués.</p>
    <ul class="dialog-list">${items.map(([id, grams]) => `<li>${grams} g · ${foods[id][0]}</li>`).join('')}</ul>
    <p>${meal.instruction}</p>${formatNutrition(nutrition(items))}<p class="small muted">Valeurs indicatives, variables selon les ingrédients et la préparation.</p>`);
}

function swapMeal(dayIndex, slot) {
  const options = suitableMeals(slot, profile);
  const alternatives = options.filter(meal => meal !== recipes[slot][plan[planIndex(dayIndex)][slot]]);
  openDialog(`<h2>Remplacer le repas</h2><p>${mealTypes[slot]} · ${longDate.format(dateAt(dayIndex))}</p>
    ${alternatives.map(meal => `<div class="entry"><span>${meal.name} <small class="muted">· ${meal.minutes} min</small></span><button class="button secondary" data-replace="${dayIndex},${slot},${recipes[slot].indexOf(meal)}">Choisir</button></div>`).join('')}`);
}

const option = (value, label, selected) => `<option value="${value}"${selected === value ? ' selected' : ''}>${label}</option>`;
function renderProfile() {
  const values = profile ?? {goal:'equilibre', diet:'tout', time:'flexible', activity:'moderee'};
  app.innerHTML = `${heading('Mon <em>profil.</em>','Configure ton programme. Tes données restent dans ce navigateur.', 'MON PROGRAMME')}
    <form class="panel profile-panel" id="profile-form">
    <div class="field-grid">
      <label>Âge<input name="age" type="number" inputmode="numeric" min="18" max="100" value="${values.age ?? ''}" required></label>
      <label>Taille (cm)<input name="height" type="number" inputmode="numeric" min="120" max="230" value="${values.height ?? ''}" required></label>
      <label>Poids actuel (kg)<input name="weight" type="number" inputmode="decimal" min="35" max="350" step=".1" value="${values.weight ?? ''}" required></label>
      <label>Activité habituelle<select name="activity">
        ${option('faible','Peu active',values.activity)}${option('moderee','Modérément active',values.activity)}${option('elevee','Très active',values.activity)}
      </select></label>
      <label>Objectif<select name="goal" id="goal">
        ${option('equilibre','Manger plus équilibré',values.goal)}${option('perte','Perdre du poids',values.goal)}
      </select></label>
      <label id="target-label">Poids visé (kg)<input name="target" type="number" inputmode="decimal" min="35" max="350" step=".1" value="${values.target || ''}"></label>
      <label>Alimentation<select name="diet">
        ${option('tout','Variée',values.diet)}${option('vegetarien','Végétarienne',values.diet)}
      </select></label>
      <label>Temps en cuisine<select name="time">
        ${option('flexible','Jusqu’à 30 minutes',values.time)}${option('rapide','Plats rapides en priorité',values.time)}
      </select></label>
    </div>
    <fieldset id="situation"><legend>Situations particulières</legend>
      <label class="check"><input type="checkbox" name="special" ${values.special ? 'checked' : ''}> Grossesse ou allaitement, trouble alimentaire ou régime prescrit.</label>
    </fieldset>
    <p class="muted small">Les menus donnent des idées de repas. Pour un objectif de perte de poids, l’app privilégie les repas riches en fibres. Adapte les portions à ta faim et à ton activité.</p>
    <p id="profile-error" class="error" role="alert"></p>
    <button class="button primary">Générer mon menu</button></form>`;
  const form = app.querySelector('#profile-form');
  function toggleTarget() {
    const losing = form.elements.goal.value === 'perte';
    app.querySelector('#target-label').style.display = losing ? '' : 'none';
    app.querySelector('#situation').hidden = !losing;
    form.elements.target.required = losing;
    form.elements.target.disabled = !losing;
    app.querySelector('#profile-error').textContent = '';
  }
  toggleTarget();
  form.elements.goal.addEventListener('change', toggleTarget);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const next = Object.fromEntries(fields);
    for (const key of ['age','height','weight','target']) next[key] = Number(fields.get(key));
    next.special = fields.has('special');
    if (next.goal === 'perte' && !allowsWeightGoal(next)) {
      app.querySelector('#profile-error').textContent = 'Choisis le menu équilibré ou parle de cet objectif avec un professionnel de santé.';
      return;
    }
    const nextPlan = generateWeek(next);
    const nextSettings = {profile:next, plan:nextPlan, start:calendarDay(dateAt())};
    if (!save('settings', nextSettings)) return;
    settings = nextSettings;
    profile = next;
    plan = nextPlan;
    day = 0;
    location.hash = 'semaine';
  });
}

function renderJournal() {
  const groups = new Map();
  for (const entry of journal) {
    const key = dateKey(new Date(entry.time));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  app.innerHTML = `${heading('Mon <em>journal.</em>', 'Retrouve les repas et les portions que tu as enregistrés.', 'MES REPAS')}
    <div class="actions"><a class="button primary" href="#scan">${icon('camera')} Ajouter un repas</a></div><br>
    ${groups.size ? Array.from(groups.values(), entries => `<section class="panel journal-group"><h2>${longDate.format(new Date(entries[0].time)).replace(/^./, letter => letter.toUpperCase())}</h2>
      ${entries.map(entry => `<div class="entry"><div><h3>${escapeHTML(entry.name)}</h3><p class="muted small">${entry.items.map(([id, grams]) => `${foods[id][0]} ${grams} g`).join(' · ')}</p>
      ${formatNutrition(nutrition(entry.items))}</div><button class="icon-button" data-delete="${entry.id}" aria-label="Supprimer ${escapeHTML(entry.name)}">${icon('close')}</button></div>`).join('')}</section>`).join('')
    : '<section class="panel"><h2>Ton journal est vide</h2><p class="muted">Ajoute ton premier repas par photo ou en choisissant les aliments à la main.</p></section>'}`;
}

const foodOptions = Object.entries(foods).sort(([,a], [,b]) => a[0].localeCompare(b[0], 'fr'));
function addFood(id = '', grams = '', replaceBlank = false) {
  const holder = app.querySelector('#food-rows');
  const blank = replaceBlank && Array.from(holder.children).find(row => !row.querySelector('select').value && !row.querySelector('input').value);
  const row = blank || document.createElement('div');
  row.className = 'food-row';
  row.innerHTML = `<label>Aliment<select required>${option('','Choisir…', id)}${foodOptions.map(([key, food]) => option(key,food[0],id)).join('')}</select></label>
    <label>Grammes<input type="number" required min="1" max="3000" step="1" inputmode="numeric" value="${grams}"></label>
    <button type="button" class="icon-button remove-food" aria-label="Retirer cet aliment">${icon('close')}</button>`;
  if (!blank) holder.append(row);
  updateTotals();
  return row;
}

function enteredItems() {
  return Array.from(app.querySelectorAll('.food-row'), row => [row.querySelector('select').value, row.querySelector('input').valueAsNumber])
    .filter(([id, grams]) => Object.hasOwn(foods, id) && grams > 0 && grams <= 3000);
}

function updateTotals() {
  const items = enteredItems();
  app.querySelector('#totals').innerHTML = items.length ? formatNutrition(nutrition(items)).replace(/^<div class="nutrition">|<\/div>$/g,'') : '<span>Les estimations s’afficheront ici.</span>';
}

function showSuggestions(frame, predictions, matches) {
  const regions = document.createElement('div');
  regions.className = 'scan-regions';
  regions.setAttribute('aria-hidden', 'true');
  for (const {boxes, color, number} of matches) {
    boxes.forEach((box, index) => {
      const region = document.createElement('span');
      region.className = 'scan-region';
      region.dataset.region = number;
      region.style.setProperty('--scan-color', color);
      region.style.left = `${box.xmin * 100}%`;
      region.style.top = `${box.ymin * 100}%`;
      region.style.width = `${(box.xmax - box.xmin) * 100}%`;
      region.style.height = `${(box.ymax - box.ymin) * 100}%`;
      if (!index) region.innerHTML = `<b class="scan-number">${number}</b>`;
      regions.append(region);
    });
  }
  frame.append(regions);

  predictions.innerHTML = `<ul class="scan-suggestions" aria-label="Aliments repérés">
    ${matches.map(({id, grams, number, color}, index) => `<li style="--scan-color:${color}"><label>
      <input type="checkbox" data-suggestion="${index}" checked>
      <b class="scan-number" aria-hidden="true">${number}</b><span>${foods[id][0]}</span><strong>≈ ${grams} g</strong>
    </label></li>`).join('')}</ul><button type="button" class="button secondary"></button>`;
  const add = predictions.querySelector('button');
  const checks = Array.from(predictions.querySelectorAll('[data-suggestion]'));
  const picked = () => checks.filter(check => check.checked);
  function updateSelection() {
    const selection = picked();
    add.disabled = !selection.length;
    add.textContent = selection.length === 0 ? 'Sélectionne un aliment' : selection.length === 1 ? 'Ajouter cet aliment' : `Ajouter les ${selection.length} aliments`;
    for (const [index, check] of checks.entries()) {
      regions.querySelectorAll(`[data-region="${index + 1}"]`).forEach(region => { region.hidden = !check.checked; });
    }
  }
  predictions.querySelector('ul').addEventListener('change', updateSelection);
  updateSelection();
  add.addEventListener('click', () => {
    const existing = Array.from(app.querySelectorAll('.food-row select'), select => select.value);
    let firstNewRow;
    for (const check of picked()) {
      const match = matches[Number(check.dataset.suggestion)];
      if (existing.includes(match.id)) continue;
      const row = addFood(match.id, match.grams, true);
      const label = row.querySelector('label');
      const marker = document.createElement('b');
      marker.className = 'scan-number';
      marker.textContent = match.number;
      marker.setAttribute('aria-hidden', 'true');
      marker.style.setProperty('--scan-color', match.color);
      const title = document.createElement('span');
      title.className = 'scan-row-label';
      title.append(marker, 'Aliment');
      label.firstChild.replaceWith(title);
      firstNewRow ??= row;
    }
    add.disabled = true;
    checks.forEach(check => { check.disabled = true; });
    add.textContent = firstNewRow ? 'Suggestions ajoutées' : 'Aliments déjà ajoutés';
    firstNewRow?.querySelector('select').focus();
  });
}

async function analyzePhoto(file) {
  const token = ++activeScan;
  const isCurrent = () => token === activeScan;
  const status = app.querySelector('#scan-status');
  const zone = app.querySelector('#photo-zone');
  const predictions = app.querySelector('#predictions');
  predictions.replaceChildren();
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = URL.createObjectURL(file);
  app.querySelectorAll('.scan-row-label').forEach(label => label.replaceWith('Aliment'));

  const frame = document.createElement('div');
  frame.className = 'scan-frame';
  const preview = document.createElement('img');
  preview.alt = 'Ton repas à analyser';
  preview.src = photoURL;
  frame.append(preview);
  zone.replaceChildren(frame);
  status.textContent = 'Préparation de l’analyse locale…';

  try {
    await preview.decode();
    if (!isCurrent()) return;
  } catch {
    if (isCurrent()) status.textContent = 'Cette image ne s’ouvre pas. Essaie une photo au format JPEG ou PNG.';
    return;
  }
  frame.style.maxWidth = `${Math.floor(340 * preview.naturalWidth / preview.naturalHeight)}px`;

  try {
    status.textContent = 'Chargement du modèle. Le premier scan peut prendre un moment.';
    const matches = await detectMeal(preview, {
      isCurrent,
      onProgress(percent) {
        if (isCurrent() && Number.isFinite(percent)) status.textContent = `Téléchargement du modèle · ${percent} %`;
      },
      onInference() {
        if (isCurrent()) status.textContent = 'Recherche des aliments visibles…';
      }
    });
    if (!isCurrent()) return;
    if (!matches.length) {
      status.textContent = 'Aucun aliment reconnu avec assez de confiance. Tu peux saisir ton assiette à la main.';
      return;
    }
    status.textContent = matches.length === 1
      ? 'Un aliment repéré. Vérifie la portion proposée.'
      : `${matches.length} aliments repérés. Vérifie chaque portion proposée.`;
    showSuggestions(frame, predictions, matches);
  } catch (error) {
    if (!isCurrent()) return;
    console.warn('Analyse de la photo indisponible', error);
    status.textContent = 'Analyse indisponible. Réessaie avec une connexion Internet ou ajoute les aliments à la main.';
  }
}

function renderScan() {
  app.append(document.querySelector('#scan-template').content.cloneNode(true));
  fillIcons(app);
  addFood();
  app.querySelector('#add-food').addEventListener('click', () => addFood().querySelector('select').focus());
  app.querySelectorAll('[data-image]').forEach(input => input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) void analyzePhoto(file);
    input.value = '';
  }));
  const form = app.querySelector('#meal-form');
  form.addEventListener('input', updateTotals);
  form.addEventListener('click', event => {
    const remove = event.target.closest('.remove-food');
    if (!remove) return;
    remove.closest('.food-row').remove();
    if (!app.querySelector('.food-row')) addFood();
    updateTotals();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const items = enteredItems();
    if (!items.length) return;
    const name = form.elements.mealName.value.trim() || (items.length === 1 ? foods[items[0][0]][0] : 'Repas maison');
    const next = [{id:crypto.randomUUID(),name,items,time:new Date().toISOString()}, ...journal];
    if (!save('journal', next)) return;
    journal = next;
    location.hash = 'journal';
  });
}

function render(keepScroll = false) {
  const requested = location.hash.slice(1);
  const view = pages.includes(requested) ? requested : 'aujourdhui';
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = undefined;
  activeScan++;
  app.replaceChildren();
  document.querySelectorAll('nav a').forEach(anchor => {
    if (anchor.dataset.view === view) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
  ({aujourdhui:renderHome,semaine:renderWeek,scan:renderScan,journal:renderJournal,profil:renderProfile})[view]();
  if (!keepScroll) window.scrollTo(0, 0);
}

app.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const {day: dayValue, recipe: recipeValue, swap, delete: deleted} = button.dataset;
  if (dayValue !== undefined) {
    day = Number(dayValue);
    render(true);
    app.querySelector('[data-day="' + day + '"]').focus({preventScroll:true});
  }
  if (recipeValue) showRecipe(...recipeValue.split(',').map(Number));
  if (swap) swapMeal(...swap.split(',').map(Number));
  if (deleted) openDialog(`<h2>Supprimer ce repas ?</h2><p>Il sera retiré de ton journal.</p><button class="button primary" data-confirm-delete="${deleted}">Supprimer le repas</button><br><br>`);
});

dialog.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button?.dataset.replace) {
    const [dayIndex, slot, recipeIndex] = button.dataset.replace.split(',').map(Number);
    const next = plan.map((meals, index) => index === planIndex(dayIndex) ? meals.map((meal, i) => i === slot ? recipeIndex : meal) : meals);
    const nextSettings = {...settings, plan:next};
    if (!save('settings', nextSettings)) return;
    settings = nextSettings;
    plan = next;
    dialog.close();
    render(true);
    app.querySelector(`[data-swap="${dayIndex},${slot}"]`)?.focus({preventScroll:true});
  }
  if (button?.dataset.confirmDelete) {
    const next = journal.filter(entry => entry.id !== button.dataset.confirmDelete);
    if (!save('journal', next)) return;
    journal = next;
    dialog.close();
    render(true);
  }
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
});
document.querySelector('#install').addEventListener('click', async () => {
  if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    openDialog('<h2>Assiette Sauge est installée</h2><p>Tu peux la retrouver sur ton écran d’accueil.</p>');
  } else if (installPrompt) {
    await installPrompt.prompt();
    installPrompt = undefined;
  } else {
    openDialog('<h2>Installer Assiette Sauge</h2><p><strong>Sur iPhone</strong> · Ouvre cette page dans Safari, touche Partager, puis Sur l’écran d’accueil.</p><p><strong>Sur Android</strong> · Ouvre le menu de Chrome, puis choisis Installer l’application ou Ajouter à l’écran d’accueil.</p>');
  }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error);
fillIcons(document);
window.addEventListener('hashchange', () => render());
render();
