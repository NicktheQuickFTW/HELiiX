# Shadcn to Once UI Migration Scripts

This directory contains scripts to help migrate from shadcn/ui components to Once UI components.

## Scripts

### 1. analyze-shadcn-usage.js

Analyzes your codebase to find all shadcn/ui component usage without making any changes.

```bash
pnpm run analyze:shadcn
```

This will show:

- All shadcn components being used
- How many times each component is used
- Which files are using each component
- A breakdown by component category

### 2. migrate-shadcn-to-once.js

Performs the actual migration from shadcn/ui to Once UI.

```bash
pnpm run migrate:once-ui
```

This will:

- Replace shadcn imports with Once UI imports
- Transform component usage to match Once UI patterns
- Update component props and structure

## Migration Mappings

| Shadcn Component                                              | Once UI Replacement                    | Notes                                    |
| ------------------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| Button                                                        | Button                                 | Direct replacement                       |
| Badge                                                         | Badge                                  | Direct replacement                       |
| Input                                                         | Input                                  | Direct replacement                       |
| Label                                                         | Label                                  | Direct replacement                       |
| Textarea                                                      | Textarea                               | Direct replacement                       |
| Skeleton                                                      | Skeleton                               | Direct replacement                       |
| Separator                                                     | Divider                                | Name change only                         |
| Progress                                                      | ProgressBar                            | Name change only                         |
| Checkbox                                                      | Switch                                 | Different component with different props |
| Card, CardHeader, CardTitle, CardDescription, CardContent     | Card + Column + Heading + Text         | Structural change                        |
| Select, SelectTrigger, SelectValue, SelectContent, SelectItem | Select + Option                        | Simplified structure                     |
| Avatar, AvatarImage, AvatarFallback                           | Avatar                                 | Simplified to single component           |
| Dialog and related                                            | Dialog + Column + Row + Heading + Text | Structural change                        |
| Tabs and related                                              | Tabs + Tab + TabContent                | Slightly different structure             |

## Excluded Components

The following custom components are preserved and not migrated:

- enhanced-icon
- TeamLogo
- meteors
- effects
- border-beam-effect
- animated-counter
- divine-button
- divine-card
- magnetic-button / MagneticButton
- shimmer-button
- 3d-card
- safe-ui

## Manual Review Required

After running the migration, you should:

1. **Test all components** - The migration handles common patterns but complex usage may need manual adjustment
2. **Check styling** - Once UI uses different design tokens and CSS variables
3. **Update props** - Some components have different prop names (e.g., `checked` → `selected` for Switch)
4. **Review layouts** - Card and Dialog components now use Column/Row for layout
5. **Test interactions** - Event handlers may have different names (e.g., `onCheckedChange` → `onToggle`)

## Rollback

If you need to rollback the migration:

1. Use git to revert the changes: `git checkout -- .`
2. Or restore from a backup if you made one

## Tips

1. Run the analyzer first to understand the scope of changes
2. Commit your current work before running the migration
3. Review the changes file by file
4. Test thoroughly before committing the migrated code
