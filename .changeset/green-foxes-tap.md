---
"vite-plugin-pagefind": patch
---

Removed the automatic pagefind run on post build in favor of manually doing so to be framework agnostic (some frameworks have their own CLI wrappers around Vite so it was impossible to run post build since the framework ran after `vite build` had completed.
