const fs = require('fs');
let content = fs.readFileSync('questions.js', 'utf8');

// The file looks like: const questions = [ ... ];
// We will evaluate it, modify the objects, and rewrite it.
let script = content.replace('const questions =', 'module.exports =');
fs.writeFileSync('temp_q.js', script);

const qs = require('./temp_q.js');

// Add 'important': true to specific IDs or random ones
qs.forEach(q => {
    // Make mostly recent ones important, plus some early ones
    if (q.id > 100 && q.id % 2 === 0) {
        q.important = true;
    }
    if (q.id === 37 || q.id === 66 || q.id === 91 || q.id === 92) {
        q.important = true; // signs and hand signals
    }
});

let output = 'const questions = ' + JSON.stringify(qs, null, 4) + ';\n';
fs.writeFileSync('questions.js', output);
fs.unlinkSync('temp_q.js');
console.log('Added important flags successfully.');
