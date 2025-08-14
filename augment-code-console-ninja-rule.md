# Augment Code Rule: Console Ninja Monitoring Integration

## Rule Configuration for Console Ninja Log Analysis

### Rule Name: Console Ninja Debug Assistant

### Trigger Conditions:
- File patterns: `console-ninja-logs.json`
- File content contains: `"source": "console-ninja-mcp"`
- When working with Next.js/React applications
- During debugging sessions with runtime errors

### Context Integration:
```json
{
  "name": "Console Ninja Debug Assistant",
  "description": "Automatically analyze Console Ninja runtime logs and errors for debugging assistance",
  "triggers": {
    "filePatterns": ["console-ninja-logs.json", "**/console-ninja-*.json"],
    "contentPatterns": ["console-ninja-mcp", "debuggingContext", "currentErrors"],
    "extensions": [".json"],
    "workspaceContains": ["package.json", "next.config.js", "tsconfig.json"]
  },
  "actions": {
    "analyzeErrors": {
      "enabled": true,
      "priority": "high",
      "autoTrigger": true
    },
    "suggestFixes": {
      "enabled": true,
      "includeStackTrace": true,
      "includeComponentContext": true
    },
    "trackPatterns": {
      "gameRelatedErrors": true,
      "componentLifecycle": true,
      "networkIssues": true
    }
  }
}
```

### Prompt Enhancement:
When Console Ninja logs are detected, automatically append this context:

```
**Console Ninja Runtime Context Available**

I have access to real-time runtime logs and errors from your running application via Console Ninja. This includes:

- Browser console logs and errors
- Component lifecycle information  
- Network request details
- Game-specific activity tracking
- File and line number context

Current debugging context shows:
- Total log entries: {{summary.totalEntries}}
- Error count: {{summary.errorCount}}
- Game-related activity: {{summary.gameRelatedCount}}
- Active components: {{summary.componentActivity}}

Let me analyze the runtime data to provide targeted debugging assistance.
```

### Analysis Instructions:
1. **Error Priority Analysis**: Parse `currentErrors` array for critical issues
2. **Component Activity Tracking**: Monitor `componentActivity` for lifecycle issues
3. **Game-Specific Context**: Focus on `isGameRelated` logs for game debugging
4. **File Location Context**: Use `file` and `line` data for precise debugging
5. **Severity Assessment**: Prioritize based on `severity` levels (high, medium, low)

### Automatic Actions:
- **High Priority**: Runtime errors, failed network requests, component crashes
- **Medium Priority**: Performance warnings, state inconsistencies
- **Low Priority**: Debug logs, lifecycle notifications

### Code Generation Enhancements:
When suggesting fixes, include:
- Exact file paths from log context
- Line numbers for precise error locations
- Component-specific debugging strategies
- Game logic error patterns
- Network request debugging steps

### Usage Example:
```typescript
// When analyzing this log entry:
{
  "type": "error",
  "file": "/src/games/hangman/components/hangmangamewrapper.tsx", 
  "line": 45,
  "message": "Cannot read property 'vocabulary' of undefined",
  "severity": "high",
  "isGameRelated": true
}

// Augment Code will automatically:
// 1. Open the specific file and line
// 2. Analyze the vocabulary state management
// 3. Suggest null-safe access patterns
// 4. Provide game-specific debugging context
```

### Integration Commands:
- `npm run console-ninja:monitor` - Start real-time monitoring
- `npm run console-ninja:single` - One-time log capture
- `npm run console-ninja:test` - Test integration

### Privacy & Compliance Notes:
✅ **Terms Compliance**: Console Ninja Community edition is free and explicitly supports MCP integration for AI tools
✅ **No Rate Limits**: Community edition has no API rate limits for local development
✅ **No Extra Costs**: Free tier includes all monitoring features used
✅ **Local Data Only**: All logs remain local, never sent to external servers
