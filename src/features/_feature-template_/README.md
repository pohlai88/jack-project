# Feature Template

This directory serves as a template for creating new features in the application. It demonstrates the recommended structure and patterns for implementing features using Feature-Based Architecture.

**Source of truth:** See [architecture/doctrine/0002-feature-public-api-boundaries.md](../../../architecture/doctrine/0002-feature-public-api-boundaries.md) for the current feature-module conventions. `architecture/docs/` is deprecated reference material.

## Structure

```
_feature-template/
|
+-- components/ # Feature-specific components
|   +-- ExampleComponent.tsx
|   +-- ExampleComponent.module.css
|
+-- hooks/ # Feature-specific hooks
|   +-- useExample.ts
|
+-- services/ # Feature-specific services
|   +-- exampleService.ts
|
+-- types/ # Feature-specific types
|   +-- index.ts
|
+-- index.ts # Public API
```

## Usage

1. Copy this directory and rename it to your feature name
2. Update the component, hook, and service names
3. Implement your feature's functionality
4. Export only what's needed through index.ts

## Best Practices

1. **Encapsulation**
   - Keep feature-specific code within the feature directory
   - Use the public API (index.ts) to expose functionality
   - Avoid direct imports from other features' internals
   - Use relative imports for same-feature internals; do not import your own feature barrel from inside the feature

2. **Components**
   - Keep components focused and reusable
   - Use CSS Modules for styling
   - Handle loading and error states

3. **Hooks**
   - Encapsulate feature-specific logic
   - Handle state management
   - Provide a clean API for components

4. **Services**
   - Handle API calls and data fetching
   - Implement error handling
   - Keep business logic separate from UI

5. **Types**
   - Define clear interfaces
   - Use TypeScript for type safety
   - Export types through index.ts

6. **Public API Discipline**
   - Root `index.ts` is the only external import target for the feature
   - Export only symbols consumed by app routes or other features
   - Do not turn the root barrel into a wildcard dump of internal folders

## Example

```typescript
// Using the feature in a page
import { ExampleComponent } from '@/features/your-feature';

export default function ExamplePage() {
  return <ExampleComponent />;
}
```
