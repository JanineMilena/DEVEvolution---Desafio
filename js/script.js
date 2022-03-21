// ========================================================================

let welcome_block = document.getElementById('welcome_block');
let quiz_block = document.getElementById('quiz_block');
let results_block = document.getElementById('results_block');
let ranking_block = document.getElementById('ranking_block');

let quiz_text = document.getElementById('quiz_text');
let results_text = document.getElementById('results_text');
let ranking_text = document.getElementById('ranking_text');

let start_button = document.getElementById('start_button');
let submit_button = document.getElementById('submit_button');
let register_button = document.getElementById('register_button');
let repeat_button = document.getElementById('repeat_button');

let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
let score = 0;
let timer = 0;
let desc = 0;

let quiz_questions = [
    {
        question: "<h1 class=\"titulo\">1 - Quantas cores há no arco-íris?</h1>",
        answers: {
            a: ' Há duas cores.',
            b: ' Há sete cores.',
            c: ' Há nove cores.',
            d: ' Há cinco cores.',
            e: ' Há dez cores.'
        },
        correctAnswer: 'b'
    },
    {
        question: "<h1 class=\"titulo\">2 - Quantos séculos há em um milênio?</h1>",
        answers: {
            a: ' Há cem séculos.',
            b: ' Há mil séculos.',
            c: ' Há um século.',
            d: ' Há dez séculos.',
            e: ' Há cinco séculos.',
        },
        correctAnswer: 'd'
    },
    {
        question: "<h1 class=\"titulo\">3 - Qual é a capital dos Estados Unidos?</h1>",
        answers: {
            a: ' Nova York.',
            b: ' Florida.',
            c: ' Los Santos.',
            d: ' Washington.',
            e: ' Boston.',
        },
        correctAnswer: 'd'
    },
    {
        question: "<h1 class=\"titulo\">4 - Qual o maior planeta do Sistema Solar?</h1>",
        answers: {
            a: ' Marte.',
            b: ' Terra.',
            c: ' Sol.',
            d: ' Plutão.',
            e: ' Júpiter.',
        },
        correctAnswer: 'e'
    },
    {
        question: "<h1 class=\"titulo\">5 - Que estado é considerado a Russia brasileira?</h1>",
        answers: {
            a: ' Paraná.',
            b: ' São Paulo.',
            c: ' Amapá.',
            d: ' Santa Catarina.',
            e: ' Bahia.',
        },
        correctAnswer: 'a'
    }
];

// ========================================================================

welcome_block.style.display = "block";
quiz_block.style.display = "none";
results_block.style.display = "none";
ranking_block.style.display = "none";

// ========================================================================

start_button.onclick = function () {
    if (document.getElementById('name').value.length == 0) {
        alert("Preencha seu nome para prosseguir.")
    } else {
        showQuestions(quiz_questions, quiz_text);
        startTimer();
    }
}

submit_button.onclick = function () {
    clearInterval(timer);
    document.getElementById('safeTimerDisplay').innerText = '';
    showResults(quiz_questions, quiz_text, results_text, desc);
}

register_button.onclick = function () {
    let name = document.getElementById('name').value;
    saveRank(ranking_text, ranking, name, score);
}

repeat_button.onclick = function () {
    restartGame();
}

// ========================================================================

function showQuestions(quiz_questions, quiz_text) {
    welcome_block.style.display = "none";
    quiz_block.style.display = "block";
    results_block.style.display = "none";
    ranking_block.style.display = "none";

    let output = [];
    let answers;
    let i;

    for (i = 0; i < quiz_questions.length; i++) {
        answers = [];

        for (letter in quiz_questions[i].answers) {
            answers.push(
                `
                <div class="option">
                <input type="radio" name="question${i}" value="${letter}">
                ${quiz_questions[i].answers[letter]}
                </div>
                `
            );
        }

        output.push(
            `
            <div class="question">
            ${quiz_questions[i].question}
            </div>
 
            <div class="answers">
            ${answers.join('')}
            </div>
            `
        );
    }

    quiz_text.innerHTML = output.join('');
}

