#!/bin/sh
# Робить icon.icns (формат іконок macOS) з icon.png.
cd "$(dirname "$0")/.." || exit 1
SET=desktop/resources/icon.iconset
rm -rf "$SET"; mkdir -p "$SET"
for s in 16 32 128 256 512; do
  sips -z $s $s desktop/resources/icon.png --out "$SET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) desktop/resources/icon.png --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o desktop/resources/icon.icns && rm -rf "$SET"
echo "✅ desktop/resources/icon.icns ($(du -h desktop/resources/icon.icns | cut -f1))"
