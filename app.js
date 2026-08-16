let sessionQuestions = [];
let dangerSessionQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let currentMode = 'karimen';
let currentDangerAnswers = [null, null, null];
let wrongQuestionIds = JSON.parse(localStorage.getItem('wrongQuestions')) || [];

// UI Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const scoreScreen = document.getElementById('score-screen');
const questionTextElement = document.getElementById('question-text');
const progressElement = document.getElementById('progress');
const controlsSection = document.getElementById('controls-section');
const dangerSection = document.getElementById('danger-section');
const submitBtn = document.getElementById('submit-btn');
const skipBtn = document.getElementById('skip-btn');
const explanationSection = document.getElementById('explanation-section');
const explanationTextElement = document.getElementById('explanation-text');
const resultBadge = document.getElementById('result-badge');
const nextBtnContainer = document.getElementById('next-btn-container');

let currentSelectedOption = null;

function updateWeaknessCount() {
    const countElement = document.getElementById('weakness-count');
    const btnElement = document.getElementById('weakness-btn');
    const resetBtnElement = document.getElementById('reset-weakness-btn');
    
    if (countElement && btnElement) {
        countElement.textContent = wrongQuestionIds.length;
        if (wrongQuestionIds.length > 0) {
            btnElement.disabled = false;
            if (resetBtnElement) resetBtnElement.disabled = false;
        } else {
            btnElement.disabled = true;
            if (resetBtnElement) resetBtnElement.disabled = true;
        }
    }
}

function resetWeaknessList() {
    if (wrongQuestionIds.length === 0) return;
    
    if (confirm("蓄積された弱点問題の履歴をすべて削除します。よろしいですか？")) {
        wrongQuestionIds = [];
        localStorage.removeItem('wrongQuestionIds');
        updateWeaknessCount();
        alert("弱点リストをリセットしました。");
    }
}

