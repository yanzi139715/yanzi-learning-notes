#!/bin/zsh
set -euo pipefail

repo_root=${0:A:h:h}
fake_file="$repo_root/content/notes/.sensitive-test.md"
scanner="$repo_root/scripts/scan-sensitive.zsh"

[[ -x "$scanner" ]] || {
  print -u2 'sensitive scanner is missing'
  exit 1
}

cleanup() {
  unlink "$fake_file" 2>/dev/null || true
}
trap cleanup EXIT

print -rn -- 'gho_' > "$fake_file"
print -r -- 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' >> "$fake_file"

if "$scanner" >/dev/null 2>&1; then
  print -u2 'scanner accepted an untracked fake token'
  exit 1
fi

print 'sensitive_working_tree_rejected'
