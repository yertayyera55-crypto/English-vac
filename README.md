# Lexora — SAT & IELTS vocabulary workspace

An interactive personal vocabulary-learning prototype designed around a deliberate learning path:

**Learn → Recognise → Understand → Recall → Use → Review**

It includes a compact dark-mode word bank, collection and status filters, starred words, a six-step daily learning session, a configurable test flow, progress indicators, and an activity calendar. It can run as a browser-only workspace or connect to Supabase for private accounts and cross-device sync.

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
