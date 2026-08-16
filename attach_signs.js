const fs = require('fs');

let content = fs.readFileSync('questions.js', 'utf8');
let script = content.replace('const questions =', 'module.exports =');
fs.writeFileSync('temp_q2.js', script);

const qs = require('./temp_q2.js');

qs.forEach(q => {
    if (q.question.includes("駐車禁止の場所であっても、人の乗り降りのための停止であれば") || q.question.includes("消火栓や消防用機械器具の置き場から5メートル以内の場所は、駐車禁止である")) {
        q.image = "images/no_parking.svg";
    }
    if (q.question.includes("交差点とその端から5メートル以内の場所は、駐停車禁止である") || q.question.includes("横断歩道や自転車横断帯から前後5メートル以内の場所は")) {
        q.image = "images/no_stopping.svg";
    }
});

let output = 'const questions = ' + JSON.stringify(qs, null, 4) + ';\n';
fs.writeFileSync('questions.js', output);
fs.unlinkSync('temp_q2.js');
console.log('Attached sign images successfully.');
