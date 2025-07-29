#!/usr/bin/env node

/**
 * Big 12 Policy Consolidation Script
 * Identifies common policies across sport files and consolidates them
 */

const fs = require('fs').promises;
const path = require('path');

const POLICIES_DIR =
  '/Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies';
const COMMON_SECTION_FILE = path.join(
  POLICIES_DIR,
  'big12-common-section-policies.md'
);

// Common policies that appear across all sports
const COMMON_POLICIES = [
  'Conference Credentials',
  'Public Comments',
  'Sportsmanship & Ethical Conduct',
  'Issues Not Addressed',
  'Conference Branding',
  'Academic Awards',
  'Ejected/Disqualified Player',
  'Game Management',
  'Crowd Control',
  'Officials Medical',
  'Travel Issues/Contingencies',
  'Teamworks',
  'Trophy Policy',
];

// Sport files to process
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
 * Parse markdown file and extract sections
 */
async function parseMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Split into sections based on ## headers
    const sections = [];
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim(),
          });
        }
        // Start new section
        currentSection = line.substring(3).trim();
        currentContent = [line];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n').trim(),
      });
    }

    return sections;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Check if a section contains common policy content
 */
function isCommonPolicy(sectionTitle, sectionContent) {
  const titleLower = sectionTitle.toLowerCase();
  const contentLower = sectionContent.toLowerCase();

  return COMMON_POLICIES.some((policy) => {
    const policyLower = policy.toLowerCase();
    return (
      titleLower.includes(policyLower) ||
      contentLower.includes('see conference policies') ||
      contentLower.includes('see conference rules') ||
      (titleLower.includes('policies') && contentLower.includes(policyLower))
    );
  });
}

/**
 * Extract common policies from all sport files
 */
async function extractCommonPolicies() {
  console.log('🔍 Analyzing sport files for common policies...\n');

  const commonSections = new Map();
  const fileAnalysis = {};

  for (const fileName of SPORT_FILES) {
    const filePath = path.join(POLICIES_DIR, fileName);
    console.log(`📖 Analyzing: ${fileName}`);

    const sections = await parseMarkdownFile(filePath);
    fileAnalysis[fileName] = sections;

    // Find sections that appear to be common policies
    const commonInThisFile = [];

    for (const section of sections) {
      if (isCommonPolicy(section.title, section.content)) {
        commonInThisFile.push(section);

        // Track how many files have this policy
        const key = section.title.toLowerCase();
        if (!commonSections.has(key)) {
          commonSections.set(key, {
            title: section.title,
            content: section.content,
            files: [],
            count: 0,
          });
        }

        commonSections.get(key).files.push(fileName);
        commonSections.get(key).count++;
      }
    }

    console.log(
      `   Found ${commonInThisFile.length} potential common policies`
    );
  }

  console.log('\n📊 Common Policy Analysis:');
  console.log('===========================');

  // Show policies that appear in multiple files
  const trulyCommonPolicies = [];

  for (const [key, policy] of commonSections.entries()) {
    if (policy.count >= 3) {
      // Appears in at least 3 sport files
      console.log(`✅ "${policy.title}" - Found in ${policy.count} files`);
      trulyCommonPolicies.push(policy);
    } else {
      console.log(`⚠️  "${policy.title}" - Only in ${policy.count} files`);
    }
  }

  return { trulyCommonPolicies, fileAnalysis };
}

/**
 * Update the common section file with consolidated policies
 */
async function updateCommonSectionFile(commonPolicies) {
  console.log('\n📝 Updating common section file...');

  try {
    // Read existing common section file
    let existingContent = '';
    try {
      existingContent = await fs.readFile(COMMON_SECTION_FILE, 'utf-8');
    } catch (error) {
      console.log('   Creating new common section file...');
    }

    // Create new consolidated content
    let newContent = existingContent;

    // Add common policies section
    const commonPolicySection = `
---

## Additional Common Policies

The following policies are common across all Big 12 sports and are referenced in individual sport manuals:

`;

    let additionalPolicies = '';

    for (const policy of commonPolicies) {
      additionalPolicies += `### ${policy.title}\n\n${policy.content}\n\n---\n\n`;
    }

    // Append to existing content
    if (!newContent.includes('## Additional Common Policies')) {
      newContent += commonPolicySection + additionalPolicies;
    }

    await fs.writeFile(COMMON_SECTION_FILE, newContent, 'utf-8');
    console.log(
      `✅ Updated common section file with ${commonPolicies.length} policies`
    );
  } catch (error) {
    console.error('❌ Error updating common section file:', error.message);
  }
}

