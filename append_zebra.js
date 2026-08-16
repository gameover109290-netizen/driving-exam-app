const fs = require('fs');
let content = fs.readFileSync('questions.js', 'utf8');
let script = content.replace('const questions =', 'module.exports =');
fs.writeFileSync('temp_q3.js', script);

const qs = require('./temp_q3.js');

// 導流帯（ゼブラゾーン）の問題を作成
const zebraQuestion = {
    id: qs.length + 1,
    question: "図のように白の斜線で描かれた標示（導流帯）は、車が進入してはならない場所であることを示している。",
    answer: "×",
    explanation: "この標示は「導流帯（ゼブラゾーン）」です。車の安全な走行を誘導するためのものであり、進入しても交通違反にはなりません。ただし、むやみに進入すると事故の原因になるため、みだりに進入すべきではありません。（黄色の実線で囲まれた「立ち入り禁止部分」とは異なります）",
    image: "images/zebra_zone.svg",
    important: true
};

qs.push(zebraQuestion);

let output = 'const questions = ' + JSON.stringify(qs, null, 4) + ';\n';
fs.writeFileSync('questions.js', output);
fs.unlinkSync('temp_q3.js');
console.log('Appended zebra zone question successfully.');
