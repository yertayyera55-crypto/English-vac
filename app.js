const collectionSeed = [
  ["sat1", "SAT Vocab #1", "#638dff"], ["sat2", "SAT Vocab #2", "#a36af3"], ["ielts", "IELTS Academic", "#51c88a"], ["difficult", "Difficult words", "#f0b867"], ["reading", "Reading practice", "#e579aa"],
].map(([id, name, color]) => ({ id, name, color }));

const wordSeed = [
  { w: "precocious", p: "/prɪˈkəʊʃəs/", pos: "adjective", d: "showing unusually early mental development or talent", tr: "рано развитый", e: "Her precocious interest in climate science changed the conversation at home.", r: ["advanced", "gifted", "mature"], c: ["sat1", "difficult"], s: "learning", m: 42, star: true, hard: true, rec: ["The museum hired a precocious intern who could already analyse conservation reports.", "What does precocious most likely mean here?", ["Developed beyond what is expected", "Careless with details", "Unwilling to learn", "Very difficult to notice"]], ctx: ["At dinner parties, guests were often surprised by the family's precocious seven-year-old, who asked detailed questions about economics and foreign policy.", "Why were the guests surprised?", ["The child had unusually advanced interests for their age", "The child refused to join the conversation", "The family hosted economists", "The questions had no purpose"]], fill: ["Although only eight, Mina gave a remarkably _____ presentation on renewable energy.", ["precocious", "conventional", "ambiguous", "reluctant"]] },
  { w: "abate", p: "/əˈbeɪt/", pos: "verb", d: "to become less intense or widespread", tr: "ослабевать", e: "The wind finally began to abate after midnight.", r: ["diminish", "subside", "ease"], c: ["sat1", "ielts"], s: "reviewing", m: 67, rec: ["Officials expected the traffic to abate once the concert ended.", "What does abate most likely mean here?", ["Become less severe", "Move to another place", "Cause a problem", "Happen suddenly"]], ctx: ["The criticism did not abate after the first apology, so the company released a detailed report.", "What does this tell us about the criticism?", ["It continued at a strong level", "It was a misunderstanding", "It had just begun", "It targeted the report"]], fill: ["The medicine helped the pain _____ within an hour.", ["abate", "accumulate", "clarify", "persist"]] },
  { w: "conventional", p: "/kənˈvenʃənəl/", pos: "adjective", d: "following what is commonly done, expected, or accepted", tr: "традиционный", e: "Rather than take a conventional route, the team tested a new method.", r: ["traditional", "customary", "standard"], c: ["sat1", "ielts", "difficult"], s: "mastered", m: 92, rec: ["The architect rejected conventional offices in favour of open community spaces.", "What does conventional most likely mean here?", ["Usual or traditional", "Expensive to maintain", "Built for many people", "Designed without a plan"]], ctx: ["The director chose a conventional ending because the audience expected the mystery to be resolved.", "Why did the director choose that ending?", ["It matched familiar audience expectations", "It made the story confusing", "It avoided resolving the mystery", "It was unpopular"]], fill: ["A handwritten note is less _____ now, but it can feel more personal.", ["conventional", "resilient", "meticulous", "candid"]] },
  { w: "meticulous", p: "/məˈtɪkjələs/", pos: "adjective", d: "showing great attention to detail; very careful and precise", tr: "тщательный", e: "The editor was meticulous about checking every source.", r: ["thorough", "precise", "scrupulous"], c: ["sat1", "reading"], s: "learning", m: 34, star: true, rec: ["Her meticulous notes included the date, source, and confidence level for each observation.", "What does meticulous most likely mean here?", ["Extremely careful about details", "Easy to understand", "Not based on evidence", "Finished quickly"]], ctx: ["Because the restoration was meticulous, visitors could not tell which sections had been repaired.", "What was the result of the restoration?", ["The repair blended in convincingly", "The repair was unfinished", "Visitors objected", "The value fell"]], fill: ["The researcher kept _____ records so others could repeat the experiment.", ["meticulous", "ambiguous", "conventional", "scarce"]] },
  { w: "ambiguous", p: "/æmˈbɪɡjuəs/", pos: "adjective", d: "having more than one possible meaning; unclear", tr: "неоднозначный", e: "The ambiguous announcement left employees unsure about the schedule.", r: ["unclear", "vague", "equivocal"], c: ["sat2", "ielts", "difficult"], s: "reviewing", m: 58, hard: true, rec: ["The law's ambiguous wording led two judges to different conclusions.", "What does ambiguous most likely mean here?", ["Open to more than one interpretation", "Required by law", "Clearly unfair", "Written long ago"]], ctx: ["When Lee replied, 'That could work,' the team could not tell whether he was enthusiastic or simply polite.", "Why was Lee's reply ambiguous?", ["It did not reveal his real support", "It explained the plan", "It rejected the idea", "It made the plan impossible"]], fill: ["The instructions were so _____ that two groups built different models.", ["ambiguous", "meticulous", "resilient", "candid"]] },
  { w: "candid", p: "/ˈkændɪd/", pos: "adjective", d: "truthful and direct, even when the truth may be uncomfortable", tr: "откровенный", e: "Her candid feedback made the next draft much stronger.", r: ["frank", "honest", "forthright"], c: ["sat2", "reading"], s: "new", m: 8, rec: ["In a candid interview, the athlete discussed mistakes that cost the match.", "What does candid most likely mean here?", ["Open and honest", "Highly emotional", "Carefully rehearsed", "Difficult to hear"]], ctx: ["The adviser was candid about the risks, but she also explained how the student could prepare.", "How did the adviser approach the conversation?", ["She spoke honestly while offering help", "She hid the risks", "She refused advice", "She focused on failures"]], fill: ["Please be _____ about whether the timeline is realistic.", ["candid", "precocious", "conventional", "scarce"]] },
  { w: "resilient", p: "/rɪˈzɪliənt/", pos: "adjective", d: "able to recover quickly from difficulty or change", tr: "устойчивый", e: "The resilient coastal plants survived another harsh winter.", r: ["adaptable", "tough", "durable"], c: ["ielts", "difficult"], s: "learning", m: 38, star: true, hard: true, rec: ["The small business proved resilient, finding new customers after the market changed.", "What does resilient most likely mean here?", ["Able to adapt and recover", "Unable to change", "Popular with customers", "Carefully planned"]], ctx: ["After losing its main supplier, the company reorganised production and met every order by Friday.", "Which quality does this show?", ["Resilience in the face of disruption", "A conventional preference", "Unclear communication", "An early talent"]], fill: ["A _____ community can recover more quickly after a natural disaster.", ["resilient", "ambiguous", "candid", "meticulous"]] },
  { w: "pragmatic", p: "/præɡˈmætɪk/", pos: "adjective", d: "focused on practical results rather than theories or ideals", tr: "прагматичный", e: "They took a pragmatic approach and repaired the bridge first.", r: ["practical", "realistic", "sensible"], c: ["ielts", "reading"], s: "mastered", m: 88, rec: ["Instead of debating the perfect design, the team made a pragmatic choice that fit the budget.", "What does pragmatic most likely mean here?", ["Guided by practical limits", "Interested in abstract ideas", "Unwilling to decide", "Concerned with tradition"]], ctx: ["The mayor supported the plan because it could be completed before winter, even though it was not the most ambitious option.", "Why was this decision pragmatic?", ["It prioritized a workable result", "It ignored all limits", "It chose the ideal plan", "It avoided deciding"]], fill: ["Given the budget, repairing the system was the most _____ choice.", ["pragmatic", "precocious", "ambiguous", "candid"]] },
  { w: "scarce", p: "/skeəs/", pos: "adjective", d: "available in small quantities; hard to find", tr: "дефицитный", e: "During the drought, clean water became scarce.", r: ["limited", "rare", "insufficient"], c: ["ielts", "difficult"], s: "new", m: 12, hard: true, rec: ["Affordable homes were scarce near the city centre.", "What does scarce most likely mean here?", ["In short supply", "Well designed", "Near the centre", "Easy to afford"]], ctx: ["Because rehearsal space was scarce, each band could reserve only two hours a week.", "What effect did scarcity have?", ["It limited time each band could use", "It improved comfort", "It gave extra time", "It stopped rehearsal"]], fill: ["When reliable data are _____, researchers must be cautious.", ["scarce", "meticulous", "conventional", "resilient"]] },
  { w: "advocate", p: "/ˈædvəkeɪt/", pos: "verb", d: "to publicly support or recommend an action or idea", tr: "выступать за", e: "Many scientists advocate protecting urban green spaces.", r: ["support", "promote", "endorse"], c: ["sat2", "ielts"], s: "reviewing", m: 61, rec: ["The doctor advocates shorter meetings so patients have more time for questions.", "What does advocates most likely mean here?", ["Publicly supports", "Studies carefully", "Strongly doubts", "Has completed"]], ctx: ["At the council meeting, Omar presented research and urged members to protect the wetland.", "What role is Omar taking?", ["He is advocating for protection", "He is describing a failure", "He is making it ambiguous", "He is seeking scarce data"]], fill: ["The report will _____ a gradual shift to renewable energy.", ["advocate", "abate", "accumulate", "conceal"]] },
  { w: "nuance", p: "/ˈnjuːɑːns/", pos: "noun", d: "a subtle difference in meaning, expression, or tone", tr: "оттенок значения", e: "The translator captured the nuance of the speaker's hesitation.", r: ["subtlety", "shade", "distinction"], c: ["sat2", "reading"], s: "learning", m: 46, rec: ["The actor changed the nuance of the line by pausing before the final word.", "What does nuance most likely mean here?", ["A small shade of meaning", "The main plot", "A factual error", "A loud sound"]], ctx: ["Both proposals support public transport, but one focuses on fares and the other late-night service.", "What is the nuance between them?", ["They prioritize different benefits", "They have no goal in common", "One rejects transport", "They are identical"]], fill: ["Knowing the cultural _____ helped her avoid an unintended insult.", ["nuance", "scarcity", "convention", "resilience"]] },
];

