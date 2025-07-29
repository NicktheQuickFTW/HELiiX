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
};

// Component mappings
const COMPONENT_MAPPINGS = {
  // Direct replacements
  Button: 'Button',
  Badge: 'Badge',
  Input: 'Input',
  Label: 'Label',
  Textarea: 'Textarea',
  Skeleton: 'Skeleton',
  Separator: 'Divider',
  Progress: 'ProgressBar',
  Checkbox: 'Switch',

  // Card components
  Card: 'Card',
  CardContent: 'Column',
  CardHeader: 'Column',
  CardTitle: 'Heading',
  CardDescription: 'Text',

  // Select components
  Select: 'Select',
  SelectContent: null, // Will be removed
  SelectItem: 'Option',
  SelectTrigger: null, // Will be removed
  SelectValue: null, // Will be removed

  // Avatar components
  Avatar: 'Avatar',
  AvatarImage: null, // Will be handled specially
  AvatarFallback: null, // Will be handled specially

  // Dialog components
  Dialog: 'Dialog',
  DialogContent: 'Dialog',
  DialogHeader: 'Column',
  DialogTitle: 'Heading',
  DialogDescription: 'Text',
  DialogFooter: 'Row',
  DialogTrigger: null, // Will be removed

  // Tabs components
  Tabs: 'Tabs',
  TabsList: null, // Will be removed
  TabsTrigger: 'Tab',
  TabsContent: 'TabContent',
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
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return imports;
}

function getOnceUIComponents(shadcnComponents) {
  const onceComponents = new Set();
  const additionalComponents = new Set();

  shadcnComponents.forEach((component) => {
    const mapped = COMPONENT_MAPPINGS[component];
    if (mapped) {
      onceComponents.add(mapped);

      // Add additional components based on what's being used
      if (component.startsWith('Card')) {
        additionalComponents.add('Column');
        if (component === 'CardTitle') additionalComponents.add('Heading');
        if (component === 'CardDescription') additionalComponents.add('Text');
      }

      if (component.startsWith('Dialog')) {
        additionalComponents.add('Column');
        additionalComponents.add('Row');
        if (component === 'DialogTitle') additionalComponents.add('Heading');
        if (component === 'DialogDescription') additionalComponents.add('Text');
      }

      if (component.startsWith('Select')) {
        onceComponents.add('Select');
        onceComponents.add('Option');
      }

      if (component.startsWith('Tabs')) {
        onceComponents.add('Tabs');
        onceComponents.add('Tab');
        onceComponents.add('TabContent');
      }
    }
  });

  // Merge additional components
  additionalComponents.forEach((c) => onceComponents.add(c));

  return Array.from(onceComponents)
    .filter((c) => c !== null)
    .sort();
}

