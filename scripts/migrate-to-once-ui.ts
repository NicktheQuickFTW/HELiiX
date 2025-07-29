#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Define component mappings from shadcn to Once UI
const componentMappings = {
  // Direct replacements
  Button: {
    from: '@/components/ui/button',
    to: '@once-ui-system/core',
    component: 'Button',
  },
  Badge: {
    from: '@/components/ui/badge',
    to: '@once-ui-system/core',
    component: 'Badge',
  },
  Input: {
    from: '@/components/ui/input',
    to: '@once-ui-system/core',
    component: 'Input',
  },
  Label: {
    from: '@/components/ui/label',
    to: '@once-ui-system/core',
    component: 'Label',
  },
  Textarea: {
    from: '@/components/ui/textarea',
    to: '@once-ui-system/core',
    component: 'Textarea',
  },

  // Card components - need special handling
  Card: {
    from: '@/components/ui/card',
    to: '@once-ui-system/core',
    component: 'Card',
    needsTransform: true,
  },

  // Select components
  Select: {
    from: '@/components/ui/select',
    to: '@once-ui-system/core',
    component: 'Select',
    needsTransform: true,
  },

  // Avatar components
  Avatar: {
    from: '@/components/ui/avatar',
    to: '@once-ui-system/core',
    component: 'Avatar',
    needsTransform: true,
  },

  // Dialog components
  Dialog: {
    from: '@/components/ui/dialog',
    to: '@once-ui-system/core',
    component: 'Dialog',
    needsTransform: true,
  },

  // Tabs components
  Tabs: {
    from: '@/components/ui/tabs',
    to: '@once-ui-system/core',
    component: 'Tabs',
    needsTransform: true,
  },

  // Checkbox to Switch
  Checkbox: {
    from: '@/components/ui/checkbox',
    to: '@once-ui-system/core',
    component: 'Switch',
    needsTransform: true,
  },

  // Separator to Divider
  Separator: {
    from: '@/components/ui/separator',
    to: '@once-ui-system/core',
    component: 'Divider',
  },

  // Progress to ProgressBar
  Progress: {
    from: '@/components/ui/progress',
    to: '@once-ui-system/core',
    component: 'ProgressBar',
  },

  // Skeleton
  Skeleton: {
    from: '@/components/ui/skeleton',
    to: '@once-ui-system/core',
    component: 'Skeleton',
  },
};

// Files/patterns to exclude
const excludePatterns = [
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

interface ImportStatement {
  original: string;
  components: string[];
  path: string;
}

function parseImports(content: string): ImportStatement[] {
  const importRegex =
    /import\s*{([^}]+)}\s*from\s*['"](@\/components\/ui\/[^'"]+)['"]/g;
  const imports: ImportStatement[] = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const componentsStr = match[1];
    const importPath = match[2];

    // Skip excluded patterns
    if (excludePatterns.some((pattern) => importPath.includes(pattern))) {
      continue;
    }

    const components = componentsStr
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);

    imports.push({
      original: match[0],
      components,
      path: importPath,
    });
  }

  return imports;
}

function transformCardUsage(content: string): string {
  // Transform Card components to Once UI pattern
  // Replace CardHeader, CardTitle, CardDescription, CardContent with Column/Text structure

  // Replace <CardHeader> with <Column>
  content = content.replace(/<CardHeader([^>]*)>/g, '<Column gap="xs"$1>');
  content = content.replace(/<\/CardHeader>/g, '</Column>');

  // Replace <CardTitle> with <Heading>
  content = content.replace(
    /<CardTitle([^>]*)>/g,
    '<Heading variant="heading-sm"$1>'
  );
  content = content.replace(/<\/CardTitle>/g, '</Heading>');

  // Replace <CardDescription> with <Text>
  content = content.replace(
    /<CardDescription([^>]*)>/g,
    '<Text variant="body-sm" muted$1>'
  );
  content = content.replace(/<\/CardDescription>/g, '</Text>');

  // Replace <CardContent> with <Column>
  content = content.replace(/<CardContent([^>]*)>/g, '<Column$1>');
  content = content.replace(/<\/CardContent>/g, '</Column>');

  return content;
}

