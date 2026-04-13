---
name: browser-use
description: Automate Chrome browser for testing, scraping, and inspection using local Chrome DevTools Protocol. Use when needing real-browser context, authenticated sessions, DOM inspection, screenshots, or visual element picking without building a full MCP server.
---

<objective>
Provide lightweight Chrome automation using DevTools Protocol helpers that let agents start Chrome, navigate tabs, evaluate JavaScript, take screenshots, and capture DOM metadata entirely on your local machine.
</objective>

<when_to_use>
Use this skill when you need:
- **Real-browser context** (authenticated sessions, production-only behavior, visual regressions)
- **DOM inspection or extraction** without building a dedicated MCP server
- **Screenshots or DOM element metadata** for QA notes, bug triage, or documentation
- **Portable, git-tracked bundle** that any teammate can run locally with zero additional infrastructure
</when_to_use>

<key_capabilities>
- Launches Chrome with remote debugging on port `:9222`
- Navigates tabs and opens new tabs as needed
- Evaluates arbitrary JavaScript in browser context
- Captures screenshots to timestamped PNG files
- Visual element picker for interactive DOM node selection
- Works with authenticated sessions when using `--profile` flag
- All operations stay on local machine - no external services
</key_capabilities>

<available_scripts>
All scripts are located in `~/.factory/skills/browser/` and must be called with full paths.

| Script | Purpose | Usage |
|--------|---------|-------|
| `start.js` | Launches Chrome with remote debugging | `~/.factory/skills/browser/start.js [--profile]` |
| `nav.js` | Navigates to URL or opens new tab | `~/.factory/skills/browser/nav.js <url> [--new]` |
| `eval.js` | Runs JavaScript in active tab | `~/.factory/skills/browser/eval.js "<js-code>"` |
| `screenshot.js` | Captures current viewport | `~/.factory/skills/browser/screenshot.js` |
| `pick.js` | Interactive element picker | `~/.factory/skills/browser/pick.js "<prompt>"` |
</available_scripts>

<process>
## Standard Workflow

1. **Start Chrome** with `start.js --profile` to mirror your authenticated state
2. **Drive navigation** via `nav.js https://target.app` or open secondary tabs with `--new`
3. **Inspect the DOM** using `eval.js` for quick counts, attribute checks, or extracting JSON payloads
4. **Capture artifacts** with `screenshot.js` for visual proof or `pick.js` when you need precise selectors or text snapshots
5. **Return gathered evidence** (file paths, DOM metadata, query outputs) in session summary or PR description
</process>

<conventions>
## Script Requirements
- Start Chrome first before using other tools
- The `--profile` flag syncs your actual Chrome profile so you're logged in everywhere
- JavaScript evaluation runs in an async context in the page
- Pick tool allows visual selection of DOM elements by clicking

## JavaScript Evaluation
The code must be a single expression or use IIFE for multiple statements:
- Single expression: `'document.title'`
- Multiple statements: `'(() => { const x = 1; return x + 1; })()'`
- Avoid newlines in the code string - keep it on one line
</conventions>

<verification>
- `~/.factory/skills/browser/start.js --profile` should print `✓ Chrome started on :9222 with your profile`
- `~/.factory/skills/browser/nav.js https://example.com` should confirm navigation
- `~/.factory/skills/browser/eval.js 'document.title'` should echo the current page title
- `~/.factory/skills/browser/screenshot.js` should output a valid PNG path under your system temp directory

If any step fails, rerun `start.js`, confirm Chrome is listening on `localhost:9222/json/version`, and ensure `puppeteer-core` is installed.
</verification>

<success_criteria>
The skill is complete when:
- Chrome is running with remote debugging enabled
- Navigation commands work reliably
- JavaScript evaluation returns expected results
- Screenshots are captured successfully
- Element picker allows interactive DOM selection
- All artifacts are saved to accessible locations
</success_criteria>

<out_of_scope>
- Complex browser automation workflows (use Playwright/Puppeteer directly)
- Cross-browser testing (Chrome only)
- Headless mode configuration (designed for headed Chrome)
- Managing multiple Chrome instances simultaneously
</out_of_scope>

<safety_and_escalation>
- This tool connects to your real Chrome profile - be cautious with automated actions
- Screenshots may capture sensitive data - review before sharing
- Do not use for actions that could modify production data without explicit approval
</safety_and_escalation>
