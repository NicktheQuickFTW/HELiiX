#!/bin/bash

# Script to fix invalid DOM props in Once UI components across the codebase

echo "Fixing invalid DOM props in Once UI components..."

# List of files to fix
FILES=$(rg -l "alignItems|justifyContent|textAlign=" /Users/nickw/Documents/XII-Ops/HELiiX/src --glob "*.tsx")

for file in $FILES; do
    echo "Processing: $file"
    
    # Fix alignItems prop variations
    sed -i '' 's/alignItems="center"/style={{ alignItems: "center" }}/g' "$file"
    sed -i '' 's/alignItems="flex-start"/style={{ alignItems: "flex-start" }}/g' "$file"
    sed -i '' 's/alignItems="flex-end"/style={{ alignItems: "flex-end" }}/g' "$file"
    
    # Fix justifyContent prop variations
    sed -i '' 's/justifyContent="center"/style={{ justifyContent: "center" }}/g' "$file"
    sed -i '' 's/justifyContent="space-between"/style={{ justifyContent: "space-between" }}/g' "$file"
    sed -i '' 's/justifyContent="space-around"/style={{ justifyContent: "space-around" }}/g' "$file"
    sed -i '' 's/justifyContent="flex-start"/style={{ justifyContent: "flex-start" }}/g' "$file"
    sed -i '' 's/justifyContent="flex-end"/style={{ justifyContent: "flex-end" }}/g' "$file"
    
    # Fix textAlign prop variations
    sed -i '' 's/textAlign="center"/style={{ textAlign: "center" }}/g' "$file"
    sed -i '' 's/textAlign="left"/style={{ textAlign: "left" }}/g' "$file"
    sed -i '' 's/textAlign="right"/style={{ textAlign: "right" }}/g' "$file"
    
    # Fix combined alignItems and justifyContent (more complex cases)
    # Note: This will need manual review for cases where both props exist
done

echo "Basic DOM prop fixes completed!"
echo "Note: Files with complex combinations may need manual review"
echo "Check for any syntax errors and duplicate style props"