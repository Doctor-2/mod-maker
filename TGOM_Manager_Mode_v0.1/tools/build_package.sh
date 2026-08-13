#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PROJECT="$ROOT/TGOM_Manager_Mode_v0.1"
INPUT="${1:-$ROOT/PluginScripts.rxdata}"
DIST="${2:-$ROOT/dist}"
STAGE="$DIST/TGOM_Manager_Mode_v0.1"

if [[ ! -f "$INPUT" ]]; then
  echo "Missing input PluginScripts.rxdata: $INPUT" >&2
  exit 1
fi
if [[ "$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")" == "$ROOT/PluginScripts.before_companion.rxdata" ]]; then
  echo "Refusing pre-Companion production base: $INPUT" >&2
  exit 1
fi
rm -rf "$STAGE"
mkdir -p "$STAGE/Data"
cp "$PROJECT/TGOM_Manager_Mode.rb" "$STAGE/"
cp "$PROJECT/README_安装与恢复.txt" "$PROJECT/CHANGELOG.txt" "$STAGE/"
cp -R "$PROJECT/audit" "$STAGE/"
cp "$INPUT" "$STAGE/Data/PluginScripts.pre-manager.rxdata"
ruby "$PROJECT/tools/inject_plugin.rb" \
  "$INPUT" "$PROJECT/TGOM_Manager_Mode.rb" "$STAGE/Data/PluginScripts.rxdata"
(
  cd "$DIST"
  rm -f TGOM_Manager_Mode_v0.1.zip
  zip -qr TGOM_Manager_Mode_v0.1.zip TGOM_Manager_Mode_v0.1
)
sha256sum "$INPUT" "$STAGE/Data/PluginScripts.rxdata" "$DIST/TGOM_Manager_Mode_v0.1.zip"
echo "Built $DIST/TGOM_Manager_Mode_v0.1.zip"