function transformSelectUsage(content: string): string {
  // Transform Select components to Once UI pattern
  content = content.replace(/<SelectTrigger([^>]*)>/g, '<Select$1>');
  content = content.replace(/<\/SelectTrigger>/g, '');

  content = content.replace(/<SelectValue([^>]*)\/>/g, '');

  content = content.replace(/<SelectContent([^>]*)>/g, '');
  content = content.replace(/<\/SelectContent>/g, '</Select>');

  content = content.replace(
    /<SelectItem\s+value="([^"]+)"([^>]*)>/g,
    '<Option value="$1"$2>'
  );
  content = content.replace(/<\/SelectItem>/g, '</Option>');

  return content;
}

function transformAvatarUsage(content: string): string {
  // Transform Avatar components to Once UI pattern
  // Once UI Avatar is simpler - just Avatar with src and alt props

  // Extract src from AvatarImage and alt/fallback text
  const avatarRegex =
    /<Avatar([^>]*)>\s*<AvatarImage\s+src="([^"]+)"[^>]*\/>\s*<AvatarFallback>([^<]+)<\/AvatarFallback>\s*<\/Avatar>/g;

  content = content.replace(avatarRegex, '<Avatar src="$2" alt="$3"$1 />');

  return content;
}

function transformDialogUsage(content: string): string {
  // Transform Dialog components to Once UI pattern
  content = content.replace(/<DialogTrigger([^>]*)>/g, '');
  content = content.replace(/<\/DialogTrigger>/g, '');

  content = content.replace(/<DialogContent([^>]*)>/g, '<Dialog$1>');
  content = content.replace(/<\/DialogContent>/g, '</Dialog>');

  content = content.replace(/<DialogHeader([^>]*)>/g, '<Column gap="xs"$1>');
  content = content.replace(/<\/DialogHeader>/g, '</Column>');

  content = content.replace(
    /<DialogTitle([^>]*)>/g,
    '<Heading variant="heading-sm"$1>'
  );
  content = content.replace(/<\/DialogTitle>/g, '</Heading>');

  content = content.replace(
    /<DialogDescription([^>]*)>/g,
    '<Text variant="body-sm" muted$1>'
  );
  content = content.replace(/<\/DialogDescription>/g, '</Text>');

  content = content.replace(
    /<DialogFooter([^>]*)>/g,
    '<Row gap="s" justify="end"$1>'
  );
  content = content.replace(/<\/DialogFooter>/g, '</Row>');

  return content;
}

function transformTabsUsage(content: string): string {
  // Transform Tabs components to Once UI pattern
  content = content.replace(/<TabsList([^>]*)>/g, '<Tabs$1>');
  content = content.replace(/<\/TabsList>/g, '');

  content = content.replace(
    /<TabsTrigger\s+value="([^"]+)"([^>]*)>/g,
    '<Tab value="$1"$2>'
  );
  content = content.replace(/<\/TabsTrigger>/g, '</Tab>');

  content = content.replace(
    /<TabsContent\s+value="([^"]+)"([^>]*)>/g,
    '<TabContent value="$1"$2>'
  );
  content = content.replace(/<\/TabsContent>/g, '</TabContent>');

  content = content.replace(/<\/Tabs>/g, '</Tabs></TabContent>');

  return content;
}

function transformCheckboxUsage(content: string): string {
  // Transform Checkbox to Switch
  content = content.replace(/<Checkbox\s+/g, '<Switch ');
  content = content.replace(/checked=/g, 'selected=');
  content = content.replace(/onCheckedChange=/g, 'onToggle=');

  return content;
}

