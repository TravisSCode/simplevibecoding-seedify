#!/bin/bash
OUTPUT="project-structure-$(date +%Y%m%d-%H%M).txt"
echo "=== AI NFT STORYTELLER - SEEDIFY VIBE COINS ===" > $OUTPUT
echo "Generated: $(date)\n" >> $OUTPUT

echo "FILES:" >> $OUTPUT
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" \) \
  ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./.git/*" | sort >> $OUTPUT

echo "\n\n=== PACKAGE.JSON ===\n" >> $OUTPUT
[ -f "package.json" ] && cat package.json >> $OUTPUT || echo "Not found" >> $OUTPUT

echo "\n\n=== MAIN FILES ===\n" >> $OUTPUT
for file in "src/app/layout.tsx" "src/app/page.tsx" "src/app/providers.tsx" "src/components/ImageUpload.tsx" "src/components/Gallery.tsx" "src/app/api/generate-description/route.ts"; do
  echo "\n--- $file ---" >> $OUTPUT
  [ -f "$file" ] && cat "$file" >> $OUTPUT || echo "File not found" >> $OUTPUT
done

echo "\n\n=== VIBE CODING LOGS ===\n" >> $OUTPUT
if [ -d "vibe-coding-log" ]; then
  find vibe-coding-log -name "*.md" -exec sh -c 'echo "\n--- {} ---"; cat {}' \; >> $OUTPUT
else
  echo "No vibe-coding-log directory found" >> $OUTPUT
fi

echo "✅ Project structure saved to: $OUTPUT"
