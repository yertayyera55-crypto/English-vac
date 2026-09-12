let readingFlow = null;
let readingSetup = { source: "vocabulary", collectionId: null, count: "8", title: "", article: "" };
// A rendered document remains only in this browser tab. Keeping it out of the
// workspace avoids putting a potentially large DOCX (and its images) in the
// learner's Supabase data.
let readingDocument = null;

function makeReadingId(prefix = "reading") { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function readingDraft() {
  const draft = app.readingLab;
  if (!draft || typeof draft !== "object") return null;
  if (!Array.isArray(draft.marks)) draft.marks = [];
  if (!Array.isArray(draft.reviewedMarkIds)) draft.reviewedMarkIds = [];
  return draft;
}
function readingWords(draft = readingDraft()) {
  return (draft?.wordIds || []).map((id) => app.words.find((word) => word.id === id)).filter(Boolean);
}
function readingMarkWord(mark) { return mark?.wordId ? app.words.find((word) => word.id === mark.wordId) : null; }
function readingMarkLabel(mark) { return String(mark?.text || readingMarkWord(mark)?.w || "").trim(); }
function readingMarks(draft = readingDraft()) { return Array.isArray(draft?.marks) ? draft.marks : []; }
function readingMarkTranslation(mark) { const word = readingMarkWord(mark); return String(word?.tr || mark?.translation || "").trim(); }
function readingMarkDefinition(mark) { const word = readingMarkWord(mark); return String(word?.d || mark?.contextSense || mark?.definition || "").trim(); }
function readingMarkMeaning(mark) { return String(readingMarkTranslation(mark) || mark?.note || readingMarkDefinition(mark) || "").trim(); }
function readingMarkIsReady(mark) { return Boolean(readingMarkMeaning(mark)); }
function unresolvedReadingMarks(draft = readingDraft()) { return readingMarks(draft).filter((mark) => !readingMarkIsReady(mark)); }
function readingMarkSummary(mark) {
  const translation = readingMarkTranslation(mark), definition = readingMarkDefinition(mark);
  if (translation && definition && translation !== definition) return `${translation} · ${definition}`;
  return translation || definition || mark?.note || "Context saved · look it up when you are ready";
}
function normaliseReadingSelection(value) { return String(value || "").replace(/\s+/g, " ").replace(/^[\s“”"'`.,;:!?—–-]+|[\s“”"'`.,;:!?—–-]+$/g, "").trim(); }
function escapeReadingRegExp(value) { return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function readingCurrentCollection() {
  const selected = readingSetup.collectionId || (app.activeCollection !== "all" ? app.activeCollection : app.collections[0]?.id);
  return app.collections.find((collection) => collection.id === selected) || app.collections[0];
}
function saveReadingSetupFields() {
  readingSetup.collectionId = document.querySelector("#reading-collection")?.value || readingSetup.collectionId;
  readingSetup.count = document.querySelector("#reading-count")?.value || readingSetup.count;
  readingSetup.title = document.querySelector("#reading-article-title")?.value || readingSetup.title;
  readingSetup.article = document.querySelector("#reading-article-input")?.value || readingSetup.article;
}
function readingDocumentTitle(file) { return file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim() || "Untitled document"; }
function readingDocumentIsOpen() { return Boolean(readingDocument?.html); }
function plainReadingDocumentText(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
function snapshotReadingDocument() {
  const article = root.querySelector("#reading-article");
  if (readingDocument && article) readingDocument.html = article.innerHTML;
}
function removeReadingDocumentMark(markId) {
  if (!readingDocument?.html) return;
  const template = document.createElement("template"); template.innerHTML = readingDocument.html;
  template.content.querySelectorAll(".reading-selection-mark").forEach((node) => {
    if (node.dataset.markId === markId) node.replaceWith(document.createTextNode(node.textContent || ""));
  });
  readingDocument.html = template.innerHTML;
}
function sanitizeRenderedDocument(container) {
  container.querySelectorAll("script, iframe, object, embed, form, input, button").forEach((node) => node.remove());
  container.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const value = String(attribute.value || "").trim().toLowerCase();
      if (/^on/i.test(attribute.name) || ((attribute.name === "href" || attribute.name === "src") && value.startsWith("javascript:"))) node.removeAttribute(attribute.name);
    });
  });
  container.querySelectorAll("a").forEach((link) => { link.target = "_blank"; link.rel = "noopener noreferrer"; });
  container.querySelectorAll("img").forEach((image) => { image.loading = "lazy"; if (!image.alt) image.alt = "Document illustration"; });
  return container.innerHTML;
}
function readingDocumentLoadingView(title) {
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Preparing document"><section class="modal reading-document-loading"><div class="reading-document-spinner" aria-hidden="true"></div><p class="eyebrow">DOCUMENT READER</p><h2>Preparing ${esc(title)}</h2><p>Keeping headings, equations, and illustrations in the reader…</p></section></div>`;
}
async function openReadingDocument(file) {
  if (!window.JSZip || !window.docx?.renderAsync) return notice("The DOCX reader is still loading. Try again in a moment.");
  if (file.size > 8 * 1024 * 1024) return notice("Choose a DOCX file smaller than 8 MB.");
  saveReadingSetupFields(); readingDocument = null; readingFlow = { kind: "document-loading" }; readingDocumentLoadingView(file.name);
  try {
    const stage = document.createElement("div");
    await window.docx.renderAsync(await file.arrayBuffer(), stage, stage, {
      className: "docx", inWrapper: false, ignoreWidth: true, ignoreHeight: true, ignoreFonts: true,
      breakPages: true, renderHeaders: false, renderFooters: false, renderFootnotes: true, renderEndnotes: true,
      renderComments: false, renderAltChunks: false, useBase64URL: true,
    });
    const article = plainReadingDocumentText(stage.innerText);
    if (article.length < 40) throw new Error("The document did not contain readable text.");
    readingDocument = { name: file.name, html: sanitizeRenderedDocument(stage) };
    app.readingLab = { id: makeReadingId("document"), source: "document", title: readingSetup.title.trim() || readingDocumentTitle(file), article, wordIds: [], marks: [], reviewedMarkIds: [] };
    save(); readingFlow = { kind: "passage", markerOn: true, selection: null }; readingPassageView();
  } catch (error) {
    readingDocument = null; readingFlow = null; readingLabHub("article");
    notice("This DOCX could not be opened. Try saving it again as a standard .docx file.");
  }
}
function readingLabHub(mode = readingSetup.source) {
  readingSetup.source = mode;
  const current = readingCurrentCollection();
  if (!readingSetup.collectionId) readingSetup.collectionId = current?.id || null;
  const draft = readingDraft(), resumeLabel = draft?.source === "article" ? draft.title || "your article" : `${readingWords(draft).length} vocabulary words`;
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Reading Lab"><section class="modal reading-lab-modal"><button class="icon-button modal-close" data-action="close" aria-label="Close">×</button><div class="reading-lab-intro"><div class="reading-lab-heading"><div><p class="eyebrow">READING LAB</p><h2>Read with your <em>vocabulary.</em></h2><p>Preview words, use them in context, mark what is unclear, then return to the same passage after a focused review.</p></div>${draft ? `<button class="reading-resume" data-action="reading-resume"><span>Resume</span><b>${esc(resumeLabel)}</b></button>` : ""}</div><div class="reading-flow-strip" aria-label="Reading Lab workflow"><span>01 Preview</span><i></i><span>02 Read & mark</span><i></i><span>03 Review</span><i></i><span>04 Quiz</span></div><div class="reading-source-switch" role="tablist" aria-label="Reading source"><button class="${mode === "vocabulary" ? "selected" : ""}" data-action="reading-source" data-id="vocabulary" role="tab" aria-selected="${mode === "vocabulary"}"><b>▤ Vocabulary passage</b><small>Build a passage from a collection</small></button><button class="${mode === "article" ? "selected" : ""}" data-action="reading-source" data-id="article" role="tab" aria-selected="${mode === "article"}"><b>⌁ My article</b><small>Paste or upload any text</small></button></div>${mode === "vocabulary" ? readingVocabularySetup(current) : readingArticleSetup()}</div></section></div>`;
  if (mode === "article") attachReadingArticleUploader();
}
function readingVocabularySetup(current) {
  const allWords = current ? collectionWords(current.id) : [];
  const practice = allWords.filter(needsPractice);
  return `<div class="reading-setup-body"><div class="reading-setup-field"><label class="field-label" for="reading-collection">VOCABULARY COLLECTION</label><select id="reading-collection">${app.collections.map((collection) => `<option value="${collection.id}" ${collection.id === current?.id ? "selected" : ""}>${esc(collection.name)} · ${collectionWords(collection.id).length} words</option>`).join("")}</select><p>${practice.length ? `${practice.length} words currently need practice. The passage can use those first.` : "All words in this collection are available for the reading passage."}</p></div><div class="reading-setup-field"><label class="field-label" for="reading-count">PASSAGE LENGTH</label><select id="reading-count"><option value="5" ${readingSetup.count === "5" ? "selected" : ""}>5 target words · quick reading</option><option value="8" ${readingSetup.count === "8" ? "selected" : ""}>8 target words · standard</option><option value="12" ${readingSetup.count === "12" ? "selected" : ""}>12 target words · extended</option><option value="all" ${readingSetup.count === "all" ? "selected" : ""}>All available words</option></select><p>Each target word appears in context and can be highlighted directly in the passage.</p></div><div class="reading-setup-footer"><span class="subtle-note">The passage is composed locally from your saved examples. No AI service or extra key is needed.</span><button class="modal-cta teal" data-action="reading-start-vocabulary" ${allWords.length ? "" : "disabled"}>Preview vocabulary →</button></div></div>`;
}
function readingArticleSetup() {
  return `<div class="reading-setup-body reading-article-setup"><label class="field-label" for="reading-article-title">ARTICLE TITLE</label><input id="reading-article-title" maxlength="90" value="${esc(readingSetup.title)}" placeholder="e.g. The future of city transport"><label class="field-label" for="reading-article-input">PASTE YOUR TEXT</label><textarea id="reading-article-input" class="reading-article-input" maxlength="50000" placeholder="Paste an article, reading passage, notes, or any other text here…">${esc(readingSetup.article)}</textarea><div class="reading-upload-row"><span>or upload a document / plain-text file</span><label class="secondary-action" for="reading-article-file">⇧ Upload .docx, .txt or .md</label><input id="reading-article-file" type="file" accept=".docx,.txt,.md,.csv,.tsv" hidden></div><p class="reading-article-note">DOCX opens as a black-on-white reading sheet and keeps headings, pictures, and supported equations. Select a word, phrase, or sentence to add it to review cards.</p><div class="reading-setup-footer"><span class="subtle-note">Pasted text is saved privately. A DOCX stays only in this browser tab, while your marked cards are saved.</span><button class="modal-cta teal" data-action="reading-start-article">Open article →</button></div></div>`;
}
function attachReadingArticleUploader() {
  const picker = document.querySelector("#reading-article-file");
  picker?.addEventListener("change", () => {
    const file = picker.files?.[0]; if (!file) return;
    saveReadingSetupFields();
    if (/\.docx$/i.test(file.name)) { openReadingDocument(file); return; }
    if (file.size > 300000) return notice("Choose a text file under 300 KB.");
    const reader = new FileReader();
    reader.onload = () => {
      readingSetup.article = String(reader.result || "").replace(/^\uFEFF/, "").trim();
      if (!readingSetup.title) readingSetup.title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      readingLabHub("article"); notice("Text loaded. You can edit it before reading.");
    };
    reader.readAsText(file);
  });
}
function createReadingDraft(source) {
  saveReadingSetupFields();
  if (source === "article") {
    const article = String(readingSetup.article || "").trim();
    if (article.length < 80) return notice("Paste at least a short paragraph before opening the reader.");
    app.readingLab = { id: makeReadingId("passage"), source: "article", title: readingSetup.title.trim() || "Untitled article", article, wordIds: [], marks: [], reviewedMarkIds: [] };
    save(); readingPassageView(); return;
  }
  const collection = readingCurrentCollection(), available = collectionWords(collection?.id);
  if (!available.length) return notice("Choose a collection with at least one word.");
  const preferred = available.filter(needsPractice), pool = preferred.length ? preferred : available;
  const count = readingSetup.count === "all" ? pool.length : Math.min(Number(readingSetup.count) || 8, pool.length);
  const words = shuffled(pool).slice(0, count);
  app.readingLab = { id: makeReadingId("passage"), source: "vocabulary", title: `${collection.name} practice reading`, collectionId: collection.id, article: "", wordIds: words.map((word) => word.id), marks: [], reviewedMarkIds: [] };
  save(); readingPreviewView();
}
function readingPreviewView() {
  const draft = readingDraft(), words = readingWords(draft);
  if (!draft || draft.source !== "vocabulary") return readingPassageView();
  if (!words.length) return readingLabHub();
  if (!readingFlow || readingFlow.kind !== "preview") readingFlow = { kind: "preview", index: 0 };
  const index = Math.min(readingFlow.index, words.length - 1), word = words[index], finalWord = index === words.length - 1, progress = Math.round((index + 1) / words.length * 100);
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Vocabulary preview"><section class="modal reading-preview-modal"><div class="session-top"><span class="session-label">READING LAB · PREVIEW ${index + 1} OF ${words.length}</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress reading-progress"><i style="width:${progress}%"></i></div><div class="reading-preview-body"><span class="step-tag reading-step-tag">VOCABULARY BEFORE READING</span><h2>${esc(word.w)}</h2><span class="phonetic">${esc(word.p || "")}</span><p class="word-meta"><b>${esc(word.pos || "word")}</b>${word.tr ? ` · ${esc(word.tr)}` : ""}</p><p class="definition">${esc(word.d)}.</p><div class="example-box">“${esc(word.e || `The word ${word.w} appears in the passage.`)}”</div><p class="reading-preview-note">${finalWord ? `You have previewed all ${words.length} target words. Now read them in context.` : "Keep the meaning in mind; you will meet this word in the passage."}</p><div class="session-actions"><button class="modal-cta teal" data-action="${finalWord ? "reading-open-passage" : "reading-preview-next"}">${finalWord ? "Open the passage →" : "Next word →"}</button></div></div></section></div>`;
}
function readingExample(word) {
  const example = String(word?.e || "").trim();
  return example || `In the discussion, ${word.w} became an important idea for the group to consider.`;
}
function decorateReadingSentence(sentence, word) {
  const target = String(word?.w || "").trim(), source = String(sentence || "");
  if (!target) return esc(source);
  const match = new RegExp(escapeReadingRegExp(target), "i").exec(source);
  const token = `<button class="reading-token" data-action="reading-toggle-word" data-id="${esc(word.id)}" aria-pressed="false">${esc(match?.[0] || target)}</button>`;
  if (!match || match.index === undefined) return `${esc(source)} ${token}`;
  return `${esc(source.slice(0, match.index))}${token}${esc(source.slice(match.index + match[0].length))}`;
}
function decorateCustomParagraph(paragraph, marks) {
  let parts = [{ text: String(paragraph || ""), marked: false }];
  [...marks].sort((first, second) => readingMarkLabel(second).length - readingMarkLabel(first).length).forEach((mark) => {
    const target = readingMarkLabel(mark); if (!target) return;
    const next = [];
    parts.forEach((part) => {
      if (part.marked) return next.push(part);
      const index = part.text.toLowerCase().indexOf(target.toLowerCase());
      if (index < 0) return next.push(part);
      if (index) next.push({ text: part.text.slice(0, index), marked: false });
      next.push({ text: part.text.slice(index, index + target.length), marked: true, id: mark.id });
      if (index + target.length < part.text.length) next.push({ text: part.text.slice(index + target.length), marked: false });
    });
    parts = next;
  });
  return parts.map((part) => part.marked ? `<mark class="reading-selection-mark" data-mark-id="${esc(part.id)}">${esc(part.text)}</mark>` : esc(part.text)).join("");
}
function readingPassageMarkup(draft) {
  if (draft.source === "document") return readingDocumentIsOpen() ? readingDocument.html : `<div class="document-reupload"><h3>Re-upload this document to continue.</h3><p>Document files stay in this browser tab, so their pictures and formatting are never uploaded to your workspace.</p></div>`;
  if (draft.source === "article") return String(draft.article || "").split(/\n\s*\n/).filter(Boolean).map((paragraph) => `<p class="reading-paragraph">${decorateCustomParagraph(paragraph, readingMarks(draft))}</p>`).join("");
  const words = readingWords(draft), groups = [];
  for (let index = 0; index < words.length; index += 3) groups.push(words.slice(index, index + 3));
  const intro = `<p class="reading-paragraph">A community research team is preparing a report about how people respond to change. Their field notes combine observations, decisions, and short accounts from different parts of the project.</p>`;
  const sections = groups.map((group, index) => `<p class="reading-paragraph">${index ? "As the work continued, the notes added further details. " : "The first set of notes records several important moments. "}${group.map((word) => decorateReadingSentence(readingExample(word), word)).join(" ")}</p>`).join("");
  return `${intro}${sections}<p class="reading-paragraph">Together, these details show how precise language helps a reader trace evidence, response, and change across a text.</p>`;
}
function readingPassageView() {
  const draft = readingDraft(); if (!draft) return readingLabHub();
  if (draft.source === "document" && !readingDocumentIsOpen()) { readingLabHub("article"); return notice("Re-upload the DOCX to continue. Its review cards are still saved."); }
  if (!readingFlow || readingFlow.kind !== "passage") readingFlow = { kind: "passage", markerOn: true, selection: null };
  const marks = readingMarks(draft), reviewComplete = marks.length && marks.every((mark) => draft.reviewedMarkIds.includes(mark.id)), quizCount = readingQuizItems(draft).length;
  const readingTitle = draft.title || "Practice passage";
  const documentReader = draft.source === "document";
  const sourceLabel = documentReader ? "DOCUMENT" : draft.source === "article" ? "MY ARTICLE" : "VOCABULARY PASSAGE";
  const fullScreen = Boolean(document.fullscreenElement || readingFlow.immersive);
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Reading Lab passage"><section class="modal reading-room-modal ${documentReader ? "document-room-modal" : ""} ${readingFlow.immersive ? "reading-room-fullscreen" : ""}"><div class="reading-room-top"><div><span class="session-label">READING LAB · ${sourceLabel}</span><h2>${esc(readingTitle)}</h2></div><div class="reading-room-actions"><button class="reading-fullscreen-toggle" data-action="reading-toggle-fullscreen" aria-pressed="${fullScreen}" title="Read in full screen">${fullScreen ? "⛶ Exit full screen" : "⛶ Full screen"}</button><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div></div><div class="reading-toolbar"><button class="reading-marker-toggle ${readingFlow.markerOn ? "on" : ""}" data-action="reading-toggle-marker" aria-pressed="${readingFlow.markerOn}">▰ Highlighter: ${readingFlow.markerOn ? "on" : "off"}</button><span id="reading-selection-status">Select text, then use the Highlight button that appears beside it.</span></div><div class="reading-room-grid"><article class="reading-article ${documentReader ? "document-article" : ""}" id="reading-article" tabindex="0">${readingPassageMarkup(draft)}</article><aside class="reading-inspector"><div class="reading-inspector-heading"><span>MARKED FOR REVIEW</span><b id="reading-mark-count">${marks.length}</b></div><p class="reading-inspector-note">Highlighted items become focused cards. Add a note or translation for phrases from your own article.</p><div id="reading-mark-list" class="reading-mark-list"></div><div class="reading-inspector-actions"><button class="secondary-action" data-action="reading-clear-marks" ${marks.length ? "" : "disabled"}>Clear marks</button><button class="modal-cta teal" data-action="reading-review" ${marks.length ? "" : "disabled"}>Review ${marks.length || ""} marked ${marks.length === 1 ? "item" : "items"} →</button><button class="reading-quiz-button" data-action="reading-quiz-start" ${(!quizCount || (marks.length && !reviewComplete)) ? "disabled" : ""}>${marks.length && !reviewComplete ? "Review cards before quiz" : "I reread it — start mini quiz →"}</button></div></aside></div><div id="reading-selection-popover" class="reading-selection-popover" role="toolbar" aria-label="Selected text tools" aria-hidden="true"><button class="reading-selection-mark-button" data-action="reading-add-selection">▰ Highlight</button><button class="reading-selection-dismiss" data-action="reading-dismiss-selection" aria-label="Dismiss selected-text tools">×</button></div></section></div>`;
  renderReadingMarks(); attachReadingSelectionCapture(); updateReadingTokenStates();
}
function hideReadingSelectionPopover() {
  const popover = root.querySelector("#reading-selection-popover");
  if (popover) { popover.classList.remove("visible"); popover.setAttribute("aria-hidden", "true"); }
}
function showReadingSelectionPopover(range) {
  const popover = root.querySelector("#reading-selection-popover"); if (!popover) return;
  const rect = [...range.getClientRects()].at(-1) || range.getBoundingClientRect();
  if (!rect?.width && !rect?.height) return;
  const width = 142, height = 38;
  const left = Math.max(10, Math.min(window.innerWidth - width - 10, rect.left + rect.width / 2 - width / 2));
  const top = Math.max(10, rect.top - height - 9);
  popover.style.left = `${Math.round(left)}px`; popover.style.top = `${Math.round(top)}px`;
  popover.classList.add("visible"); popover.setAttribute("aria-hidden", "false");
}
async function toggleReadingFullscreen() {
  const room = root.querySelector(".reading-room-modal"); if (!room || readingFlow?.kind !== "passage") return;
  if (document.fullscreenElement) {
    try { await document.exitFullscreen(); } catch { /* Fall back to the in-app reader mode. */ }
    readingFlow.immersive = false; readingPassageView(); return;
  }
  if (room.requestFullscreen) {
    try { await room.requestFullscreen(); readingFlow.immersive = false; return; } catch { /* Safari and some embedded browsers use the fallback below. */ }
  }
  readingFlow.immersive = !readingFlow.immersive; readingPassageView();
}
function attachReadingSelectionCapture() {
  const article = root.querySelector("#reading-article"); if (!article) return;
  const popover = root.querySelector("#reading-selection-popover");
  popover?.addEventListener("pointerdown", (event) => event.preventDefault());
  const capture = () => {
    if (!readingFlow?.markerOn) return;
    const selected = window.getSelection?.(), text = normaliseReadingSelection(selected?.toString());
    if (!text || text.length > 280 || !selected?.rangeCount || !article.contains(selected.anchorNode) || !article.contains(selected.focusNode)) { hideReadingSelectionPopover(); return; }
    const all = normaliseReadingSelection(article.textContent), position = all.toLowerCase().indexOf(text.toLowerCase());
    readingFlow.selection = { text, context: position >= 0 ? all.slice(Math.max(0, position - 90), Math.min(all.length, position + text.length + 120)) : text, range: selected.getRangeAt(0).cloneRange() };
    showReadingSelectionPopover(readingFlow.selection.range);
    const status = root.querySelector("#reading-selection-status");
    if (status) status.textContent = "Highlight tool is next to your selection.";
  };
  article.addEventListener("pointerup", () => window.setTimeout(capture, 0));
  article.addEventListener("keyup", capture);
  root.querySelector(".reading-room-modal")?.addEventListener("scroll", hideReadingSelectionPopover, { passive: true });
}
function renderReadingMarks() {
  const draft = readingDraft(), list = root.querySelector("#reading-mark-list"), count = root.querySelector("#reading-mark-count");
  if (!draft || !list) return;
  const marks = readingMarks(draft); if (count) count.textContent = marks.length;
  list.innerHTML = marks.length ? marks.map((mark) => { const word = readingMarkWord(mark), lookupReady = Boolean(readingMarkTranslation(mark) || readingMarkDefinition(mark)); return `<article class="reading-mark-row"><span class="reading-mark-swatch"></span><div><b>${esc(readingMarkLabel(mark))}</b><small>${esc(readingMarkSummary(mark))}</small></div><div>${word ? `<button class="reading-mark-note" data-action="reading-edit-mark" data-id="${mark.id}">Context</button>` : lookupReady ? `<button class="reading-mark-note" data-action="reading-edit-mark" data-id="${mark.id}">View</button>` : `<button class="reading-mark-lookup" data-action="reading-lookup" data-id="${mark.id}">Learn more</button>`}<button class="reading-mark-remove" data-action="reading-remove-mark" data-id="${mark.id}" aria-label="Remove ${esc(readingMarkLabel(mark))}">×</button></div></article>`; }).join("") : `<p class="reading-no-marks">Use the highlighter in the text. Your marked items will stay here.</p>`;
  const review = root.querySelector('[data-action="reading-review"]'), clear = root.querySelector('[data-action="reading-clear-marks"]'), unresolved = unresolvedReadingMarks(draft);
  if (review) {
    review.disabled = !marks.length || Boolean(unresolved.length);
    review.textContent = unresolved.length ? `Use Learn more for ${unresolved.length} ${unresolved.length === 1 ? "item" : "items"} first` : `Review ${marks.length || ""} marked ${marks.length === 1 ? "item" : "items"} →`;
  }
  if (clear) clear.disabled = !marks.length;
}
function updateReadingTokenStates() {
  const marked = new Set(readingMarks().filter((mark) => mark.wordId).map((mark) => mark.wordId));
  root.querySelectorAll(".reading-token").forEach((token) => { const active = marked.has(token.dataset.id); token.classList.toggle("marked", active); token.setAttribute("aria-pressed", String(active)); });
}
function saveReadingDraft() { save(); renderReadingMarks(); updateReadingTokenStates(); }
function addReadingWordMark(wordId) {
  const draft = readingDraft(), word = app.words.find((item) => item.id === wordId); if (!draft || !word) return;
  const existing = readingMarks(draft).find((mark) => mark.wordId === wordId);
  if (existing) draft.marks = readingMarks(draft).filter((mark) => mark.id !== existing.id);
  else draft.marks.push({ id: makeReadingId("mark"), text: word.w, wordId: word.id, note: "", context: readingExample(word), known: false });
  draft.reviewedMarkIds = draft.reviewedMarkIds.filter((id) => readingMarks(draft).some((mark) => mark.id === id)); saveReadingDraft();
}
function addReadingSelection() {
  const draft = readingDraft(), selected = readingFlow?.selection; if (!draft || !selected?.text) return notice("Select text in the passage first.");
  const text = normaliseReadingSelection(selected.text); if (!text) return notice("Select a word, phrase, or sentence first.");
  if (readingMarks(draft).some((mark) => readingMarkLabel(mark).toLowerCase() === text.toLowerCase())) return notice("That item is already marked.");
  const word = app.words.find((item) => item.w.toLowerCase() === text.toLowerCase());
  const mark = { id: makeReadingId("mark"), text, wordId: word?.id || null, note: "", context: selected.context || text, known: false };
  draft.marks.push(mark);
  if (selected.range?.commonAncestorContainer && root.querySelector("#reading-article")?.contains(selected.range.commonAncestorContainer)) {
    try {
      const highlight = document.createElement("mark");
      highlight.className = "reading-selection-mark";
      highlight.dataset.markId = mark.id;
      selected.range.surroundContents(highlight);
    } catch { /* The saved markup will restore complex cross-node selections. */ }
  }
  if (draft.source === "document") snapshotReadingDocument();
  readingFlow.selection = null; window.getSelection?.().removeAllRanges(); hideReadingSelectionPopover(); saveReadingDraft();
  const status = root.querySelector("#reading-selection-status");
  if (status) status.textContent = "Marked for review. Keep reading or add another selection.";
}
function removeReadingMark(markId) {
  const draft = readingDraft(); if (!draft) return;
  if (draft.source === "document") removeReadingDocumentMark(markId);
  draft.marks = readingMarks(draft).filter((mark) => mark.id !== markId); draft.reviewedMarkIds = draft.reviewedMarkIds.filter((id) => id !== markId); saveReadingDraft();
}
function clearReadingMarks() {
  const draft = readingDraft(); if (!draft) return;
  if (draft.source === "document") readingMarks(draft).forEach((mark) => removeReadingDocumentMark(mark.id));
  draft.marks = []; draft.reviewedMarkIds = []; saveReadingDraft(); notice("Marked items cleared from this reading.");
}
function readingLookupView(markId, error = "") {
  const draft = readingDraft(), mark = readingMarks(draft).find((item) => item.id === markId); if (!mark) return readingPassageView();
  const pending = readingFlow?.kind === "lookup" && readingFlow.markId === markId && readingFlow.loading;
  const translation = readingMarkTranslation(mark), definition = readingMarkDefinition(mark);
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal reading-lookup-modal"><button class="icon-button modal-close" data-action="reading-return-passage" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">CONTEXTUAL LOOKUP</p><h2>${esc(readingMarkLabel(mark))}</h2><p class="reading-context">“${esc(mark.context || "Context was not captured.")}”</p>${pending ? `<div class="reading-lookup-loading"><i></i><div><b>Finding the meaning in context…</b><span>Building a Russian translation and a focused study card.</span></div></div>` : error ? `<div class="reading-lookup-error"><b>Couldn’t complete the lookup.</b><span>${esc(error)}</span></div>` : `<div class="reading-lookup-result"><div><span>RUSSIAN TRANSLATION · IN THIS CONTEXT</span><strong>${esc(translation || "Translation was not found")}</strong></div><div><span>ENGLISH EXPLANATION${mark.partOfSpeech ? ` · ${esc(mark.partOfSpeech)}` : ""}</span><strong>${esc(definition || "An explanation was not found")}</strong></div>${mark.example ? `<p>Study cue: ${esc(mark.example)}</p>` : ""}</div>`}<div class="modal-footer"><span class="subtle-note">Only the selected text and its nearby context are sent for this lookup.</span>${pending ? "" : error ? `<button class="modal-cta teal" data-action="reading-lookup-retry" data-id="${mark.id}">Try again</button>` : `<button class="modal-cta teal" data-action="reading-edit-mark" data-id="${mark.id}">Save in review cards →</button>`}</div></div></section></div>`;
}
async function lookUpReadingMark(markId) {
  const draft = readingDraft(), mark = readingMarks(draft).find((item) => item.id === markId), query = readingMarkLabel(mark); if (!mark || !query) return;
  readingFlow = { kind: "lookup", markId, loading: true }; readingLookupView(markId);
  const controller = new AbortController(), timeout = window.setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch("/api/reading-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ text: query, context: String(mark.context || "").slice(0, 1500) }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || "The lookup service is unavailable.");
    const translation = String(payload.translationRu || "").trim(), definition = String(payload.definitionEn || "").trim(), contextSense = String(payload.contextSense || "").trim();
    if (!translation && !definition && !contextSense) throw new Error("The lookup service did not return study information.");
    Object.assign(mark, { translation, definition, contextSense, partOfSpeech: String(payload.partOfSpeech || "").trim(), example: String(payload.studyCue || "").trim(), lookupAt: Date.now() });
    save(); readingFlow = { kind: "lookup", markId, loading: false }; readingLookupView(markId);
  } catch (error) {
    readingFlow = { kind: "lookup", markId, loading: false };
    const message = error?.name === "AbortError" ? "The lookup took longer than 15 seconds. Please try again." : String(error?.message || "Check your connection and try again.");
    readingLookupView(markId, message);
  } finally { window.clearTimeout(timeout); }
}
function readingNoteModal(markId) {
  const draft = readingDraft(), mark = readingMarks(draft).find((item) => item.id === markId); if (!mark) return readingPassageView();
  const word = readingMarkWord(mark), translation = readingMarkTranslation(mark), definition = readingMarkDefinition(mark);
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal reading-note-modal"><button class="icon-button modal-close" data-action="reading-return-passage" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">MARKED FROM READING</p><h2>${esc(readingMarkLabel(mark))}</h2><p class="reading-context">“${esc(mark.context || "Context was not captured.")}”</p>${!word && (translation || definition) ? `<div class="reading-saved-lookup"><span>TRANSLATION</span><b>${esc(translation || "—")}</b>${definition ? `<small>${esc(definition)}</small>` : ""}</div>` : ""}<label class="field-label" for="reading-mark-note">${word ? "MEANING FROM YOUR WORD BANK" : translation ? "YOUR PERSONAL NOTE (OPTIONAL)" : "YOUR NOTE / TRANSLATION"}</label><textarea id="reading-mark-note" class="reading-mark-note-input" maxlength="500" placeholder="Write a short meaning, translation, or reminder…" ${word ? "readonly" : ""}>${esc(word ? definition : mark.note || "")}</textarea><div class="modal-footer"><span class="subtle-note">${word ? "This word already has a saved definition." : translation ? "The looked-up translation is already saved to your review card." : "A note makes this selection into a clearer flashcard and quiz question."}</span><button class="modal-cta teal" data-action="reading-save-note" data-id="${mark.id}">${word ? "Back to passage" : "Save note"}</button></div></div></section></div>`;
}
function saveReadingNote(markId) {
  const draft = readingDraft(), mark = readingMarks(draft).find((item) => item.id === markId); if (!mark) return readingPassageView();
  if (!readingMarkWord(mark)) mark.note = document.querySelector("#reading-mark-note")?.value.trim() || "";
  save(); readingPassageView();
}
function startReadingReview() {
  const draft = readingDraft(), marks = readingMarks(draft); if (!marks.length) return notice("Mark something in the passage first.");
  const unresolved = unresolvedReadingMarks(draft);
  if (unresolved.length) return notice(`Open Learn more for ${unresolved.length} marked ${unresolved.length === 1 ? "item" : "items"} first, so every card has a clear meaning.`);
  readingFlow = { kind: "review", queue: shuffled(marks.map((mark) => mark.id)), index: 0, revealed: false, again: 0, learned: 0 };
  readingReviewView();
}
function activeReadingMark() {
  const draft = readingDraft(), mark = readingMarks(draft).find((item) => item.id === readingFlow?.queue?.[readingFlow.index]);
  return { draft, mark, word: readingMarkWord(mark) };
}
function readingReviewView() {
  const { draft, mark, word } = activeReadingMark(); if (!draft || !mark) return readingPassageView();
  const total = readingFlow.queue.length, back = readingMarkMeaning(mark), context = word?.e || mark.context || "", label = word ? "MEANING" : mark.translation ? "TRANSLATION · THIS CONTEXT" : "YOUR NOTE", definition = !word ? readingMarkDefinition(mark) : "";
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Review marked reading cards"><section class="modal reading-review-modal"><div class="session-top"><span class="session-label">READING REVIEW · ${total} ${total === 1 ? "CARD" : "CARDS"} IN THE LOOP</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress reading-progress"><i style="width:${Math.max(5, mark.known ? 100 : 0)}%"></i></div><div class="reading-review-body"><span class="step-tag reading-step-tag">FROM ${draft.source === "article" ? "YOUR ARTICLE" : "THE PASSAGE"}</span><button class="reading-review-card ${readingFlow.revealed ? "revealed" : ""}" data-action="reading-card-flip"><span class="reading-review-face reading-review-front"><small>MARKED TEXT</small><strong>${esc(readingMarkLabel(mark))}</strong><b>Tap to reveal the context and your note</b></span><span class="reading-review-face reading-review-back"><small>${label}</small><strong>${esc(back)}</strong>${definition && definition !== back ? `<span class="reading-card-definition">${esc(definition)}</span>` : ""}${context ? `<em>“${esc(context)}”</em>` : ""}<b>Decide whether it needs another round.</b></span></button><div class="flashcard-study-actions"><button class="flashcard-again" data-action="reading-rate" data-id="again" ${readingFlow.revealed ? "" : "disabled"}><span>1</span><b>Still learning</b><small>Repeat after two cards</small></button><button class="flashcard-known" data-action="reading-rate" data-id="known" ${readingFlow.revealed ? "" : "disabled"}><span>2</span><b>I know it</b><small>Return to the passage</small></button></div><p class="flashcard-shortcuts">Space — reveal · 1 — still learning · 2 — I know it</p></div></section></div>`;
}
function flipReadingCard() { if (!readingFlow || readingFlow.kind !== "review") return; readingFlow.revealed = !readingFlow.revealed; readingReviewView(); }
function rateReadingCard(result) {
  const { draft, mark } = activeReadingMark(); if (!draft || !mark || !readingFlow.revealed) return;
  readingFlow.queue.splice(readingFlow.index, 1); mark.known = result === "known";
  if (result === "known") readingFlow.learned += 1;
  else { readingFlow.again += 1; readingFlow.queue.splice(Math.min(readingFlow.index + 2, readingFlow.queue.length), 0, mark.id); }
  save(); readingFlow.revealed = false;
  if (!readingFlow.queue.length) return readingReviewResult();
  if (readingFlow.index >= readingFlow.queue.length) readingFlow.index = 0;
  readingReviewView();
}
function readingReviewResult() {
  const draft = readingDraft(), summary = { learned: readingFlow?.learned || 0, again: readingFlow?.again || 0 };
  draft.reviewedMarkIds = readingMarks(draft).map((mark) => mark.id); save(); readingFlow = null;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal reading-result-modal"><div class="result"><div class="result-mark">✓</div><p class="eyebrow">READING REVIEW COMPLETE</p><h2>Return to the same text.</h2><p>${summary.learned} ${summary.learned === 1 ? "item is" : "items are"} now marked clear${summary.again ? ` after ${summary.again} extra ${summary.again === 1 ? "repeat" : "repeats"}` : ""}. Re-read the passage before opening the mini quiz.</p><div class="modal-footer"><span class="subtle-note">Your highlights and notes remain visible in the reader.</span><button class="modal-cta teal" data-action="reading-return-passage">Read again →</button></div></div></section></div>`;
}
function readingQuizItems(draft = readingDraft()) {
  const marks = readingMarks(draft), source = marks.length ? marks : readingWords(draft).map((word) => ({ id: `word-${word.id}`, text: word.w, wordId: word.id, note: "", context: word.e }));
  return source.map((mark) => { const word = readingMarkWord(mark), answer = readingMarkMeaning(mark); return answer ? { mark, word, answer } : null; }).filter(Boolean);
}
function startReadingQuiz() {
  const draft = readingDraft(), marks = readingMarks(draft);
  if (marks.length && !marks.every((mark) => draft.reviewedMarkIds.includes(mark.id))) return notice("Review the marked cards, then re-read the passage before the quiz.");
  const items = shuffled(readingQuizItems(draft)).slice(0, 5); if (!items.length) return notice("Add a note or translation to at least one marked phrase before starting a quiz.");
  const allAnswers = readingQuizItems(draft).map((item) => item.answer).concat(app.words.map((word) => word.d));
  readingFlow = { kind: "quiz", items, allAnswers, index: 0, selected: null, submitted: false, answers: [] };
  readingFlow.questions = items.map((item) => readingQuizQuestion(item));
  readingQuizView();
}
function readingQuizQuestion(item) {
  const alternatives = shuffled([...new Set(readingFlow.allAnswers.filter((answer) => answer !== item.answer))]).slice(0, 3);
  while (alternatives.length < 3) alternatives.push("A detail that is not supported by the passage");
  const options = shuffled([item.answer, ...alternatives]).map((text) => ({ text, correct: text === item.answer }));
  return { ...item, options, correct: options.findIndex((option) => option.correct) };
}
function readingQuizView() {
  const item = readingFlow?.items?.[readingFlow.index]; if (!item) return readingPassageView();
  const question = readingFlow.questions[readingFlow.index], selected = readingFlow.selected, submitted = readingFlow.submitted, correct = selected === question.correct, number = readingFlow.index + 1;
  root.innerHTML = `<div class="overlay reading-overlay" role="dialog" aria-modal="true" aria-label="Reading mini quiz"><section class="modal reading-quiz-modal"><div class="session-top"><span class="session-label">READING MINI QUIZ · QUESTION ${number} OF ${readingFlow.items.length}</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress reading-progress"><i style="width:${Math.round((number - 1) / readingFlow.items.length * 100)}%"></i></div><div class="session-body"><span class="step-tag reading-step-tag">FROM THE PASSAGE</span><h2>What does this mean here?</h2><p class="question-kicker">${item.mark.context ? `“${esc(item.mark.context)}”` : "Use the passage context."}</p><p class="question-kicker"><b>As used in the text, “${esc(readingMarkLabel(item.mark))}” most nearly means:</b></p><div class="answer-list">${question.options.map((option, index) => `<button class="answer-option ${selected === index ? "selected" : ""} ${submitted && index === question.correct ? "correct" : ""} ${submitted && selected === index && index !== question.correct ? "incorrect" : ""}" data-action="reading-quiz-pick" data-id="${index}" ${submitted ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + index)}</span>${esc(option.text)}</button>`).join("")}</div>${submitted ? `<p class="feedback-line ${correct ? "good" : "bad"}">${correct ? "Correct — you understood it in context." : `The best answer is: <b>${esc(question.options[question.correct].text)}</b>.`}</p>` : ""}<div class="session-actions"><button class="modal-cta teal" data-action="reading-quiz-next" ${selected === null ? "disabled" : ""}>${submitted ? (number === readingFlow.items.length ? "Finish quiz →" : "Next question →") : "Check answer"}</button></div></div></section></div>`;
}
function selectReadingQuizAnswer(index) { if (!readingFlow || readingFlow.submitted) return; readingFlow.selected = index; root.querySelectorAll('[data-action="reading-quiz-pick"]').forEach((button) => button.classList.toggle("selected", Number(button.dataset.id) === index)); const next = root.querySelector('[data-action="reading-quiz-next"]'); if (next) next.disabled = false; }
function nextReadingQuiz() {
  if (!readingFlow || readingFlow.selected === null) return;
  if (!readingFlow.submitted) { readingFlow.submitted = true; return readingQuizView(); }
  readingFlow.answers.push(readingFlow.selected);
  if (readingFlow.index === readingFlow.items.length - 1) return readingQuizResult();
  readingFlow.index += 1; readingFlow.selected = null; readingFlow.submitted = false; readingQuizView();
}
function readingQuizResult() {
  const correct = readingFlow.items.filter((_, index) => readingFlow.answers[index] === readingFlow.questions[index].correct).length;
  const total = readingFlow.items.length, percent = Math.round(correct / total * 100);
  readingFlow.items.forEach((item, index) => { if (readingFlow.answers[index] === undefined || readingFlow.answers[index] === readingFlow.questions[index].correct) return; const word = item.word; if (word) { word.needsPractice = true; word.due = true; word.hard = true; word.s = "reviewing"; word.m = Math.min(word.m, 55); } });
  app.accuracy = Math.round((app.accuracy * 3 + percent) / 4); save(); render(); readingFlow = null;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal reading-result-modal"><div class="result"><div class="result-mark">${percent >= 80 ? "✓" : "↻"}</div><p class="eyebrow">READING MINI QUIZ COMPLETE</p><h2>${percent >= 80 ? "Context understood." : "Useful signal for review."}</h2><p>${correct} of ${total} correct. Any missed vocabulary from your Word Bank is now prioritised in Review Queue.</p><div class="result-grid"><div><strong>${percent}%</strong><span>accuracy</span></div><div><strong>${correct}</strong><span>correct</span></div><div><strong>${total - correct}</strong><span>to revisit</span></div></div><div class="modal-footer"><button class="secondary-action" data-action="reading-return-passage">Return to text</button><button class="modal-cta teal" data-action="close">Done</button></div></div></section></div>`;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]"); if (!button) return;
  const action = button.dataset.action, id = button.dataset.id;
  if (action === "reading-lab") readingLabHub();
  if (action === "reading-resume") {
    const draft = readingDraft();
    if (draft?.source === "document" && !readingDocumentIsOpen()) { readingLabHub("article"); notice("Re-upload the DOCX to continue. Its review cards are still saved."); }
    else if (draft?.source === "vocabulary" && !readingFlow) readingPreviewView();
    else readingPassageView();
  }
  if (action === "reading-source") { saveReadingSetupFields(); readingLabHub(id); }
  if (action === "reading-start-vocabulary") createReadingDraft("vocabulary");
  if (action === "reading-start-article") createReadingDraft("article");
  if (action === "reading-preview-next") { readingFlow.index += 1; readingPreviewView(); }
  if (action === "reading-open-passage" || action === "reading-return-passage") { readingFlow = { kind: "passage", markerOn: true, selection: null }; readingPassageView(); }
  if (action === "reading-toggle-marker") { if (readingFlow?.kind !== "passage") return; readingFlow.markerOn = !readingFlow.markerOn; readingPassageView(); }
  if (action === "reading-toggle-fullscreen") toggleReadingFullscreen();
  if (action === "reading-toggle-word") { if (!readingFlow?.markerOn) return notice("Turn on the highlighter to mark a target word."); addReadingWordMark(id); }
  if (action === "reading-add-selection") addReadingSelection();
  if (action === "reading-dismiss-selection") { readingFlow.selection = null; window.getSelection?.().removeAllRanges(); hideReadingSelectionPopover(); }
  if (action === "reading-lookup" || action === "reading-lookup-retry") lookUpReadingMark(id);
  if (action === "reading-edit-mark") readingNoteModal(id);
  if (action === "reading-save-note") saveReadingNote(id);
  if (action === "reading-remove-mark") removeReadingMark(id);
  if (action === "reading-clear-marks") clearReadingMarks();
  if (action === "reading-review") startReadingReview();
  if (action === "reading-card-flip") flipReadingCard();
  if (action === "reading-rate") rateReadingCard(id);
  if (action === "reading-quiz-start") startReadingQuiz();
  if (action === "reading-quiz-pick") selectReadingQuizAnswer(Number(id));
  if (action === "reading-quiz-next") nextReadingQuiz();
});
document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;
  if (readingFlow?.kind === "review") {
    if (event.key === " " || event.key === "Enter") { event.preventDefault(); flipReadingCard(); }
    if (event.key === "1") { event.preventDefault(); rateReadingCard("again"); }
    if (event.key === "2") { event.preventDefault(); rateReadingCard("known"); }
  }
});
document.addEventListener("fullscreenchange", () => {
  const button = root.querySelector('[data-action="reading-toggle-fullscreen"]');
  if (!button || readingFlow?.kind !== "passage") return;
  const fullScreen = Boolean(document.fullscreenElement || readingFlow.immersive);
  button.setAttribute("aria-pressed", String(fullScreen)); button.textContent = fullScreen ? "⛶ Exit full screen" : "⛶ Full screen";
});
window.LexoraReadingLab = { clearSession: () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); readingFlow = null; } };
