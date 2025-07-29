# Create New Component Command

Create a new custom Tailwind CSS component following HELiiX-OS patterns.

## Command: /component-new <ComponentName>

### Component Template:

```tsx
// src/components/ui/[component-name].tsx

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const [componentName]Variants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'default-variant-classes',
        secondary: 'secondary-variant-classes',
      },
      size: {
        sm: 'size-sm-classes',
        md: 'size-md-classes',
        lg: 'size-lg-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface [ComponentName]Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof [componentName]Variants> {
  // Add component-specific props here
}

const [ComponentName] = forwardRef<HTMLElement, [ComponentName]Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn([componentName]Variants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
[ComponentName].displayName = '[ComponentName]'

export { [ComponentName], [componentName]Variants }
```

### Steps to Create Component:

1. **Choose appropriate HTML element** (div, button, input, etc.)
2. **Define base Tailwind classes** for default styling
3. **Create variants** using class-variance-authority
4. **Add TypeScript interface** extending appropriate HTML element
5. **Implement forwardRef** for ref support
6. **Export component and variants**

### Example Components:

1. **Button** (`/src/components/ui/button.tsx`)
   - Variants: primary, secondary, ghost, link
   - Sizes: sm, md, lg, icon

2. **Card** (`/src/components/ui/card.tsx`)
   - Compound component with CardHeader, CardContent
   - Clean container styling

3. **Badge** (`/src/components/ui/badge.tsx`)
   - Variants: default, outline, success, warning
   - Compact status indicators

### Naming Conventions:

- **File**: kebab-case (e.g., `team-logo.tsx`)
- **Component**: PascalCase (e.g., `TeamLogo`)
- **Variants**: camelCase (e.g., `teamLogoVariants`)
- **Props**: PascalCase + Props (e.g., `TeamLogoProps`)

### Best Practices:

1. **Keep it simple** - Components under 300 lines
2. **Use semantic HTML** - Proper elements and ARIA
3. **Mobile-first** - Responsive by default
4. **Accessibility** - Keyboard navigation, screen readers
5. **Performance** - Avoid runtime calculations

### Usage:

```
/component-new Button
/component-new TeamSelector
/component-new MetricCard
```
