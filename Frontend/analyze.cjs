const fs = require('fs');
const path = require('path');

// 1. Analyze ESLint dependencies
const eslintReportPath = path.join(__dirname, 'eslint_report.json');
let eslintDeps = [];
if (fs.existsSync(eslintReportPath)) {
    const report = JSON.parse(fs.readFileSync(eslintReportPath, 'utf8'));
    report.forEach(file => {
        file.messages.forEach(msg => {
            if (msg.ruleId === 'react-hooks/exhaustive-deps') {
                eslintDeps.push({
                    file: file.filePath,
                    line: msg.line,
                    message: msg.message
                });
            }
        });
    });
}

// 2. Search for missing cleanup functions
// We'll recursively search src/ for .js and .jsx files, and look for useEffects that use timers, events, or abort controllers but have no return statement.
function findFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findFiles(fullPath, files);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            files.push(fullPath);
        }
    });
    return files;
}

const allFiles = findFiles(path.join(__dirname, 'src'));
const cleanupIssues = [];

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Basic regex to find useEffect blocks. It won't handle highly nested brackets perfectly, but good enough for a heuristic
    const useEffects = content.split(/useEffect\s*\(/);
    
    // Skip the first split since it's everything before the first useEffect
    for (let i = 1; i < useEffects.length; i++) {
        let block = useEffects[i];
        
        // Find the block of code inside the useEffect function
        // We'll just look at the next 30 lines approximately or until we see a closing dependency array
        const lines = block.split('\n').slice(0, 30);
        const snippet = lines.join('\n');
        
        const hasListener = /addEventListener|setInterval|setTimeout|subscribe|new AbortController/.test(snippet);
        const hasReturn = /return\s+(\(\)\s*=>|function)/.test(snippet);
        
        if (hasListener && !hasReturn) {
            // Found a potential missing cleanup
            cleanupIssues.push({
                file,
                snippet: lines.slice(0, 10).join('\n') + '...',
                reason: 'Contains side-effect (event/timer/subscription) but no return cleanup function detected.'
            });
        }
    }
});

fs.writeFileSync('analysis_results.json', JSON.stringify({
    missingDependencies: eslintDeps,
    missingCleanups: cleanupIssues
}, null, 2));

console.log(`Found ${eslintDeps.length} dependency issues and ${cleanupIssues.length} potential cleanup issues.`);
