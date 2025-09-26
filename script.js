const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis de personagens e física
let jogador = {
    x: 0,
    y: 0,
    largura: 50,
    altura: 50,
    velocidadeX: 0,
    velocidadeY: 0,
    gravidade: 0.8,
    forcaPulo: 12,
    pulando: false
};

let alvo = {
    x: 0,
    y: 0,
    largura: 50,
    altura: 50,
    velocidadeX: 0,
    velocidadeY: 0,
    gravidade: 0.8,
    pulando: false
};

// Variáveis do fundo
let imagemFundo = new Image();
imagemFundo.src = 'background.png'; // Caminho da imagem de fundo

// Carregar imagens do jogador e alvo
let imagemJogador = new Image();
imagemJogador.src = 'player.png'; // Caminho da imagem do jogador

let imagemAlvo = new Image();
imagemAlvo.src = 'patrick.png'; // Caminho da imagem do alvo

// Função para redimensionar o canvas
function redimensionarCanvas() {
    canvas.width = window.innerWidth;  // A largura do canvas ocupa 100% da largura da janela
    canvas.height = window.innerHeight; // A altura do canvas ocupa 100% da altura da janela
}

// Chamamos a função redimensionarCanvas inicialmente e a cada redimensionamento da janela
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas(); // Definir tamanho inicial do canvas

// Limitar o movimento do personagem para não sair da tela
function limitarMovimento(obj) {
    if (obj.x < 0) obj.x = 0;
    if (obj.x + obj.largura > canvas.width) obj.x = canvas.width - obj.largura;
    if (obj.y < 0) obj.y = 0;
    if (obj.y + obj.altura > canvas.height) obj.y = canvas.height - obj.altura;
}

// Função de pulo do jogador
function pular() {
    if (!jogador.pulando) {
        jogador.velocidadeY = -jogador.forcaPulo;
        jogador.pulando = true;
    }
}

// Atualiza o pulo/queda do jogador
function atualizarPuloJogador() {
    if (jogador.pulando) {
        jogador.velocidadeY += jogador.gravidade;
        jogador.y += jogador.velocidadeY;

        if (jogador.y + jogador.altura >= canvas.height) {
            jogador.y = canvas.height - jogador.altura;
            jogador.pulando = false;
            jogador.velocidadeY = 0;
        }
    }
}

// Atualiza a física do alvo chutado
function atualizarFisicaAlvo() {
    if (alvo.pulando) {
        alvo.velocidadeY += jogador.gravidade;
        alvo.x += alvo.velocidadeX;
        alvo.y += alvo.velocidadeY;

        if (alvo.y + alvo.altura >= canvas.height) {
            alvo.y = canvas.height - alvo.altura;
            alvo.pulando = false;
            alvo.velocidadeY = 0;
            alvo.velocidadeX = 0;
        } else {
            alvo.velocidadeX *= 0.95; // resistência para desacelerar
        }
    }
}

// Função para chutar o alvo
function chutar() {
    let distX = alvo.x + alvo.largura / 2 - (jogador.x + jogador.largura / 2);
    let distY = alvo.y + alvo.altura / 2 - (jogador.y + jogador.altura / 2);
    let distancia = Math.sqrt(distX ** 2 + distY ** 2);

    if (distancia < 150) {
        alvo.velocidadeX = distX > 0 ? 20 : -20;
        alvo.velocidadeY = -20;
        alvo.pulando = true;
    }
}

// Função para desenhar todos os elementos
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada quadro

    // Desenha o fundo
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

    // Desenha o jogador
    ctx.drawImage(imagemJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);

    // Desenha o alvo
    ctx.drawImage(imagemAlvo, alvo.x, alvo.y, alvo.largura, alvo.altura);
}

// Função principal do jogo
function jogo() {
    // Controla os movimentos do jogador com as teclas
    if (teclas['ArrowLeft']) jogador.x -= 3;
    if (teclas['ArrowRight']) jogador.x += 3;
    if (teclas['ArrowUp']) jogador.y -= 3;
    if (teclas['ArrowDown']) jogador.y += 3;

    if (teclas[' '] && !jogador.pulando) pular();
    if (teclas['f']) chutar();

    // Atualizar física
    atualizarPuloJogador();
    atualizarFisicaAlvo();

    // Limitar movimento para que o personagem não saia da tela
    limitarMovimento(jogador);

    // Desenhar os objetos na tela
    desenhar();

    requestAnimationFrame(jogo); // Chama o próximo quadro
}

// Controle de teclas pressionadas
let teclas = {};
window.addEventListener('keydown', (e) => teclas[e.key] = true);
window.addEventListener('keyup', (e) => teclas[e.key] = false);

// Iniciar o jogo quando as imagens estiverem carregadas
let imagensCarregadas = 0;
const totalImagens = 3; // Temos 3 imagens

// Função para verificar se todas as imagens foram carregadas
function verificarImagensCarregadas() {
    imagensCarregadas++;
    if (imagensCarregadas === totalImagens) {
        jogo(); // Iniciar o jogo depois que todas as imagens estiverem carregadas
    }
}

// Definir eventos de carregamento de imagem
imagemJogador.onload = verificarImagensCarregadas;
imagemAlvo.onload = verificarImagensCarregadas;
imagemFundo.onload = verificarImagensCarregadas;