async function processFile(filePath: string): Promise<void> {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Parse imports
  const imports = parseImports(content);

  if (imports.length === 0) {
    return;
  }

  // Group components by their new import path
  const onceUIComponents = new Set<string>();
  const needsColumn = new Set<string>();
  const needsRow = new Set<string>();
  const needsHeading = new Set<string>();
  const needsText = new Set<string>();

  // Process each import
  for (const imp of imports) {
    let hasChanges = false;

    for (const component of imp.components) {
      // Check if we have a mapping for this component
      const baseComponent = component.replace(
        /^(Card|Select|Avatar|Dialog|Tabs).*/,
        '$1'
      );
      const mapping = componentMappings[baseComponent];

      if (mapping) {
        hasChanges = true;

        // Add to Once UI imports
        if (component.startsWith('Card')) {
          onceUIComponents.add('Card');
          needsColumn.add('Column');
          if (component === 'CardTitle') needsHeading.add('Heading');
          if (component === 'CardDescription') needsText.add('Text');
        } else if (component.startsWith('Select')) {
          onceUIComponents.add('Select');
          onceUIComponents.add('Option');
        } else if (component.startsWith('Avatar')) {
          onceUIComponents.add('Avatar');
        } else if (component.startsWith('Dialog')) {
          onceUIComponents.add('Dialog');
          needsColumn.add('Column');
          needsRow.add('Row');
          if (component === 'DialogTitle') needsHeading.add('Heading');
          if (component === 'DialogDescription') needsText.add('Text');
        } else if (component.startsWith('Tabs')) {
          onceUIComponents.add('Tabs');
          onceUIComponents.add('Tab');
          onceUIComponents.add('TabContent');
        } else if (component === 'Checkbox') {
          onceUIComponents.add('Switch');
        } else if (component === 'Separator') {
          onceUIComponents.add('Divider');
        } else if (component === 'Progress') {
          onceUIComponents.add('ProgressBar');
        } else {
          onceUIComponents.add(mapping.component);
        }
      }
    }

    // Remove the old import
    if (hasChanges) {
      content = content.replace(imp.original, '');
    }
  }

  // Add layout components if needed
  needsColumn.forEach((c) => onceUIComponents.add(c));
  needsRow.forEach((c) => onceUIComponents.add(c));
  needsHeading.forEach((c) => onceUIComponents.add(c));
  needsText.forEach((c) => onceUIComponents.add(c));

  // Add Once UI import if we have components to import
  if (onceUIComponents.size > 0) {
    const componentsArray = Array.from(onceUIComponents).sort();
    const onceUIImport = `import { ${componentsArray.join(', ')} } from '@once-ui-system/core';`;

    // Find a good place to insert the import (after other imports)
    const importRegex = /^import\s+.+$/m;
    const lastImportMatch = content.match(/^import\s+.+$/gm);

    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const insertPosition = content.indexOf(lastImport) + lastImport.length;
      content =
        content.slice(0, insertPosition) +
        '\n' +
        onceUIImport +
        content.slice(insertPosition);
    } else {
      // No imports found, add at the beginning
      content = onceUIImport + '\n\n' + content;
    }
  }

  // Apply transformations based on what components were imported
  if (imports.some((imp) => imp.components.some((c) => c.startsWith('Card')))) {
    content = transformCardUsage(content);
  }

  if (
    imports.some((imp) => imp.components.some((c) => c.startsWith('Select')))
  ) {
    content = transformSelectUsage(content);
  }

  if (
    imports.some((imp) => imp.components.some((c) => c.startsWith('Avatar')))
  ) {
    content = transformAvatarUsage(content);
  }

  if (
    imports.some((imp) => imp.components.some((c) => c.startsWith('Dialog')))
  ) {
    content = transformDialogUsage(content);
  }

  if (imports.some((imp) => imp.components.some((c) => c.startsWith('Tabs')))) {
    content = transformTabsUsage(content);
  }

  if (imports.some((imp) => imp.components.some((c) => c === 'Checkbox'))) {
    content = transformCheckboxUsage(content);
  }

  // Replace component names in the content
  content = content.replace(/\bSeparator\b/g, 'Divider');
  content = content.replace(/\bProgress\b/g, 'ProgressBar');

  // Clean up multiple newlines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  }
}

async function main() {
  console.log('Starting migration to Once UI...\n');

  // Find all TypeScript/JavaScript files
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**', '**/*.d.ts'],
  });

  console.log(`Found ${files.length} files to process\n`);

  // Process each file
  for (const file of files) {
    try {
      await processFile(file);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log('\n✨ Migration complete!');
  console.log('\n⚠️  Please review the changes and test your application.');
  console.log(
    'Some manual adjustments may be needed for complex component usage.'
  );
}

// Run the migration
main().catch(console.error);