/**
 * Create reference updates for sport files
 */
async function createSportFileUpdates(commonPolicies, fileAnalysis) {
  console.log('\n📋 Creating sport file update recommendations...');

  const updatePlan = [];

  for (const [fileName, sections] of Object.entries(fileAnalysis)) {
    const updates = [];

    for (const section of sections) {
      const isCommon = commonPolicies.some(
        (cp) => cp.title.toLowerCase() === section.title.toLowerCase()
      );

      if (isCommon) {
        updates.push({
          originalTitle: section.title,
          recommendation: `Replace with: "See Common Section > ${section.title}"`,
        });
      }
    }

    if (updates.length > 0) {
      updatePlan.push({
        file: fileName,
        updates: updates,
      });
    }
  }

  // Save update plan
  const updatePlanContent = JSON.stringify(updatePlan, null, 2);
  await fs.writeFile(
    path.join(POLICIES_DIR, 'sport-file-update-plan.json'),
    updatePlanContent,
    'utf-8'
  );

  console.log(`✅ Created update plan for ${updatePlan.length} sport files`);
  console.log('   Saved to: sport-file-update-plan.json');

  return updatePlan;
}

/**
 * Generate summary report
 */
async function generateSummaryReport(commonPolicies, updatePlan) {
  const report = `# Big 12 Policy Consolidation Report

## Summary
- **Common policies identified:** ${commonPolicies.length}
- **Sport files to update:** ${updatePlan.length}
- **Total sections to consolidate:** ${updatePlan.reduce((sum, file) => sum + file.updates.length, 0)}

## Common Policies Identified

${commonPolicies
  .map(
    (policy) => `### ${policy.title}
- **Found in:** ${policy.files.join(', ')}
- **Files count:** ${policy.count}
`
  )
  .join('\n')}

## Sport File Updates Required

${updatePlan
  .map(
    (file) => `### ${file.file}
**Sections to replace:**
${file.updates.map((update) => `- ${update.originalTitle} → ${update.recommendation}`).join('\n')}
`
  )
  .join('\n')}

## Next Steps

1. **Review common policies** in the updated common section file
2. **Update sport files** according to the update plan
3. **Verify references** are working correctly
4. **Test policy lookup** functionality

Generated on: ${new Date().toISOString()}
`;

  await fs.writeFile(
    path.join(POLICIES_DIR, 'consolidation-report.md'),
    report,
    'utf-8'
  );

  console.log('✅ Generated consolidation report: consolidation-report.md');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Big 12 Policy Consolidation Tool');
  console.log('===================================\n');

  try {
    // Extract common policies
    const { trulyCommonPolicies, fileAnalysis } = await extractCommonPolicies();

    if (trulyCommonPolicies.length === 0) {
      console.log('❌ No common policies found across multiple files');
      return;
    }

    // Update common section file
    await updateCommonSectionFile(trulyCommonPolicies);

    // Create update plan for sport files
    const updatePlan = await createSportFileUpdates(
      trulyCommonPolicies,
      fileAnalysis
    );

    // Generate summary report
    await generateSummaryReport(trulyCommonPolicies, updatePlan);

    console.log('\n🎉 Policy consolidation analysis complete!');
    console.log('\nNext steps:');
    console.log('1. Review the consolidation-report.md');
    console.log('2. Check the updated common section file');
    console.log('3. Apply updates to individual sport files');
  } catch (error) {
    console.error('❌ Error during consolidation:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  extractCommonPolicies,
  updateCommonSectionFile,
  createSportFileUpdates,
};
