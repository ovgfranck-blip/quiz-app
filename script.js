
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];

// Éléments du DOM
const domainSection    = document.getElementById("domain-section");
const loadingSection   = document.getElementById("loading-section");
const quizSection      = document.getElementById("quiz-section");
const questionText     = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const nextBtn          = document.getElementById("next-btn");
const questionCounter  = document.getElementById("question-counter");

// ============================================================
//  ÉTAPE 1 : L'UTILISATEUR TAPE SON DOMAINE ET DÉMARRE
// ============================================================
function startQuiz() {
  const input = document.getElementById("domain-input");
  const domain = input.value.trim();

  if (!domain) {
    input.style.border = "2px solid red";
    return;
  }

  input.style.border = "";
  domainSection.classList.add("hidden");
  generateQuestions(domain);
}

// ============================================================
//  ÉTAPE 2 : GÉNÉRER LES QUESTIONS VIA GROQ
// ============================================================
async function generateQuestions(domain) {
  loadingSection.classList.remove("hidden");
  quizSection.classList.add("hidden");

  // Seed aléatoire pour avoir des questions différentes à chaque fois
  const seed = Math.floor(Math.random() * 100000);

  const GROQ_API_KEY = "REMPLACE_PAR_TA_CLE_GROQ"; // ← à remplacer

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        temperature: 1,
        messages: [
          {
            role: "system",
            content: "Tu es un générateur de quiz. Tu réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown."
          },
          {
            role: "user",
            content: `Seed:${seed}. Génère 5 questions de quiz variées sur le domaine : "${domain}".
Varie les formulations et le niveau à chaque fois.
Format JSON exact à respecter :
[
  {
    "question": "Texte de la question ?",
    "options": ["choix a", "choix b", "choix c", "choix d"],
    "answer": 2
  }
]
L'index "answer" correspond à la bonne réponse dans "options" (0, 1, 2 ou 3).`
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    questions = JSON.parse(clean);

    loadingSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    initQuiz();

  } catch (error) {
    console.error("Erreur Groq :", error);
    loadingSection.innerHTML = `
      <p>Erreur lors de la génération des questions.</p>
      <button onclick="location.reload()">Réessayer</button>
    `;
  }
}

// ============================================================
//  INITIALISATION
// ============================================================
function initQuiz() {
  currentQuestionIndex = 0;
  selectedAnswer = null;
  userAnswers = [];
  displayQuestion();
}

// ============================================================
//  AFFICHER UNE QUESTION À LA FOIS AVEC 4 CHOIX
// ============================================================
function displayQuestion() {
  const question = questions[currentQuestionIndex];

  questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
  questionText.textContent = question.question;

  choicesContainer.innerHTML = "";
  selectedAnswer = null;
  nextBtn.disabled = true;

  // Créer les 4 boutons de choix
  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.classList.add("choice-btn");
    btn.textContent = option;
    btn.dataset.index = index;
    btn.addEventListener("click", () => selectAnswer(btn, index));
    choicesContainer.appendChild(btn);
  });
}

// ============================================================
//  SÉLECTIONNER UNE RÉPONSE
// ============================================================
function selectAnswer(clickedBtn, answerIndex) {
  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
  clickedBtn.classList.add("selected");
  selectedAnswer = answerIndex;
  nextBtn.disabled = false;
}

// ============================================================
//  NAVIGATION : QUESTION SUIVANTE
// ============================================================
function nextQuestion() {
  if (selectedAnswer === null) return;

  userAnswers.push(selectedAnswer);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  quizSection.classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  // Franck a besoin de ces données pour calculer le score
  window.quizAnswers    = userAnswers;    // réponses de l'utilisateur
  window.quizQuestions  = questions;      // questions avec les bonnes réponses
  window.totalQuestions = questions.length;

  // Franck appelle showFeedback() depuis son fichier JS avancé
  if (typeof showFeedback === "function") {
    showFeedback(userAnswers, questions);
  }
}

// ============================================================
//  REJOUER
// ============================================================
function restartQuiz() {
  document.getElementById("result-section").classList.add("hidden");
  domainSection.classList.remove("hidden");
  document.getElementById("domain-input").value = "";
  questions = [];
  userAnswers = [];
}

// ============================================================
//  ÉVÉNEMENTS
// ============================================================
nextBtn.addEventListener("click", nextQuestion);

const startBtn = document.getElementById("start-btn");
if (startBtn) startBtn.addEventListener("click", startQuiz);

// Permettre de démarrer avec la touche Entrée
const domainInput = document.getElementById("domain-input");
if (domainInput) {
  domainInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") startQuiz();
  });
}

const restartBtn = document.getElementById("restart-btn");
if (restartBtn) restartBtn.addEventListener("click", restartQuiz);

document.addEventListener("DOMContentLoaded", () => {
  domainSection.classList.remove("hidden");
  loadingSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  document.getElementById("result-section").classList.add("hidden");
});