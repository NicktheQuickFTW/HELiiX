/**
 * Remove Salary Data from All Profiles
 * Cleans up coach profiles by removing salary and contract financial details
 */

import fs from 'fs';
import path from 'path';

interface ProfileCleanupResult {
  profilesProcessed: number;
  salariesRemoved: number;
  contractsModified: number;
  filesUpdated: string[];
}

async function removeSalaryData(): Promise<ProfileCleanupResult> {
  console.log('🧹 REMOVING SALARY DATA FROM ALL PROFILES');
  console.log('=========================================');
  
  const result: ProfileCleanupResult = {
    profilesProcessed: 0,
    salariesRemoved: 0,
    contractsModified: 0,
    filesUpdated: []
  };

  // Remove salary fields from coach research agent
  await cleanupCoachResearchAgent(result);
  
  // Remove salary from deep research agent
  await cleanupDeepResearchAgent(result);
  
  // Remove salary from validation agent
  await cleanupValidationAgent(result);
  
  // Remove salary from any generated data files
  await cleanupGeneratedProfiles(result);
  
  console.log('');
  console.log('✅ SALARY DATA REMOVAL COMPLETE');
  console.log('===============================');
  console.log(`📊 Profiles Processed: ${result.profilesProcessed}`);
  console.log(`💰 Salaries Removed: ${result.salariesRemoved}`);
  console.log(`📋 Contracts Modified: ${result.contractsModified}`);
  console.log(`📁 Files Updated: ${result.filesUpdated.length}`);
  
  return result;
}

async function cleanupCoachResearchAgent(result: ProfileCleanupResult): Promise<void> {
  console.log('🔧 Cleaning up Coach Research Agent...');
  
  const filePath = '/Users/nickw/Documents/XII-Ops/HELiiX/src/lib/agents/research/coach-research-agent.ts';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove salary-related lines
    const salaryPatterns = [
      /salary.*annually/gi,
      /\$[\d,]+(\.\d+)?[MK]?\s*(annually|per year)/gi,
      /salary.*research required/gi,
      /contract.*salary/gi,
      /salary_database/gi
    ];
    
    salaryPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, 'Contract details available upon request');
        modified = true;
        result.salariesRemoved++;
      }
    });
    
    // Clean up contract details sections
    if (content.includes('contract_details')) {
      content = content.replace(/salary: ['"][^'"]*['"],?/g, '// salary: "Contract details available upon request",');
      content = content.replace(/total_compensation.*,/g, '// total_compensation removed,');
      modified = true;
      result.contractsModified++;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      result.filesUpdated.push('coach-research-agent.ts');
      console.log('  ✅ Updated Coach Research Agent');
    }
    
    result.profilesProcessed++;
    
  } catch (error) {
    console.warn(`  ⚠️ Could not update ${filePath}:`, error.message);
  }
}

async function cleanupDeepResearchAgent(result: ProfileCleanupResult): Promise<void> {
  console.log('🔧 Cleaning up Deep Research Agent...');
  
  const filePath = '/Users/nickw/Documents/XII-Ops/HELiiX/src/lib/agents/research/deep-research-agent.ts';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove salary generation in mock data
    if (content.includes('annual_salary') || content.includes('total_compensation')) {
      content = content.replace(/annual_salary: `\$[^`]*`,/g, '// annual_salary: "Information not disclosed",');
      content = content.replace(/total_compensation: `\$[^`]*`,/g, '// total_compensation: "Information not disclosed",');
      content = content.replace(/salary: `\$[^`]*`,/g, '// salary: "Contract details private",');
      modified = true;
      result.contractsModified++;
    }
    
    // Remove USA Today salary rank references
    if (content.includes('usa_today_salary_rank')) {
      content = content.replace(/usa_today_salary_rank:.*,/g, '// usa_today_salary_rank: removed,');
      modified = true;
    }
    
    // Update queries to not request salary information
    content = content.replace(/salary information/gi, 'coaching background');
    content = content.replace(/contract details/gi, 'career history');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      result.filesUpdated.push('deep-research-agent.ts');
      console.log('  ✅ Updated Deep Research Agent');
      result.salariesRemoved += 3;
    }
    
    result.profilesProcessed++;
    
  } catch (error) {
    console.warn(`  ⚠️ Could not update ${filePath}:`, error.message);
  }
}

async function cleanupValidationAgent(result: ProfileCleanupResult): Promise<void> {
  console.log('🔧 Cleaning up Validation Agent...');
  
  const filePath = '/Users/nickw/Documents/XII-Ops/HELiiX/src/lib/agents/validation/profile-validation-agent.ts';
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove salary validation rules
    if (content.includes('salary')) {
      content = content.replace(/field: 'contract_details\.salary'[^}]*}/s, 
        `field: 'coaching_philosophy.team_culture',
        type: 'format',
        description: 'Team culture should be well defined',
        validate: (value) => ({
          valid: value && typeof value === 'string' && value.length > 0,
          severity: 'info' as const,
          message: value ? 'Team culture defined' : 'Team culture not specified',
          suggestion: 'Add team culture and philosophy details'
        })`);
      modified = true;
      result.salariesRemoved++;
    }
    
    // Remove salary-related recommendations
    content = content.replace(/Research public salary information.*$/gm, '');
    content = content.replace(/salary information.*$/gm, '');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      result.filesUpdated.push('profile-validation-agent.ts');
      console.log('  ✅ Updated Validation Agent');
    }
    
    result.profilesProcessed++;
    
  } catch (error) {
    console.warn(`  ⚠️ Could not update ${filePath}:`, error.message);
  }
}

async function cleanupGeneratedProfiles(result: ProfileCleanupResult): Promise<void> {
  console.log('🔧 Cleaning up generated profile scripts...');
  
  const scriptsToClean = [
    '/Users/nickw/Documents/XII-Ops/HELiiX/src/scripts/demo-coach-profiles.ts',
    '/Users/nickw/Documents/XII-Ops/HELiiX/src/scripts/validate-player-profiles.ts',
    '/Users/nickw/Documents/XII-Ops/HELiiX/src/scripts/comprehensive-media-day-research.ts'
  ];
  
  for (const filePath of scriptsToClean) {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Remove salary display in console logs
        if (content.includes('💰 Salary:')) {
          content = content.replace(/console\.log\(`.*💰 Salary:.*`\);?/g, 
            '// console.log(`💰 Salary information removed`);');
          modified = true;
          result.salariesRemoved++;
        }
        
        // Remove salary from mock data
        if (content.includes('$5.5M annually') || content.includes('$4.0M annually')) {
          content = content.replace(/\$\d+\.\d+M annually/g, 'Contract details private');
          modified = true;
          result.contractsModified++;
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content);
          result.filesUpdated.push(path.basename(filePath));
          console.log(`  ✅ Updated ${path.basename(filePath)}`);
        }
        
        result.profilesProcessed++;
      }
    } catch (error) {
      console.warn(`  ⚠️ Could not update ${filePath}:`, error.message);
    }
  }
}

// Execute cleanup
if (require.main === module) {
  removeSalaryData()
    .then((result) => {
      console.log('');
      console.log('🎯 SALARY DATA SUCCESSFULLY REMOVED');
      console.log('All profiles now focus on athletic and media content only.');
      
      if (result.filesUpdated.length > 0) {
        console.log('');
        console.log('📁 Updated Files:');
        result.filesUpdated.forEach(file => {
          console.log(`   • ${file}`);
        });
      }
      
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

export default removeSalaryData;