const freshWorkspace = () => ({ collections: structuredClone(collectionSeed), words: structuredClone(wordSeed).map((x) => ({ ...x, id: x.w, due: x.s !== "mastered" })), streak: 7, accuracy: 82, theme: "dark" });
const app = { ...freshWorkspace(), activeCollection: "all", activeStatus: "all", query: "", starredOnly: false, showAll: false };
const root = document.querySelector("#overlay-root"), toast = document.querySelector("#toast");
const storageKey = "lexora-state";
const cloud = { enabled: false, client: null, user: null, state: "local", syncTimer: null, isLoading: false, needsWorkspaceChoice: false };
let session, test, cardDeck, toastTimer;
const esc = (v = "") => String(v).replace(/[&<>'"]/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[x]);
const coll = (id) => app.collections.find((x) => x.id === id);
const collectionWords = (id = app.activeCollection) => id === "all" ? app.words : app.words.filter((w) => w.c.includes(id));
const due = (w) => w.due || w.s === "reviewing";
const needsPractice = (w) => w.needsPractice === true || (w.needsPractice !== false && w.s !== "mastered");
const practiceWords = (id = app.activeCollection) => collectionWords(id).filter(needsPractice);
const statusColor = (s) => ({ new: "#638dff", learning: "#a66bef", reviewing: "#eebc63", mastered: "#58ca89" })[s];
function workspaceState() { return { words: app.words, collections: app.collections, streak: app.streak, accuracy: app.accuracy, theme: app.theme }; }
function applyWorkspace(state) {
  if (!state || !Array.isArray(state.words) || !Array.isArray(state.collections)) return false;
  Object.assign(app, { ...freshWorkspace(), words: state.words, collections: state.collections, streak: Number(state.streak) || 0, accuracy: Number(state.accuracy) || 0, theme: state.theme === "light" ? "light" : "dark", activeCollection: "all", activeStatus: "all", query: "", starredOnly: false, showAll: false });
  return true;
}
function resetWorkspace() { applyWorkspace(freshWorkspace()); }
function saveLocal() { try { localStorage.setItem(storageKey, JSON.stringify(workspaceState())); } catch {} }
function load() { try { applyWorkspace(JSON.parse(localStorage.getItem(storageKey))); } catch {} }
function save() { saveLocal(); if (cloud.enabled && cloud.user && !cloud.isLoading) queueCloudSave(); }
function notice(s) { toast.textContent = s; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2700); }
function renderTheme() {
  const light = app.theme === "light", toggle = document.querySelector("#theme-toggle");
  document.documentElement.dataset.theme = light ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#f5f7fb" : "#081121");
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", String(light));
  toggle.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} mode`);
  toggle.querySelector(".theme-symbol").textContent = light ? "☾" : "☀";
  toggle.querySelector("span:last-child").textContent = light ? "Dark" : "Light";
}
function setTheme(theme) { app.theme = theme === "light" ? "light" : "dark"; renderTheme(); save(); notice(`${app.theme === "light" ? "Light" : "Dark"} mode is on.`); }

function initials(name = "") { return name.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "LX"; }
function cloudReady() { const config = window.LEXORA_SUPABASE_CONFIG || {}; return Boolean(config.url && config.anonKey && window.supabase?.createClient); }
function renderAccount() {
  const name = cloud.user?.user_metadata?.full_name || cloud.user?.email?.split("@")[0] || "Aidar";
  document.querySelector("#profile-avatar").textContent = initials(name);
  document.querySelector("#profile-name").textContent = name;
  document.querySelector("#profile-subtitle").textContent = cloud.user ? "Private cloud workspace" : "Personal workspace";
  const status = document.querySelector("#sync-status");
  const label = cloud.user ? (cloud.state === "saving" ? "Saving…" : cloud.state === "error" ? "Saved in browser" : "Cloud saved") : "Browser only";
  status.dataset.state = cloud.user ? cloud.state : "local";
  status.querySelector("span").textContent = label;
}
function configureCloud() {
  if (!cloudReady()) return false;
  const config = window.LEXORA_SUPABASE_CONFIG;
  cloud.client = window.supabase.createClient(config.url, config.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  cloud.enabled = true;
  cloud.client.auth.onAuthStateChange((event, sessionData) => {
    if (event === "SIGNED_OUT") {
      cloud.user = null; cloud.state = "local"; load(); render(); authView();
    } else if (sessionData?.user && sessionData.user.id !== cloud.user?.id) {
      window.setTimeout(() => useSession(sessionData), 0);
    }
  });
  return true;
}
async function boot() {
  load();
  if (!configureCloud()) { render(); return; }
  const { data, error } = await cloud.client.auth.getSession();
  if (error) notice("Could not restore the cloud session. Please sign in again.");
  if (data.session) await useSession(data.session); else authView();
}
async function useSession(sessionData) {
  cloud.user = sessionData.user;
  cloud.state = "saving";
  cloud.isLoading = true;
  renderAccount();
  const { data, error } = await cloud.client.from("user_workspaces").select("state").eq("user_id", cloud.user.id).maybeSingle();
  cloud.isLoading = false;
  if (error) {
    cloud.state = "error"; renderAccount(); notice("Cloud storage could not be opened. Your browser copy is still safe."); return;
  }
  if (data?.state) {
    applyWorkspace(data.state);
    cloud.state = "cloud";
    cloud.needsWorkspaceChoice = false;
    render(); close(); notice("Your private cloud workspace is ready."); return;
  }
  cloud.needsWorkspaceChoice = true;
  render(); firstWorkspaceView();
}
async function createCloudWorkspace(migrateBrowserData) {
  if (!cloud.user) return;
  if (!migrateBrowserData) resetWorkspace();
  cloud.needsWorkspaceChoice = false;
  cloud.state = "saving"; render();
  await pushCloud(true);
  if (cloud.state === "cloud") { close(); notice(migrateBrowserData ? "Your browser library is now private and synced." : "A new private workspace is ready."); }
}
function queueCloudSave() {
  clearTimeout(cloud.syncTimer);
  cloud.state = "saving"; renderAccount();
  cloud.syncTimer = setTimeout(() => pushCloud(false), 650);
}
async function pushCloud(showFeedback = false) {
  if (!cloud.client || !cloud.user || cloud.isLoading) return;
  cloud.state = "saving"; renderAccount();
  const { error } = await cloud.client.from("user_workspaces").upsert({ user_id: cloud.user.id, state: workspaceState() }, { onConflict: "user_id" });
  cloud.state = error ? "error" : "cloud";
  renderAccount();
  if (error && showFeedback) notice("Cloud save failed. Your browser copy remains available.");
  if (!error && showFeedback) saveLocal();
}
function authView(mode = "signin") {
  const signup = mode === "signup";
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal auth-modal"><div class="modal-intro"><div class="auth-wordmark"><i></i>LEXORA CLOUD</div><p class="eyebrow">PRIVATE VOCABULARY WORKSPACE</p><h2>${signup ? "Create your private workspace." : "Your words, on every device."}</h2><p>${signup ? "Create a separate account for yourself. Your friend will have a different account and will never see your words or progress." : "Sign in to open your own vocabulary library. Each account has an isolated database."}</p><label class="field-label">EMAIL</label><input id="auth-email" type="email" autocomplete="email" placeholder="you@example.com"><label class="field-label">PASSWORD</label><input id="auth-password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" placeholder="At least 8 characters"><div class="auth-security-note"><b>●</b><span>Words, collections, and progress are stored under your account only. Keep the password private.</span></div><div class="modal-footer"><span class="subtle-note">${signup ? "You may need to confirm your email." : "New here? Create an account."}</span><button class="modal-cta" data-action="auth-submit" data-mode="${signup ? "signup" : "signin"}">${signup ? "Create account" : "Sign in"}</button></div><p class="auth-switch">${signup ? "Already have an account?" : "No account yet?"} <button data-action="auth-switch" data-mode="${signup ? "signin" : "signup"}">${signup ? "Sign in" : "Create one"}</button></p></div></section></div>`;
  window.setTimeout(() => document.querySelector("#auth-email")?.focus(), 0);
}
function firstWorkspaceView() {
  const count = app.words.length;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal auth-modal"><div class="modal-intro"><div class="auth-wordmark"><i></i>LEXORA CLOUD</div><p class="eyebrow">FIRST CLOUD SYNC</p><h2>Choose what belongs in this account.</h2><p>This account does not have a cloud library yet. Keep data private by choosing whether the ${count} words currently in this browser should move into this account.</p><div class="account-info"><div class="account-line"><span><b>Move this browser library</b><small>Words, collections, and progress will be saved to this account.</small></span><button class="modal-cta" data-action="cloud-workspace" data-mode="migrate">Use ${count} words</button></div><div class="account-line"><span><b>Start a separate library</b><small>Creates a fresh Lexora study set for this account.</small></span><button class="secondary-action" data-action="cloud-workspace" data-mode="fresh">Start fresh</button></div></div></div></section></div>`;
}
async function authenticate(mode) {
  const email = document.querySelector("#auth-email")?.value.trim();
  const password = document.querySelector("#auth-password")?.value;
  if (!email || !password || password.length < 8) return notice("Enter an email and a password with at least 8 characters.");
  const button = root.querySelector('[data-action="auth-submit"]'); if (button) { button.disabled = true; button.textContent = "Please wait…"; }
  const request = mode === "signup" ? cloud.client.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` } }) : cloud.client.auth.signInWithPassword({ email, password });
  const { data, error } = await request;
  if (error) { if (button) { button.disabled = false; button.textContent = mode === "signup" ? "Create account" : "Sign in"; } return notice(error.message); }
  if (mode === "signup" && !data.session) { notice("Check your email, confirm the account, then sign in."); return authView("signin"); }
  if (data.session) await useSession(data.session);
}
async function signOut() { if (!cloud.client) return; await cloud.client.auth.signOut(); }
function profileModal() {
  if (!cloud.user) return cloud.enabled ? authView() : notice("Add Supabase project details in supabase-config.js to enable private cloud accounts.");
  const email = esc(cloud.user.email || "");
  const state = cloud.state === "error" ? "Browser backup only" : cloud.state === "saving" ? "Saving changes…" : "Cloud saved";
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal auth-modal"><button class="icon-button modal-close" data-action="close" aria-label="Close">×</button><div class="modal-intro"><p class="eyebrow">ACCOUNT & BACKUP</p><h2>Your private workspace.</h2><p>Only the signed-in account can read or change this library. A browser backup is also kept on this device.</p><div class="account-info"><div class="account-line"><span><b>${email}</b><small>Signed-in Lexora account</small></span><span class="account-state ${cloud.state === "error" ? "warning" : ""}">${state}</span></div></div><div class="account-actions"><button class="secondary-action" data-action="sync-now">Sync now</button><button class="secondary-action" data-action="export-backup">Download backup</button><button class="secondary-action danger-outline" data-action="sign-out">Sign out</button></div></div></section></div>`;
}
function downloadBackup() {
  const file = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), lexora: workspaceState() }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file), link = document.createElement("a");
  link.href = url; link.download = `lexora-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notice("Backup downloaded. Keep it somewhere safe.");
}

function renderCollections() {
  document.querySelector("#collection-nav").innerHTML = app.collections.map((c) => `<button data-action="collection" data-id="${c.id}" class="${app.activeCollection === c.id ? "active" : ""}" style="--collection-color:${c.color}"><i></i><span>${esc(c.name)}</span><b>${collectionWords(c.id).length}</b></button>`).join("");
  const filter = document.querySelector("#collection-filter"); filter.innerHTML = `<option value="all">All collections</option>${app.collections.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}`; filter.value = app.activeCollection;
}
function renderStats() {
  const practiceCount = practiceWords().length;
  document.querySelector("#total-words").textContent = app.words.length;
  document.querySelector("#due-words").textContent = app.words.filter(due).length;
  document.querySelector("#nav-due").textContent = app.words.filter(due).length;
  document.querySelector("#mastered-words").textContent = app.words.filter((w) => w.s === "mastered").length;
  document.querySelector("#accuracy-value").textContent = `${app.accuracy}%`; document.querySelector("#streak-value").textContent = app.streak;
  document.querySelector("#daily-action-count").textContent = practiceCount ? `${practiceCount} words ready to choose from` : "sort cards to build a queue";
  document.querySelector("#review-action-count").textContent = `${practiceCount} ${practiceCount === 1 ? "word needs" : "words need"} practice`;
}
function matches() { const q = app.query.trim().toLowerCase(); return collectionWords().filter((w) => (app.activeStatus === "all" || w.s === app.activeStatus) && (!app.starredOnly || w.star) && (!q || `${w.w} ${w.d} ${w.r.join(" ")}`.toLowerCase().includes(q))); }
function renderWords() {
  const all = matches(), words = app.showAll ? all : all.slice(0, 8), list = document.querySelector("#word-list");
  document.querySelector("#word-bank-count").textContent = `${all.length} ${all.length === 1 ? "word" : "words"}`;
  const more = document.querySelector(".show-more"); more.style.visibility = all.length > 8 ? "visible" : "hidden"; more.innerHTML = app.showAll ? `Show fewer words <span>↑</span>` : `Show all ${all.length} words <span>→</span>`;
  list.innerHTML = words.length ? words.map((w, i) => `<article class="word-row" style="animation-delay:${i * 30}ms"><button class="word-open" data-action="edit" data-id="${w.id}"><span class="word-name"><strong>${esc(w.w)}</strong><small>${esc(w.pos)} · ${esc(w.d)}</small></span></button><span class="status ${w.s}">${w.s}</span><span class="mastery" style="--word-color:${statusColor(w.s)}"><i class="line"><i style="width:${w.m}%"></i></i><b>${w.m}%</b></span><button class="word-star ${w.star ? "starred" : ""}" data-action="star" data-id="${w.id}" aria-label="Star ${esc(w.w)}">${w.star ? "★" : "☆"}</button></article>`).join("") : `<div class="empty-words">No words match those filters. <button data-action="clear">Clear filters</button></div>`;
}
function renderProgress() {
  const id = app.activeCollection === "all" ? "sat1" : app.activeCollection, words = collectionWords(id), average = words.length ? Math.round(words.reduce((n, w) => n + w.m, 0) / words.length) : 0;
  document.querySelector("#progress-title").textContent = coll(id)?.name || "Your library"; document.querySelector("#collection-progress").textContent = `${average}%`; document.querySelector(".ring").style.background = `conic-gradient(var(--blue) 0 ${average}%, var(--surface-3) ${average}% 100%)`;
  document.querySelector("#collection-mastered").textContent = `${words.filter((w) => w.s === "mastered").length} / ${words.length}`;
  [["new", "new-count"], ["learning", "learning-count"], ["reviewing", "review-count"]].forEach(([s, el]) => document.querySelector(`#${el}`).textContent = words.filter((w) => w.s === s).length);
}
function renderCalendar() { const a = [0,0,1,2,0,3,1,0,2,0,0,1,2,3,1,0,0,2,3,0,1,2,0,3,1,2,3,0,1,0,2,3,0,1,0]; document.querySelector("#calendar").innerHTML = a.map((x, i) => `<span data-level="${x}" class="${i === 25 ? "today" : ""}"></span>`).join(""); }
function render() { renderTheme(); renderCollections(); renderStats(); renderWords(); renderProgress(); renderCalendar(); }
function close() { root.innerHTML = ""; session = test = cardDeck = null; }

