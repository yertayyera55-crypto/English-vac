const flashcardImportState = { file: null, rows: [], summary: null };
let flashSession = null;

function ensureFlashcardSets() {
  if (!Array.isArray(app.flashcardSets)) app.flashcardSets = [];
  return app.flashcardSets;
}
function flashcardSet(id) { return ensureFlashcardSets().find((set) => set.id === id); }
function flashcardCards(set) { return Array.isArray(set?.cards) ? set.cards : []; }
function flashcardStats(set) {
  const cards = flashcardCards(set), learned = cards.filter((card) => card.known).length;
  return { total: cards.length, learned, learning: cards.length - learned, percent: cards.length ? Math.round(learned / cards.length * 100) : 0 };
}
function makeFlashcardId(prefix = "card") { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function findOrCreateFlashcardSet(name) {
  const label = String(name || "").trim();
  const existing = ensureFlashcardSets().find((set) => set.name.toLowerCase() === label.toLowerCase());
  if (existing) return existing;
  const colors = ["#8d6af2", "#547ff2", "#42bf89", "#e879ae", "#e6ad58"];
  const set = { id: makeFlashcardId("set"), name: label, color: colors[ensureFlashcardSets().length % colors.length], cards: [] };
  ensureFlashcardSets().unshift(set);
  return set;
}
function flashcardHub() {
  flashSession = null;
  const sets = ensureFlashcardSets();
  const totalCards = sets.reduce((count, set) => count + flashcardStats(set).total, 0);
  const learnedCards = sets.reduce((count, set) => count + flashcardStats(set).learned, 0);
  root.innerHTML = `<div class="overlay flashcard-overlay" role="dialog" aria-modal="true" aria-label="Flashcards"><section class="modal flashcard-hub"><button class="icon-button modal-close" data-action="close" aria-label="Close">×</button><div class="modal-intro"><div class="flashcard-hub-heading"><div><p class="eyebrow">FLASHCARDS</p><h2>Fast recall, your way.</h2><p>Build quick sets for linking words, synonyms, formulas, or anything that needs repetition rather than a full SAT task.</p></div><div class="flashcard-total"><strong>${learnedCards} / ${totalCards}</strong><span>learned</span></div></div><div class="flashcard-hub-actions"><button class="secondary-action" data-action="flashcard-import">⇧ Import cards</button><button class="secondary-action" data-action="flashcard-template">↓ Template</button><button class="modal-cta purple" data-action="flashcard-new-set">+ New set</button></div><div class="flashcard-set-grid">${sets.length ? sets.map((set) => { const stats = flashcardStats(set); return `<article class="flashcard-set-card" style="--set-color:${esc(set.color || "#8d6af2")}"><div class="flashcard-set-card-top"><span class="flashcard-set-mark">▣</span><span class="flashcard-set-percent">${stats.percent}% learned</span></div><h3>${esc(set.name)}</h3><p>${stats.total ? `${stats.learned} learned · ${stats.learning} still learning` : "No cards yet"}</p><div class="flashcard-set-progress"><i style="width:${stats.percent}%"></i></div><div class="flashcard-set-actions"><button class="secondary-action" data-action="flashcard-open-set" data-id="${set.id}">Manage</button><button class="flashcard-start-button" data-action="flashcard-start" data-id="${set.id}" ${stats.total ? "" : "disabled"}>Intensive →</button></div></article>`; }).join("") : `<div class="flashcard-empty"><span>▣</span><h3>Your first fast-recall set starts here.</h3><p>For example: create “Linking words”, then add <b>however</b> on the front and its use on the back.</p><button class="modal-cta purple" data-action="flashcard-new-set">Create a flashcard set</button></div>`}</div></div></section></div>`;
}
function flashcardSetView(id) {
  const set = flashcardSet(id); if (!set) return flashcardHub();
  const cards = flashcardCards(set), stats = flashcardStats(set);
  root.innerHTML = `<div class="overlay flashcard-overlay" role="dialog" aria-modal="true" aria-label="${esc(set.name)} flashcards"><section class="modal flashcard-hub flashcard-set-view"><button class="icon-button modal-close" data-action="close" aria-label="Close">×</button><div class="modal-intro"><button class="flashcard-back-link" data-action="flashcards">← All flashcard sets</button><div class="flashcard-set-heading"><div><p class="eyebrow">FLASHCARD SET</p><h2>${esc(set.name)}</h2><p>${stats.total ? `${stats.learned} of ${stats.total} cards are clearly learned. Cards marked “still learning” repeat in the intensive loop.` : "Add your first front-and-back card, or import a file using the template."}</p></div><div class="flashcard-total"><strong>${stats.percent}%</strong><span>learned</span></div></div><div class="flashcard-hub-actions"><button class="secondary-action" data-action="flashcard-import">⇧ Import cards</button><button class="secondary-action" data-action="flashcard-reset" data-id="${set.id}" ${stats.total ? "" : "disabled"}>Reset learned</button><button class="modal-cta" data-action="flashcard-add-card" data-id="${set.id}">+ Add card</button><button class="flashcard-start-button" data-action="flashcard-start" data-id="${set.id}" ${stats.total ? "" : "disabled"}>Start intensive →</button></div><div class="flashcard-card-list">${cards.length ? cards.map((card) => `<article class="flashcard-card-row"><span class="flashcard-card-state ${card.known ? "learned" : "learning"}">${card.known ? "✓ Learned" : "↻ Learning"}</span><div><strong>${esc(card.front)}</strong><p>${esc(card.back)}</p>${card.example ? `<small>${esc(card.example)}</small>` : ""}</div><button class="icon-button flashcard-delete-card" data-action="flashcard-delete-card" data-id="${card.id}" data-set="${set.id}" aria-label="Delete ${esc(card.front)}">×</button></article>`).join("") : `<div class="flashcard-empty compact"><span>+</span><h3>No cards in this set yet.</h3><p>Add a card manually or import a CSV / Excel file with the template.</p></div>`}</div><div class="flashcard-set-footer"><button class="danger-button" data-action="flashcard-delete-set" data-id="${set.id}">Delete this set</button><span>${stats.total} ${stats.total === 1 ? "card" : "cards"} saved privately in your workspace</span></div></div></section></div>`;
}
function flashcardSetModal() {
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal flashcard-form-modal"><button class="icon-button modal-close" data-action="close" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">NEW FLASHCARD SET</p><h2>Give quick recall a home.</h2><p>Keep this separate from your SAT and IELTS collections. A set can be as focused as “Linking words” or “Economics terms”.</p><label class="field-label" for="flashcard-set-name">SET NAME</label><input id="flashcard-set-name" maxlength="50" placeholder="e.g. Linking words" autofocus><div class="modal-footer"><span class="subtle-note">You can add cards or import them next.</span><button class="modal-cta purple" data-action="flashcard-save-set">Create set</button></div></div></section></div>`;
}
function saveFlashcardSet() {
  const input = document.querySelector("#flashcard-set-name"), name = input?.value.trim();
  if (!name) return notice("Give this flashcard set a name first.");
  const set = findOrCreateFlashcardSet(name); save(); flashcardSetView(set.id);
}
function flashcardCardModal(setId) {
  const set = flashcardSet(setId); if (!set) return flashcardHub();
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal flashcard-form-modal"><button class="icon-button modal-close" data-action="flashcard-open-set" data-id="${set.id}" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">ADD FLASHCARD · ${esc(set.name)}</p><h2>One clear idea per card.</h2><p>The front is what you want to recall. The back is the meaning, use, translation, or explanation.</p><label class="field-label" for="flashcard-card-front">FRONT</label><input id="flashcard-card-front" maxlength="120" placeholder="e.g. However" autofocus><label class="field-label" for="flashcard-card-back">BACK</label><textarea id="flashcard-card-back" class="flashcard-textarea" maxlength="400" placeholder="Use to introduce a contrast."></textarea><label class="field-label" for="flashcard-card-example">OPTIONAL EXAMPLE</label><input id="flashcard-card-example" maxlength="300" placeholder="However, the data tell a different story."><div class="modal-footer"><button class="secondary-action" data-action="flashcard-open-set" data-id="${set.id}">Cancel</button><button class="modal-cta purple" data-action="flashcard-save-card" data-id="${set.id}">Add card</button></div></div></section></div>`;
}
function saveFlashcardCard(setId) {
  const set = flashcardSet(setId); if (!set) return flashcardHub();
  const front = document.querySelector("#flashcard-card-front")?.value.trim(), back = document.querySelector("#flashcard-card-back")?.value.trim(), example = document.querySelector("#flashcard-card-example")?.value.trim();
  if (!front || !back) return notice("Add both the front and back of the card.");
  flashcardCards(set).unshift({ id: makeFlashcardId(), front, back, example, known: false, reviews: 0 }); save(); flashcardSetView(set.id);
}
function deleteFlashcardCard(setId, cardId) {
  const set = flashcardSet(setId); if (!set) return flashcardHub();
  set.cards = flashcardCards(set).filter((card) => card.id !== cardId); save(); flashcardSetView(setId); notice("Flashcard removed.");
}
function resetFlashcardSet(setId) {
  const set = flashcardSet(setId); if (!set) return flashcardHub();
  flashcardCards(set).forEach((card) => { card.known = false; }); save(); flashcardSetView(setId); notice("Every card is back in the learning loop.");
}
function deleteFlashcardSet(setId) {
  const set = flashcardSet(setId); if (!set) return flashcardHub();
  if (!window.confirm(`Delete “${set.name}” and its ${flashcardCards(set).length} cards?`)) return;
  app.flashcardSets = ensureFlashcardSets().filter((item) => item.id !== setId); save(); flashcardHub(); notice("Flashcard set deleted.");
}
function startFlashcardSession(setId) {
  const set = flashcardSet(setId), cards = flashcardCards(set); if (!set || !cards.length) return notice("Add at least one flashcard before starting.");
  const learning = cards.filter((card) => !card.known), startCards = learning.length ? learning : cards;
  flashSession = { setId, queue: shuffled(startCards.map((card) => card.id)), index: 0, revealed: false, again: 0, learnedThisSession: 0 };
  flashcardStudyView();
}
function activeFlashcard() {
  const set = flashcardSet(flashSession?.setId); return { set, card: flashcardCards(set).find((card) => card.id === flashSession?.queue[flashSession.index]) };
}
function flashcardStudyView() {
  const { set, card } = activeFlashcard(); if (!set || !card) return flashcardHub();
  const stats = flashcardStats(set), inLoop = flashSession.queue.length, progress = stats.total ? Math.round(stats.learned / stats.total * 100) : 0;
  root.innerHTML = `<div class="overlay flashcard-overlay" role="dialog" aria-modal="true" aria-label="Intensive flashcard session"><section class="modal flashcard-study-modal"><div class="session-top"><span class="session-label">INTENSIVE FLASHCARDS · ${stats.learned} OF ${stats.total} LEARNED</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress flashcard-session-progress"><i style="width:${progress}%"></i></div><div class="flashcard-study-body"><div class="flashcard-study-meta"><span>${esc(set.name)}</span><b>${inLoop} ${inLoop === 1 ? "card" : "cards"} in the loop</b></div><button class="intensive-card ${flashSession.revealed ? "revealed" : ""}" data-action="flashcard-flip" aria-label="${flashSession.revealed ? "Hide answer" : "Reveal answer"}"><span class="intensive-card-face intensive-card-front"><small>FRONT</small><strong>${esc(card.front)}</strong><b>${flashSession.revealed ? "Tap to hide answer" : "Tap or press Space to reveal"}</b></span><span class="intensive-card-face intensive-card-back"><small>BACK</small><strong>${esc(card.back)}</strong>${card.example ? `<em>${esc(card.example)}</em>` : ""}<b>Now decide: know it or repeat it.</b></span></button><div class="flashcard-study-actions"><button class="flashcard-again" data-action="flashcard-rate" data-id="again" ${flashSession.revealed ? "" : "disabled"}><span>1</span><b>Still learning</b><small>Repeat after two cards</small></button><button class="flashcard-known" data-action="flashcard-rate" data-id="known" ${flashSession.revealed ? "" : "disabled"}><span>2</span><b>I know it</b><small>Mark as learned</small></button></div><p class="flashcard-shortcuts">Space — reveal · 1 — still learning · 2 — I know it</p></div></section></div>`;
}
function flipFlashcard() { if (!flashSession) return; flashSession.revealed = !flashSession.revealed; flashcardStudyView(); }
function rateFlashcard(result) {
  const { set, card } = activeFlashcard(); if (!set || !card || !flashSession.revealed) return;
  const wasKnown = Boolean(card.known); card.reviews = Number(card.reviews || 0) + 1;
  flashSession.queue.splice(flashSession.index, 1);
  if (result === "known") { card.known = true; if (!wasKnown) flashSession.learnedThisSession += 1; }
  else {
    card.known = false; flashSession.again += 1;
    const retryIndex = Math.min(flashSession.index + 2, flashSession.queue.length);
    flashSession.queue.splice(retryIndex, 0, card.id);
  }
  save(); flashSession.revealed = false;
  if (!flashSession.queue.length) return flashcardStudyResult(set);
  if (flashSession.index >= flashSession.queue.length) flashSession.index = 0;
  flashcardStudyView();
}
function flashcardStudyResult(set) {
  const stats = flashcardStats(set), summary = { learned: flashSession?.learnedThisSession || 0, again: flashSession?.again || 0 };
  flashSession = null;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal flashcard-result-modal"><div class="result"><div class="result-mark">✓</div><p class="eyebrow">INTENSIVE SESSION COMPLETE</p><h2>That set is clear now.</h2><p>${summary.learned} ${summary.learned === 1 ? "card was" : "cards were"} marked learned${summary.again ? ` after ${summary.again} extra ${summary.again === 1 ? "repeat" : "repeats"}` : ""}.</p><div class="result-grid"><div><strong>${stats.learned} / ${stats.total}</strong><span>learned in set</span></div><div><strong>${summary.learned}</strong><span>learned now</span></div><div><strong>${stats.percent}%</strong><span>set progress</span></div></div><div class="modal-footer"><button class="secondary-action" data-action="flashcard-open-set" data-id="${set.id}">View set</button><button class="modal-cta purple" data-action="flashcards">All flashcard sets</button></div></div></section></div>`;
}
function normaliseFlashcardHeader(value) { return String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_"); }
function parseFlashcardDelimited(source, delimiter) {
  const records = []; let row = [], cell = "", quote = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"') { if (quote && source[index + 1] === '"') { cell += '"'; index += 1; } else quote = !quote; }
    else if (char === delimiter && !quote) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quote) { if (char === "\r" && source[index + 1] === "\n") index += 1; row.push(cell); if (row.some(Boolean)) records.push(row); row = []; cell = ""; }
    else cell += char;
  }
  row.push(cell); if (row.some(Boolean)) records.push(row);
  const headers = (records.shift() || []).map(normaliseFlashcardHeader);
  return records.map((values) => Object.fromEntries(headers.map((header, index) => [header, String(values[index] || "").trim()])));
}
function normaliseFlashcardRow(row) { return Object.fromEntries(Object.entries(row).map(([key, value]) => [normaliseFlashcardHeader(key), String(value ?? "").trim()])); }
function flashcardFront(row) { return row.front || row.term || row.word || ""; }
function flashcardBack(row) { return row.back || row.definition || row.meaning || row.answer || ""; }
function inspectFlashcardRows(rows) {
  const valid = rows.filter((row) => flashcardFront(row) && flashcardBack(row));
  return { total: rows.length, valid: valid.length, invalid: rows.length - valid.length, sets: new Set(valid.map((row) => row.set || "Imported flashcards")).size };
}
function flashcardImportModal() {
  flashcardImportState.file = null; flashcardImportState.rows = []; flashcardImportState.summary = null;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal flashcard-form-modal"><button class="icon-button modal-close" data-action="flashcards" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">IMPORT FLASHCARDS</p><h2>Bring a fast-recall set.</h2><p>Upload Excel, CSV, or TSV. Use <code>front</code> and <code>back</code>; add <code>example</code> and <code>set</code> when useful.</p><div id="flashcard-dropzone" class="import-dropzone"><span class="import-file-icon">CARD</span><div><strong>Drop a file here</strong><p>Excel (.xlsx), CSV, or TSV · first sheet only</p></div><div class="file-picker"><input id="flashcard-import-file" type="file" accept=".xlsx,.csv,.tsv,.txt" /><label for="flashcard-import-file">Choose a file</label></div></div><label class="field-label" for="flashcard-import-set">SET FOR BLANK ROWS</label><input id="flashcard-import-set" maxlength="50" placeholder="e.g. Linking words"><div id="flashcard-import-preview"></div><div class="modal-footer"><button class="template-link" data-action="flashcard-template">Download template</button><button class="modal-cta purple" data-action="flashcard-process-import" disabled>Import cards</button></div></div></section></div>`;
  const dropzone = document.querySelector("#flashcard-dropzone"), picker = document.querySelector("#flashcard-import-file");
  picker.addEventListener("change", () => readFlashcardFile(picker.files[0]));
  document.querySelector("#flashcard-import-set").addEventListener("input", renderFlashcardImportPreview);
  ["dragenter", "dragover"].forEach((event) => dropzone.addEventListener(event, (item) => { item.preventDefault(); dropzone.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach((event) => dropzone.addEventListener(event, (item) => { item.preventDefault(); dropzone.classList.remove("dragging"); }));
  dropzone.addEventListener("drop", (event) => readFlashcardFile(event.dataTransfer.files[0]));
}
function readFlashcardFile(file) {
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  if (!["xlsx", "csv", "tsv", "txt"].includes(extension)) return notice("Choose an Excel, CSV, or TSV file.");
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let rows;
      if (extension === "xlsx") {
        if (!window.XLSX) throw new Error("Excel reader unavailable");
        const book = window.XLSX.read(reader.result, { type: "array" });
        rows = window.XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], { defval: "" });
      } else {
        const source = String(reader.result).replace(/^\uFEFF/, "");
        rows = parseFlashcardDelimited(source, extension === "tsv" ? "\t" : (source.includes("\t") ? "\t" : ","));
      }
      flashcardImportState.file = file; flashcardImportState.rows = rows.map(normaliseFlashcardRow).filter((row) => Object.values(row).some(Boolean)); flashcardImportState.summary = inspectFlashcardRows(flashcardImportState.rows); renderFlashcardImportPreview();
    } catch { notice("Could not read this file. Try saving it as CSV."); }
  };
  if (extension === "xlsx") reader.readAsArrayBuffer(file); else reader.readAsText(file);
}
function renderFlashcardImportPreview() {
  const preview = document.querySelector("#flashcard-import-preview"), button = document.querySelector('[data-action="flashcard-process-import"]');
  if (!preview || !button || !flashcardImportState.summary) return;
  const { valid, invalid, sets } = flashcardImportState.summary;
  preview.className = "import-preview";
  preview.innerHTML = `<strong>${esc(flashcardImportState.file.name)} is ready to import</strong><ul><li>${valid} valid ${valid === 1 ? "card" : "cards"} found${invalid ? ` · ${invalid} row${invalid === 1 ? "" : "s"} need a front and back` : ""}</li><li>${sets} ${sets === 1 ? "set" : "sets"} will be created or updated</li><li>Each card starts as <b>still learning</b> until you mark it known.</li></ul>`;
  button.disabled = !valid;
}
function importFlashcards() {
  const valid = flashcardImportState.rows.filter((row) => flashcardFront(row) && flashcardBack(row));
  if (!valid.length) return notice("Choose a file with a front and back for every card.");
  const fallbackSet = document.querySelector("#flashcard-import-set")?.value.trim() || "Imported flashcards";
  const setNames = new Set();
  valid.forEach((row) => {
    const set = findOrCreateFlashcardSet(row.set || fallbackSet), example = row.example || row.context || "";
    flashcardCards(set).unshift({ id: makeFlashcardId(), front: flashcardFront(row), back: flashcardBack(row), example, known: false, reviews: 0 }); setNames.add(set.id);
  });
  save(); flashcardHub(); notice(`Imported ${valid.length} ${valid.length === 1 ? "flashcard" : "flashcards"} into ${setNames.size} ${setNames.size === 1 ? "set" : "sets"}.`);
}
function downloadFlashcardTemplate() {
  const rows = ["front,back,example,set", "However,Use to introduce a contrast.,\"However, the results changed after the policy.\",Linking words", "In addition,Use to add a related idea.,\"In addition, the survey included interviews.\",Linking words"];
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([`\uFEFF${rows.join("\n")}\n`], { type: "text/csv;charset=utf-8" })); link.download = "lexora-flashcards-template.csv"; link.click(); URL.revokeObjectURL(link.href);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]"); if (!button) return;
  const action = button.dataset.action, id = button.dataset.id;
  if (action === "flashcards") flashcardHub();
  if (action === "flashcard-new-set") flashcardSetModal();
  if (action === "flashcard-save-set") saveFlashcardSet();
  if (action === "flashcard-open-set") flashcardSetView(id);
  if (action === "flashcard-add-card") flashcardCardModal(id);
  if (action === "flashcard-save-card") saveFlashcardCard(id);
  if (action === "flashcard-delete-card") deleteFlashcardCard(button.dataset.set, id);
  if (action === "flashcard-reset") resetFlashcardSet(id);
  if (action === "flashcard-delete-set") deleteFlashcardSet(id);
  if (action === "flashcard-start") startFlashcardSession(id);
  if (action === "flashcard-flip") flipFlashcard();
  if (action === "flashcard-rate") rateFlashcard(id);
  if (action === "flashcard-import") flashcardImportModal();
  if (action === "flashcard-process-import") importFlashcards();
  if (action === "flashcard-template") downloadFlashcardTemplate();
});
document.addEventListener("keydown", (event) => {
  if (!flashSession || event.target.matches("input, textarea, select")) return;
  if (event.key === " " || event.key === "Enter") { event.preventDefault(); flipFlashcard(); }
  if (event.key === "1") { event.preventDefault(); rateFlashcard("again"); }
  if (event.key === "2") { event.preventDefault(); rateFlashcard("known"); }
});
window.LexoraFlashcards = { clearSession: () => { flashSession = null; } };
