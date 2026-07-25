# Lexora — SAT & IELTS vocabulary workspace

An interactive personal vocabulary-learning prototype designed around a deliberate learning path:

**Learn → Recognise → Understand → Recall → Use → Review**

It includes a compact dark-mode word bank, collection and status filters, starred words, a six-step daily learning session, a configurable test flow, progress indicators, and an activity calendar. Changes are saved in the browser for the current user.

## Run locally

```bash
npm start
```

Open [http://localhost:4173](http://localhost:4173).

On macOS, you can instead double-click `Запустить Lexora.command` in Finder.

## Import your own vocabulary

Use **Import file** in the Word bank to load `.xlsx`, `.csv`, or `.tsv` files. Download the in-app CSV template, open it in Excel, add one word per row, then upload it again.

The required columns are `word` and `definition`. For high-quality SAT-style practice, add `task_1`, `task_2`, and `task_3` columns from the template. Each task supports a prompt, a question, four answer choices, and a correct answer letter (`A`–`D`). Lexora rotates the three task types during later reviews.

## Check the JavaScript

```bash
npm run check
```
