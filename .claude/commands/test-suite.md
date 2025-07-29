# Test Suite Command

Run tests and validation checks for the HELiiX-OS platform.

## Command: /test-suite

### Available Test Commands:

1. **Type Checking**

   ```bash
   pnpm run type-check
   ```

   - Validates TypeScript types
   - No emit, just checking
   - Should pass before commits

2. **Linting**

   ```bash
   pnpm run lint          # Check for issues
   pnpm run lint:fix      # Auto-fix issues
   ```

   - ESLint rules enforcement
   - Code quality standards
   - Catches common errors

3. **Formatting**

   ```bash
   pnpm run format        # Format all files
   pnpm run format:check  # Check formatting
   ```

   - Prettier formatting
   - Consistent code style
   - Auto-fixable

4. **Build Validation**

   ```bash
   pnpm run build
   ```

   - Production build test
   - Catches build-time errors
   - Verifies all imports

5. **Component Analysis**
   ```bash
   pnpm run analyze:components
   ```

   - Component usage analysis
   - Identifies unused components
   - Checks component patterns

### Pre-Commit Checklist:

```bash
# Run all checks
pnpm run type-check && pnpm run lint && pnpm run format:check

# Fix issues
pnpm run lint:fix && pnpm run format
```

### Common Test Scenarios:

1. **New Component Testing**
   - Verify TypeScript types
   - Check accessibility
   - Test responsive design
   - Validate prop handling

2. **API Endpoint Testing**
   - Authentication flow
   - Error handling
   - Response format
   - Status codes

3. **Database Operations**
   - Schema validation
   - Migration testing
   - RLS policies
   - Query performance

### Performance Benchmarks:

- **AI Response**: < 3ms target
- **API Response**: < 100ms for queries
- **Page Load**: < 1s for initial load
- **Build Time**: < 2 minutes

### Manual Testing Checklist:

1. **UI Components**
   - [ ] Renders correctly
   - [ ] Handles all variants
   - [ ] Mobile responsive
   - [ ] Keyboard accessible
   - [ ] Dark mode support

2. **Features**
   - [ ] Happy path works
   - [ ] Error states handled
   - [ ] Loading states shown
   - [ ] Data persists correctly

3. **Cross-Browser**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

### Debug Commands:

```bash
# Check Supabase connection
pnpm dlx supabase status

# View build output
pnpm run build --debug

# Check bundle size
pnpm run build && pnpm run analyze
```

### Usage:

```
/test-suite
```

Run through all validation steps before committing changes or creating pull requests.
