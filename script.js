const board = document.getElementById('game-board');


// ✅ Imágenes locales guardadas en la carpeta /img/
const autoImages = [
  'img/audi.jpg',
  'img/focus.jpg',
  'img/mitsubishi.jpg',
  'img/peugeot.jpg',
  'img/subaru.jpg',
  'img/bmw.jpg',
];

const totalPairs = autoImages.length; // total de pares a encontrar
let pairsFound = 0;                   // contador que irá aumentando

// 🧠 Duplicamos las imágenes para tener pares
let cards = [...autoImages, ...autoImages];

// 🔀 Mezclamos las cartas
cards = cards.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let lockBoard = false;

cards.forEach((imgSrc) => {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = imgSrc;

  card.appendChild(img);
  board.appendChild(card);

  card.addEventListener('click', () => {
    if (lockBoard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      checkMatch();
    }
  });
}); 


function checkMatch() {
  const img1 = firstCard.querySelector('img').src;
  const img2 = secondCard.querySelector('img').src;

  if (img1 === img2) {
    pairsFound++;  // <--- sumamos uno cuando encontramos un par
    firstCard = null;
    secondCard = null;

    if (pairsFound === totalPairs) {
      clearInterval(timerInterval);  // frenamos el timer
      Swal.fire({
        title: '¡Felicitaciones!',
        background: '#000000',
        color: '#ffffff', 
        confirmButtonColor: '#1e90ff',
        text: '¡Ganaste el juego!',
        icon: 'success',
        confirmButtonText: 'Jugar otra vez'
      }).then(() => {
        location.reload(); // recarga la página para reiniciar
      });
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

const timerElement = document.getElementById('timer');
let timeLeft = 60; // segundos (1 minutos)

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerElement.textContent = `Tiempo: ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  
  if (timeLeft === 0) {
    clearInterval(timerInterval);
    Swal.fire({
      title: 'Se acabó el tiempo',
      background: '#000000',
      color: '#ffffff', 
      confirmButtonColor: '#1e90ff',
      text: '¡Intenta de nuevo!',
      icon: 'error',
      confirmButtonText: 'Reiniciar juego'
    }).then(() => {
      location.reload();
    });
  }
  
  timeLeft--;
}

let timerInterval = setInterval(updateTimer, 1000);
updateTimer();