function taskVariants(w) {
  if (Array.isArray(w.tasks) && w.tasks.length) return w.tasks.filter((task) => task?.prompt && task?.options?.length >= 2);
  return [
    { type: "meaning", prompt: w.rec[0], question: w.rec[1], options: w.rec[2], correct: 0 },
    { type: "inference", prompt: w.ctx[0], question: w.ctx[1], options: w.ctx[2], correct: 0 },
    { type: "completion", prompt: w.fill[0], question: "Which word completes the sentence precisely?", options: w.fill[1], correct: 0 },
  ];
}
function shuffled(items) { return [...items].sort(() => Math.random() - .5); }
function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }
function sessionTasks(w) {
  const variants = taskVariants(w);
  const coreTypes = ["meaning", "inference", "completion"];
  const picks = coreTypes.map((type) => {
    const matching = variants.filter((task) => task.type === type);
    return matching.length ? randomItem(matching) : null;
  }).filter(Boolean);
  return [...picks, ...shuffled(variants.filter((task) => !picks.includes(task)))].slice(0, 3);
}
function dailySetup() {
  const words = practiceWords(), total = words.length;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">DAILY SESSION</p><h2>Choose today’s practice.</h2><p>${total ? `${total} ${total === 1 ? "word is" : "words are"} currently marked for practice. Daily Session lets you choose the size of the set — it is never fixed at three words.` : "Your practice queue is empty. Scan your cards first and mark the words you want to practise."}</p><div class="account-info"><div class="account-line"><span><b>Practice queue</b><small>Only words marked “I don’t know it” or not yet mastered are included.</small></span><span class="account-state">${total} words</span></div></div><label class="field-label">HOW MANY WORDS?</label><select id="daily-count" ${total ? "" : "disabled"}><option value="1">1 focused word</option><option value="5" selected>5 words</option><option value="10">10 words</option><option value="20">20 words</option><option value="all">All ${total} words in my queue</option></select><div class="modal-footer"><button class="secondary-action" data-action="scan-cards">Scan cards first</button><button class="modal-cta" data-action="begin-daily" ${total ? "" : "disabled"}>Start my practice</button></div></div></section></div>`;
}
function emptyReviewView() { root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">REVIEW QUEUE</p><h2>Nothing is waiting to be reviewed.</h2><p>Use cards to mark unfamiliar words. Only those words will return in Review Queue and future practice.</p><div class="modal-footer"><span class="subtle-note">You can change a card’s result anytime.</span><button class="modal-cta" data-action="scan-cards">Open cards</button></div></div></section></div>`; }
function startSession(kind = "daily", providedWords) {
  const pool = providedWords || practiceWords();
  const queue = [...pool].sort((a,b) => Number(due(b)) - Number(due(a)) || Number(b.hard) - Number(a.hard));
  if (!queue.length) return emptyReviewView();
  session = { kind, queue, taskOrder: queue.map((word) => sessionTasks(word)), wi: 0, step: 0, picked: null, input: "", submitted: false, score: 0, scored: 0, improved: 0, missed: new Set(), opening: true, animate: false }; sessionView();
}
function beginDailySession() { const count = document.querySelector("#daily-count")?.value || "all", words = practiceWords(), chosen = count === "all" ? words : words.slice(0, Number(count)); startSession("daily", chosen); }
function startReview() { startSession("review", practiceWords()); }
function startCards() { const words = collectionWords(); if (!words.length) return notice("Add a word before opening cards."); cardDeck = { queue: shuffled(words), index: 0, revealed: false, known: 0, unknown: 0, unknownIds: [] }; flashcardView(); }
function flashcardView() {
  const word = cardDeck.queue[cardDeck.index], progress = Math.round(cardDeck.index / cardDeck.queue.length * 100);
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal session-modal card-modal"><div class="session-top"><span class="session-label">CARD SORT · ${cardDeck.index + 1} OF ${cardDeck.queue.length}</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress"><i style="width:${progress}%"></i></div><div class="session-body"><span class="step-tag">BUILD YOUR REVIEW QUEUE</span><button class="flashcard ${cardDeck.revealed ? "revealed" : ""}" data-action="reveal-card" aria-label="${cardDeck.revealed ? "Card answer revealed" : "Reveal answer"}"><span class="flashcard-side flashcard-front"><small>WORD</small><strong>${esc(word.w)}</strong><em>${esc(word.p)}</em><b>${cardDeck.revealed ? "Tap to hide answer" : "Tap to reveal meaning"}</b></span><span class="flashcard-side flashcard-back"><small>MEANING</small><strong>${esc(word.d)}</strong><em>${esc(word.e)}</em></span></button><p class="card-help">After revealing the answer, decide whether this word should return in your practice queue.</p><div class="card-rating"><button class="card-rate unknown" data-action="rate-card" data-id="unknown" ${cardDeck.revealed ? "" : "disabled"}><span>↻</span><b>I don’t know it</b><small>Keep it for review</small></button><button class="card-rate known" data-action="rate-card" data-id="known" ${cardDeck.revealed ? "" : "disabled"}><span>✓</span><b>I know it</b><small>Remove from review</small></button></div></div></section></div>`;
}
function rateCard(result) {
  const word = cardDeck.queue[cardDeck.index], known = result === "known";
  word.needsPractice = !known; word.due = !known; word.hard = !known;
  word.s = known ? "mastered" : "reviewing"; word.m = known ? Math.max(85, word.m) : Math.min(50, word.m);
  if (known) cardDeck.known++; else { cardDeck.unknown++; cardDeck.unknownIds.push(word.id); }
  save(); cardDeck.index++; cardDeck.revealed = false;
  if (cardDeck.index >= cardDeck.queue.length) return cardResult(); flashcardView();
}
function cardResult() {
  const ids = cardDeck.unknownIds, unknown = ids.length;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><div class="result"><div class="result-mark">✓</div><p class="eyebrow">CARD SORT COMPLETE</p><h2>Your review queue is ready.</h2><p>${cardDeck.known} ${cardDeck.known === 1 ? "word is" : "words are"} marked known and ${unknown} ${unknown === 1 ? "word is" : "words are"} marked for practice.</p><div class="result-grid"><div><strong>${cardDeck.known}</strong><span>known</span></div><div><strong>${unknown}</strong><span>need practice</span></div><div><strong>${cardDeck.queue.length}</strong><span>cards sorted</span></div></div><button class="modal-cta" data-action="practice-card-unknown" ${unknown ? "" : "disabled"}>Practice ${unknown} unknown ${unknown === 1 ? "word" : "words"} →</button><div class="modal-footer"><span class="subtle-note">Only words marked unknown will appear in Review Queue.</span><button class="secondary-action" data-action="close">Back to workspace</button></div></div></section></div>`;
}
function stepQuestion(w, step) { return step >= 1 && step <= 3 ? session.taskOrder[session.wi][step - 1] : null; }
function options(q) { return `<div class="answer-list">${q.options.map((x,i) => `<button class="answer-option ${session.picked === i ? "selected" : ""}" data-action="pick" data-id="${i}" ${session.submitted ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65+i)}</span>${esc(x)}</button>`).join("")}</div>`; }
function sessionView() {
  const opening = Boolean(session.opening), animate = Boolean(session.animate); session.opening = false; session.animate = false;
  const w = session.queue[session.wi], q = stepQuestion(w, session.step), progress = Math.round((session.wi * 6 + session.step) / (session.queue.length * 6) * 100); let content;
  if (session.step === 0) content = `<span class="step-tag">01 · LEARN</span><h2>${esc(w.w)}</h2><span class="phonetic">${esc(w.p)}</span><p class="word-meta"><b>${esc(w.pos)}</b> · ${esc(w.tr)}</p><p class="definition">${esc(w.d)}.</p><div class="example-box">“${esc(w.e)}”</div><div class="related">RELATED <span>${w.r.map(esc).join("</span><span>")}</span></div><div class="session-actions"><button class="modal-cta" data-action="submit">I understand this word →</button></div>`;
  else if (session.step === 4) { const right = session.input.trim().toLowerCase() === w.w; content = `<span class="step-tag">05 · ACTIVE RECALL</span><h2>Can you retrieve it?</h2><p class="question-kicker">Type the word that means: <b>${esc(w.d)}</b>.</p><input class="recall-input" id="answer-input" value="${esc(session.input)}" placeholder="Type the word…" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" dir="ltr" ${session.submitted ? "disabled" : ""}/><p class="hint">Pronunciation: ${esc(w.p)}</p>${session.submitted ? `<p class="feedback-line ${right ? "good" : "bad"}">${right ? "Exactly — you recalled it without a cue." : `The word was <b>${esc(w.w)}</b>. It will return sooner.`}</p>` : ""}<div class="session-actions"><button class="modal-cta" data-action="${session.submitted ? "advance" : "submit"}" ${!session.input.trim() ? "disabled" : ""}>${session.submitted ? "Continue →" : "Check recall"}</button></div>`; }
  else if (session.step === 5) content = `<span class="step-tag">06 · PERSONAL USE</span><h2>Make it yours.</h2><p class="question-kicker">Write one sentence using <b>${esc(w.w)}</b>. Use a situation you could genuinely encounter.</p><textarea class="use-textarea" id="answer-input" placeholder="Write your sentence…" autocomplete="off" autocapitalize="sentences" autocorrect="on" spellcheck="true" dir="ltr" ${session.submitted ? "disabled" : ""}>${esc(session.input)}</textarea><p class="hint">Your sentence is private to this workspace.</p>${session.submitted ? `<p class="feedback-line good">Nice. Personal examples create a stronger memory path.</p>` : ""}<div class="session-actions"><button class="modal-cta green" data-action="${session.submitted ? "advance" : "submit"}" ${session.input.trim().length < 12 ? "disabled" : ""}>${session.submitted ? "Finish word →" : "Save my example"}</button></div>`;
  else { const meta = { meaning: ["02 · MEANING IN CONTEXT", "Spot the meaning."], inference: ["03 · CONTEXTUAL INFERENCE", "Read the situation."], completion: ["04 · SENTENCE COMPLETION", "Choose the precise word."] }[q.type] || ["02 · WORD IN CONTEXT", "Reason from the passage."]; const right = session.picked === q.correct; content = `<span class="step-tag">${meta[0]}</span><h2>${meta[1]}</h2><p class="question-kicker">${esc(q.prompt)}</p><p class="question-kicker"><b>${esc(q.question || "Which answer is best supported by the text?")}</b></p>${options(q)}${session.submitted ? `<p class="feedback-line ${right ? "good" : "bad"}">${right ? "Correct. You caught the intended meaning." : `${esc(w.w)} means ${esc(w.d)}.`}</p>` : ""}<div class="session-actions"><button class="modal-cta" data-action="${session.submitted ? "advance" : "submit"}" ${session.picked === null ? "disabled" : ""}>${session.submitted ? "Continue →" : "Check answer"}</button></div>`; }
  root.innerHTML = `<div class="overlay ${opening ? "" : "session-overlay"}" role="dialog" aria-modal="true"><section class="modal session-modal ${opening ? "session-opening" : ""}"><div class="session-top"><span class="session-label">${session.kind === "review" ? "REVIEW QUEUE" : "DAILY SESSION"} · ${session.wi+1} OF ${session.queue.length} WORDS</span><button class="icon-button session-close" data-action="close" aria-label="Close">×</button></div><div class="session-progress"><i style="width:${progress}%"></i></div><div class="session-body ${animate ? "task-enter" : ""}">${content}</div></section></div>`;
  const input = document.querySelector("#answer-input"); if (input && !session.submitted) { const submitButton = root.querySelector('[data-action="submit"]'); input.focus(); input.addEventListener("input", () => { session.input = input.value; if (submitButton) submitButton.disabled = input.value.trim().length < (session.step === 5 ? 12 : 1); }); }
}
function submit() { if (session.step === 0) return advance(); const w = session.queue[session.wi]; let good = true; if (session.step >= 1 && session.step <= 3) good = session.picked === stepQuestion(w, session.step).correct; if (session.step === 4) good = session.input.trim().toLowerCase() === w.w; if (session.step === 5) good = session.input.trim().length >= 12; if (session.step) { session.scored++; if (good) session.score++; else session.missed.add(w.id); } session.submitted = true; sessionView(); }
function advance() { const w = session.queue[session.wi]; if (session.step === 5) { const gain = Math.max(4, Math.round(session.score / Math.max(session.scored, 1) * 9)); const missed = session.missed.has(w.id); w.m = Math.min(100, w.m + gain); w.needsPractice = missed; w.due = missed; w.hard = missed; w.s = missed ? "reviewing" : "mastered"; session.improved++; } if (session.step === 5 && session.wi === session.queue.length - 1) return sessionResult(); if (session.step === 5) { session.wi++; session.step = 0; } else session.step++; Object.assign(session, { picked: null, input: "", submitted: false, animate: true }); sessionView(); }
function selectSessionAnswer(index) { session.picked = index; root.querySelectorAll('[data-action="pick"]').forEach((button) => button.classList.toggle("selected", Number(button.dataset.id) === index)); const submitButton = root.querySelector('[data-action="submit"]'); if (submitButton) submitButton.disabled = false; }
function sessionResult() { const accuracy = Math.round(session.score / Math.max(session.scored, 1) * 100); app.accuracy = Math.round((app.accuracy*3 + accuracy)/4); app.streak++; save(); render(); root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><div class="result"><div class="result-mark">✓</div><p class="eyebrow">SESSION COMPLETE</p><h2>Meaning made memorable.</h2><p>You moved through every layer of understanding — not just the definition.</p><div class="result-grid"><div><strong>${accuracy}%</strong><span>session accuracy</span></div><div><strong>${session.queue.length}</strong><span>words learned</span></div><div><strong>${session.improved}</strong><span>words improved</span></div></div><p class="next-review">Next review: <b>tomorrow at 09:00</b> · difficult answers return sooner.</p><button class="modal-cta green" data-action="close">Back to my workspace</button></div></section></div>`; }

function testConfig() {
  const initialCollection = app.activeCollection === "all" ? app.collections[0]?.id : app.activeCollection;
  if (!initialCollection) return notice("Create a collection before starting a test.");
  test = { collection: initialCollection };
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">TEST LAB</p><h2>Review first. Then mix it up.</h2><p>First, you will revisit every selected word. Then Lexora mixes questions from the whole set, so you never work through one word at a time.</p><label class="field-label test-collection-label">VOCABULARY COLLECTION <span>${app.collections.length} available</span></label><div class="test-collection-tools"><input id="test-collection-search" type="search" placeholder="Search collections…" autocomplete="off" aria-label="Search collections"></div><div class="collection-choice test-collection-choice" id="test-collections"></div><div class="config-grid"><label><span class="field-label">QUESTIONS</span><select id="test-count"><option value="5">5 questions</option><option value="8">8 questions</option><option value="10">10 questions</option></select></label><label><span class="field-label">ORDER</span><select disabled><option>Mixed across words</option></select></label></div><span class="field-label">QUESTION TYPES</span><div class="check-grid"><label class="check-item"><input type="checkbox" checked> Definition</label><label class="check-item"><input type="checkbox" checked> Meaning in context</label><label class="check-item"><input type="checkbox" checked> Contextual inference</label><label class="check-item"><input type="checkbox" checked> Sentence completion</label><label class="check-item"><input type="checkbox"> Typing the word</label><label class="check-item"><input type="checkbox"> Synonym / antonym</label></div><div class="modal-footer"><label class="check-item"><input id="hard-only" type="checkbox" checked> Only words needing practice</label><button class="modal-cta purple" data-action="begin-test">Review words first →</button></div></div></section></div>`;
  renderTestCollections();
  document.querySelector("#test-collection-search")?.addEventListener("input", (event) => renderTestCollections(event.target.value));
}
function renderTestCollections(query = "") {
  const holder = document.querySelector("#test-collections"); if (!holder) return;
  const search = String(query).trim().toLowerCase();
  const collections = app.collections.filter((collection) => collection.name.toLowerCase().includes(search));
  holder.innerHTML = collections.length ? collections.map((collection) => `<button class="choice ${collection.id === test.collection ? "selected" : ""}" data-action="test-collection" data-id="${collection.id}"><strong>${esc(collection.name)}</strong><span>${practiceWords(collection.id).length} words need practice</span></button>`).join("") : `<p class="empty-test-collections">No collections match “${esc(query)}”.</p>`;
}
function makeQuestion(w) {
  const imported = randomItem(taskVariants(w));
  const fallback = imported ? { prompt: imported.prompt, question: imported.question, options: imported.options, correct: imported.correct } : { prompt: "Which definition best matches this word?", question: "Choose the most precise definition.", options: [w.d, ...app.words.filter((x) => x.id !== w.id).slice(0,3).map((x) => x.d)], correct: 0 };
  const options = fallback.options.map((t,n)=>({t,right:n===fallback.correct})).sort(()=>Math.random()-.5);
  return { w, prompt: fallback.prompt, question: fallback.question, options, correct: options.findIndex((o)=>o.right) };
}
function mixedQuestionWords(words, count) {
  const appearances = new Map(words.map((word) => [word.id, 0])); let previousId = null;
  return Array.from({ length: count }, () => {
    const eligible = words.filter((word) => words.length === 1 || word.id !== previousId);
    const lowest = Math.min(...eligible.map((word) => appearances.get(word.id)));
    const choices = eligible.filter((word) => appearances.get(word.id) === lowest);
    const picked = randomItem(choices);
    appearances.set(picked.id, appearances.get(picked.id) + 1); previousId = picked.id;
    return picked;
  });
}
function beginTest() {
  let pool = collectionWords(test.collection); if (document.querySelector("#hard-only").checked) pool = pool.filter(needsPractice);
  if (!pool.length) return notice("No words in this set need practice. Scan cards or choose another collection.");
  const count = +document.querySelector("#test-count").value;
  test = { ...test, reviewWords: shuffled(pool), reviewIndex: 0, qs: mixedQuestionWords(pool, count).map(makeQuestion), i: 0, selected: null, answers: [], opening: true, animate: false };
  testReviewView();
}
function testReviewView() {
  const opening = Boolean(test.opening), animate = Boolean(test.animate); test.opening = false; test.animate = false;
  const word = test.reviewWords[test.reviewIndex], total = test.reviewWords.length, finalWord = test.reviewIndex === total - 1, progress = Math.round((test.reviewIndex + 1) / total * 100);
  root.innerHTML = `<div class="overlay ${opening ? "" : "session-overlay"}" role="dialog" aria-modal="true"><section class="modal session-modal ${opening ? "session-opening" : ""}"><div class="session-top"><span class="session-label">VOCAB TEST · REVIEW ${test.reviewIndex + 1} OF ${total}</span><button class="icon-button session-close" data-action="close">×</button></div><div class="session-progress"><i style="width:${progress}%;background:var(--purple)"></i></div><div class="session-body ${animate ? "task-enter" : ""}"><span class="step-tag" style="color:#d2b7ff;background:rgba(147,97,242,.12)">PREVIEW BEFORE THE TEST</span><h2>${esc(word.w)}</h2><span class="phonetic">${esc(word.p)}</span><p class="word-meta"><b>${esc(word.pos)}</b>${word.tr ? ` · ${esc(word.tr)}` : ""}</p><p class="definition">${esc(word.d)}.</p><div class="example-box">“${esc(word.e)}”</div><p class="test-review-note">${finalWord ? `You have reviewed all ${total} selected words. The questions will now be mixed across the full set.` : `Review every word first. ${total - test.reviewIndex - 1} ${total - test.reviewIndex - 1 === 1 ? "word remains" : "words remain"}.`}</p><div class="session-actions"><button class="modal-cta purple" data-action="${finalWord ? "start-random-test" : "next-test-review"}">${finalWord ? "Start mixed test →" : "Next word →"}</button></div></div></section></div>`;
}
function nextTestReview() { test.reviewIndex += 1; test.animate = true; testReviewView(); }
function startRandomTest() { test.opening = true; test.animate = false; testView(); }
function testView() {
  const opening = Boolean(test.opening), animate = Boolean(test.animate); test.opening = false; test.animate = false;
  const q = test.qs[test.i], p = Math.round(test.i / test.qs.length * 100);
  root.innerHTML = `<div class="overlay ${opening ? "" : "session-overlay"}" role="dialog" aria-modal="true"><section class="modal session-modal ${opening ? "session-opening" : ""}"><div class="session-top"><span class="session-label">MIXED VOCAB TEST · QUESTION ${test.i+1} OF ${test.qs.length}</span><button class="icon-button session-close" data-action="close">×</button></div><div class="session-progress"><i style="width:${p}%;background:var(--purple)"></i></div><div class="session-body ${animate ? "task-enter" : ""}"><span class="step-tag" style="color:#d2b7ff;background:rgba(147,97,242,.12)">MIXED ACROSS YOUR WORDS</span><h2>Choose the best answer.</h2><p class="question-kicker">${esc(q.prompt)}</p><p class="question-kicker"><b>${esc(q.question || "Which answer is best supported by the text?")}</b></p><div class="answer-list">${q.options.map((o,i)=>`<button class="answer-option ${test.selected===i?"selected":""}" data-action="test-answer" data-id="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span>${esc(o.t)}</button>`).join("")}</div><div class="session-actions"><button class="modal-cta purple" data-action="next-test" ${test.selected===null?"disabled":""}>${test.i+1===test.qs.length?"Finish test →":"Next question →"}</button></div></div></section></div>`;
}
function nextTest() { test.answers.push(test.selected); if(test.i===test.qs.length-1)return testResult(); test.i++;test.selected=null;test.animate=true;testView(); }
function selectTestAnswer(index) { test.selected = index; root.querySelectorAll('[data-action="test-answer"]').forEach((button) => button.classList.toggle("selected", Number(button.dataset.id) === index)); const next = root.querySelector('[data-action="next-test"]'); if (next) next.disabled = false; }
function testResult() { const correct=test.qs.filter((q,i)=>q.correct===test.answers[i]).length, percent=Math.round(correct/test.qs.length*100); app.accuracy=Math.round((app.accuracy*2+percent)/3);save();render(); const reviews=test.qs.map((q,i)=>`<div class="test-review ${q.correct===test.answers[i]?"good":"bad"}"><span>${q.correct===test.answers[i]?"✓":"×"}</span><p><b>${esc(q.w.w)}</b> · “${esc(q.w.w)}” means ${esc(q.w.d)}.<small>${q.correct===test.answers[i]?"Correct":`Your answer: ${esc(q.options[test.answers[i]].t)}`}</small></p></div>`).join(""); root.innerHTML=`<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro test-results"><p class="eyebrow">TEST COMPLETE</p><h2>${percent>=80?"Strong work.":"Useful signal."}</h2><p>${correct} of ${test.qs.length} correct. The answers below explain every word in context.</p><div class="result-grid"><div><strong>${percent}%</strong><span>accuracy</span></div><div><strong>${correct}</strong><span>correct</span></div><div><strong>${test.qs.length-correct}</strong><span>to revisit</span></div></div><div class="test-review-list">${reviews}</div><div class="modal-footer"><span class="subtle-note">Incorrect answers are prioritised in review.</span><button class="modal-cta purple" data-action="close">Done</button></div></div></section></div>`; }

