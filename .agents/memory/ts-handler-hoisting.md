---
name: TypeScript handler hoisting in React components
description: Why `function` declarations inside React components cause "possibly undefined" errors after type-guard early returns.
---

In TypeScript, `function` declarations are hoisted to the top of the function scope. This means TypeScript's control flow analysis cannot narrow a variable's type inside a `function` declaration that appears after a type guard.

**Example of the bug:**
```tsx
const biz = findBusiness(slug); // type: Business | undefined
if (!biz) return <NotFound />;   // guard

function handleClick() {
  biz.name  // TS ERROR: biz is possibly undefined (function was hoisted before the guard)
}
```

**Fix:** Use `const` arrow functions defined after the guard:
```tsx
const biz = findBusiness(slug);
if (!biz) return <NotFound />;

const handleClick = () => {
  biz.name  // OK — TypeScript narrows correctly
};
```

**Why:** `const` arrow function expressions are not hoisted, so TypeScript correctly applies the narrowing from the type-guard return.

**How to apply:** In any React component that conditionally returns early based on a nullable variable, always define handlers as `const` arrow functions, not `function` declarations.
