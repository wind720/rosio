function showLogin() {
    $('#message').html('Preencha os campos abaixo para entrar.');
    $('#inputFields').html(`
        <label for="loginUsername">Nome de Usuário:</label>
        <input type="text" id="loginUsername" name="loginUsername" placeholder="Seu nome de usuário">
        <label for="loginPassword">Senha:</label>
        <input type="password" id="loginPassword" name="loginPassword" placeholder="Sua senha">
        <button onclick="login()">Entrar</button>
    `);
}

function showSignup() {
    $('#message').html('Preencha os campos abaixo para realizar cadastrar.');
    $('#inputFields').html(`
        <label for="signupEmail">E-mail:</label>
        <input type="email" id="signupEmail" name="signupEmail" placeholder="Seu e-mail">
        <label for="signupUsername">Nome de Usuário:</label>
        <input type="text" id="signupUsername" name="signupUsername" placeholder="Seu nome de usuário">
        <label for="signupPassword">Senha:</label>
        <input type="password" id="signupPassword" name="signupPassword" placeholder="Sua senha">
        <button onclick="register()">Cadastrar</button>
    `);
}

function login() {
    const username = $('#loginUsername').val();
    const password = $('#loginPassword').val();

    if (!username || !password) {
        alert('Por favor, preencha todos os campos para entrar.');
        return;
    }

    $.ajax({
        url: 'https://teste1-yebt.onrender.com/users',
        method: 'GET',
        success: function (users) {
            const user = users.find(u => u.nome === username && u.senha === password);

            if (user) {
                console.log('Login bem-sucedido:', user);
                window.location.href = '../vendas/index.html'; // Redireciona para a página desejada
            } else {
                alert('Credenciais incorretas. Por favor, verifique seu nome de usuário e senha.');
                console.log('Credenciais inválidas');
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
}

function register() {
    const email = $('#signupEmail').val();
    const username = $('#signupUsername').val();
    const password = $('#signupPassword').val();

    if (!email || !username || !password) {
        alert('Por favor, preencha todos os campos para se cadastrar.');
        return;
    }

    $.ajax({
        url: 'https://teste1-yebt.onrender.com/users',
        method: 'POST',
        data: JSON.stringify({ nome: username, email, senha: password, cashback: 0, availableBalance: 0 }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Cadastro bem-sucedido:', response);
            alert('Cadastro realizado com sucesso!');
            showLogin(); // Abre a aba de login após o cadastro
        },
        error: function (error) {
            console.error('Erro no cadastro:', error);
        }
    });
}
