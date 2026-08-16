const fs = require('fs');

['questions.js', 'danger_questions.js'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let replaced = content.replace(/\.wmv/g, '.mp4');
    fs.writeFileSync(file, replaced);
    console.log(`Replaced .wmv with .mp4 in ${file}`);
});
