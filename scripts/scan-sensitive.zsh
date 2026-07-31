#!/bin/zsh
set -euo pipefail

repo_root=${0:A:h:h}
cd "$repo_root"

ruby -e '
patterns = {
  "local-user-path" => %r{/Users/[A-Za-z0-9._-]+},
  "github-token" => %r{gh[opsu]_[A-Za-z0-9]{20,}},
  "api-key" => %r{sk-[A-Za-z0-9_-]{20,}},
  "private-key" => %r{BEGIN (?:RSA |OPENSSH )?PRIVATE KEY},
  "real-uuid" => %r{\b(?!00000000-0000-0000-0000-000000000000)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b}i,
  "clash-profile-id" => %r{\b(?:RMhSlN6RtGBz|rrLM8MGSZB14|pKL2xVUZa8aD|Rprr35xq2pwg)\b},
  "subscription-url" => %r{https?://\S*(?:subscribe|subscription|token=|uuid=)}i,
  "ipv4-address" => %r{\b(?!0\.0\.0\.0\b)(?!127\.0\.0\.1\b)(?:\d{1,3}\.){3}\d{1,3}\b}
}

files = Dir.glob("**/*", File::FNM_DOTMATCH).select do |path|
  File.file?(path) &&
    !path.start_with?(".git/", ".next/", "node_modules/") &&
    path != "scripts/scan-sensitive.zsh"
end

failures = []
files.each do |path|
  begin
    File.foreach(path).with_index(1) do |line, number|
      patterns.each do |name, pattern|
        failures << "#{path}:#{number}:#{name}" if line.match?(pattern)
      end
    end
  rescue ArgumentError
    next
  end
end

if failures.any?
  warn failures.join("\n")
  exit 1
end

puts "sensitive_scan_ok files=#{files.size}"
'
