# Vendored browser dependency

`supabase.js` is the UMD browser build of `@supabase/supabase-js` version 2.110.8.

It is kept locally so Lexora authentication works in Safari even when a content blocker prevents loading scripts from third-party CDNs. Source: https://github.com/supabase/supabase-js

## PDF.js

`pdfjs/` contains the legacy browser modules and character maps from Mozilla `pdfjs-dist` 6.3.289 (https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-6.3.289.tgz). Apache-2.0 license included in `pdfjs/LICENSE`. These files are served locally; PDF file contents are parsed in the browser.
