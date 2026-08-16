const fs = require('fs');
let content = fs.readFileSync('questions.js', 'utf8');
let script = content.replace('const questions =', 'module.exports =');
fs.writeFileSync('temp_q4.js', script);

const qs = require('./temp_q4.js');

const newQuestions = [
    {
        id: qs.length + 1,
        question: "図のように黄色の実線と黄色の斜線で描かれた標示（立ち入り禁止部分）がある場所では、危険を避けるためやむを得ない場合を除き、車はその中に入ってはいけない。",
        answer: "○",
        explanation: "この標示は「立ち入り禁止部分」です。導流帯（ゼブラゾーン）とは異なり、いかなる理由であっても（危険回避を除き）車は進入してはなりません。",
        image: "images/keep_out.svg",
        important: true
    },
    {
        id: qs.length + 2,
        question: "図のように白色の実線と白色の斜線で囲まれた四角形の標示（停止禁止部分）がある場所では、前方の信号が赤であっても、その中を通過することができるが、その中で停止してはならない。",
        answer: "○",
        explanation: "この標示は警察署や消防署の前などに描かれる「停止禁止部分」です。通過すること自体は違反ではありませんが、赤信号の順番待ちや渋滞などで、この枠内で停止してしまうことは禁止されています。",
        image: "images/no_stopping_area.svg",
        important: true
    }
];

qs.push(...newQuestions);

let output = 'const questions = ' + JSON.stringify(qs, null, 4) + ';\n';
fs.writeFileSync('questions.js', output);
fs.unlinkSync('temp_q4.js');
console.log('Appended official marking questions successfully.');
