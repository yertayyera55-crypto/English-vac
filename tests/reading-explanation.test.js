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
