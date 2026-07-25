const importState = { file: null, rows: [], summary: null };

const importHeaders = [
  "word", "pronunciation", "part_of_speech", "definition", "translation", "example_sentence", "synonyms", "collections", "status", "starred", "difficult",
  "task_1_type", "task_1_prompt", "task_1_question", "task_1_a", "task_1_b", "task_1_c", "task_1_d", "task_1_correct",
  "task_2_type", "task_2_prompt", "task_2_question", "task_2_a", "task_2_b", "task_2_c", "task_2_d", "task_2_correct",
  "task_3_type", "task_3_prompt", "task_3_question", "task_3_a", "task_3_b", "task_3_c", "task_3_d", "task_3_correct",
];

const templateRow = {
  word: "ubiquitous", pronunciation: "/juːˈbɪkwɪtəs/", part_of_speech: "adjective", definition: "present, appearing, or found everywhere", translation: "повсеместный", example_sentence: "Smartphones have become ubiquitous in modern classrooms.", synonyms: "widespread; omnipresent", collections: "SAT Vocab #1; IELTS Academic", status: "new", starred: "false", difficult: "false",
  task_1_type: "meaning_in_context", task_1_prompt: "In many cities, contactless payment is now ubiquitous, even at small market stalls.", task_1_question: "What does ubiquitous most nearly mean in this context?", task_1_a: "Present almost everywhere", task_1_b: "Difficult to afford", task_1_c: "Recently invented", task_1_d: "Carefully regulated", task_1_correct: "A",
  task_2_type: "contextual_inference", task_2_prompt: "Because smartphones are ubiquitous, the school designed its announcement system to work on any device.", task_2_question: "What does the word ubiquitous help explain about the school's decision?", task_2_a: "Most students can probably access a smartphone", task_2_b: "The school wants students to buy new devices", task_2_c: "Smartphones are banned at the school", task_2_d: "Only a few students own any device", task_2_correct: "A",
  task_3_type: "sentence_completion", task_3_prompt: "Wireless internet is now _____ in public libraries, so visitors can work almost anywhere.", task_3_question: "Which word completes the sentence most precisely?", task_3_a: "ubiquitous", task_3_b: "ambiguous", task_3_c: "reluctant", task_3_d: "scarce", task_3_correct: "A",
};

