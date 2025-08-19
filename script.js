const gameCanvas = document.getElementById('gameCanvas');
const lixeira = document.getElementById('lixeira');
const scoreboard = document.getElementById('scoreboard');
const scoreSpan = document.getElementById('score');
const message = document.getElementById('message');

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const nomeInput = document.getElementById('nome');
const telefoneInput = document.getElementById('telefone');
const emailInput = document.getElementById('email');

const userDisplay = document.getElementById('userDisplay');
const sidebar = document.getElementById('sidebar');

let score = 0;
let interval;
let gameRunning = false;

const itens = ['📚', '🖊️', '🖌️', '🎨', '🖍️', '📏', '✂️', '🎒'];

function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function criarItem() {
  const item = document.createElement('div');
  item.classList.add('item');
  item.innerText = itens[Math.floor(Math.random() * itens.length)];

  const left = Math.random() * (gameCanvas.clientWidth - 50);
  item.style.left = `${left}px`;
  item.style.top = `-50px`;

  gameCanvas.appendChild(item);

  let posY = -50;
  const speed = 6 + Math.random() * 6; // Aumentei a velocidade aqui

  function queda() {
    if (!gameRunning) {
      if (gameCanvas.contains(item)) {
        gameCanvas.removeChild(item);
      }
      return;
    }

    posY += speed;
    item.style.top = `${posY}px`;

    const itemRect = item.getBoundingClientRect();
    const lixeiraRect = lixeira.getBoundingClientRect();

    if (isColliding(itemRect, lixeiraRect)) {
      score += 200;
      scoreSpan.textContent = score;
      if (gameCanvas.contains(item)) gameCanvas.removeChild(item);
      return; // parar animação deste item
    } else if (posY > window.innerHeight) {
      score -= 300;
      if (score < 0) score = 0;
      scoreSpan.textContent = score;
      if (gameCanvas.contains(item)) gameCanvas.removeChild(item);
      return; // parar animação deste item
    }

    requestAnimationFrame(queda);
  }

  requestAnimationFrame(queda);
}

function startGame() {
  score = 0;
  scoreSpan.textContent = score;
  scoreboard.style.display = 'block';
  message.style.display = 'none';

  loginForm.style.display = 'none';  // Esconde o login
  sidebar.style.display = 'none';    // Esconde o menu lateral

  gameRunning = true;
  interval = setInterval(criarItem, 400);

  document.addEventListener('mousemove', seguirMouse);

  setTimeout(() => {
    endGame();
  }, 30000);
}

function endGame() {
  gameRunning = false;
  clearInterval(interval);

  // Remove itens que ainda estiverem na tela
  const itensAtivos = gameCanvas.querySelectorAll('.item');
  itensAtivos.forEach(item => gameCanvas.removeChild(item));

  // Cria o container da mensagem final
  const overlay = document.createElement('div');
  overlay.id = 'gameOverOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.color = '#fff';
  overlay.style.fontSize = '2em';
  overlay.style.zIndex = 1000;

  // Mensagem de fim de jogo
  const mensagem = document.createElement('div');
  mensagem.textContent = `Fim de jogo! Pontuação: ${score}`;
  mensagem.style.marginBottom = '20px';

  // Botão de voltar ao início
  const btnVoltar = document.createElement('button');
  btnVoltar.textContent = 'Voltar ao Início';
  btnVoltar.style.fontSize = '1em';
  btnVoltar.style.padding = '10px 20px';
  btnVoltar.style.cursor = 'pointer';

  btnVoltar.addEventListener('click', () => {
    // Remove a overlay da mensagem
    document.body.removeChild(overlay);

    // Reseta pontuação e UI
    score = 0;
    scoreSpan.textContent = '0';
    scoreboard.style.display = 'none';
    message.style.display = 'none';

    // Mostra login e sidebar novamente
    loginForm.style.display = 'block';
    sidebar.style.display = 'block';

    // Esconde display do usuário
    userDisplay.style.display = 'none';

    // Posiciona a lixeira no centro fixada
    posicionarLixeiraFixada();
  });

  overlay.appendChild(mensagem);
  overlay.appendChild(btnVoltar);

  document.body.appendChild(overlay);

  // Remove evento de movimento do mouse
  document.removeEventListener('mousemove', seguirMouse);
}

function seguirMouse(e) {
  let x = e.clientX;

  const minX = lixeira.offsetWidth / 2;
  const maxX = window.innerWidth - minX;

  if (x < minX) x = minX;
  if (x > maxX) x = maxX;

  lixeira.style.position = 'fixed';
  lixeira.style.bottom = '10px';
  lixeira.style.left = `${x}px`;
  lixeira.style.top = '';
  lixeira.style.transform = 'translateX(-50%)';
}

function posicionarLixeiraFixada() {
  lixeira.style.position = 'fixed';
  lixeira.style.left = '50%';
  lixeira.style.bottom = '10px';
  lixeira.style.top = '';
  lixeira.style.transform = 'translateX(-50%)';
}

// Inicializa posição fixa da lixeira ao carregar
posicionarLixeiraFixada();

// Evento do botão Começar Jogo
loginBtn.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const email = emailInput.value.trim();

  if (!nome || !telefone || !email) {
    alert('Por favor, preencha todos os campos para entrar.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefoneRegex = /^[0-9\s()+-]{8,}$/;

  if (!emailRegex.test(email)) {
    alert('Digite um e-mail válido.');
    return;
  }

  if (!telefoneRegex.test(telefone)) {
    alert('Digite um telefone válido.');
    return;
  }

  alert(`Bem-vindo(a), ${nome}! O jogo vai começar.`);

  // Exibe o nome do usuário logado no canto superior direito
  userDisplay.textContent = `Usuário: ${nome}`;
  userDisplay.style.display = 'block';

  startGame();
});

// Evento para mostrar nome + pontuação ao clicar em "Usuários" no menu lateral
const usuarioLink = document.querySelector('#sidebar ul li:nth-child(3) a'); // "Usuários"

usuarioLink.addEventListener('click', (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();

  if (!nome) {
    userDisplay.textContent = "Nenhum usuário logado.";
  } else {
    userDisplay.textContent = `Usuário: ${nome} | Pontuação: ${score}`;
  }

  userDisplay.style.display = 'block';
});
