const wordDisplay = document.getElementById("wordDisplay");
const wrongLettersDiv = document.getElementById("wrongLetters");
const input = document.getElementById("letterInput");
const statusMessage = document.getElementById("statusMessage");
const hint = document.getElementById("hint");
const restartBtn = document.getElementById("restartBtn");
const vitoriasSpan = document.getElementById("vitorias");
const derrotasSpan = document.getElementById("derrotas");

let palavra = "";
let letrasCorretas = [];
let letrasErradas = [];
const maxErros = 6;

let vitorias = 0;
let derrotas = 0;

function iniciarJogo() {
  input.disabled = true;
  statusMessage.innerText = "Carregando palavra...";

  fetch("https://random-word-api.herokuapp.com/all?lang=pt-br")
    .then(res => res.json())
    .then(data => {
      const palavrasFiltradas = data.filter(p =>
        /^[a-zç]{4,22}$/i.test(p) // 4 a 22 letras, sem acentos
      );

      palavra = palavrasFiltradas[Math.floor(Math.random() * palavrasFiltradas.length)].toLowerCase();

      letrasCorretas = [];
      letrasErradas = [];

      input.disabled = false;
      input.value = "";
      input.focus();

      hint.innerText = `Dica: Palavra com ${palavra.length} letras.`;
      statusMessage.innerText = "";
      atualizarPalavra();
      atualizarErros();
    })
    .catch(() => {
      hint.innerText = "Erro ao carregar palavra.";
      statusMessage.innerText = "Erro ao iniciar jogo.";
    });
}

function atualizarPalavra() {
  const exibicao = palavra
    .split("")
    .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
    .join(" ");
  wordDisplay.innerText = exibicao;
}

function atualizarErros() {
  wrongLettersDiv.innerText = "Erros: " + letrasErradas.join(", ");

  if (letrasErradas.length >= maxErros) {
    statusMessage.innerText = `😢 Você perdeu! A palavra era "${palavra}".`;
    derrotas++;
    derrotasSpan.innerText = derrotas;
    input.disabled = true;
    return;
  }

  const exibicaoAtual = palavra
    .split("")
    .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
    .join("");

  if (exibicaoAtual === palavra) {
    statusMessage.innerText = "🎉 Você venceu!";
    vitorias++;
    vitoriasSpan.innerText = vitorias;
    input.disabled = true;
  }
}

input.addEventListener("input", () => {
  const letra = input.value.toLowerCase();
  input.value = "";

  if (!letra.match(/^[a-zç]$/i)) return;
  if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) return;

  if (palavra.includes(letra)) {
    letrasCorretas.push(letra);
  } else {
    letrasErradas.push(letra);
  }

  atualizarPalavra();
  atualizarErros();
});

restartBtn.addEventListener("click", iniciarJogo);

// Iniciar na primeira vez
iniciarJogo();
