// Timer - Franck (JS avancé)
let tempsRestant = 30;
let timer;

function demarrerTimer() {
    timer = setInterval(function() {
        tempsRestant--;
        document.getElementById("timer").textContent = tempsRestant + "s";
        if (tempsRestant === 0) {
            clearInterval(timer);
            questionSuivante();
        }
    }, 1000);
}

function reinitialiserTimer() {
    clearInterval(timer);
    tempsRestant = 30;
}

// Score final - Franck (JS avancé)
let score = 0;
let totalQuestions = 10;

function verifierReponse(reponseDonnee, reponsecorrecte) {
    if (reponseDonnee === reponsecorrecte) {
        score++;
    }
}

function afficherScoreFinal() {
    clearInterval(timer);
    document.getElementById("score").textContent = 
        "Votre score : " + score + " / " + totalQuestions;
}