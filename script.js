
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


function afficherFeedback(estCorrect) {
    let boutons = document.querySelectorAll(".choix");
    boutons.forEach(function(bouton) {
        if (bouton.textContent === estCorrect) {
            bouton.style.backgroundColor = "green";
        } else {
            bouton.style.backgroundColor = "red";
        }
    });

    setTimeout(function() {
        boutons.forEach(function(bouton) {
            bouton.style.backgroundColor = "";
        });
        reinitialiserTimer();
    }, 1000);
}