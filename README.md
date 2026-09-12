# Lexora — SAT & IELTS vocabulary workspace

An interactive personal vocabulary-learning prototype designed around a deliberate learning path:

**Learn → Recognise → Understand → Recall → Use → Review**

It includes a compact dark-mode word bank, collection and status filters, starred words, a six-step daily learning session, a configurable test flow, progress indicators, and an activity calendar. It can run as a browser-only workspace or connect to Supabase for private accounts and cross-device sync.

## Run locally

Requires Node.js 22 or later. The local server runs both the app and its explanation API.

```bash
npm start
```

Open [http://localhost:4173](http://localhost:4173).

On macOS, you can instead double-click `Запустить Lexora.command` in Finder.

### Reading Lab explanations (Groq)

Selecting a word or phrase and choosing **Learn more** shows its meaning in easy English (A2–B1) and a short example. Review cards and the mini quiz use that explanation instead of a Russian translation. Existing saved English definitions and personal notes remain usable. The API uses Groq’s `openai/gpt-oss-20b` model with low reasoning effort.

For local explanations, copy `.env.example` to `.env.local`, set `GROQ_API_KEY` to your Groq API key, and restart `npm start`. A key configured on Vercel is not automatically available on your computer. Keep the key in the server environment; never add it to browser JavaScript. `.env.local` is ignored by Git and is not served by the local server.

If the old `python3 -m http.server 4173` is still running, stop it before starting the new server. The Python static server cannot run `/api/reading-lookup`.

For Vercel, add `GROQ_API_KEY` in the project's Environment Variables for the deployment's environment and redeploy. Static-only hosts cannot execute this API. Reading Lab sends the selected text and nearby context to Groq and saves successful explanations in the reading cards, so opening them again requires no request.

## Import your own vocabulary

Use **Import file** in the Word bank to load `.xlsx`, `.csv`, or `.tsv` files. Download the in-app CSV template, open it in Excel, add one word per row, then upload it again.

The required columns are `word` and `definition`. The downloadable template contains three task groups: `task_1`, `task_2`, and `task_3`. Each group can include up to three variants — for example, `task_1_variant_1_prompt` through `task_1_variant_3_correct`. A variant has a prompt, a question, four answer choices, and a correct answer letter (`A`–`D`). That means an imported word can have up to nine SAT-style question variants: three meaning-in-context, three inference, and three sentence-completion questions.

For each practice session, Lexora randomly selects one variant of each task type. Vocab Tests first preview every selected word, then mix questions from the whole set while also randomly drawing from the imported variants — no word is tested repeatedly in a block. Import does not generate exercises with AI: prepare these columns yourself or ask an external AI to fill the downloaded template. Older files with one task per type (`task_1_prompt`, `task_2_prompt`, and `task_3_prompt`) still import normally.

## Check the JavaScript

```bash
npm run check
```

## Private accounts and cloud sync (Supabase)

Lexora is ready for one private workspace per account. Your friend signs up with a separate email and receives an entirely separate library, collections, and progress record.

1. Create a new project at [Supabase](https://supabase.com/dashboard).
2. In **SQL Editor**, create a query, paste the complete contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `user_workspaces` table and Row Level Security (RLS) policies: a user can only read or update a row whose `user_id` is their own.
3. In **Project Settings → API**, copy the Project URL and the publishable key (or the legacy `anon` key). Paste them into [`supabase-config.js`](supabase-config.js):

   ```js
   window.LEXORA_SUPABASE_CONFIG = {
     url: "https://YOUR-PROJECT.supabase.co",
     anonKey: "YOUR-PUBLISHABLE-OR-ANON-KEY",
   };
   ```

4. In **Authentication → URL Configuration**, add `http://localhost:4173` and the final production URL to **Redirect URLs**. Keep email/password sign-in enabled.
5. Start Lexora. The app will show sign-in and account-creation screens. On a first sign-in, it asks whether to move the vocabulary already in that browser into the new account or start a separate library.

The publishable/anon key is intentionally used in browser code and can be present in a deployed static site. **Never** put a `service_role` key in this repository or in `supabase-config.js`: it can bypass the privacy policies.

### Backups

Open the account menu in the bottom-left corner, then choose **Download backup**. It downloads a JSON file containing every word, task, collection, and progress value. Keep the original Excel file too; it remains a useful editable source copy.

### Hosting while keeping GitHub private

The repository can stay private. A static host such as Vercel or Cloudflare Pages can deploy from a private GitHub repository after you authorize it. The published site itself must serve JavaScript to visitors, so a technical user can inspect the frontend files, but private words stay protected by Supabase Authentication and RLS—not by hiding the frontend source.