function updateStartScreen() {
    const countElement = document.getElementById('weakness-count');
    const btnElement = document.getElementById('weakness-btn');
    if (countElement && btnElement) {
        countElement.textContent = wrongQuestionIds.length;
        if (wrongQuestionIds.length > 0) {
            btnElement.disabled = false;
        } else {
            btnElement.disabled = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', updateStartScreen);
updateStartScreen(); // Call immediately in case DOM is already loaded

function saveWrongQuestions() {
    localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestionIds));
}

function recordAnswer(questionId, isCorrect) {
    if (!isCorrect) {
        if (!wrongQuestionIds.includes(questionId)) {
            wrongQuestionIds.push(questionId);
        }
    } else {
        const index = wrongQuestionIds.indexOf(questionId);
        if (index !== -1) {
            wrongQuestionIds.splice(index, 1);
        }
    }
    saveWrongQuestions();
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startSession(mode) {
    currentMode = mode;
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    scoreScreen.style.display = 'none';
    
    if (mode === 'weakness') {
        const weakNormals = questions.filter(q => wrongQuestionIds.includes(q.id));
        sessionQuestions = shuffleArray(weakNormals);
        
        const weakDangers = dangerQuestions.filter(q => wrongQuestionIds.includes(q.id));
        dangerSessionQuestions = shuffleArray(weakDangers);
        
        if (sessionQuestions.length === 0 && dangerSessionQuestions.length === 0) {
            alert("弱点問題がありません！素晴らしい！");
            location.reload();
            return;
        }
    } else if (mode === 'test_media') {
        const mediaNormals = questions.filter(q => q.image || q.video);
        sessionQuestions = mediaNormals; // 全件表示、シャッフルなし（確認しやすいため）
        
        const mediaDangers = dangerQuestions.filter(q => q.image || q.video);
        dangerSessionQuestions = mediaDangers; // 全件表示
        
        if (sessionQuestions.length === 0 && dangerSessionQuestions.length === 0) {
            alert("画像や動画を含む問題がありません。");
            location.reload();
            return;
        }
    } else {
        const numQuestions = mode === 'honmen' ? 90 : 50;
        
        // 優先的に出題する問題（間違えた問題 または 重要問題）
        let prioritized = questions.filter(q => wrongQuestionIds.includes(q.id) || q.important);
        let others = questions.filter(q => !wrongQuestionIds.includes(q.id) && !q.important);
        
        prioritized = shuffleArray(prioritized);
        others = shuffleArray(others);
        
        let maxPrioritized = mode === 'honmen' ? 40 : 20;
        let selected = prioritized.slice(0, maxPrioritized);
        let remainingNeeded = numQuestions - selected.length;
        selected = selected.concat(others.slice(0, remainingNeeded));
        
        // 【安全対策】万が一問題データに重複があった場合でも、1回の試験中には絶対に重複して出題されないように除外する
        const uniqueSelected = [];
        const seenQuestions = new Set();
        selected.forEach(q => {
            if (!seenQuestions.has(q.question)) {
                seenQuestions.add(q.question);
                uniqueSelected.push(q);
            }
        });
        
        sessionQuestions = shuffleArray(uniqueSelected); // 最終シャッフル
        
        if (mode === 'honmen') {
            dangerSessionQuestions = shuffleArray(dangerQuestions).slice(0, 5);
        } else {
            dangerSessionQuestions = [];
        }
    }
    
    userAnswers = [];
    currentQuestionIndex = 0;
    score = 0;
    
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const totalQuestions = sessionQuestions.length + dangerSessionQuestions.length;
    progressElement.textContent = `問題 ${currentQuestionIndex + 1} / ${totalQuestions}`;
    
    if (currentQuestionIndex < sessionQuestions.length) {
        document.querySelector('.question-section').style.display = 'block';
        controlsSection.style.display = 'flex';
        dangerSection.style.display = 'none';
        submitBtn.style.display = 'block';
        skipBtn.style.display = 'block';
        
        const currentQuestion = sessionQuestions[currentQuestionIndex];
        questionTextElement.textContent = currentQuestion.question;
        
        const questionImageElement = document.getElementById('question-image');
        if (currentQuestion.image) {
            questionImageElement.src = currentQuestion.image;
            questionImageElement.style.display = 'block';
        } else {
            questionImageElement.src = '';
            questionImageElement.style.display = 'none';
        }
    } else {
        document.querySelector('.question-section').style.display = 'none';
        controlsSection.style.display = 'none';
        dangerSection.style.display = 'block';
        submitBtn.style.display = 'none';
        skipBtn.style.display = 'block';
        
        const dangerIndex = currentQuestionIndex - sessionQuestions.length;
        const currentDanger = dangerSessionQuestions[dangerIndex];
        
        const dangerImageElement = document.getElementById('danger-image');
        const dangerVideoElement = document.getElementById('danger-video');
        
        if (currentDanger.image) {
            dangerImageElement.src = currentDanger.image;
            dangerImageElement.style.display = 'block';
            dangerVideoElement.style.display = 'none';
            dangerVideoElement.pause();
        } else if (currentDanger.video) {
            dangerVideoElement.src = currentDanger.video;
            dangerVideoElement.style.display = 'block';
            dangerImageElement.style.display = 'none';
        } else {
            dangerImageElement.style.display = 'none';
            dangerVideoElement.style.display = 'none';
            dangerVideoElement.pause();
        }
        
        document.getElementById('danger-scenario').textContent = currentDanger.scenario;
        
        currentDangerAnswers = [null, null, null];
        const subqContainer = document.getElementById('danger-subquestions');
        subqContainer.innerHTML = '';
        
        currentDanger.subQuestions.forEach((sq, i) => {
            const div = document.createElement('div');
            div.style.marginBottom = '1rem';
            div.style.padding = '1rem';
            div.style.backgroundColor = '#f9f9f9';
            div.style.border = '1px solid #e0e0e0';
            div.style.borderRadius = '8px';
            div.innerHTML = `
                <div style="font-weight:bold; margin-bottom:0.8rem; text-align:left;">(${i+1}) ${sq.question}</div>
                <div class="controls" style="margin-top:0.5rem;">
                    <button id="d-btn-true-${i}" class="btn" style="background-color:#e0e0e0; flex:1;" onclick="selectDangerOption(${i}, '○')">○</button>
                    <button id="d-btn-false-${i}" class="btn" style="background-color:#e0e0e0; flex:1;" onclick="selectDangerOption(${i}, '×')">×</button>
                </div>
            `;
            subqContainer.appendChild(div);
        });
        document.getElementById('danger-submit-btn').disabled = true;
    }
}

function selectOption(option) {
    currentSelectedOption = option;
    document.querySelectorAll('#controls-section .btn').forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.border = 'none';
    });
    
    const selectedBtn = option === '○' ? document.querySelector('#controls-section .btn-correct') : document.querySelector('#controls-section .btn-wrong');
    selectedBtn.style.opacity = '1';
    selectedBtn.style.border = '2px solid #333';
    
    submitBtn.disabled = false;
}

function selectDangerOption(subIndex, option) {
    currentDangerAnswers[subIndex] = option;
    
    const trueBtn = document.getElementById(`d-btn-true-${subIndex}`);
    const falseBtn = document.getElementById(`d-btn-false-${subIndex}`);
    
    trueBtn.style.backgroundColor = option === '○' ? '#4caf50' : '#e0e0e0';
    trueBtn.style.color = option === '○' ? 'white' : 'black';
    falseBtn.style.backgroundColor = option === '×' ? '#f44336' : '#e0e0e0';
    falseBtn.style.color = option === '×' ? 'white' : 'black';
    
    if (currentDangerAnswers.every(ans => ans !== null)) {
        document.getElementById('danger-submit-btn').disabled = false;
    }
}

