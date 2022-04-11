const square = document.querySelectorAll(".square");
const ninja = document.querySelectorAll(".ninja");
const timeLeft = document.querySelector("#time-left");
let score = document.querySelector("#score");

let result = 0;
let currentTime = timeLeft.textContent;

function randomSquare() {
  square.forEach((className) => {
    className.classList.remove("ninja");
  });
  let randomPosition = square[Math.floor(Math.random() * 9)];
  randomPosition.classList.add("ninja");
  //assign the id of the randomPosition to hitPosition for us to use later
  hitPosition = randomPosition.id;
}

square.forEach((id) => {
  id.addEventListener("mouseup", () => {
    if (id.id === hitPosition) {
      result = result + 1;
      score.textContent = result;
    }
  });
});

function moveNinja() {
  let timerId = null;
  timerId = setInterval(randomSquare, 500);
}

moveNinja();

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(timerId);
    alert("JUEGO TERMINADO. Tu puntuación fue de " + result + " puntos");
  }
}

let timerId = setInterval(countDown, 1000);
