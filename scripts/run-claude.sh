#!/usr/bin/env bash
# Headless Claude Code runner for devprofile-admin.
# Invoked by .github/workflows/claude-edit.yml on self-hosted Mac Mini.
# Requires `claude` CLI (Claude Code) logged in with Max subscription.

set -euo pipefail

PROMPT_FILE="${1:?usage: run-claude.sh <prompt-file>}"

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

USER_PROMPT=$(cat "$PROMPT_FILE")

# System context — Claude reads STYLE_GUIDE.md via its tools; we just remind it.
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

# Headless one-shot. --dangerously-skip-permissions required for non-interactive runner.
# Default to Sonnet — Opus reserved for manual escalation via CLAUDE_MODEL env.
CLAUDE_MODEL="${CLAUDE_MODEL:-claude-sonnet-4-6}"
claude -p "$FULL_PROMPT" --model "$CLAUDE_MODEL" --dangerously-skip-permissions