function transformComponentUsage(content, components) {
  let transformed = content;

  // Card transformations
  if (components.some((c) => c.startsWith('Card'))) {
    transformed = transformed.replace(
      /<CardHeader([^>]*)>/g,
      '<Column gap="xs"$1>'
    );
    transformed = transformed.replace(/<\/CardHeader>/g, '</Column>');

    transformed = transformed.replace(
      /<CardTitle([^>]*)>/g,
      '<Heading variant="heading-sm"$1>'
    );
    transformed = transformed.replace(/<\/CardTitle>/g, '</Heading>');

    transformed = transformed.replace(
      /<CardDescription([^>]*)>/g,
      '<Text variant="body-sm" muted$1>'
    );
    transformed = transformed.replace(/<\/CardDescription>/g, '</Text>');

    transformed = transformed.replace(/<CardContent([^>]*)>/g, '<Column$1>');
    transformed = transformed.replace(/<\/CardContent>/g, '</Column>');
  }

  // Select transformations
  if (components.some((c) => c.startsWith('Select'))) {
    // Remove SelectTrigger and SelectValue
    transformed = transformed.replace(
      /<SelectTrigger([^>]*)>[\s\S]*?<\/SelectTrigger>/g,
      ''
    );
    transformed = transformed.replace(/<SelectValue[^>]*\/>/g, '');

    // Remove SelectContent tags
    transformed = transformed.replace(/<SelectContent([^>]*)>/g, '');
    transformed = transformed.replace(/<\/SelectContent>/g, '');

    // Transform SelectItem to Option
    transformed = transformed.replace(
      /<SelectItem\s+value="([^"]+)"([^>]*)>/g,
      '<Option value="$1"$2>'
    );
    transformed = transformed.replace(/<\/SelectItem>/g, '</Option>');
  }

  // Avatar transformations
  if (components.includes('Avatar')) {
    // Simple avatar pattern
    const avatarRegex =
      /<Avatar([^>]*)>\s*<AvatarImage\s+src="([^"]+)"[^>]*\/>\s*<AvatarFallback>([^<]+)<\/AvatarFallback>\s*<\/Avatar>/g;
    transformed = transformed.replace(
      avatarRegex,
      '<Avatar src="$2" alt="$3"$1 />'
    );
  }

  // Dialog transformations
  if (components.some((c) => c.startsWith('Dialog'))) {
    transformed = transformed.replace(
      /<DialogTrigger[^>]*>[\s\S]*?<\/DialogTrigger>/g,
      ''
    );

    transformed = transformed.replace(/<DialogContent([^>]*)>/g, '<Dialog$1>');
    transformed = transformed.replace(/<\/DialogContent>/g, '</Dialog>');

    transformed = transformed.replace(
      /<DialogHeader([^>]*)>/g,
      '<Column gap="xs"$1>'
    );
    transformed = transformed.replace(/<\/DialogHeader>/g, '</Column>');

    transformed = transformed.replace(
      /<DialogTitle([^>]*)>/g,
      '<Heading variant="heading-sm"$1>'
    );
    transformed = transformed.replace(/<\/DialogTitle>/g, '</Heading>');

    transformed = transformed.replace(
      /<DialogDescription([^>]*)>/g,
      '<Text variant="body-sm" muted$1>'
    );
    transformed = transformed.replace(/<\/DialogDescription>/g, '</Text>');

    transformed = transformed.replace(
      /<DialogFooter([^>]*)>/g,
      '<Row gap="s" justify="end"$1>'
    );
    transformed = transformed.replace(/<\/DialogFooter>/g, '</Row>');
  }

  // Tabs transformations
  if (components.some((c) => c.startsWith('Tabs'))) {
    // Wrap TabsList content into Tabs
    transformed = transformed.replace(
      /<TabsList([^>]*)>([\s\S]*?)<\/TabsList>/g,
      (match, attrs, content) => {
        return content; // Remove TabsList wrapper
      }
    );

    transformed = transformed.replace(
      /<TabsTrigger\s+value="([^"]+)"([^>]*)>/g,
      '<Tab value="$1"$2>'
    );
    transformed = transformed.replace(/<\/TabsTrigger>/g, '</Tab>');

    transformed = transformed.replace(
      /<TabsContent\s+value="([^"]+)"([^>]*)>/g,
      '<TabContent value="$1"$2>'
    );
    transformed = transformed.replace(/<\/TabsContent>/g, '</TabContent>');
  }

  // Checkbox to Switch
  if (components.includes('Checkbox')) {
    transformed = transformed.replace(/<Checkbox\s+/g, '<Switch ');
    transformed = transformed.replace(/checked=/g, 'selected=');
    transformed = transformed.replace(/onCheckedChange=/g, 'onToggle=');
  }

  // Direct replacements
  transformed = transformed.replace(/\bSeparator\b/g, 'Divider');
  transformed = transformed.replace(/\bProgress\b/g, 'ProgressBar');

  return transformed;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Parse imports
    const imports = parseImports(content);

    if (imports.length === 0) {
      return false;
    }

    log(`\nProcessing: ${filePath}`, 'cyan');

    // Collect all components that need to be imported from Once UI
    const allShadcnComponents = [];
    imports.forEach((imp) => {
      allShadcnComponents.push(...imp.components);
    });

    const onceUIComponents = getOnceUIComponents(allShadcnComponents);

    if (onceUIComponents.length > 0) {
      // Remove old imports (in reverse order to maintain indices)
      imports.reverse().forEach((imp) => {
        content =
          content.slice(0, imp.startIndex) + content.slice(imp.endIndex);
      });

      // Add Once UI import
      const onceImport = `import { ${onceUIComponents.join(', ')} } from '@once-ui-system/core';`;

      // Find the last import statement
      const lastImportMatch = content.match(/^import\s+.+$/gm);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const insertPosition = content.indexOf(lastImport) + lastImport.length;
        content =
          content.slice(0, insertPosition) +
          '\n' +
          onceImport +
          content.slice(insertPosition);
      } else {
        content = onceImport + '\n\n' + content;
      }

      // Transform component usage
      content = transformComponentUsage(content, allShadcnComponents);

      // Clean up multiple newlines
      content = content.replace(/\n{3,}/g, '\n\n');

      // Write the file
      fs.writeFileSync(filePath, content);

      log(
        `✅ Updated with Once UI components: ${onceUIComponents.join(', ')}`,
        'green'
      );
      return true;
    }

    return false;
  } catch (error) {
    log(`❌ Error processing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n🚀 Starting shadcn to Once UI migration...', 'bright');

  // Find all TypeScript/JavaScript files
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**', '**/*.d.ts'],
  });

  log(`\n📁 Found ${files.length} files to scan`, 'yellow');

  let updatedCount = 0;
  files.forEach((file) => {
    if (processFile(file)) {
      updatedCount++;
    }
  });

  log(`\n✨ Migration complete!`, 'bright');
  log(`📊 Updated ${updatedCount} files`, 'green');

  if (updatedCount > 0) {
    log('\n⚠️  Please review the changes and test your application.', 'yellow');
    log(
      'Some manual adjustments may be needed for complex component usage.',
      'yellow'
    );
  }
}

// Run the migration
main();
