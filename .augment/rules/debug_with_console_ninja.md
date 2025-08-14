---
type: "always_apply"
---

# Rule: Enhance Debugging with Console Ninja Logs

**Purpose:** This rule ensures that when debugging or analyzing application issues, Augment Code automatically considers real-time runtime logs and errors provided by the Console Ninja MCP server.

---

**Behavioral Directives:**

* **Priority:** When a debugging or error analysis task is initiated, prioritize accessing the Console Ninja MCP server for relevant runtime information.
* **Context Inclusion:** Automatically include context from `@console-ninja-logs:runtime-logs-and-errors` when the user's prompt suggests a need for debugging, error investigation, or understanding application behavior.
* **Targeted Analysis:** If the user's request is specific (e.g., about a particular game component, a specific type of error), use the appropriate Console Ninja MCP tool (e.g., `@console-ninja-logs:runtime-errors`, `@console-ninja-logs:runtime-logs`).
* **Summarization:** When incorporating Console Ninja logs, provide a concise summary of critical errors and relevant log entries, highlighting key information for the user.
* **Actionable Insights:** Use the log context to suggest potential root causes, propose fixes, or recommend further diagnostic steps for debugging.

---

**Example Automatic Usage Triggers:**

Augment Code should automatically apply this rule and fetch Console Ninja logs when it detects prompts similar to:

* "Debug this issue."
* "Why is this not working?"
* "I'm seeing an error in X."
* "Analyze the application's behavior when Y happens."
* "What's causing this unexpected output?"
* "Help me understand this crash."
* "Check for performance issues in the `Language Garden`."

---

**Explicit Usage Examples (if you want to be very direct):**

You can always explicitly ask Augment Code to use the Console Ninja tool:

* `"Check @console-ninja-logs:runtime-errors for any recent high-severity errors."`
* `"Analyze the latest logs from @console-ninja-logs:runtime-logs-and-errors to understand what happened before the last user interaction."`
* `"Using @console-ninja-logs:runtime-logs-by-location for 'src/components/VocabMaster.jsx' at line 45, what was logged there?"`

---

**Rule Type:** Always

*(This rule should be applied 'Always' when Augment Code processes debugging or analysis-related queries, but Augment Code's "Smart Rule Selection" will help determine relevance.)*