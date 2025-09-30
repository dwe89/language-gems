# Hook Ordering Fix Summary

## Problem
Multiple games were experiencing the React error: **"Rendered more hooks than during the previous render."**

This error occurs when React hooks are called conditionally or in different orders between renders, violating React's [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

### Root Cause
Games were checking for assignment mode and returning early **BEFORE** all hooks were initialized:

```tsx
// ❌ WRONG - Violates Rules of Hooks
export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  
  // Early return BEFORE hooks are initialized
  if (assignmentId && mode === 'assignment') {
    return <AssignmentWrapper />;
  }
  
  // These hooks are only called when NOT in assignment mode
  const [gameStarted, setGameStarted] = useState(false);
  const [config, setConfig] = useState(null);
  // ... more hooks
}
```

When the component switches between assignment mode and regular mode, React sees a different number of hooks being called, causing the error.

## Solution
Move ALL hook declarations to the top of the component, BEFORE any conditional returns:

```tsx
// ✅ CORRECT - All hooks initialized first
export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  
  // ALL HOOKS MUST BE INITIALIZED FIRST
  const [gameStarted, setGameStarted] = useState(false);
  const [config, setConfig] = useState(null);
  // ... all other hooks
  
  // NOW we can conditionally return (after all hooks are initialized)
  if (assignmentId && mode === 'assignment') {
    return <AssignmentWrapper />;
  }
  
  // Rest of component logic
}
```

## Games Fixed

### 1. ✅ Vocab Blast (`src/app/games/vocab-blast/page.tsx`)
- **Issue**: Assignment mode check at line 89 before `useEffect` at line 122
- **Fix**: Moved assignment mode check to line 193 (after all hooks)
- **Hooks affected**: `useEffect` for URL parameter checking

### 2. ✅ Word Blast (`src/app/games/word-blast/page.tsx`)
- **Issue**: Assignment mode check at line 31 before hooks
- **Fix**: Moved assignment mode check to line 66 (after all hooks)
- **Hooks affected**: `useState` for game configuration

### 3. ✅ Speed Builder (`src/app/games/speed-builder/page.tsx`)
- **Issue**: Assignment mode check at line 64 before hooks
- **Fix**: Moved assignment mode check to line 64 (after all hooks)
- **Hooks affected**: `useState` for game state management

### 4. ✅ Word Towers (`src/app/games/word-towers/page.tsx`)
- **Issue**: Assignment mode check at line 319, but hooks declared at line 416+
- **Fix**: Moved hook declarations to line 310 (before assignment check)
- **Hooks affected**: Multiple `useState` hooks for game state
- **Note**: This was the most complex fix as hooks were declared much later in the file

## Assignment Mode Navigation

All games in assignment mode now have proper navigation:

### Back to Assignment Button
The `GameAssignmentWrapper` component provides a standard "Back to Assignments" button in the header for all games. This button:
- Appears in the top-left corner
- Uses the `onBackToAssignments` callback
- Navigates to `/student-dashboard/assignments/{assignmentId}`

### Completion Screens
Games should NOT auto-redirect after completion. Instead:
1. Show completion screen with stats
2. Provide two buttons:
   - **"Play Again"** - Restart the game
   - **"Go back to assignment"** - Return to assignment page

Example from VocabMaster:
```tsx
<button onClick={onBackToMenu}>
  {isAssignmentMode ? (
    <>
      <ArrowLeft className="h-5 w-5" />
      Go back to assignment
    </>
  ) : (
    <>
      <Home className="h-5 w-5" />
      Back to Menu
    </>
  )}
</button>
```

## Testing Checklist

To verify the fixes work correctly:

- [ ] Vocab Blast - Assignment mode loads without errors
- [ ] Word Blast - Assignment mode loads without errors
- [ ] Speed Builder - Assignment mode loads without errors
- [ ] Word Towers - Assignment mode loads without errors
- [ ] All games show "Back to Assignments" button in header
- [ ] Completion screens show proper navigation options
- [ ] No "Rendered more hooks" errors in console
- [ ] Games can be played multiple times in assignment mode

## Best Practices for Future Development

### 1. Always Initialize Hooks First
```tsx
export default function GamePage() {
  // 1. Get URL parameters
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  
  // 2. Initialize ALL hooks
  const [state1, setState1] = useState(initialValue);
  const [state2, setState2] = useState(initialValue);
  useEffect(() => { /* ... */ }, []);
  
  // 3. NOW you can have conditional returns
  if (assignmentId) {
    return <AssignmentWrapper />;
  }
  
  // 4. Rest of component
}
```

### 2. Comment Hook Sections
```tsx
// ALL HOOKS MUST BE INITIALIZED FIRST - before any conditional returns
const [gameStarted, setGameStarted] = useState(false);
// ... more hooks

// Assignment mode check (after all hooks are initialized)
if (assignmentId && mode === 'assignment') {
  return <AssignmentWrapper />;
}
```

### 3. Use ESLint Rules
Enable the `react-hooks/rules-of-hooks` ESLint rule to catch these issues during development.

## Related Files

- `src/components/games/templates/GameAssignmentWrapper.tsx` - Provides standard assignment UI
- `src/app/games/vocab-master/components/GameCompletionScreen.tsx` - Example completion screen
- All game `page.tsx` files in `src/app/games/*/page.tsx`

## References

- [React Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Hooks FAQ](https://react.dev/reference/react/hooks#rules-of-hooks)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

