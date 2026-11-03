#!/bin/sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
OUTPUT_DIR="$PROJECT_DIR/tmp/orion-desktop/Orion Companion Review.app"
test -f "$PROJECT_DIR/public/character-assets/orion/companion-v1/atlas.png"
mkdir -p "$OUTPUT_DIR/Contents/MacOS" "$OUTPUT_DIR/Contents/Resources" "$PROJECT_DIR/tmp/swift-module-cache"
swiftc -module-cache-path "$PROJECT_DIR/tmp/swift-module-cache" -framework AppKit "$SCRIPT_DIR/OrionCompanion.swift" -o "$OUTPUT_DIR/Contents/MacOS/OrionCompanion"
cp "$SCRIPT_DIR/Info.plist" "$OUTPUT_DIR/Contents/Info.plist"
cp "$PROJECT_DIR/public/character-assets/orion/companion-v1/atlas.png" "$OUTPUT_DIR/Contents/Resources/atlas.png"
cp "$PROJECT_DIR/public/character-assets/orion/companion-v1/manifest.json" "$OUTPUT_DIR/Contents/Resources/manifest.json"
echo "$OUTPUT_DIR"
