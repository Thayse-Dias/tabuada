const questions = [];
for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 10; j++) {
    questions.push({
      question: `${i} × ${j}`,
      correct: i * j,
      explanation: `${i} × ${j} é somar ${i} por ${j} vezes.`
    });
  }
}

function shuffleQuestions() {
  questions.sort(() => Math.random() - 0.5);
}

shuffleQuestions();

let current = 0;
let timeLeft = 10;
let timer;

// 📊 Histórico de erros (por rodada)
let errorHistory = {
  1:0,2:0,3:0,4:0,5:0,
  6:0,7:0,8:0,9:0,10:0
};

// ⭐ Recompensas (agora também reiniciam)
let stars = 0;
localStorage.setItem("stars", stars);

// Elementos
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const speechEl = document.getElementById("speech");
const lunaEl = document.getElementById("luna");
const timerEl = document.getElementById("timer");
const rewardsEl = document.getElementById("rewards");
const historyListEl = document.getElementById("historyList");

// ⏱️ Timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.textContent = `⏱️ Tempo: ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ Tempo: ${timeLeft}`;

    if (timeLeft === 0) {
      clearInterval(timer);
      autoFail();
    }
  }, 1000);
}

// 📥 Carregar pergunta
function loadQuestion() {
  const q = questions[current];
  questionEl.textContent = `Quanto é ${q.question}?`;
  answerEl.value = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  speechEl.textContent = "Respira… você consegue 🌟";
  lunaEl.style.transform = "scale(1)";
  startTimer();
}

// ✅ Verificar resposta
function checkAnswer() {
  clearInterval(timer);

  const userAnswer = Number(answerEl.value);
  const q = questions[current];
  const base = Number(q.question.split("×")[0]);

  if (userAnswer === q.correct) {
    stars++;
    localStorage.setItem("stars", stars);

    feedbackEl.innerHTML = `✅ Certinho!<br>${q.explanation}`;
    feedbackEl.style.color = "green";
    speechEl.textContent = "Arrasou! 😍✨";
    lunaEl.style.transform = "scale(1.1)";
  } else {
    registerError(base, q);
  }

  updateRewards();
  renderHistory();
  nextBtn.style.display = "block";
}

// ⏱️ Tempo acabou
function autoFail() {
  const q = questions[current];
  const base = Number(q.question.split("×")[0]);
  registerError(base, q);
  nextBtn.style.display = "block";
}

// ❌ Registrar erro
function registerError(base, q) {
  errorHistory[base]++;

  feedbackEl.innerHTML = `❌ A resposta é ${q.correct}.<br>👉 ${q.explanation}`;
  feedbackEl.style.color = "red";
  speechEl.textContent = "Tudo bem errar! Vamos aprender 💛";
  lunaEl.style.transform = "scale(0.95)";
}

// 👉 Próxima
function nextQuestion() {
  current++;

  if (current >= questions.length) {
    resetGame();
    return;
  }

  loadQuestion();
}

// 🔄 REINICIAR TUDO
function resetGame() {
  alert("🔄 Tabuada reiniciada! Vamos começar do zero 💖");

  // Progresso
  current = 0;

  // Zerar histórico
  errorHistory = {
    1:0,2:0,3:0,4:0,5:0,
    6:0,7:0,8:0,9:0,10:0
  };

  // Zerar recompensas
  stars = 0;
  localStorage.setItem("stars", stars);

  // Limpar UI
  historyListEl.innerHTML = "";
  rewardsEl.textContent = "";
  feedbackEl.textContent = "";

  // Reembaralhar
  shuffleQuestions();

  speechEl.textContent = "Tudo novinho! Vamos lá 🌈✨";
  loadQuestion();
}

// 🏆 Atualizar recompensas
function updateRewards() {
  let msg = `⭐ Estrelas: ${stars}`;

  if (stars >= 20) msg += " 👑 Rainha da Tabuada!";
  else if (stars >= 10) msg += " 🏆 Troféu!";
  else if (stars >= 5) msg += " 💖 Mandando bem!";

  rewardsEl.textContent = msg;
}

// 📊 Histórico
function renderHistory() {
  historyListEl.innerHTML = "";

  Object.keys(errorHistory).forEach(n => {
    if (errorHistory[n] > 0) {
      const li = document.createElement("li");
      li.textContent = `❌ Tabuada do ${n}: ${errorHistory[n]} erro(s)`;
      historyListEl.appendChild(li);
    }
  });
}

// 🚀 Inicialização
updateRewards();
renderHistory();
loadQuestion();
