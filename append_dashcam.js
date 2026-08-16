const fs = require('fs');

let content = fs.readFileSync('danger_questions.js', 'utf8');
let script = content.replace('const dangerQuestions =', 'module.exports =');
fs.writeFileSync('temp_dq.js', script);

const dq = require('./temp_dq.js');

const newDangers = [
    {
        id: dq.length + 1,
        scenario: "一般道を直進しています。脇道や駐車場が多く、夕暮れ時で視界がやや不良です。",
        video: "media/text_sample01.wmv",
        subQuestions: [
            { question: "駐車場や脇道の多い道路では、人や車が飛び出してくることは少ないため、速度を落とさずに進行する。", answer: "×" },
            { question: "死角から歩行者等が飛び出してくることを予測し、いつでも停止できる速度で進行する。", answer: "○" },
            { question: "夕暮れ時は視界が悪くなるため、早めに前照灯を点灯して自分の存在を周囲に知らせる。", answer: "○" }
        ],
        explanation: "脇道や駐車場からの飛び出しを常に予測し、いつでも停止できる速度（徐行）で進む必要があります。また、夕暮れ時は視認性が落ちるため早めのライト点灯が基本です。"
    },
    {
        id: dq.length + 2,
        scenario: "片側一車線の一般道を直進しています。前方に駐車車両があり、対向車が来ています。",
        video: "media/text_sample02.wmv",
        subQuestions: [
            { question: "駐車車両の陰から人が飛び出してくるかもしれないが、対向車が来ているので急いで駐車車両を避けて進行する。", answer: "×" },
            { question: "対向車が通り過ぎるのを待つため、駐車車両の手前で早めに減速し、安全にすれ違える場所で待機する。", answer: "○" },
            { question: "対向車に道を譲る必要はないので、対向車より先に駐車車両の横を通り抜ける。", answer: "×" }
        ],
        explanation: "障害物がある側の車が対向車に道を譲るのが原則です。無理に駐車車両を避けて進むと正面衝突の危険があります。"
    },
    {
        id: dq.length + 3,
        scenario: "雨の夕方、一般道を直進しています。前の車に続いて走行しています。",
        video: "media/text_sample03.wmv",
        subQuestions: [
            { question: "雨の日は路面が滑りやすく視界も悪いため、通常より車間距離を長くとって進行する。", answer: "○" },
            { question: "前の車が急ブレーキをかけた場合でもすぐに対応できるよう、車間距離を詰めて進行する。", answer: "×" },
            { question: "スリップを防ぐため、ブレーキをかけるときは急ブレーキを避け、余裕を持って踏む。", answer: "○" }
        ],
        explanation: "雨天時は制動距離（ブレーキが効き始めてから止まるまでの距離）が長くなるため、車間距離を長くとり、急ブレーキを避ける必要があります。"
    },
    {
        id: dq.length + 4,
        scenario: "駐車場から道路へ右折して出ようとしています。",
        video: "media/text_sample04.wmv",
        subQuestions: [
            { question: "道路に出る際は、左右から自転車や歩行者が急に現れることがあるため、徐行または一時停止して確認する。", answer: "○" },
            { question: "道路を走行している車が優先なので、歩行者や自転車がいても車の切れ目を狙って急いで右折する。", answer: "×" },
            { question: "道路に出るために歩道や路側帯を横切るときは、歩行者がいなくても必ずその直前で一時停止しなければならない。", answer: "○" }
        ],
        explanation: "歩道や路側帯を横切る際は、歩行者の有無にかかわらず必ずその直前で「一時停止」する義務があります。"
    },
    {
        id: dq.length + 5,
        scenario: "見通しの悪い駐車場（構内出入口）から道路へ出ようとしています。",
        video: "media/text_sample05.wmv",
        subQuestions: [
            { question: "見通しが悪くても、カーブミラーがあればそれに頼って一時停止せずに進行してよい。", answer: "×" },
            { question: "死角から車両や歩行者が出てくることを予測し、すぐ停止できる態勢で少しずつ前進して安全を確認する。", answer: "○" },
            { question: "道路に出るために歩道を横切る場合、歩行者がいなければ徐行してそのまま通過してよい。", answer: "×" }
        ],
        explanation: "カーブミラーはあくまで補助です。ミラーだけに頼らず、少しずつ前進して直接目視で安全を確認する必要があります。"
    },
    {
        id: dq.length + 6,
        scenario: "見通しの悪い側道から、信号のない交差点（優先道路）へ直進しようとしています。",
        video: "media/text_sample06.wmv",
        subQuestions: [
            { question: "側道から優先道路に入る場合、塀などで見通しが悪くても、徐行すれば一時停止しなくてもよい。", answer: "×" },
            { question: "本線の状況が分からないため、急に車両が来ることを予測し、必ず手前で一時停止して安全を確認する。", answer: "○" },
            { question: "優先道路を走っている車は、側道から車が出てこないと考えていることが多いため、側道側が十分に注意する。", answer: "○" }
        ],
        explanation: "見通しの悪い交差点や優先道路へ入る際は、必ず一時停止して左右の安全を直接確認しなければなりません。"
    },
    {
        id: dq.length + 7,
        scenario: "信号のない丁字路交差点を右折しようとしています。直線道路には車が接近しています。",
        video: "media/text_sample07.wmv",
        subQuestions: [
            { question: "直線道路の車は思った以上に速く接近してくることがあるため、自車の通過時間を考えて慎重にタイミングを判断する。", answer: "○" },
            { question: "直線道路の車がまだ遠くにいると判断した場合は、一時停止せずにそのまま右折してもよい。", answer: "×" },
            { question: "左右の安全確認を十分に行い、接近してくる車両の速度と距離を見極めてから進入する。", answer: "○" }
        ],
        explanation: "直線道路の車はスピードが出ていることが多く、距離感を誤りやすいため、無理な右折（右直事故）は絶対に避けるべきです。"
    },
    {
        id: dq.length + 8,
        scenario: "信号のある交差点を青信号で右折しようとしています。対向車線から直進車が来ています。",
        video: "media/text_sample08.wmv",
        subQuestions: [
            { question: "対向車線の直進車が接近していても、自分が先に右折できると判断したら急いで右折する。", answer: "×" },
            { question: "青信号では直進車が速度を落とさずに交差点に進入してくることが多いため、対向車の間をぬって右折するのは危険である。", answer: "○" },
            { question: "対向車が通り過ぎた後、横断歩道を渡る歩行者や自転車の有無を確認しながら徐行して右折する。", answer: "○" }
        ],
        explanation: "青信号での右直事故は非常に多発しています。直進車が優先であり、さらに対向車の陰から二輪車が直進してくる危険性にも注意が必要です。"
    }
];

dq.push(...newDangers);

let output = 'const dangerQuestions = ' + JSON.stringify(dq, null, 4) + ';\n';
fs.writeFileSync('danger_questions.js', output);
fs.unlinkSync('temp_dq.js');
console.log('Appended 8 new dashcam danger questions successfully.');
