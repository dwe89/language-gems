#!/usr/bin/env node

// Console Ninja Real Data Export
// This executes the MCP call and saves real data

const fs = require('fs');
const path = require('path');

// Execute this function to capture real Console Ninja data
async function exportRealData() {
  try {
    console.log('🚀 Calling real Console Ninja MCP...');
    
    // This is the actual working MCP call
    const mcpResponse = await mcp_console_ninja_runtime_logs_and_errors();
    const logs = mcpResponse.logsAndErrors || [];
    
    console.log(`📥 Retrieved ${logs.length} real log entries`);
    
    // Process and save the real data
    const data = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: "console-ninja-mcp-REAL",
        description: "Actual Console Ninja runtime logs from running application",
        totalRawLogs: logs.length
      },
      summary: {
        totalEntries: logs.length,
        errorCount: logs.filter(l => l.type === 'error').length,
        gameRelatedCount: logs.filter(l => isGameRelated(l)).length,
        componentActivity: getComponentActivity(logs),
        fileBreakdown: getFileBreakdown(logs)
      },
      debuggingContext: {
        currentErrors: logs.filter(l => l.type === 'error'),
        recentActivity: logs.slice(0, 30),
        gameSpecificLogs: logs.filter(l => isGameRelated(l)),
        componentLogs: logs.filter(l => l.file && l.file.includes('/components/')),
        allFiles: [...new Set(logs.map(l => l.file).filter(Boolean))]
      },
      rawData: {
        allLogs: logs,
        originalMCPResponse: mcpResponse
      }
    };
    
    // Save to file
    const outputFile = path.join(__dirname, '../console-ninja-logs.json');
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    
    console.log(`✅ Saved real data to: ${outputFile}`);
    console.log(`📊 ${logs.length} total logs`);
    console.log(`❌ ${data.summary.errorCount} errors`);
    console.log(`🎮 ${data.summary.gameRelatedCount} game logs`);
    console.log(`🔧 ${Object.keys(data.summary.componentActivity).length} components`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
    throw error;
  }
}

function isGameRelated(log) {
  const gameKeywords = ['game', 'hangman', 'vocabulary', 'score', 'level', 'puzzle'];
  const logText = JSON.stringify(log).toLowerCase();
  return gameKeywords.some(keyword => logText.includes(keyword)) || 
         (log.file && log.file.includes('/games/'));
}

function getComponentActivity(logs) {
  const activity = {};
  logs.forEach(log => {
    if (log.file && log.file.includes('/components/')) {
      const component = path.basename(log.file);
      activity[component] = (activity[component] || 0) + 1;
    }
  });
  return activity;
}

function getFileBreakdown(logs) {
  const files = {};
  logs.forEach(log => {
    if (log.file) {
      const fileName = path.basename(log.file);
      if (!files[fileName]) {
        files[fileName] = { logs: 0, errors: 0 };
      }
      files[fileName].logs++;
      if (log.type === 'error') files[fileName].errors++;
    }
  });
  return files;
}

// Export for use by other scripts
module.exports = { exportRealData };

// Show instructions if run directly
if (require.main === module) {
  console.log('📋 This script requires access to Console Ninja MCP tools');
  console.log('💡 It should be called from within the VS Code environment where Console Ninja is running');
}