function importModal() {
  importState.file = null; importState.rows = []; importState.summary = null;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true" aria-label="Import vocabulary file"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">IMPORT VOCABULARY</p><h2>Bring your own word set.</h2><p>Upload an Excel, CSV, or TSV file. One row is one word; its three distinct tasks rotate in later reviews.</p><div id="import-dropzone" class="import-dropzone"><span class="import-file-icon">XLSX</span><div><strong>Drop a file here</strong><p>Excel (.xlsx), CSV, or TSV · first sheet only</p></div><div class="file-picker"><input id="import-file" type="file" accept=".xlsx,.csv,.tsv,.txt" /><label for="import-file">Choose a file</label></div></div><div class="import-guide"><div><strong>Required</strong><span><code>word</code> and <code>definition</code></span></div><div><strong>Best results</strong><span>Three SAT-style tasks with A–D options</span></div></div><div class="task-type-list"><div><b>01</b><p><strong>Meaning in context</strong><span>Infer the intended meaning from a new sentence.</span></p></div><div><b>02</b><p><strong>Contextual inference</strong><span>Explain what the word reveals about a passage or situation.</span></p></div><div><b>03</b><p><strong>Sentence completion</strong><span>Choose the word that makes the sentence precise.</span></p></div></div><div id="import-preview"></div><div class="modal-footer"><button class="template-link" data-action="download-template">Download Excel-ready template</button><button class="modal-cta" data-action="process-import" disabled>Import words</button></div></div></section></div>`;
  const dropzone = document.querySelector("#import-dropzone");
  const picker = document.querySelector("#import-file");
  picker.addEventListener("change", () => readImportFile(picker.files[0]));
  ["dragenter", "dragover"].forEach((event) => dropzone.addEventListener(event, (e) => { e.preventDefault(); dropzone.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach((event) => dropzone.addEventListener(event, (e) => { e.preventDefault(); dropzone.classList.remove("dragging"); }));
  dropzone.addEventListener("drop", (event) => readImportFile(event.dataTransfer.files[0]));
}

function normaliseHeader(value) { return String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_"); }
function normaliseRow(row) { return Object.fromEntries(Object.entries(row).map(([key, value]) => [normaliseHeader(key), String(value ?? "").trim()])); }
function parseDelimited(source, delimiter) {
  const records = []; let row = [], cell = "", quote = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"') { if (quote && source[i + 1] === '"') { cell += '"'; i += 1; } else quote = !quote; }
    else if (char === delimiter && !quote) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quote) { if (char === "\r" && source[i + 1] === "\n") i += 1; row.push(cell); if (row.some((item) => item.trim())) records.push(row); row = []; cell = ""; }
    else cell += char;
  }
  row.push(cell); if (row.some((item) => item.trim())) records.push(row);
  const [headers = [], ...lines] = records;
  return lines.map((line) => Object.fromEntries(headers.map((header, index) => [header, line[index] || ""])));
}

function readImportFile(file) {
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  const reader = new FileReader();
  reader.onerror = () => notice("The file could not be read. Try saving it again as CSV or XLSX.");
  reader.onload = () => {
    try {
      let rows;
      if (extension === "xlsx") {
        if (!window.XLSX) throw new Error("Excel reader unavailable");
        const workbook = window.XLSX.read(reader.result, { type: "array" });
        rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      } else {
        const source = String(reader.result).replace(/^\uFEFF/, "");
        rows = parseDelimited(source, extension === "tsv" ? "\t" : (source.includes("\t") ? "\t" : ","));
      }
      importState.file = file; importState.rows = rows.map(normaliseRow).filter((row) => Object.values(row).some(Boolean));
      importState.summary = inspectImportRows(importState.rows);
      renderImportPreview();
    } catch (error) { notice("Could not read this file. For Excel, check your connection or save it as CSV."); }
  };
  if (extension === "xlsx") reader.readAsArrayBuffer(file); else reader.readAsText(file);
}

function inspectImportRows(rows) {
  const valid = rows.filter((row) => row.word && row.definition);
  const customTasks = valid.reduce((total, row) => total + [1, 2, 3].filter((number) => row[`task_${number}_prompt`] && row[`task_${number}_a`] && row[`task_${number}_correct`]).length, 0);
  return { total: rows.length, valid: valid.length, invalid: rows.length - valid.length, customTasks };
}

function renderImportPreview() {
  const preview = document.querySelector("#import-preview");
  const button = document.querySelector('[data-action="process-import"]');
  if (!importState.summary) return;
  const { total, valid, invalid, customTasks } = importState.summary;
  preview.className = "import-preview";
  preview.innerHTML = `<strong>${esc(importState.file.name)} is ready to import</strong><ul><li>${valid} valid word${valid === 1 ? "" : "s"} found${invalid ? ` · ${invalid} row${invalid === 1 ? "" : "s"} need a word and definition` : ""}</li><li>${customTasks} custom SAT-style task${customTasks === 1 ? "" : "s"} found</li><li>Existing words with the same spelling will be updated.</li></ul>`;
  button.disabled = !valid || Boolean(invalid && !valid);
}

function parseBool(value) { return ["true", "yes", "1", "y", "да"].includes(String(value || "").trim().toLowerCase()); }
function parseCorrect(value, options) {
  const letter = String(value || "A").trim().toUpperCase();
  if (/^[A-D]$/.test(letter)) return Math.min(options.length - 1, letter.charCodeAt(0) - 65);
  const number = Number(letter); return Number.isFinite(number) && number > 0 ? Math.min(options.length - 1, number - 1) : 0;
}
function parseCollections(value) { return String(value || "").split(/[;,|]/).map((name) => name.trim()).filter(Boolean); }
function taskType(value, index) {
  const type = normaliseHeader(value);
  if (type.includes("infer") || type.includes("context")) return "inference";
  if (type.includes("complete") || type.includes("cloze") || type.includes("sentence")) return "completion";
  return index === 2 ? "inference" : index === 3 ? "completion" : "meaning";
}
function generatedTasks(word) {
  const sentence = word.e || `The author's use of ${word.w} gives the passage a precise meaning.`;
  return [
    { type: "meaning", prompt: sentence, question: `What does ${word.w} most nearly mean in this context?`, options: [word.d, "following a familiar routine", "difficult to observe", "unlikely to change"], correct: 0 },
    { type: "inference", prompt: sentence, question: `What does the word ${word.w} help the reader understand about the situation?`, options: [`It emphasizes that something is ${word.d}`, "It signals a contrast with no evidence", "It changes the speaker's topic", "It describes an unrelated detail"], correct: 0 },
    { type: "completion", prompt: sentence.replace(new RegExp(word.w, "ig"), "_____"), question: "Which word completes the sentence most precisely?", options: [word.w, "conventional", "ambiguous", "scarce"], correct: 0 },
  ];
}
function rowTasks(row, word) {
  const tasks = [1, 2, 3].map((number) => {
    const options = ["a", "b", "c", "d"].map((letter) => row[`task_${number}_${letter}`]).filter(Boolean);
    const prompt = row[`task_${number}_prompt`];
    if (!prompt || options.length < 2) return null;
    return { type: taskType(row[`task_${number}_type`], number), prompt, question: row[`task_${number}_question`] || "Which answer is best supported by the text?", options, correct: parseCorrect(row[`task_${number}_correct`], options) };
  }).filter(Boolean);
  return [...tasks, ...generatedTasks(word)].slice(0, 3);
}
function findOrCreateCollection(name, index) {
  const existing = app.collections.find((collection) => collection.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing.id;
  const id = `import-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}-${index}`;
  const colors = ["#638dff", "#a36af3", "#51c88a", "#e579aa", "#f0b867"];
  app.collections.push({ id, name, color: colors[app.collections.length % colors.length] });
  return id;
}
function importWords() {
  const validRows = importState.rows.filter((row) => row.word && row.definition);
  if (!validRows.length) { notice("Choose a file with a word and definition in each row."); return; }
  let added = 0, updated = 0, questions = 0;
  validRows.forEach((row, index) => {
    const word = row.word.toLowerCase();
    const names = parseCollections(row.collections);
    const collectionIDs = (names.length ? names : [app.activeCollection === "all" ? "SAT Vocab #1" : coll(app.activeCollection)?.name]).filter(Boolean).map((name) => findOrCreateCollection(name, index));
    const draft = { w: word, p: row.pronunciation || "/add pronunciation/", pos: row.part_of_speech || "word", d: row.definition, tr: row.translation || "", e: row.example_sentence || `The author used ${word} in the passage.`, r: String(row.synonyms || "").split(/[;,|]/).map((value) => value.trim()).filter(Boolean), c: collectionIDs, s: ["new", "learning", "reviewing", "mastered"].includes(row.status?.toLowerCase()) ? row.status.toLowerCase() : "new", m: 0, star: parseBool(row.starred), hard: parseBool(row.difficult), due: true };
    draft.tasks = rowTasks(row, draft); questions += draft.tasks.length;
    const existing = app.words.find((item) => item.w.toLowerCase() === word);
    if (existing) { Object.assign(existing, draft); updated += 1; }
    else { app.words.unshift({ id: `${word}-${Date.now()}-${index}`, ...draft }); added += 1; }
  });
  save(); render(); close(); notice(`Imported ${added} new word${added === 1 ? "" : "s"}${updated ? ` · updated ${updated}` : ""} · ${questions} rotating tasks ready.`);
}
function downloadTemplate() {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = `\uFEFF${importHeaders.join(",")}\n${importHeaders.map((header) => quote(templateRow[header] || "")).join(",")}\n`;
  const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); link.download = "lexora-vocabulary-template.csv"; link.click(); URL.revokeObjectURL(link.href);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]"); if (!button) return;
  if (button.dataset.action === "import-words") importModal();
  if (button.dataset.action === "download-template") downloadTemplate();
  if (button.dataset.action === "process-import") importWords();
});
