// Timer - Franck (JS avancé)
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

// Score final - Franck (JS avancé)
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

// Feedback visuel - Franck (JS avancé)
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