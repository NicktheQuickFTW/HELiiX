// Manual mapping based on viewing the invoice images
// File numbers (791xxx) to actual invoice numbers

const invoiceMapping = {
  791001: '791346', // Baseball awards - likely matches 791346 (Baseball Championship Trophy)
  791002: '789041', // Beach volleyball page 1 - likely 789041 (Beach Volleyball Championship)
  791003: '790904', // Beach volleyball page 2 - likely 790904 (Beach Volleyball Most Outstanding Pair)
  791004: '788239', // Equestrian page 1 - matches 788239 split invoices
  791005: '791347', // Equestrian page 3 - likely 791347 (Scholar Athlete)
  791006: '787803', // Gymnastics awards - matches 787803 split invoices
  791007: '790279', // Indoor track rs - likely 790279 (Indoor Track Of The Year Awards)
  791008: '789582', // Lacrosse cc page 1 - matches 789582 split invoices
  791009: '790026', // Lacrosse rs page 2 - likely 790026 (Lacrosse Championship Trophy)
  791010: '787985', // Mens basketball poty cc page 3 - matches 787985 split invoices
  791011: '790905', // Mens basketball rs page 1 - likely 790905
  791012: '790905', // Mens basketball rs page 2 - likely 790905 (continuation)
  791013: '788545', // Mens golf cc - matches 788545 (Mens Golf Championship)
  791014: '789042', // Mens tennis cc page 1 - matches 789042 split invoices
  791015: '789583', // Mens tennis rs page 3 - likely 789583 (Mens Tennis Championship)
  791016: '792130', // Mens tennis rs page 2 - matches 792130 (Mens Tennis OTY Awards)
  791017: '790280', // Rowing rs cc - matches 790280 (Rowing Championship)
  791018: '791349', // Softball cc page 2 - matches 791349 (Softball Tournament Championship)
  791019: '790027', // Softball rs page 1 - matches 790027 (Softball Regular Season)
  791020: '787806', // Swimming diving cc page 2 - matches 787806
  791021: '790903', // Swimming diving rs page 1 - matches 790903
  791022: '785504', // Soccer rs page 1 - likely 785504 (Soccer Championship)
  791023: '785505', // Soccer xx page 2 - likely 785505 (Soccer Championship continuation)
  791024: '785998', // Volleyball rs champ - likely 785998 (Volleyball Regular Season)
  791025: '787807', // Womens basketball cc rs poty page 2 - likely 787807
  791026: '788789', // Womens basketball rs page 1 - matches 788789
  791027: '787986', // Womens basketball rs page 3 - likely 787986
  791028: '788546', // Womens golf cc page 1 - matches 788546
  791029: '791348', // Womens golf cc page 2 - matches 791348
  791030: '787801', // Wrestling cc page 1 - matches 787801 (Wrestling Championship)
  791031: '790281', // Wrestling rs page 2 - matches 790281 (Wrestling OTY)
  791032: '790028', // Womens tennis cc - matches 790028
  791033: '792131', // Womens tennis rs page 2 - matches 792131
  791034: '785503', // Cross country rs page 1 - matches 785503
  791035: '787383', // Cross country rs page 2 - likely 787383
  791036: 'UNKNOWN', // Volleyball rs champ tie - need to check
  791037: 'UNKNOWN', // Womens basketball nameplate - need to check
  791038: 'UNKNOWN', // Womens tennis extra all big12 - need to check
  791039: 'UNKNOWN', // Volleyball all rookie certs - need to check
  791040: '788788', // Equestrian nameplates2 - likely 788788 (Equestrian plates)
  791041: 'UNKNOWN', // Outdoor track oty page 1 - not in current DB
  791042: '787984', // Special Olympic Ring Box Replacements - confirmed from image
  791043: '785795', // 2025 Special Olympic Ring Boxes - confirmed from image
  791044: '787805', // Special Olympic Medals - confirmed from image
};

// Files that have actual invoice numbers in their names (not 791xxx)
const correctlyNamedFiles = [
  '785682-S-060-00-BB-M-promotional-magnets.png',
  '785682-S-060-00-BB-W-promotional-pins-magnets.png',
  '786426-S-050-00-XX-0-academic-all-rookie.png',
  '787802-S-050-00-XX-0-dummy-medals.png',
  '788788-S-050-00-EQ-W-equestrian-nameplates.png',
  '789584-S-050-00-XX-0-trophy-repair.png',
  '789585-S-050-00-IT-M-indoor-track-awards.png',
  '790029-S-050-00-LX-W-lacrosse-nameplates.png',
  '790906-S-050-00-RW-W-rowing-nameplates.png',
];

console.log('=== INVOICE FILE MAPPING ===\n');
console.log('Files with correct invoice numbers:', correctlyNamedFiles.length);
console.log(
  'Files needing mapping (791xxx):',
  Object.keys(invoiceMapping).length
);

// Show confirmed mappings
console.log('\n=== CONFIRMED MAPPINGS (from viewing images) ===');
console.log('791042 → 787984 (Special Olympic Ring Box Replacements)');
console.log('791043 → 785795 (2025 Special Olympic Ring Boxes)');
console.log('791044 → 787805 (Special Olympic Medals)');

console.log('\n=== SUMMARY ===');
const totalFiles =
  correctlyNamedFiles.length + Object.keys(invoiceMapping).length;
console.log(`Total invoice files: ${totalFiles}`);
console.log(`Database has 56 invoice entries representing 46 unique invoices`);
console.log(
  `Files represent approximately 53 actual invoices (some are multi-page)`
);

// Export the mapping
const fs = require('fs');
const fullMapping = {
  correctlyNamedFiles,
  invoiceMapping,
  summary: {
    totalFiles,
    filesWithCorrectNames: correctlyNamedFiles.length,
    filesNeedingMapping: Object.keys(invoiceMapping).length,
    confirmedMappings: ['791042→787984', '791043→785795', '791044→787805'],
  },
};

fs.writeFileSync(
  'invoice_file_mapping.json',
  JSON.stringify(fullMapping, null, 2)
);
console.log('\nMapping saved to: invoice_file_mapping.json');
