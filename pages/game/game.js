const emojis = ["🎃", "👻", "🕷️", "🦇", "🧙‍♀️", "🧟", "🍬", "❤️", "☀️", "🍕", "🎈", "🐱", "🌹", "✨", "😎", "💋"]; // Adicione mais emojis se desejar
const halloweenEmojis = ["🎃", "👻", "🕷️", "🦇", "🧙‍♀️", "🧟", "🍬"];
let score = 0;
let clickedCards = [];
let gameDuration = 15; // segundos
let timer;

function startGame() {
    // Alert box antes do jogo começar
    alert("Bem-vindo ao 'Treasure of Souls'! Clique nos emojis temáticos de halloween para acumular pontos, mas cuidado ao clicar em outros emojis! \nEles estarão em cartas, que mudam a cada 3 segundos, e a duração total do jogo será de 15 segundos. Seja rápido!");

    createGameBoard();
    updateScore();
    updateTimer();
    timer = setInterval(updateGame, 3000);
    setInterval(updateTimer, 1000);
}

function createGameBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ""; // Limpa o conteúdo anterior do tabuleiro

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = i * 7 + j;
            card.innerText = getRandomEmoji();
            card.addEventListener("click", handleCardClick);
            gameBoard.appendChild(card);
        }
    }
}

function getRandomEmoji() {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
}

function handleCardClick() {
    const cardIndex = this.dataset.index;
    const cardValue = this.innerText;

    if (!clickedCards.includes(cardIndex)) {
        if (halloweenEmojis.includes(cardValue)) {
            score += 10;
        } else {
            score = Math.max(0, score - 10);
        }

        updateScore();
        this.classList.add("clicked");
        clickedCards.push(cardIndex);
    }
}

function updateScore() {
    document.getElementById("score").innerText = `Pontuação: ${score}`;
}

function updateGame() {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const cardIndex = card.dataset.index;
        card.innerText = getRandomEmoji();
        card.classList.remove("clicked");
    });
    clickedCards = [];
}

function updateTimer() {
    if (gameDuration > 0) {
        document.getElementById("timer").innerText = `Tempo Restante: ${gameDuration} segundos`;
        gameDuration -= 1;
    } else {
        endGame();
        clearInterval(timer);
    }
}

function endGame() {
    // Alert box no final do jogo
    const message = `Jogo encerrado! Sua pontuação final é ${score}`;
    alert(message);

    // Redirecionar para outra página ao clicar em OK
    window.location.href = "outra_pagina.html";
}

startGame();