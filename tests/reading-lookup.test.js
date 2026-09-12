const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const lookup = require("../api/reading-lookup");
const { createServer } = require("../server");

const originalFetch = global.fetch;
const originalKey = process.env.GROQ_API_KEY;
let requestId = 0;
afterEach(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = originalKey;
});

async function invoke(body = { text: "bank", context: "She sat on the river bank." }, headers = {}) {
  const res = {
    headers: {}, status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; return this; },
    send(value) { this.body = JSON.parse(value); return this; },
  };
  await lookup({ method: "POST", body, headers: { "x-forwarded-for": `test-${++requestId}`, ...headers } }, res);
  return res;
}
function modelResponse(data, finish_reason = "stop") {
  return new Response(JSON.stringify({ choices: [{ finish_reason, message: { content: typeof data === "string" ? data : JSON.stringify(data) } }] }));
}
const answer = { selectedText: "bank", definitionEn: "The land beside a river.", partOfSpeech: "noun", studyCue: "Sit on the river bank." };

test("missing key fails immediately without contacting Groq", async () => {
  delete process.env.GROQ_API_KEY;
  global.fetch = () => assert.fail("No request should be made without a key");
  const result = await invoke();
  assert.equal(result.statusCode, 503);
  assert.equal(result.body.code, "NOT_CONFIGURED");
});

test("explanation succeeds without a translation and stays private", async () => {
  process.env.GROQ_API_KEY = " test-key ";
  global.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, "Bearer test-key");
    const sent = JSON.parse(options.body);
    return modelResponse(answer);
  };
  const result = await invoke();
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.definitionEn, answer.definitionEn);
  assert.equal(result.body.translationRu, undefined);
  assert.equal(result.headers["Cache-Control"], "no-store");
  assert.ok(!JSON.stringify(result.body).includes("test-key"));
});

test("invalid API key has an actionable error without leaking upstream details", async () => {
  process.env.GROQ_API_KEY = "test-key";
  global.fetch = async () => new Response(JSON.stringify({ error: { message: "secret upstream details" } }), { status: 401 });
  const result = await invoke();
  assert.equal(result.statusCode, 503);
  assert.equal(result.body.code, "PROVIDER_AUTH");
  assert.ok(!JSON.stringify(result.body).includes("secret upstream"));
});

test("malformed, truncated, and mismatched answers are never saved as successful explanations", async () => {
  process.env.GROQ_API_KEY = "test-key";
  for (const response of [modelResponse('{"definitionEn":'), modelResponse(answer, "length"), modelResponse({ ...answer, selectedText: "river" }), modelResponse({ ...answer, definitionEn: {} }), modelResponse({ selectedText: "bank", translationRu: "берег" })]) {
    global.fetch = async () => response;
    assert.equal((await invoke()).statusCode, 502);
  }
});

test("Groq rate limits and timeouts retain their specific status", async () => {
  process.env.GROQ_API_KEY = "test-key";
  global.fetch = async () => new Response("{}", { status: 429 });
  assert.equal((await invoke()).statusCode, 429);
  global.fetch = async () => { throw new DOMException("Aborted", "AbortError"); };
  assert.equal((await invoke()).statusCode, 504);
});

test("unavailable Groq model is reported as configuration failure", async () => {
  process.env.GROQ_API_KEY = "test-key";
  global.fetch = async () => new Response(JSON.stringify({ error: { code: "model_not_found" } }), { status: 404 });
  const result = await invoke();
  assert.equal(result.statusCode, 503);
  assert.equal(result.body.code, "MODEL_UNAVAILABLE");
});

test("oversized selections are rejected instead of silently translating a prefix", async () => {
  process.env.GROQ_API_KEY = "test-key";
  global.fetch = () => assert.fail("Invalid input must not reach Groq");
  assert.equal((await invoke({ text: "a".repeat(281), context: "A passage" })).statusCode, 400);
});

test("local server executes the API and never serves environment or server files", async () => {
  delete process.env.GROQ_API_KEY;
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await originalFetch(base);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /reading-lab.js/);
    const response = await originalFetch(`${base}/api/reading-lookup`, { method: "POST", body: JSON.stringify({ text: "bank", context: "A river bank" }) });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "NOT_CONFIGURED");
    for (const file of [".env.local", ".git/config", "server.js", "api/reading-lookup.js", "%2eenv.local"]) {
      assert.equal((await originalFetch(`${base}/${file}`)).status, 404, file);
    }
    assert.equal((await originalFetch(`${base}/vendor/supabase.js`)).status, 200);
  } finally { await new Promise((resolve) => server.close(resolve)); }
});
