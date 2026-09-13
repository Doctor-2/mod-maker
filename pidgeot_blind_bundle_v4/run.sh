#!/usr/bin/env bash
# Reproduces the entire run from a clean machine.
#   usage: ./run.sh [workdir]      (default: <bundle>/.work)
set -euo pipefail

BUNDLE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="${1:-$BUNDLE/.work}"
mkdir -p "$WORK"
cd "$WORK"

# 1. clone + 2. checkout the tag
[ -d pokemon-showdown ] || git clone --depth 1 --branch v0.11.11 https://github.com/smogon/pokemon-showdown.git
cd pokemon-showdown
git checkout v0.11.11

# 3. install
npm ci

# 4. apply the overlay, preserving paths
cp -R "$BUNDLE/showdown_overlay/." .

# 5. build
npm run build

# 6. mechanics tests
#    NOTE: .mocharc.json already lists test/sim/**/*.js, so naming the file *adds* to that
#    list rather than narrowing it: this runs the whole suite (2375 passing). To run only
#    the new file: npx mocha --no-config --no-package test/sim/abilities/wingtipvortex.js
npx mocha test/sim/abilities/wingtipvortex.js

# 8. format + team validation, and a check that nothing leaked into the stock formats
node "$BUNDLE/verify.js"