function showResults(quiz_questions, quiz_text, results_text, desc) {
    welcome_block.style.display = "none";
    quiz_block.style.display = "none";
    results_block.style.display = "block";
    ranking_block.style.display = "none";

    let answerContainers = quiz_text.querySelectorAll('.answers');
    let userAnswer = '';
    let numCorrect = 0;
    score = 0;

    for (let i = 0; i < quiz_questions.length; i++) {
        userAnswer = (answerContainers[i].querySelector('input[name=question' + i + ']:checked') || {}).value;

        if (userAnswer === quiz_questions[i].correctAnswer) {
            numCorrect++;
            score = score + 100;
        }
    }

    score = score - desc;

    console.log(desc);
    if (score > 0) {
        results_text.innerText = `Você acertou ${numCorrect} de ${quiz_questions.length} questões,\n`;
        results_text.innerText += `mas você teve um desconto de ${desc} pontos por tempo!\n\n`;
        results_text.innerText += `Sua pontuação é ${score} pontos!`;
    } else {
        score = 0;
        results_text.innerText = `Você acertou ${numCorrect} de ${quiz_questions.length} questões,\n`;
        results_text.innerText += `e teve um desconto de ${desc} pontos por tempo!\n\n`;
        results_text.innerText += `como conseguiu essa proeza?!\n\n`;
        results_text.innerText += `Sua pontuação é ${score} pontos!`;
    }
}

function saveRank(ranking_text, ranking, name, score) {
    welcome_block.style.display = "none";
    quiz_block.style.display = "none";
    results_block.style.display = "none";
    ranking_block.style.display = "block";

    let ranking_scores = {
        name: name,
        score: score
    };

    ranking.push(ranking_scores);
    ranking.sort((a, b) => b.score - a.score);
    ranking.splice(5);

    localStorage.setItem('ranking', JSON.stringify(ranking));

    ranking_text.innerText = ranking.map(score => {
        return (`Nome: ${score.name} | Pontuação: ${score.score}\n`);
    }).join("");
}

function restartGame() {
    welcome_block.style.display = "block";
    quiz_block.style.display = "none";
    results_block.style.display = "none";
    ranking_block.style.display = "none";
}

function startTimer() {
    let sec = 30;
    desc = 0;
    timer = setInterval(function () {
        document.getElementById('safeTimerDisplay').innerText = 'Tempo: 00:' + sec;
        if (sec < 10) {
            document.getElementById('safeTimerDisplay').innerText = 'Tempo: 00:0' + sec;
        }
        sec--;
        if (sec == 0) {
            clearInterval(timer);
            document.getElementById('safeTimerDisplay').innerText = ''
            document.getElementById('safeTimerDisplay').innerText = 'O tempo acabou! Serão descontados de sua pontuação 150 pontos!';
        }
        desc = desc + 5;
    }, 1000);
}

// ========================================================================

start_button.addEventListener("mouseover", enterBox);
submit_button.addEventListener("mouseover", enterBox);
register_button.addEventListener("mouseover", enterBox);
repeat_button.addEventListener("mouseover", enterBox);

function enterBox() {
    start_button.style.background = "black";
    submit_button.style.background = "black";
    register_button.style.background = "black";
    repeat_button.style.background = "black";
}

start_button.addEventListener("mouseout", getOutBox);
submit_button.addEventListener("mouseout", getOutBox);
register_button.addEventListener("mouseout", getOutBox);
repeat_button.addEventListener("mouseout", getOutBox);

function getOutBox() {
    start_button.style.background = "#1a1c4b";
    submit_button.style.background = "#1a1c4b";
    register_button.style.background = "#1a1c4b";
    repeat_button.style.background = "#1a1c4b";
}