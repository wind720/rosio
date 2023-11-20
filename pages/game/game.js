// game.js
const apiUrl = "http://172.16.31.43:3000/users"; // Substitua com a URL correta da sua API

const emojis = ["🎃", "👻", "🕷️", "🦇", "🧙‍♀️", "🧟", "🍬", "❤️", "☀️", "🍕", "🎈", "🐱", "🌹", "✨", "😎", "💋"];
const halloweenEmojis = ["🎃", "👻", "🕷️", "🦇", "🧙‍♀️", "🧟", "🍬"];
let score = 0;
let clickedCards = [];
let gameDuration = 15; // segundos
let timer;
let currentUser; // Armazena informações do usuário logado

async function promptForCredentials() {
    const username = prompt("Digite seu nome de usuário:");
    const password = prompt("Digite sua senha:");

    return { username, password };
}

async function authenticateUser() {
    let attempts = 3;

    while (attempts > 0) {
        const { username, password } = await promptForCredentials();

        try {
            // Faz a requisição à API
            const response = await fetch(apiUrl);
            const users = await response.json();

            // Verifica se há um usuário com as credenciais fornecidas
            const user = users.find(u => u.nome === username && u.senha === password);

            if (user) {
                currentUser = user; // Armazena informações do usuário logado
                alert("Credenciais corretas! Bem-vindo ao jogo.");
                return true;
            } else {
                attempts--;
                alert(`Credenciais incorretas. Tentativas restantes: ${attempts}`);
            }
        } catch (error) {
            console.error("Erro ao buscar usuários na API:", error);
            alert("Erro ao autenticar usuário. Tente novamente.");
            return false;
        }
    }

    alert("Número máximo de tentativas atingido. O jogo será encerrado.");
    window.location.href("../vendas/index.html");
    return false;
}
async function updateScoreInApi() {
    try {
        // Faz uma requisição GET para obter todos os usuários
        const response = await fetch(apiUrl);
        const users = await response.json();

        // Procura o usuário pelo nome
        const userToUpdate = users.find(user => user.nome === currentUser.nome);

        if (userToUpdate) {
            // Atualiza a pontuação localmente
            userToUpdate.pontos = score;

            // Faz uma requisição PUT para atualizar os dados completos do usuário
            await fetch(`${apiUrl}/${userToUpdate.nome}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userToUpdate),
            });

            console.log(`Pontuação do usuário ${currentUser.nome} atualizada com sucesso!`);
        } else {
            console.error(`Usuário ${currentUser.nome} não encontrado na API.`);
        }
    } catch (error) {
        console.error("Erro ao atualizar pontuação na API:", error);
    }
}

function startGame() {
    const userConfirmed = confirm("Antes de jogar, confirme seu usuário.");

    if (userConfirmed) {
        authenticateUser().then(isAuthenticated => {
            if (isAuthenticated) {
                alert("Bem-vindo ao 'Treasure of Souls'! Clique nos emojis temáticos de Halloween para acumular pontos, mas cuidado ao clicar em outros emojis! \nEles estarão em cartas, que mudam a cada 3 segundos, e a duração total do jogo será de 15 segundos. Seja rápido.");

                createGameBoard();
                updateScore();
                updateTimer();
                timer = setInterval(updateGame, 3000);
                setInterval(updateTimer, 1000);

                // Adiciona um evento para chamar a função ao final do jogo
                window.addEventListener('beforeunload', () => {
                    updateScoreInApi();
                });
            }
        });
    }
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
    document.getElementById("score").innerText = `Pontos: ${score}`;
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
    const message = `Jogo encerrado! Sua pontuação final é ${score}\nClique em OK para receber os pontos.`;
    const confirmResponse = confirm(message);

    if (confirmResponse) {
        // Atualizar pontos apenas se o usuário clicar em OK
        updateScoreInApi().then(() => {
            // Redirecionar para outra página ao clicar em OK
            window.location.href("../../hallow/cashback.html");
        });
    } else {
        // Se o usuário não clicar em OK, não atualizar os pontos
        // Redirecionar para outra página
        window.location.href("../../hallow/cashback.html");
    }
}

startGame();
