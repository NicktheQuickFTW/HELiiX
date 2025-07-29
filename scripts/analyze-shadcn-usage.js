#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Files to exclude
const EXCLUDE_PATTERNS = [
  'enhanced-icon',
  'TeamLogo',
  'meteors',
  'effects',
  'border-beam-effect',
  'animated-counter',
  'divine-button',
  'divine-card',
  'magnetic-button',
  'MagneticButton',
  'shimmer-button',
  '3d-card',
  'safe-ui',
];

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function parseImports(content) {
  const imports = [];
  const regex =
    /import\s*{([^}]+)}\s*from\s*['"](@\/components\/ui\/[^'"]+)['"]/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[2];

    // Skip excluded files
    if (EXCLUDE_PATTERNS.some((pattern) => importPath.includes(pattern))) {
      continue;
    }

    const components = match[1]
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);

    imports.push({
      original: match[0],
      components,
      path: importPath,
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  return imports;
}

function analyzeFile(filePath, allImports) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = parseImports(content);

    if (imports.length > 0) {
      imports.forEach((imp) => {
        imp.components.forEach((component) => {
          if (!allImports[component]) {
            allImports[component] = {
              count: 0,
              files: [],
              importPaths: new Set(),
            };
          }
          allImports[component].count++;
          allImports[component].files.push({
            file: filePath,
            line: imp.line,
          });
          allImports[component].importPaths.add(imp.path);
        });
      });

      return true;
    }

    return false;
  } catch (error) {
    log(`❌ Error analyzing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n🔍 Analyzing shadcn/ui component usage...', 'bright');

  // Find all TypeScript/JavaScript files
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**', '**/*.d.ts'],
  });

  log(`\n📁 Found ${files.length} files to analyze`, 'yellow');

  const allImports = {};
  let fileCount = 0;

  files.forEach((file) => {
    if (analyzeFile(file, allImports)) {
      fileCount++;
    }
  });

  // Sort components by usage count
  const sortedComponents = Object.entries(allImports).sort(
    ([, a], [, b]) => b.count - a.count
  );

  log(
    `\n📊 Found ${sortedComponents.length} shadcn/ui components in ${fileCount} files:\n`,
    'cyan'
  );

  // Display component usage
  sortedComponents.forEach(([component, data]) => {
    log(
      `${component} (${data.count} usage${data.count > 1 ? 's' : ''})`,
      'bright'
    );

    // Show import paths
    log(`  Import paths:`, 'yellow');
    data.importPaths.forEach((path) => {
      log(`    ${path}`, 'reset');
    });

    // Show first 3 files using this component
    log(`  Used in:`, 'magenta');
    data.files.slice(0, 3).forEach(({ file, line }) => {
      const relativePath = path.relative(process.cwd(), file);
      log(`    ${relativePath}:${line}`, 'reset');
    });

    if (data.files.length > 3) {
      log(`    ... and ${data.files.length - 3} more files`, 'reset');
    }

    console.log(); // Empty line between components
  });

  // Summary of components by category
  log('\n📈 Component categories:', 'cyan');

  const categories = {
    Card: ['Card', 'CardContent', 'CardDescription', 'CardHeader', 'CardTitle'],
    Form: [
      'Button',
      'Input',
      'Label',
      'Textarea',
      'Checkbox',
      'Select',
      'SelectContent',
      'SelectItem',
      'SelectTrigger',
      'SelectValue',
    ],
    Dialog: [
      'Dialog',
      'DialogContent',
      'DialogDescription',
      'DialogFooter',
      'DialogHeader',
      'DialogTitle',
      'DialogTrigger',
    ],
    Layout: ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger', 'Separator'],
    Display: [
      'Avatar',
      'AvatarImage',
      'AvatarFallback',
      'Badge',
      'Progress',
      'Skeleton',
    ],
  };

  Object.entries(categories).forEach(([category, components]) => {
    const usedComponents = components.filter((c) => allImports[c]);
    if (usedComponents.length > 0) {
      const totalUsage = usedComponents.reduce(
        (sum, c) => sum + allImports[c].count,
        0
      );
      log(
        `  ${category}: ${usedComponents.length} components, ${totalUsage} total usages`,
        'yellow'
      );
    }
  });

  log('\n✅ Analysis complete!', 'green');
  log(
    '\nRun ./scripts/migrate-shadcn-to-once.js to perform the migration.',
    'yellow'
  );
}

// Run the analysis
main();