function submitAnswer() {
    if (!currentSelectedOption) return;
    
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const isCorrect = currentSelectedOption === currentQuestion.answer;
    
    if (isCorrect) score++;
    recordAnswer(currentQuestion.id, isCorrect);
    
    userAnswers.push({
        type: 'normal',
        question: currentQuestion,
        userAnswer: currentSelectedOption,
        isCorrect: isCorrect
    });
    
    showExplanation(isCorrect, currentQuestion.explanation, currentQuestion.video);
}

function skipQuestion() {
    const isDanger = currentQuestionIndex >= sessionQuestions.length;
    
    if (isDanger) {
        const dangerIndex = currentQuestionIndex - sessionQuestions.length;
        const currentDanger = dangerSessionQuestions[dangerIndex];
        
        recordAnswer(currentDanger.id, false); // 弱点に登録
        
        userAnswers.push({
            type: 'danger',
            question: currentDanger,
            userAnswers: ['未解答', '未解答', '未解答'],
            isCorrect: false
        });
    } else {
        const currentQuestion = sessionQuestions[currentQuestionIndex];
        
        recordAnswer(currentQuestion.id, false); // 弱点に登録
        
        userAnswers.push({
            type: 'normal',
            question: currentQuestion,
            userAnswer: 'スキップ',
            isCorrect: false
        });
    }
    
    // 解説を出さずに即座に次へ
    currentQuestionIndex++;
    const totalQuestions = sessionQuestions.length + dangerSessionQuestions.length;
    if (currentQuestionIndex < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    }
}

function submitDangerAnswer() {
    const dangerIndex = currentQuestionIndex - sessionQuestions.length;
    const currentDanger = dangerSessionQuestions[dangerIndex];
    
    let isAllCorrect = true;
    currentDangerAnswers.forEach((ans, i) => {
        if (ans !== currentDanger.subQuestions[i].answer) {
            isAllCorrect = false;
        }
    });
    
    if (isAllCorrect) {
        score += 2;
    }
    recordAnswer(currentDanger.id, isAllCorrect);
    
    userAnswers.push({
        type: 'danger',
        question: currentDanger,
        userAnswers: [...currentDangerAnswers],
        isCorrect: isAllCorrect
    });
    
    showExplanation(isAllCorrect, currentDanger.explanation, null);
    
    document.querySelectorAll('#danger-subquestions button').forEach(btn => btn.disabled = true);
    document.getElementById('danger-submit-btn').style.display = 'none';
}

function showExplanation(isCorrect, explanationText, videoUrl) {
    if (isCorrect) {
        resultBadge.textContent = '正解！';
        resultBadge.className = 'result-badge correct';
    } else {
        resultBadge.textContent = '不正解...';
        resultBadge.className = 'result-badge wrong';
    }
    
    const explanationVideoElement = document.getElementById('explanation-video');
    if (videoUrl) {
        explanationVideoElement.src = videoUrl;
        explanationVideoElement.style.display = 'block';
        explanationVideoElement.play().catch(e => console.log('Auto-play prevented'));
    } else {
        explanationVideoElement.style.display = 'none';
        explanationVideoElement.src = '';
    }
    
    explanationTextElement.textContent = explanationText;
    explanationSection.classList.add('visible');
    nextBtnContainer.classList.add('visible');
    
    if (currentQuestionIndex < sessionQuestions.length) {
        document.querySelectorAll('#controls-section .btn').forEach(btn => btn.disabled = true);
        submitBtn.style.display = 'none';
        skipBtn.style.display = 'none';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    const totalQuestions = sessionQuestions.length + dangerSessionQuestions.length;
    
    if (currentQuestionIndex < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    }
}

function resetState() {
    currentSelectedOption = null;
    
    document.querySelectorAll('#controls-section .btn').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.border = 'none';
        btn.disabled = false;
    });
    
    submitBtn.style.display = 'block';
    submitBtn.disabled = true;
    skipBtn.style.display = 'block';
    
    document.getElementById('danger-submit-btn').style.display = 'block';
    
    explanationSection.classList.remove('visible');
    
    const explanationVideoElement = document.getElementById('explanation-video');
    if (explanationVideoElement) {
        explanationVideoElement.pause();
        explanationVideoElement.src = '';
    }
    
    nextBtnContainer.classList.remove('visible');
}

