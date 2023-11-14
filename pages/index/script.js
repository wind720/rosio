function showLogin() {
    $('#message').html('Preencha com seu nome de usuário e senha para entrar.');
    $('#inputFields').html(`
        <label for="loginUsername">Nome de Usuário:</label>
        <input type="text" id="loginUsername" name="loginUsername" placeholder="Seu nome de usuário">
        <label for="loginPassword">Senha:</label>
        <input type="password" id="loginPassword" name="loginPassword" placeholder="Sua senha">
        <button onclick="login()">Entrar</button>
    `);
}

function showSignup() {
    $('#message').html('Preencha com seu e-mail, nome de usuário e senha para se cadastrar.');
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

    $.ajax({
        url: 'http://172.16.31.43:3000/users/' + username,
        method: 'GET',
        success: function (response) {
            if (response && response.senha) {
                if (response.senha === password) {
                    console.log('Login bem-sucedido:', response);
                    window.location.href = 'https://vendas-gilt.vercel.app/';
                } else {
                    console.log('Credenciais inválidas');
                }
            } else {
                console.log('Usuário não encontrado na API');
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

    $.ajax({
        url: 'http://172.16.31.43:3000/users',
        method: 'POST',
        data: JSON.stringify({ nome: username, email, senha: password, cashback: 0, availableBalance: 0 }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Cadastro bem-sucedido:', response);
            window.location.href = 'https://vendas-gilt.vercel.app/';
        },
        error: function (error) {
            console.error('Erro no cadastro:', error);
        }
    });
}
