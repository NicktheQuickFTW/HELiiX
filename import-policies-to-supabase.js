#!/usr/bin/env node

/**
 * Big 12 Sport Policies Import Script
 * Imports sport policy data from markdown files into Supabase database
 *
 * Usage: node import-policies-to-supabase.js
 */

const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '/Users/nickw/.env/flextime.env' });

// Supabase client setup
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Missing Supabase configuration. Please check your .env file.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directory containing policy files
const POLICIES_DIR =
  '/Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies';

// Sport configuration with gender specifications
const SPORT_CONFIG = {
  baseball: { name: 'Baseball', gender: 'men', year: '2025' },
  basketball: {
    name: 'Basketball',
    gender: 'both', // Will create separate entries for men's and women's
    year: '2024-25',
    variations: [
      { name: "Men's Basketball", gender: 'men' },
      { name: "Women's Basketball", gender: 'women' },
    ],
  },
  football: { name: 'Football', gender: 'men', year: '2024' },
  gymnastics: { name: 'Gymnastics', gender: 'women', year: '2025' },
  lacrosse: { name: 'Lacrosse', gender: 'women', year: '2025' },
  soccer: { name: 'Soccer', gender: 'both', year: '2024' }, // Both genders compete
  softball: { name: 'Softball', gender: 'women', year: '2025' },
  tennis: {
    name: 'Tennis',
    gender: 'both', // Will create separate entries for men's and women's
    year: '2025',
    variations: [
      { name: "Men's Tennis", gender: 'men' },
      { name: "Women's Tennis", gender: 'women' },
    ],
  },
  volleyball: { name: 'Volleyball', gender: 'women', year: '2024' },
  wrestling: { name: 'Wrestling', gender: 'men', year: '2024-25' },
  'common-section': { name: 'Common Section', gender: 'all', year: '2024-25' },
};

/**
 * Generate a random policy ID
 */
function generatePolicyId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Parse markdown file and extract structured content
 */