function collectionModal() { root.innerHTML=`<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">NEW COLLECTION</p><h2>Give a set of words a home.</h2><p>Collections can overlap, so a word can appear in both SAT and IELTS study plans.</p><label class="field-label">COLLECTION NAME</label><input id="collection-name" placeholder="e.g. Words from October reading" maxlength="38" autofocus><label class="field-label">ACCENT</label><div class="color-choice"><button class="color-dot selected" data-action="color" data-id="#638dff" style="--dot:#638dff"></button><button class="color-dot" data-action="color" data-id="#a36af3" style="--dot:#a36af3"></button><button class="color-dot" data-action="color" data-id="#51c88a" style="--dot:#51c88a"></button><button class="color-dot" data-action="color" data-id="#e579aa" style="--dot:#e579aa"></button></div><div class="modal-footer"><span class="subtle-note">You can add words next.</span><button class="modal-cta" data-action="save-collection">Create collection</button></div></div></section></div>`; }
function saveCollection() { const input=document.querySelector("#collection-name"),name=input.value.trim(); if(!name)return notice("Give the collection a name first."); const color=document.querySelector(".color-dot.selected")?.dataset.id||"#638dff",id=`collection-${Date.now()}`;app.collections.push({id,name,color});app.activeCollection=id;save();render();close();notice(`“${name}” is ready for words.`); }
function practiceSelectionModal() {
  const words = collectionWords(), scope = app.activeCollection === "all" ? "your whole library" : `“${coll(app.activeCollection)?.name || "this collection"}”`;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal practice-selection-modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">CHOOSE WORDS</p><h2>Build your practice set.</h2><p>Tick only the words you want in Review Queue and Vocab Test. Unticked words are treated as known, so cards are optional.</p><div class="practice-selection-summary"><span><b id="practice-selection-count">0</b> selected from ${words.length} in ${esc(scope)}</span><div><button class="selection-link" data-action="select-all-practice">Select all</button><button class="selection-link" data-action="clear-practice">Clear</button></div></div><div id="practice-selection-list" class="practice-selection-list">${words.map((word) => `<label class="practice-select-row"><input type="checkbox" value="${esc(word.id)}" ${needsPractice(word) ? "checked" : ""}><span class="practice-select-word"><b>${esc(word.w)}</b><small>${esc(word.pos)} · ${esc(word.d)}</small></span><span class="practice-select-state">${needsPractice(word) ? "practice" : "known"}</span></label>`).join("") || `<p class="empty-selection">This collection has no words yet.</p>`}</div><div class="modal-footer"><span class="subtle-note">Your selection is private and syncs with your account.</span><button class="modal-cta" data-action="save-practice-selection" ${words.length ? "" : "disabled"}>Save selection</button></div></div></section></div>`;
  updatePracticeSelectionCount();
}
function updatePracticeSelectionCount() {
  const checks = [...root.querySelectorAll("#practice-selection-list input[type=checkbox]")], selected = checks.filter((input) => input.checked).length;
  const count = root.querySelector("#practice-selection-count"), button = root.querySelector('[data-action="save-practice-selection"]');
  if (count) count.textContent = selected;
  if (button) button.textContent = `Save ${selected} ${selected === 1 ? "word" : "words"}`;
  checks.forEach((input) => input.closest(".practice-select-row")?.classList.toggle("selected", input.checked));
}
function setPracticeSelection(checked) { root.querySelectorAll("#practice-selection-list input[type=checkbox]").forEach((input) => { input.checked = checked; }); updatePracticeSelectionCount(); }
function savePracticeSelection() {
  const selected = new Set([...root.querySelectorAll("#practice-selection-list input:checked")].map((input) => input.value)), scope = new Set(collectionWords().map((word) => word.id));
  app.words.forEach((word) => {
    if (!scope.has(word.id)) return;
    const shouldPractice = selected.has(word.id); word.needsPractice = shouldPractice; word.due = shouldPractice; word.hard = shouldPractice;
    if (shouldPractice && word.s === "mastered") word.s = "reviewing";
    if (!shouldPractice) { word.s = "mastered"; word.m = Math.max(85, word.m); }
  });
  save(); render(); close(); notice(`${selected.size} ${selected.size === 1 ? "word is" : "words are"} in your practice set.`);
}
function collectionOptions() {
  if (app.activeCollection === "all") return notice("Choose a collection first.");
  const collection = coll(app.activeCollection); if (!collection) return notice("That collection is no longer available.");
  const words = collectionWords(collection.id), exclusive = words.filter((word) => word.c.length === 1).length;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro collection-settings"><p class="eyebrow">COLLECTION SETTINGS</p><h2>${esc(collection.name)}</h2><p>This collection contains ${words.length} ${words.length === 1 ? "word" : "words"}. Deleting it never removes words by surprise.</p><div class="account-info"><div class="account-line"><span><b>Keep words in your library</b><small>Words are removed from this collection and stay available in All collections.</small></span></div>${exclusive ? `<div class="account-line"><span><b>${exclusive} word${exclusive === 1 ? "" : "s"} only belong${exclusive === 1 ? "s" : ""} here</b><small>You can choose to remove these words in the confirmation step.</small></span></div>` : ""}</div><div class="modal-footer"><span class="subtle-note">This cannot be undone after syncing.</span><button class="danger-action" data-action="prepare-delete-collection" data-id="${collection.id}">Delete collection</button></div></div></section></div>`;
}
function deleteCollectionModal(id) {
  const collection = coll(id); if (!collection) return close();
  const words = collectionWords(id), exclusive = words.filter((word) => word.c.length === 1).length;
  root.innerHTML = `<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro collection-settings"><p class="eyebrow">DELETE COLLECTION</p><h2>Delete “${esc(collection.name)}”?</h2><p>Choose what should happen to its ${words.length} ${words.length === 1 ? "word" : "words"}.</p><label class="delete-choice selected"><input type="radio" name="collection-delete-mode" value="keep" checked><span><b>Keep all words in my library</b><small>Only the collection is deleted. This is the safe default.</small></span></label>${exclusive ? `<label class="delete-choice"><input type="radio" name="collection-delete-mode" value="exclusive"><span><b>Also remove ${exclusive} word${exclusive === 1 ? "" : "s"} only in this collection</b><small>Words shared with another collection will be kept.</small></span></label>` : ""}<div class="modal-footer"><button class="secondary-action" data-action="collection-options">Go back</button><button class="danger-action" data-action="confirm-delete-collection" data-id="${id}">Delete collection</button></div></div></section></div>`;
}
function deleteCollection(id) {
  const collection = coll(id); if (!collection) return close();
  const removeExclusive = document.querySelector('input[name="collection-delete-mode"]:checked')?.value === "exclusive";
  const exclusiveIds = new Set(app.words.filter((word) => word.c.includes(id) && word.c.length === 1).map((word) => word.id));
  app.words = app.words.filter((word) => !(removeExclusive && exclusiveIds.has(word.id))).map((word) => ({ ...word, c: word.c.filter((collectionId) => collectionId !== id) }));
  app.collections = app.collections.filter((item) => item.id !== id);
  app.activeCollection = "all"; app.showAll = false; save(); render(); close();
  notice(`Removed “${collection.name}”${removeExclusive && exclusiveIds.size ? ` and ${exclusiveIds.size} exclusive ${exclusiveIds.size === 1 ? "word" : "words"}` : ""}.`);
}
function wordModal(id) { const w=app.words.find((x)=>x.id===id), editing=!!w; root.innerHTML=`<div class="overlay" role="dialog" aria-modal="true"><section class="modal"><button class="icon-button modal-close" data-action="close">×</button><div class="modal-intro"><p class="eyebrow">${editing?"WORD DETAILS":"ADD A WORD"}</p><h2>${editing?esc(w.w):"Build your library."}</h2><div class="config-grid"><label><span class="field-label">WORD</span><input id="editor-word" value="${esc(w?.w||"")}" placeholder="e.g. tenacious"></label><label><span class="field-label">PART OF SPEECH</span><select id="editor-pos">${["adjective","noun","verb","adverb"].map((x)=>`<option ${w?.pos===x?"selected":""}>${x}</option>`).join("")}</select></label></div><label><span class="field-label">SIMPLE DEFINITION</span><input id="editor-definition" value="${esc(w?.d||"")}" placeholder="What does it mean in plain English?"></label><label><span class="field-label">EXAMPLE SENTENCE</span><textarea class="use-textarea" id="editor-example" placeholder="Use it in a real situation…">${esc(w?.e||"")}</textarea></label><span class="field-label">IN COLLECTIONS</span><div class="check-grid">${app.collections.map((c)=>`<label class="check-item"><input type="checkbox" value="${c.id}" ${w?.c.includes(c.id)?"checked":""}> ${esc(c.name)}</label>`).join("")}</div><div class="modal-footer">${editing?`<button class="danger-button" data-action="delete" data-id="${w.id}">Remove word</button>`:`<span class="subtle-note">You can edit details later.</span>`}<button class="modal-cta" data-action="save-word" data-id="${w?.id||""}">${editing?"Save changes":"Add word"}</button></div></div></section></div>`; }
function saveWord(id) { const w=document.querySelector("#editor-word").value.trim().toLowerCase(),d=document.querySelector("#editor-definition").value.trim(),e=document.querySelector("#editor-example").value.trim(),pos=document.querySelector("#editor-pos").value,c=[...document.querySelectorAll(".check-grid input:checked")].map(x=>x.value); if(!w||!d||!c.length)return notice("Add a word, its meaning, and at least one collection."); const data={w,d,e,pos,c}; if(id)Object.assign(app.words.find(x=>x.id===id),data);else app.words.unshift({id:`${w}-${Date.now()}`,...data,p:"/add pronunciation/",tr:"",r:[],s:"new",m:0,star:false,hard:false,due:true,rec:[e||`The word ${w} appeared in the article.`,`What does ${w} most likely mean?`,[d,"A familiar routine","A sudden change","A source of doubt"]],ctx:[e||`The writer used ${w} in a discussion.`,`What should a reader do next?`,["Use surrounding context","Ignore the word","Assume no effect","Choose randomly"]],fill:[`The writer chose the word _____.`,[w,"ordinary","unclear","limited"]]});save();render();close();notice(`“${w}” ${id?"was updated":"was added to your library"}.`); }

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-action]"); if (!t) return;
  const a = t.dataset.action, id = t.dataset.id;
  if (a === "close") close();
  if (a === "start") dailySetup();
  if (a === "review") startReview();
  if (a === "scan-cards") startCards();
  if (a === "begin-daily") beginDailySession();
  if (a === "reveal-card") { cardDeck.revealed = !cardDeck.revealed; flashcardView(); }
  if (a === "rate-card") rateCard(id);
  if (a === "practice-card-unknown") startSession("review", app.words.filter((word) => cardDeck.unknownIds.includes(word.id)));
  if (a === "test") testConfig();
  if (a === "collection") { app.activeCollection = id; app.showAll = false; render(); }
  if (a === "collection-options") collectionOptions();
  if (a === "star-filter") { app.starredOnly = !app.starredOnly; t.setAttribute("aria-pressed", app.starredOnly); renderWords(); }
  if (a === "star") { const w = app.words.find((x) => x.id === id); w.star = !w.star; save(); renderWords(); }
  if (a === "clear") { app.activeStatus = "all"; app.starredOnly = false; app.query = ""; document.querySelector("#word-search").value = ""; document.querySelectorAll(".filter-tab").forEach((x) => x.classList.toggle("active", x.dataset.status === "all")); renderWords(); }
  if (a === "show-more") { app.showAll = !app.showAll; renderWords(); }
  if (a === "pick") selectSessionAnswer(+id);
  if (a === "submit") submit();
  if (a === "advance") advance();
  if (a === "test-collection") { test.collection = id; document.querySelectorAll("#test-collections .choice").forEach((x) => x.classList.toggle("selected", x === t)); }
  if (a === "begin-test") beginTest();
  if (a === "next-test-review") nextTestReview();
  if (a === "start-random-test") startRandomTest();
  if (a === "test-answer") selectTestAnswer(+id);
  if (a === "next-test") nextTest();
  if (a === "new-collection") collectionModal();
  if (a === "choose-practice") practiceSelectionModal();
  if (a === "select-all-practice") setPracticeSelection(true);
  if (a === "clear-practice") setPracticeSelection(false);
  if (a === "save-practice-selection") savePracticeSelection();
  if (a === "color") document.querySelectorAll(".color-dot").forEach((x) => x.classList.toggle("selected", x === t));
  if (a === "save-collection") saveCollection();
  if (a === "prepare-delete-collection") deleteCollectionModal(id);
  if (a === "confirm-delete-collection") deleteCollection(id);
  if (a === "add-word") wordModal();
  if (a === "edit") wordModal(id);
  if (a === "save-word") saveWord(id);
  if (a === "delete") { const w = app.words.find((x) => x.id === id); app.words = app.words.filter((x) => x.id !== id); save(); render(); close(); notice(`Removed “${w.w}”.`); }
  if (a === "profile") profileModal();
  if (a === "auth-switch") authView(t.dataset.mode);
  if (a === "auth-submit") authenticate(t.dataset.mode);
  if (a === "cloud-workspace") createCloudWorkspace(t.dataset.mode === "migrate");
  if (a === "sync-now") pushCloud(true);
  if (a === "export-backup") downloadBackup();
  if (a === "sign-out") signOut();
  if (a === "theme") setTheme(app.theme === "light" ? "dark" : "light");
  if (a === "focus") { document.body.classList.toggle("focus-mode"); notice(document.body.classList.contains("focus-mode") ? "Focus mode on — distractions dimmed." : "Focus mode off."); }
  if (a === "menu") document.querySelector(".sidebar").classList.toggle("open");
});
document.addEventListener("click",(e)=>{const t=e.target.closest(".filter-tab");if(!t)return;app.activeStatus=t.dataset.status;app.showAll=false;document.querySelectorAll(".filter-tab").forEach(x=>x.classList.toggle("active",x===t));renderWords()});
document.addEventListener("change", (e) => { if (e.target.matches("#practice-selection-list input[type=checkbox]")) updatePracticeSelectionCount(); });
document.querySelector("#word-search").addEventListener("input",(e)=>{app.query=e.target.value;app.showAll=false;renderWords()});
document.querySelector("#collection-filter").addEventListener("change",(e)=>{app.activeCollection=e.target.value;app.showAll=false;render()});
document.addEventListener("keydown",(e)=>{if(e.key==="Escape"&&root.innerHTML)close()});
boot();
