#!/usr/bin/env node

/**
 * More Precise Common Policy Identification
 * Looks for actual policy content that's identical across sports
 */

const fs = require('fs').promises;
const path = require('path');

const POLICIES_DIR =
  '/Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies';

const SPORT_FILES = [
  'big12-baseball-policies.md',
  'big12-basketball-policies.md',
  'big12-football-policies.md',
  'big12-gymnastics-policies.md',
  'big12-lacrosse-policies.md',
  'big12-soccer-policies.md',
  'big12-softball-policies.md',
  'big12-tennis-policies.md',
  'big12-volleyball-policies.md',
  'big12-wrestling-policies.md',
];

/**
 * Extract specific policy references that point to common sections
 */
async function extractPolicyReferences() {
  console.log('🔍 Looking for actual common policy references...\n');

  const commonReferences = new Map();

  for (const fileName of SPORT_FILES) {
    const filePath = path.join(POLICIES_DIR, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      console.log(`📖 Analyzing: ${fileName}`);

      // Look for lines that reference common policies
      const lines = content.split('\n');
      const references = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();

        // Look for references to Conference Policies or Conference Rules
        if (
          line.includes('see conference policies') ||
          line.includes('see conference rules') ||
          line.includes('see c.r.') ||
          line.includes('conference policies >')
        ) {
          // Get context (previous line for section title)
          let contextLines = [];
          if (i > 0 && lines[i - 1].startsWith('##')) {
            contextLines.push(lines[i - 1]);
          }
          contextLines.push(lines[i]);

          references.push({
            lineNumber: i + 1,
            context: contextLines,
            reference: lines[i].trim(),
          });
        }
      }

      console.log(`   Found ${references.length} policy references`);

      // Track common references
      for (const ref of references) {
        const key = ref.reference.toLowerCase();
        if (!commonReferences.has(key)) {
          commonReferences.set(key, {
            reference: ref.reference,
            files: [],
            count: 0,
          });
        }

        commonReferences.get(key).files.push(fileName);
        commonReferences.get(key).count++;
      }
    } catch (error) {
      console.error(`❌ Error reading ${fileName}:`, error.message);
    }
  }

  return commonReferences;
}

/**
 * Find specific policy text that appears identically across files
 */
async function findIdenticalPolicyText() {
  console.log('\n🔍 Looking for identical policy text across files...\n');

  const policyTexts = new Map();

  for (const fileName of SPORT_FILES) {
    const filePath = path.join(POLICIES_DIR, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Extract sections that contain actual policy text (not just references)
      const sections = content.split(/\n## /);

      for (const section of sections) {
        const lines = section.split('\n');
        const title = lines[0].replace(/^#+ /, '').trim();

        // Look for sections with substantial policy content
        if (
          section.length > 200 &&
          !section.toLowerCase().includes('see conference policies') &&
          !section.toLowerCase().includes('see conference rules') &&
          (title.toLowerCase().includes('sportsmanship') ||
            title.toLowerCase().includes('ejected') ||
            title.toLowerCase().includes('disqualified') ||
            title.toLowerCase().includes('crowd control') ||
            title.toLowerCase().includes('game management') ||
            title.toLowerCase().includes('academic awards') ||
            title.toLowerCase().includes('travel issues') ||
            title.toLowerCase().includes('teamworks') ||
            title.toLowerCase().includes('public comments'))
        ) {
          const key = title.toLowerCase();
          if (!policyTexts.has(key)) {
            policyTexts.set(key, {
              title: title,
              content: section,
              files: [],
              similarContent: [],
            });
          }

          policyTexts.get(key).files.push(fileName);
          policyTexts.get(key).similarContent.push({
            file: fileName,
            content: section,
          });
        }
      }
    } catch (error) {
      console.error(`❌ Error reading ${fileName}:`, error.message);
    }
  }

  return policyTexts;
}

/**
 * Generate detailed report of findings
 */
async function generateDetailedReport(commonReferences, policyTexts) {
  console.log('\n📊 Analysis Results:');
  console.log('====================');

  // Show common references
  console.log('\n🔗 Common Policy References (found in multiple files):');
  const sortedRefs = Array.from(commonReferences.entries())
    .filter(([, data]) => data.count >= 3)
    .sort((a, b) => b[1].count - a[1].count);

  for (const [key, data] of sortedRefs) {
    console.log(`\n✅ "${data.reference}"`);
    console.log(`   📁 Found in: ${data.files.join(', ')}`);
    console.log(`   📊 Count: ${data.count} files`);
  }

  // Show potential identical policy text
  console.log('\n📝 Potential Identical Policy Content:');
  const sortedTexts = Array.from(policyTexts.entries())
    .filter(([, data]) => data.files.length >= 2)
    .sort((a, b) => b[1].files.length - a[1].files.length);

  for (const [key, data] of sortedTexts) {
    console.log(`\n✅ "${data.title}"`);
    console.log(`   📁 Found in: ${data.files.join(', ')}`);
    console.log(`   📊 Files: ${data.files.length}`);

    // Check if content is actually identical
    const contents = data.similarContent.map((item) => item.content);
    const isIdentical = contents.every((content) => content === contents[0]);
    console.log(`   🔄 Identical content: ${isIdentical ? 'Yes' : 'No'}`);
  }

  // Generate comprehensive report
  const report = `# Detailed Common Policy Analysis

## Executive Summary

### Common Policy References (appear in multiple files)
${sortedRefs
  .map(
    ([key, data]) => `
- **"${data.reference}"**
  - Files: ${data.count}
  - Found in: ${data.files.join(', ')}
`
  )
  .join('')}

### Potential Common Policy Content
${sortedTexts
  .map(
    ([key, data]) => `
- **"${data.title}"**
  - Files: ${data.files.length}
  - Found in: ${data.files.join(', ')}
  - Identical: ${data.similarContent.every((item) => item.content === data.similarContent[0].content) ? 'Yes' : 'Needs Review'}
`
  )
  .join('')}

## Recommendations

### High Priority - Move to Common Section:
${sortedRefs
  .filter(([, data]) => data.count >= 7)
  .map(([, data]) => `- ${data.reference}`)
  .join('\n')}

### Medium Priority - Review for Consolidation:
${sortedTexts
  .filter(([, data]) => data.files.length >= 4)
  .map(([, data]) => `- ${data.title}`)
  .join('\n')}

Generated: ${new Date().toISOString()}
`;

  await fs.writeFile(
    path.join(POLICIES_DIR, 'detailed-common-policy-analysis.md'),
    report,
    'utf-8'
  );

  console.log(
    '\n✅ Generated detailed analysis: detailed-common-policy-analysis.md'
  );
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Detailed Common Policy Analysis');
  console.log('==================================');

  try {
    const commonReferences = await extractPolicyReferences();
    const policyTexts = await findIdenticalPolicyText();

    await generateDetailedReport(commonReferences, policyTexts);

    console.log('\n🎉 Analysis complete!');
  } catch (error) {
    console.error('❌ Error during analysis:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
