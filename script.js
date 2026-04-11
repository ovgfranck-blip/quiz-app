// ============================================================
//  JS CORE - Astou (Affichage questions et navigation)
// ============================================================
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];

const domainSection    = document.getElementById("section-formulaire");
const quizSection      = document.getElementById("section-question");
const questionText     = document.getElementById("texte-question");
const choicesContainer = document.getElementById("liste-choix");
const nextBtn          = document.getElementById("btn-suivant");
const questionCounter  = document.getElementById("numero-question");

function startQuiz() {
  const input = document.getElementById("input-nom");
  const domain = document.getElementById("input-categorie").value;

  if (!input.value.trim()) {
    input.style.border = "2px solid red";
    return;
  }

  input.style.border = "";
  domainSection.classList.add("cache");
  document.getElementById("section-score").classList.remove("cache");
  document.getElementById("affichage-nom").textContent = input.value.trim();
  generateQuestions(domain);
}

async function generateQuestions(domain) {
  quizSection.classList.add("cache");

  const seed = Math.floor(Math.random() * 100000);
  const GROQ_API_KEY = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        messages: [
          {
            role: "system",
            content: "Tu es un générateur de quiz. Tu réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown."
          },
          {
            role: "user",
            content: `Seed:${seed}. Génère 5 questions de quiz variées sur le domaine : "${domain}".
Format JSON exact :
[
  {
    "question": "Texte de la question ?",
    "options": ["choix a", "choix b", "choix c", "choix d"],
    "answer": 2
  }
]`
          }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    questions = JSON.parse(clean);

    quizSection.classList.remove("cache");
    initQuiz();

  } catch (error) {
    console.error("Erreur Groq :", error);
  }
}

function initQuiz() {
  currentQuestionIndex = 0;
  selectedAnswer = null;
  userAnswers = [];
  displayQuestion();
  demarrerTimer();
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];

  questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
  questionText.textContent = question.question;
  document.getElementById("affichage-question").textContent =
    `${currentQuestionIndex + 1} / ${questions.length}`;

  choicesContainer.innerHTML = "";
  selectedAnswer = null;
  nextBtn.classList.add("cache");

  question.options.forEach((option, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("btn-choix");
    btn.textContent = option;
    btn.dataset.index = index;
    btn.addEventListener("click", () => selectAnswer(btn, index, question.options[question.answer]));
    li.appendChild(btn);
    choicesContainer.appendChild(li);
  });
}

function selectAnswer(clickedBtn, answerIndex, bonneReponse) {
  document.querySelectorAll(".btn-choix").forEach(btn => {
    btn.classList.remove("selected");
  });
  clickedBtn.classList.add("selected");
  selectedAnswer = answerIndex;
  nextBtn.classList.remove("cache");

  afficherFeedback(bonneReponse);
  verifierReponse(clickedBtn.textContent, bonneReponse);
}

function questionSuivante() {
  if (selectedAnswer === null) return;

  userAnswers.push(selectedAnswer);
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    reinitialiserTimer();
    demarrerTimer();
    displayQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  quizSection.classList.add("cache");
  document.getElementById("section-score").classList.add("cache");
  document.getElementById("section-resultat").classList.remove("cache");
  afficherScoreFinal();
}

function restartQuiz() {
  document.getElementById("section-resultat").classList.add("cache");
  domainSection.classList.remove("cache");
  document.getElementById("input-nom").value = "";
  questions = [];
  userAnswers = [];
}

nextBtn.addEventListener("click", questionSuivante);

const startBtn = document.getElementById("btn-demarrer");
if (startBtn) startBtn.addEventListener("click", startQuiz);

const restartBtn = document.getElementById("btn-rejouer");
if (restartBtn) restartBtn.addEventListener("click", restartQuiz);

const accueilBtn = document.getElementById("btn-accueil");
if (accueilBtn) accueilBtn.addEventListener("click", restartQuiz);

// ============================================================
//  JS AVANCÉ - Franck (Timer, Score, Feedback visuel)
// ============================================================
let tempsRestant = 30;
let timer;

function demarrerTimer() {
    timer = setInterval(function() {
        tempsRestant--;
        document.getElementById("affichage-timer").textContent = tempsRestant + "s";
        if (tempsRestant === 0) {
            clearInterval(timer);
            questionSuivante();
        }
    }, 1000);
}

function reinitialiserTimer() {
    clearInterval(timer);
    tempsRestant = 30;
    document.getElementById("affichage-timer").textContent = "30s";
}

let score = 0;
let totalQuestions = 10;

function verifierReponse(reponseDonnee, reponseCorrecte) {
    if (reponseDonnee === reponseCorrecte) {
        score++;
    }
}

function afficherScoreFinal() {
    clearInterval(timer);
    document.getElementById("affichage-points").textContent = score;
    document.getElementById("resultat-points-final").textContent = score;
    document.getElementById("nb-correctes").textContent = score;
    document.getElementById("nb-incorrectes").textContent = totalQuestions - score;
    document.getElementById("pourcentage-reussite").textContent =
        Math.round((score / totalQuestions) * 100) + "%";
}

function afficherFeedback(reponseCorrecte) {
    let boutons = document.querySelectorAll(".btn-choix");
    boutons.forEach(function(bouton) {
        if (bouton.textContent === reponseCorrecte) {
            bouton.style.backgroundColor = "green";
        } else {
            bouton.style.backgroundColor = "red";
        }
    });

    document.getElementById("zone-feedback").classList.remove("cache");

    setTimeout(function() {
        boutons.forEach(function(bouton) {
            bouton.style.backgroundColor = "";
        });
        document.getElementById("zone-feedback").classList.add("cache");
        reinitialiserTimer();
    }, 1000);
}