function showScore() {
    quizScreen.style.display = 'none';
    scoreScreen.style.display = 'block';
    
    const totalQuestions = sessionQuestions.length + dangerSessionQuestions.length;
    let maxScore = sessionQuestions.length + (dangerSessionQuestions.length * 2);
    let passThreshold = Math.floor(maxScore * 0.9); // 90%
    
    if (currentMode === 'weakness' || currentMode === 'test_media') {
        passThreshold = maxScore; // 弱点やテストは満点目指す
    }
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions').textContent = maxScore;
    
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
    document.getElementById('score-percentage').textContent = percentage;
    
    const statusElement = document.getElementById('result-status');
    const messageElement = document.getElementById('result-message');
    
    if (score >= passThreshold) {
        statusElement.textContent = '合格！';
        statusElement.className = 'result-status pass';
        if (currentMode === 'weakness') {
            messageElement.textContent = '素晴らしい！弱点をしっかり克服できましたね！';
        } else if (currentMode === 'test_media') {
            messageElement.textContent = 'テスト完了です！全ての画像・動画が正常に表示されましたか？';
        } else {
            messageElement.textContent = '素晴らしい成績です！この調子で本番も頑張りましょう！';
        }
    } else {
        statusElement.textContent = '不合格...';
        statusElement.className = 'result-status fail';
        if (currentMode === 'test_media') {
            messageElement.textContent = `メディアのテストモードです。間違えた問題を確認できます。`;
        } else {
            messageElement.textContent = `合格まであと ${passThreshold - score}点 足りませんでした。振り返りを確認して復習しましょう。`;
        }
    }
    
    generateReviewList();
}

function generateReviewList() {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    userAnswers.forEach((item, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        if (item.type === 'normal') {
            const badgeClass = item.isCorrect ? 'correct' : 'wrong';
            const badgeText = item.isCorrect ? '正解' : '不正解';
            const imageHtml = item.question.image ? `<img src="${item.question.image}" style="max-width: 80px; margin-bottom: 0.5rem; display: block;">` : '';
            const videoHtml = item.question.video ? `<video src="${item.question.video}" controls style="max-width: 150px; margin-bottom: 0.5rem; display: block; border-radius: 4px;"></video>` : '';
            
            reviewItem.innerHTML = `
                ${imageHtml}
                ${videoHtml}
                <div class="review-question">Q${index + 1}. ${item.question.question}</div>
                <div class="review-meta">
                    <span class="result-badge ${badgeClass}" style="margin:0;">${badgeText}</span>
                    <span style="margin-left: 1rem;">あなたの解答: <strong>${item.userAnswer}</strong></span>
                    <span style="margin-left: 1rem;">正解: <strong>${item.question.answer}</strong></span>
                </div>
                <div class="review-explanation">${item.question.explanation}</div>
            `;
        } else {
            const badgeClass = item.isCorrect ? 'correct' : 'wrong';
            const imageHtml = item.question.image ? `<img src="${item.question.image}" style="max-width: 150px; margin-bottom: 0.5rem; display: block;">` : '';
            const videoHtml = item.question.video ? `<video src="${item.question.video}" controls style="max-width: 250px; margin-bottom: 0.5rem; display: block; border-radius: 4px;"></video>` : '';
            
            let subQsHtml = '';
            item.question.subQuestions.forEach((sq, i) => {
                const isSubCorrect = item.userAnswers[i] === sq.answer;
                const resultIcon = isSubCorrect ? '<span style="color: #107c10; font-weight: bold;">[正解]</span>' : '<span style="color: #d13438; font-weight: bold;">[不正解]</span>';
                const bgColor = isSubCorrect ? '#f3f2f1' : '#fde7e9';
                const borderColor = isSubCorrect ? '#107c10' : '#d13438';
                
                subQsHtml += `<div style="margin-bottom: 0.5rem; font-size: 0.9em; padding: 0.5rem; background-color: ${bgColor}; border-left: 4px solid ${borderColor};">
                    <strong>小問${i + 1}:</strong> ${sq.question}<br>
                    <span style="color: #333;">あなたの解答: <strong>${item.userAnswers[i] || '未解答'}</strong> | 正解: <strong>${sq.answer}</strong></span> ${resultIcon}
                </div>`;
            });
            
            reviewItem.innerHTML = `
                ${imageHtml}
                ${videoHtml}
                <div class="review-question" style="text-align: left; margin-bottom: 1rem;">Q${index + 1}. (危険予測) ${item.question.scenario}</div>
                ${subQsHtml}
                <div class="review-meta" style="margin-top: 1rem;">
                    <span class="result-badge ${badgeClass}" style="margin:0;">${item.isCorrect ? '2点ゲット！ (全問正解)' : '0点 (一部不正解)'}</span>
                </div>
                <div class="review-explanation">${item.question.explanation}</div>
            `;
        }
        
        reviewList.appendChild(reviewItem);
    });
}

function restartQuiz() {
    location.reload();
}
