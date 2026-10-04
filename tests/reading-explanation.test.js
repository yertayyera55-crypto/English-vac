const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function reader(mark) {
  const context = vm.createContext({
    app: { words: [], readingLab: { marks: [mark] } },
    document: { addEventListener() {} }, window: {},
    root: { innerHTML: "" }, esc: (text) => String(text),
    fetch: () => assert.fail("Saved definitions must not need another API call"),
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../reading-lab.js"), "utf8"), context);
  return context;
}

test("existing cards and quiz answers prefer English explanations over saved Russian translations", () => {
  const context = reader({ id: "mark", text: "bank", translation: "берег", contextSense: "Берег реки", definition: "The land next to a river." });
  assert.equal(vm.runInContext("readingMarkMeaning(readingMarks()[0])", context), "The land next to a river.");
  assert.equal(vm.runInContext("readingQuizItems()[0].answer", context), "The land next to a river.");
  vm.runInContext('readingLookupView("mark")', context);
  assert.match(context.root.innerHTML, /IN SIMPLE ENGLISH/);
  assert.doesNotMatch(context.root.innerHTML, /берег|Берег|TRANSLATION/);
});

test("translation-only legacy cards need an explanation but personal notes remain usable", () => {
  const context = reader({ id: "mark", text: "bank", translation: "берег", contextSense: "Берег реки" });
  assert.equal(vm.runInContext("readingMarkIsReady(readingMarks()[0])", context), false);
  vm.runInContext('readingMarks()[0].note = "Land beside water"', context);
  assert.equal(vm.runInContext("readingMarkMeaning(readingMarks()[0])", context), "Land beside water");
});

test("reopening a saved English-only explanation does not call the API", async () => {
  const context = reader({ id: "mark", text: "bank", definition: "The land next to a river." });
  await vm.runInContext('lookUpReadingMark("mark")', context);
  assert.match(context.root.innerHTML, /The land next to a river/);
});

test("PDF text joins adjacent glyphs, separates words, and preserves line endings", () => {
  const context = reader({});
  context.items = [
    { str: "riv", width: 12, transform: [1, 0, 0, 1, 0, 100] },
    { str: "er", width: 8, transform: [1, 0, 0, 1, 12, 100] },
    { str: "bank", width: 20, transform: [1, 0, 0, 1, 25, 100], hasEOL: true },
    { str: "Next page", width: 40, transform: [1, 0, 0, 1, 0, 80] },
  ];
  assert.equal(vm.runInContext("readingPDFPageText(items)", context), "river bank\nNext page");
});

test("PDF text reads stream chunks without Safari's missing async iterator", async () => {
  const context = reader({});
  let reads = 0;
  let released = false;
  context.page = {
    getTextContent() { assert.fail("getTextContent requires ReadableStream async iteration in Safari"); },
    streamTextContent() {
      return {
        getReader() {
          return {
            async read() {
              reads += 1;
              if (reads === 1) return { value: { items: [{ str: "river", width: 24, transform: [1, 0, 0, 1, 0, 100] }] }, done: false };
              if (reads === 2) return { value: { items: [{ str: "bank", width: 20, transform: [1, 0, 0, 1, 30, 100] }] }, done: false };
              return { done: true };
            },
            releaseLock() { released = true; },
          };
        },
      };
    },
  };
  assert.equal(await vm.runInContext("readingPDFPageItems(page).then(readingPDFPageText)", context), "river bank");
  assert.equal(reads, 3);
  assert.equal(released, true);
});
