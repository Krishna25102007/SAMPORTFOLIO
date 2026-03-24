const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Match <style> ... </style>
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = content.match(styleRegex);
if (styleMatch) {
    fs.writeFileSync(path.join(__dirname, 'style.css'), styleMatch[1].trim());
    content = content.replace(styleRegex, '<link rel="stylesheet" href="style.css" />');
}

// Match <script> ... </script>
const scriptRegex = /<script>([\s\S]*?)<\/script>/;
const scriptMatch = content.match(scriptRegex);
if (scriptMatch) {
    fs.writeFileSync(path.join(__dirname, 'script.js'), scriptMatch[1].trim());
    content = content.replace(scriptRegex, '<script src="script.js"></script>');
}

fs.writeFileSync(filePath, content);
console.log('Extraction complete.');
