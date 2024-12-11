import "@webxdc/highscores";

const square = document.querySelectorAll(".square");
const ninja = document.querySelectorAll(".ninja");
const timeLeft = document.querySelector("#time-left");
const button = document.querySelector("#toggle");
const score = document.getElementById("score");
const lugares = document.getElementById("lugares");

let hitPosition;
let result = 0;
let currentTime = timeLeft.textContent;
let running = false;
let timerIdCountdown;
let timerIdMove;

function moveNinja() {
  square.forEach((className) => {
    className.classList.remove("ninja");
  });
  if (running) {
    let randomPosition = square[Math.floor(Math.random() * 9)];
    randomPosition.classList.add("ninja");
    hitPosition = randomPosition.id;
  }
}

square.forEach((id) => {
  id.addEventListener("pointerdown", () => {
    if (id.id === hitPosition) {
      clearContainer(score);
      clearContainer(id);
      result = result + 1;
      score.textContent = result;
      window.navigator.vibrate(100);
      let addition = document.createElement("div");
      let additionCopy = document.createElement("div");
      addition.classList.add("addition");
      additionCopy.classList.add("addition");
      addition.textContent = "+1";
      additionCopy.textContent = "+1";
      addition.style.userSelect = "none";
      additionCopy.style.userSelect = "none";
      score.style.position = "relative";
      id.appendChild(addition);
      score.appendChild(additionCopy);
    } else if (running) {
      clearContainer(id);
      let miss = document.createElement("div");
      miss.classList.add("addition");
      miss.style.color = "red";
      miss.style.userSelect = "none";
      miss.textContent = "miss";
      id.appendChild(miss);
    }
  });
});

document.addEventListener("keydown", (e) => {
  let arr = [7, 8, 9, 4, 5, 6, 1, 2, 3].map((e) => square[e - 1]);
  if (e.code === "Space") {
    toggle();
  }
  if (running && e.key.match(/[1-9]/)) {
    e.preventDefault();
    const key = e.key;
    if (key === hitPosition) {
      clearContainer(score);
      clearContainer(arr[key - 1]);
      result = result + 1;
      score.textContent = result;
      window.navigator.vibrate(200);
      let addition = document.createElement("div");
      let additionCopy = document.createElement("div");
      addition.classList.add("addition");
      additionCopy.classList.add("addition");
      addition.textContent = "+1";
      additionCopy.textContent = "+1";
      addition.style.userSelect = "none";
      additionCopy.style.userSelect = "none";
      score.style.position = "relative";
      arr[key - 1].appendChild(addition);
      score.appendChild(additionCopy);
    } else if (running) {
      clearContainer(arr[key - 1]);
      let miss = document.createElement("div");
      miss.classList.add("addition");
      miss.style.color = "red";
      miss.style.userSelect = "none";
      miss.textContent = "miss";
      arr[key - 1].appendChild(miss);
    }
  }
});

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime < 1) {
    stop();
  }
}

function toggle() {
  if (running) {
    stop();
  } else {
    start();
  }
}

function start() {
  result = 0;
  score.textContent = 0;
  button.textContent = "Surrender";
  const gameover = document.getElementById("gameover");
  gameover.style.display = "none";
  running = true;
  timerIdCountdown = setInterval(countDown, 1000);
  timerIdMove = setInterval(moveNinja, 500);
}

function stop() {
  button.textContent = "Start";
  clearInterval(timerIdCountdown);
  clearInterval(timerIdMove);
  running = false;
  currentTime = 60;
  hitPosition = null;
  timeLeft.textContent = currentTime;
  window.highscores.setScore(result);
  showGameOver(result);
}

function showGameOver(result) {
  const gameover = document.getElementById("gameover");
  gameover.textContent = `You scored ${
    result === 1 ? "only 1 point" : result + " points!"
  }`;
  gameover.style.display = "block";
}

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

window.toggle = toggle;
window.showScoreboard = () => {
  const container = document.getElementById("scoreboard-container");
  container.innerHTML = window.highscores.renderScoreboard().innerHTML;
  document.getElementById("scoreboard").style.display = "block";
};

window.highscores.init({
  onHighscoresChanged: () => {
    lugares.style.display = "flex";
  },
});