async function parseMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Extract title from first heading
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');

    // Extract table of contents
    const tocMatch = content.match(/## Table of Contents\n(.*?)\n\n---/s);
    const tableOfContents = tocMatch ? tocMatch[1] : '';

    // Split content into sections
    const sections = [];
    const sectionRegex = /^##? ([^#\n]+)\n(.*?)(?=\n##? |$)/gms;
    let match;

    while ((match = sectionRegex.exec(content)) !== null) {
      const [, sectionTitle, sectionContent] = match;
      sections.push({
        title: sectionTitle.trim(),
        content: sectionContent.trim(),
      });
    }

    return {
      title,
      content,
      tableOfContents,
      sections,
      wordCount: content.split(/\s+/).length,
      lastModified: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract awards criteria from parsed content
 */
function extractAwardsCriteria(parsedContent) {
  const awards = [];

  // Look for awards sections
  const awardsSection = parsedContent.sections.find(
    (s) =>
      s.title.toLowerCase().includes('award') ||
      s.title.toLowerCase().includes('recognition')
  );

  if (awardsSection) {
    // Extract criteria patterns
    const criteriaPatterns = [
      /Scholar-Athlete of the Year Criteria[:\s]*(.*?)(?=\n\n|$)/s,
      /Academic All-Big 12.*?requirements[:\s]*(.*?)(?=\n\n|$)/s,
      /All-Big 12.*?criteria[:\s]*(.*?)(?=\n\n|$)/s,
    ];

    criteriaPatterns.forEach((pattern) => {
      const match = awardsSection.content.match(pattern);
      if (match) {
        awards.push({
          type: 'criteria',
          content: match[1].trim(),
        });
      }
    });
  }

  return awards;
}

/**
 * Extract scheduling parameters from parsed content
 */
function extractSchedulingParameters(parsedContent) {
  const parameters = [];

  // Look for scheduling sections
  const schedulingSection = parsedContent.sections.find(
    (s) =>
      s.title.toLowerCase().includes('schedul') ||
      s.title.toLowerCase().includes('conference agreement')
  );

  if (schedulingSection) {
    // Extract schedule format information
    const formatMatch = schedulingSection.content.match(
      /Schedule format[:\s]*(.*?)(?=\n\n|$)/s
    );
    if (formatMatch) {
      parameters.push({
        type: 'format',
        content: formatMatch[1].trim(),
      });
    }

    // Extract game count information
    const gameCountMatch = schedulingSection.content.match(
      /(\d+)[-\s]*game[s]?\s+(schedule|Conference)/i
    );
    if (gameCountMatch) {
      parameters.push({
        type: 'game_count',
        value: parseInt(gameCountMatch[1]),
      });
    }
  }

  return parameters;
}

/**
 * Check existing tables and data
 */
async function checkDatabaseStructure() {
  console.log('🔍 Checking database structure...');

  try {
    // Check if policies table exists and get structure
    const { data: policies, error: policiesError } = await supabase
      .from('policies')
      .select('*')
      .limit(1);

    if (policiesError) {
      console.log('❌ Policies table error:', policiesError.message);
      return false;
    }

    // Check if awards table exists
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*')
      .limit(1);

    if (awardsError) {
      console.log('❌ Awards table error:', awardsError.message);
    }

    // Check if scheduling_parameters table exists
    const { data: scheduling, error: schedulingError } = await supabase
      .from('scheduling_parameters')
      .select('*')
      .limit(1);

    if (schedulingError) {
      console.log(
        '❌ Scheduling parameters table error:',
        schedulingError.message
      );
    }

    console.log('✅ Database structure checked successfully');
    return true;
  } catch (error) {
    console.error('❌ Error checking database structure:', error);
    return false;
  }
}

/**
 * Import policies data to Supabase
 */
async function importPolicies() {
  console.log('📁 Reading policy files from:', POLICIES_DIR);

  try {
    const files = await fs.readdir(POLICIES_DIR);
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    console.log(`📋 Found ${markdownFiles.length} markdown files`);

    const policiesToInsert = [];
    const awardsToInsert = [];
    const schedulingToInsert = [];

    for (const file of markdownFiles) {
      const filePath = path.join(POLICIES_DIR, file);
      const sportKey = path
        .basename(file, '.md')
        .replace('big12-', '')
        .replace('-policies', '');
      const sportConfig = SPORT_CONFIG[sportKey];

      if (!sportConfig) {
        console.log(`⚠️  No configuration found for sport: ${sportKey}`);
        continue;
      }

      console.log(`📖 Processing: ${file}`);

      const parsedContent = await parseMarkdownFile(filePath);
      if (!parsedContent) continue;

      // Extract awards and scheduling data
      const awards = extractAwardsCriteria(parsedContent);
      const scheduling = extractSchedulingParameters(parsedContent);

      // Handle sports with gender variations (Basketball, Tennis)
      if (sportConfig.variations) {
        for (const variation of sportConfig.variations) {
          const policyData = {
            policy_id: generatePolicyId(),
            sport: variation.name,
            gender: variation.gender,
            year: sportConfig.year,
            title: parsedContent.title.replace(
              sportConfig.name,
              variation.name
            ),
            content: parsedContent.content,
            table_of_contents: parsedContent.tableOfContents,
            sections: JSON.stringify(parsedContent.sections),
            word_count: parsedContent.wordCount,
            last_modified: parsedContent.lastModified,
            source_file: file,
            category: 'sport_policy',
          };

          policiesToInsert.push(policyData);

          // Add awards and scheduling data for each variation
          awards.forEach((award) => {
            awardsToInsert.push({
              policy_id: policyData.policy_id,
              sport: variation.name,
              gender: variation.gender,
              year: sportConfig.year,
              ...award,
            });
          });

          scheduling.forEach((param) => {
            schedulingToInsert.push({
              policy_id: policyData.policy_id,
              sport: variation.name,
              gender: variation.gender,
              year: sportConfig.year,
              ...param,
            });
          });
        }
      } else {
        // Single entry for sports without gender variations
        const policyData = {
          policy_id: generatePolicyId(),
          sport: sportConfig.name,
          gender: sportConfig.gender,
          year: sportConfig.year,
          title: parsedContent.title,
          content: parsedContent.content,
          table_of_contents: parsedContent.tableOfContents,
          sections: JSON.stringify(parsedContent.sections),
          word_count: parsedContent.wordCount,
          last_modified: parsedContent.lastModified,
          source_file: file,
          category: 'sport_policy',
        };

        policiesToInsert.push(policyData);

        // Add awards and scheduling data
        awards.forEach((award) => {
          awardsToInsert.push({
            policy_id: policyData.policy_id,
            sport: sportConfig.name,
            gender: sportConfig.gender,
            year: sportConfig.year,
            ...award,
          });
        });

        scheduling.forEach((param) => {
          schedulingToInsert.push({
            policy_id: policyData.policy_id,
            sport: sportConfig.name,
            gender: sportConfig.gender,
            year: sportConfig.year,
            ...param,
          });
        });
      }
    }

    console.log(`📊 Prepared ${policiesToInsert.length} policy records`);
    console.log(`🏆 Prepared ${awardsToInsert.length} awards records`);
    console.log(`📅 Prepared ${schedulingToInsert.length} scheduling records`);

    // Insert policies data
    if (policiesToInsert.length > 0) {
      console.log('💾 Inserting policies data...');
      const { data: insertedPolicies, error: policiesError } = await supabase
        .from('policies')
        .insert(policiesToInsert)
        .select();

      if (policiesError) {
        console.error('❌ Error inserting policies:', policiesError);
      } else {
        console.log(
          `✅ Successfully inserted ${insertedPolicies.length} policy records`
        );
      }
    }

    // Insert awards data
    if (awardsToInsert.length > 0) {
      console.log('💾 Inserting awards data...');
      const { data: insertedAwards, error: awardsError } = await supabase
        .from('awards')
        .insert(awardsToInsert)
        .select();

      if (awardsError) {
        console.error('❌ Error inserting awards:', awardsError);
      } else {
        console.log(
          `✅ Successfully inserted ${insertedAwards.length} awards records`
        );
      }
    }

    // Insert scheduling data
    if (schedulingToInsert.length > 0) {
      console.log('💾 Inserting scheduling data...');
      const { data: insertedScheduling, error: schedulingError } =
        await supabase
          .from('scheduling_parameters')
          .insert(schedulingToInsert)
          .select();

      if (schedulingError) {
        console.error(
          '❌ Error inserting scheduling parameters:',
          schedulingError
        );
      } else {
        console.log(
          `✅ Successfully inserted ${insertedScheduling.length} scheduling records`
        );
      }
    }
  } catch (error) {
    console.error('❌ Error during import:', error);
  }
}

/**
 * Display summary of what will be imported
 */
async function showImportSummary() {
  console.log('\n📋 Import Summary:');
  console.log('==================');

  Object.entries(SPORT_CONFIG).forEach(([key, config]) => {
    if (config.variations) {
      config.variations.forEach((variation) => {
        console.log(
          `📌 ${variation.name} (${variation.gender}) - ${config.year}`
        );
      });
    } else {
      console.log(`📌 ${config.name} (${config.gender}) - ${config.year}`);
    }
  });

  console.log('\n🎯 Data will be imported into:');
  console.log('  • policies table (main policy content)');
  console.log('  • awards table (awards criteria)');
  console.log('  • scheduling_parameters table (scheduling info)');
  console.log('');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Big 12 Sport Policies Import Script');
  console.log('=====================================\n');

  // Show import summary
  await showImportSummary();

  // Check database connection and structure
  const dbCheck = await checkDatabaseStructure();
  if (!dbCheck) {
    console.error(
      '❌ Database structure check failed. Please ensure tables exist.'
    );
    process.exit(1);
  }

  // Prompt for confirmation
  console.log('⚠️  This will import policy data into your Supabase database.');
  console.log('   Make sure you have backed up any existing data.');
  console.log('   Press Ctrl+C to cancel, or any key to continue...\n');

  // Import the policies
  await importPolicies();

  console.log('\n✅ Import process completed!');
  console.log('🔍 Check your Supabase dashboard to verify the imported data.');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  importPolicies,
  parseMarkdownFile,
  extractAwardsCriteria,
  extractSchedulingParameters,
};
