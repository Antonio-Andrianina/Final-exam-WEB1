// Gestion du mode jour/nuit
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = "Mode Jour";
  } else {
    themeToggleBtn.textContent = "Mode Nuit";
  }
}

// Génération dynamique des étoiles réparties sur toute la fenêtre, centrées horizontalement
document.addEventListener('DOMContentLoaded', generateStars);
function generateStars() {
  const starsContainer = document.querySelector('#celestial .stars');
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const numberOfStars = 50;
  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = Math.random() * containerHeight + "px";
    star.style.left = (containerWidth * 0.25 + Math.random() * (containerWidth * 0.5)) + "px";
    star.style.animationDelay = Math.random() * 2 + "s";
    starsContainer.appendChild(star);
  }
}

// Textes à taper selon la difficulté
const texts = {
  "easy": "Le chat dort sur le canapé.",
  "medium": "Les oiseaux chantent dans les arbres pendant que les enfants jouent dans le parc.",
  "hard": "La complexité des situations économiques contemporaines nécessite une analyse approfondie des structures de marché et des comportements des consommateurs."
};

const difficultyButtons = document.querySelectorAll('#difficulties button');
const testContainer = document.getElementById('test-container');
const textToType = document.getElementById('text-to-type');
const testArea = document.getElementById('test-area');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const statsDiv = document.getElementById('stats');
const resultsDiv = document.getElementById('results');

// Configuration du cercle de progression
const progressCircle = document.querySelector('.progress-ring__circle');
const progressText = document.querySelector('.progress-text');
const circleRadius = progressCircle.r.baseVal.value;
const circleCircumference = 2 * Math.PI * circleRadius;
progressCircle.style.strokeDasharray = circleCircumference;
progressCircle.style.strokeDashoffset = circleCircumference;

let selectedDifficulty = "";
let timer = null;
let seconds = 0;

difficultyButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Réinitialisation des boutons de difficulté
    difficultyButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    selectedDifficulty = button.getAttribute('data-difficulty');
    
    // Animation fluide du changement de texte: fade-out puis fade-in
    if (textToType.textContent) {
      textToType.classList.add('fade-out');
      setTimeout(() => {
        textToType.textContent = texts[selectedDifficulty];
        textToType.classList.remove('fade-out');
        textToType.classList.add('fade-in');
        setTimeout(() => {
          textToType.classList.remove('fade-in');
        }, 500);
      }, 400);
    } else {
      textToType.textContent = texts[selectedDifficulty];
      textToType.classList.add('fade-in');
      setTimeout(() => {
        textToType.classList.remove('fade-in');
      }, 500);
    }
    
    testContainer.style.display = "block";
    testArea.value = '';
    testArea.disabled = true;
    seconds = 0;
    timerDisplay.textContent = 'Temps : 0 s';
    statsDiv.textContent = '';
    resultsDiv.style.display = "none";
    updateProgress(0);
  });
});

startBtn.addEventListener('click', startTest);

function startTest() {
  if (!selectedDifficulty) {
    alert("Veuillez choisir une difficulté.");
    return;
  }
  
  testArea.disabled = false;
  testArea.focus();
  testArea.value = '';
  statsDiv.textContent = '';
  seconds = 0;
  timerDisplay.textContent = 'Temps : 0 s';
  updateProgress(0);
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = 'Temps : ' + seconds + ' s';
  }, 1000);
  
  testArea.addEventListener('input', checkTyping);
}

function checkTyping() {
  const currentText = testArea.value;
  const goalText = texts[selectedDifficulty];
  
  let progress = currentText.length / goalText.length;
  if (progress > 1) progress = 1;
  updateProgress(progress);
  
  if (currentText === goalText) {
    clearInterval(timer);
    testArea.disabled = true;
    displayResults();
    testArea.removeEventListener('input', checkTyping);
  }
}

function updateProgress(fraction) {
  const offset = circleCircumference * (1 - fraction);
  progressCircle.style.strokeDashoffset = offset;
  const percentage = Math.round(fraction * 100);
  progressText.textContent = percentage + '%';
}

function displayResults() {
  resultsDiv.style.display = "block";
  
  const goalText = texts[selectedDifficulty];
  const wordsCount = goalText.trim().split(/\s+/).length;
  const wpm = seconds > 0 ? Math.round((wordsCount * 60) / seconds) : 0;
  
  let typedText = testArea.value;
  let correctCount = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === goalText[i]) {
      correctCount++;
    }
  }
  const accuracy = typedText.length > 0 ? Math.round((correctCount / typedText.length) * 100) : 0;
  
  const timeFraction = Math.min(seconds / 120, 1);
  const wpmFraction = Math.min(wpm / 120, 1);
  const accuracyFraction = accuracy / 100;
  
  updateResultCircle(document.getElementById("time-progress"), seconds, " s", timeFraction);
  updateResultCircle(document.getElementById("wpm-progress"), wpm, "", wpmFraction);
  updateResultCircle(document.getElementById("accuracy-progress"), accuracy, "%", accuracyFraction);
  
  statsDiv.textContent = "Test terminé !";
}

function updateResultCircle(container, value, unit, fraction) {
  const circle = container.querySelector(".result-ring__circle");
  const textEl = container.querySelector(".result-text");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  const offset = circumference * (1 - fraction);
  circle.style.strokeDashoffset = offset;
  textEl.textContent = value + unit;
}
