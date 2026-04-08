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