/**
 * Demo: Big 12 Coach Profile Generation
 * Demonstrates the coach research agent and profile generation capabilities
 */

import CoachResearchAgent from '../lib/agents/research/coach-research-agent';

// Big 12 football head coaches for 2025 season
const big12Coaches = [
  { name: 'Brent Brennan', school: 'Arizona' },
  { name: 'Kenny Dillingham', school: 'Arizona State' },
  { name: 'Dave Aranda', school: 'Baylor' },
  { name: 'Kalani Sitake', school: 'BYU' },
  { name: 'Scott Satterfield', school: 'Cincinnati' },
  { name: 'Deion Sanders', school: 'Colorado' },
  { name: 'Willie Fritz', school: 'Houston' },
  { name: 'Matt Campbell', school: 'Iowa State' },
  { name: 'Lance Leipold', school: 'Kansas' },
  { name: 'Chris Klieman', school: 'Kansas State' },
  { name: 'Mike Gundy', school: 'Oklahoma State' },
  { name: 'Sonny Dykes', school: 'TCU' },
  { name: 'Joey McGuire', school: 'Texas Tech' },
  { name: 'Gus Malzahn', school: 'UCF' },
  { name: 'Kyle Whittingham', school: 'Utah' },
  { name: 'Rich Rodriguez', school: 'West Virginia' }
];

async function demonstrateCoachProfileGeneration() {
  console.log('🏈 BIG 12 COACH PROFILE GENERATION DEMO');
  console.log('=====================================');
  console.log(`Generating profiles for ${big12Coaches.length} head coaches`);
  console.log('');

  const coachAgent = new CoachResearchAgent();
  const startTime = Date.now();
  const results = [];

  // Process coaches in batches of 4 for realistic simulation
  const batchSize = 4;
  for (let i = 0; i < big12Coaches.length; i += batchSize) {
    const batch = big12Coaches.slice(i, i + batchSize);
    
    console.log(`📋 Processing Batch ${Math.floor(i / batchSize) + 1}: ${batch.map(c => c.school).join(', ')}`);
    
    const batchPromises = batch.map(async (coach) => {
      try {
        console.log(`  🔍 Researching ${coach.name} (${coach.school})...`);
        const profile = await coachAgent.researchCoach(coach.name, coach.school);
        
        const completeness = calculateCoachCompleteness(profile);
        const status = completeness > 0.8 ? '✅' : completeness > 0.6 ? '⚠️' : '❌';
        
        console.log(`  ${status} ${coach.school.padEnd(15)} | ${coach.name.padEnd(20)} | ${(completeness * 100).toFixed(1)}% complete`);
        
        if (profile.contract_details?.salary) {
          // console.log(`💰 Salary information removed`);
        }
        
        if (profile.career_record?.overall_wins !== undefined) {
          console.log(`      📊 Record: ${profile.career_record.overall_wins}-${profile.career_record.overall_losses}`);
        }
        
        if (profile.hire_date) {
          const tenure = new Date().getFullYear() - new Date(profile.hire_date).getFullYear();
          console.log(`      📅 Tenure: ${tenure} years (hired ${profile.hire_date})`);
        }
        
        return { coach, profile, completeness };
        
      } catch (error) {
        console.error(`  ❌ Failed to generate profile for ${coach.name}:`, error.message);
        return { coach, profile: null, completeness: 0, error: error.message };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults.map(r => r.status === 'fulfilled' ? r.value : r.reason));
    
    console.log('');
    
    // Small delay between batches to simulate realistic processing
    if (i + batchSize < big12Coaches.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const processingTime = Date.now() - startTime;
  
  console.log('📊 GENERATION SUMMARY');
  console.log('====================');
  
  const successful = results.filter(r => r.profile);
  const failed = results.filter(r => !r.profile);
  const avgCompleteness = successful.length > 0 
    ? successful.reduce((sum, r) => sum + r.completeness, 0) / successful.length 
    : 0;
  
  console.log(`✅ Successful: ${successful.length}/${big12Coaches.length} coaches`);
  console.log(`❌ Failed: ${failed.length}/${big12Coaches.length} coaches`);
  console.log(`📈 Average Completeness: ${(avgCompleteness * 100).toFixed(1)}%`);
  console.log(`⏱️  Total Processing Time: ${(processingTime / 1000).toFixed(2)} seconds`);
  console.log(`⚡ Processing Rate: ${(big12Coaches.length / (processingTime / 1000)).toFixed(2)} profiles/second`);
  
  if (failed.length > 0) {
    console.log('');
    console.log('❌ Failed Coaches:');
    failed.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.coach.name} (${result.coach.school}): ${result.error}`);
    });
  }
  
  console.log('');
  console.log('🎯 TOP PERFORMING COACHES BY COMPLETENESS:');
  console.log('==========================================');
  
  const topCoaches = successful
    .sort((a, b) => b.completeness - a.completeness)
    .slice(0, 5);
    
  topCoaches.forEach((result, index) => {
    console.log(`${index + 1}. ${result.coach.name} (${result.coach.school}) - ${(result.completeness * 100).toFixed(1)}%`);
  });
  
  // Save summary data
  const summary = {
    timestamp: new Date().toISOString(),
    total_coaches: big12Coaches.length,
    successful: successful.length,
    failed: failed.length,
    avg_completeness: avgCompleteness,
    processing_time_ms: processingTime,
    profiles_per_second: big12Coaches.length / (processingTime / 1000),
    results: results.map(r => ({
      school: r.coach.school,
      coach: r.coach.name,
      success: !!r.profile,
      completeness: r.completeness,
      error: r.error || null
    }))
  };
  
  console.log('');
  console.log('💾 SUMMARY DATA:');
  console.log(JSON.stringify(summary, null, 2));
  
  return summary;
}

function calculateCoachCompleteness(coach: any): number {
  if (!coach) return 0;
  
  const requiredFields = ['name', 'school', 'title', 'hire_date', 'career_record'];
  const optionalFields = ['contract_details', 'background', 'coaching_history', 'current_season', 'media_day_talking_points'];
  
  let completedRequired = 0;
  let completedOptional = 0;
  
  for (const field of requiredFields) {
    if (coach[field] && coach[field] !== 'Research Required') {
      completedRequired++;
    }
  }
  
  for (const field of optionalFields) {
    if (coach[field] && coach[field] !== 'Research Required') {
      completedOptional++;
    }
  }
  
  const requiredScore = (completedRequired / requiredFields.length) * 0.7;
  const optionalScore = (completedOptional / optionalFields.length) * 0.3;
  
  return requiredScore + optionalScore;
}

// Execute the demo
if (require.main === module) {
  demonstrateCoachProfileGeneration()
    .then(() => {
      console.log('');
      console.log('🎉 Big 12 Coach Profile Generation Demo Completed Successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Demo failed:', error);
      process.exit(1);
    });
}

export default demonstrateCoachProfileGeneration;