const square = document.querySelectorAll(".square");
const ninja = document.querySelectorAll(".ninja");
const timeLeft = document.querySelector("#time-left");
const button = document.querySelector("#start");
let score = document.querySelector("#score");

let result = 0;
let currentTime = timeLeft.textContent;
let running = false;
let timerIdCountdown; // = setInterval(countDown, 1000);
const player = "Tú"; //window.webxdc.selfName;

function randomSquare() {
  square.forEach((className) => {
    className.classList.remove("ninja");
  });
  if (running) {
    let randomPosition = square[Math.floor(Math.random() * 9)];
    randomPosition.classList.add("ninja");
    //assign the id of the randomPosition to hitPosition for us to use later
    hitPosition = randomPosition.id;
  }
}

square.forEach((id) => {
  id.addEventListener("mouseup", () => {
    if (id.id === hitPosition) {
      result = result + 1;
      score.textContent = result;
      // hardcore mode below
      // } else {
      //   result = result - 1;
      //   score.textContent = result;
    }
  });
});

function moveNinja() {
  let timerId = null;
  timerId = setInterval(randomSquare, 500);
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(timerIdCountdown);
    alert("JUEGO TERMINADO. Tu puntuación fue de " + result + " puntos");
  }
}

function start() {
  running = true;
  timerIdCountdown = setInterval(countDown, 1000);
  moveNinja();
}

function stop() {
  //clearInterval(timerId);
  clearInterval(timerIdCountdown);
  running = false;
  currentTime = 60;
  timeLeft.textContent = currentTime;
  alert(
    "JUEGO TERMINADO.\n" +
      player +
      ", tu puntuación fue de " +
      result +
      " puntos"
  );
}
