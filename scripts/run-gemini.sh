#!/usr/bin/env bash
# Headless Gemini CLI runner for devprofile-admin.
# Invoked by .github/workflows/gemini-edit.yml on GitHub-hosted runner.
# Requires:
#   - `gemini` CLI (npm install -g @google/gemini-cli)
#   - GEMINI_API_KEY env var (GitHub secret)

set -euo pipefail

PROMPT_FILE="${1:?usage: run-gemini.sh <prompt-file>}"

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

# Restrict to /tmp to prevent path traversal (macOS: /tmp → /private/tmp)
REAL_PATH=$(realpath "$PROMPT_FILE")
if [[ "$REAL_PATH" != /tmp/* && "$REAL_PATH" != /private/tmp/* ]]; then
  echo "prompt file must be under /tmp — got: $REAL_PATH" >&2
  exit 1
fi

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "GEMINI_API_KEY is not set" >&2
  exit 1
fi

USER_PROMPT=$(cat "$PROMPT_FILE")

SYSTEM_CONTEXT=$(cat <<'EOF'
You are editing the n5nsuf.github.io GitHub Pages repo.

Before making any change:
1. Read STYLE_GUIDE.md (mandatory).
2. Read index.html to understand the hub structure.
3. If the request creates a new project page, read an existing project page under projects/ if any, or reuse the card-grid pattern from index.html.

Rules:
- New project page → projects/<slug>.html (kebab-case slug).
- On new project page, update index.html: append a card to the "Projects" section, creating that section with purple accent if it does not exist yet.
- Preserve multilingual ko/en structure on every user-facing text node.
- Follow STYLE_GUIDE.md exactly — design tokens, typography, layout.
- Do NOT modify CLAUDE.md, STYLE_GUIDE.md, scripts/, or .github/.
- Make all edits atomically. Use Write/Edit tools, not Bash for file mutation.

Output minimal commentary. Make the edits.
EOF
)

FULL_PROMPT=$(printf '%s\n\n## Request\n%s\n' "$SYSTEM_CONTEXT" "$USER_PROMPT")

# Headless non-interactive mode.
# --yolo auto-accepts all tool calls (required for CI).
# -p / --prompt: one-shot prompt.
gemini --yolo --prompt "$FULL_PROMPT"
