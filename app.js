const square = document.querySelectorAll(".square");
const ninja = document.querySelectorAll(".ninja");
const timeLeft = document.querySelector("#time-left");
const button = document.querySelector("#toggle");
const score = document.querySelector("#score");
const lugares = document.getElementById("lugares");

let hitPosition;
let result = 0;
let currentTime = timeLeft.textContent;
let running = false;
let timerIdCountdown; // = setInterval(countDown, 1000);

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
  let timerIdmove = null;
  timerIdmove = setInterval(randomSquare, 500);
}

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
  moveNinja();
}

function stop() {
  button.textContent = "Start";
  clearInterval(timerIdCountdown);
  running = false;
  currentTime = 60;
  hitPosition = null;
  timeLeft.textContent = currentTime;
  const addr = window.webxdc.selfAddr;

  console.log(addr);
  console.log("puntuación más alta " + highscore(addr));
  console.log("puntuación actual " + result);

  const name = window.webxdc.selfName;
  if (highscore(addr) < result) {
    const amount = result === 1 ? "1 point" : result + " points";
    const info = name + " scored " + amount + " in Whack-A-Ninja!";
    const payload = { addr: addr, name: name, score: result };
    updateHighscore(addr, name, result);
    window.webxdc.sendUpdate({ payload: payload, info: info }, info);
  }
  //lugares.style.display = "flex";
  showGameOver(result);
}

// modified from https://github.com/adbenitez/StackUp.xdc/blob/master/js/index.js

async function updateLoader() {
  window.webxdc.setUpdateListener((update) => {
    const player = update.payload;
    updateHighscore(player.addr, player.name, player.score);
    if (update.serial === update.max_serial) {
      lugares.style.display = "flex";
    }
  });
}

function showGameOver(result) {
  //event.stopPropagation();
  const gameover = document.getElementById("gameover");
  gameover.textContent = `You scored ${
    result === 1 ? "only 1 point" : result + " points!"
  }`;
  // const cerrar = document.createElement("span");
  // cerrar.textContent = "X";
  // cerrar.className = "w3-button w3-display-topright";
  // cerrar.onclick = () =>
  //   (document.getElementById("gameover").style.display = "none");
  // cerrar.style.transform = "translate(50%, -60%)";
  // cerrar.style.border = "2px solid whitesmoke";
  // cerrar.style.padding = "3px 6px";
  // cerrar.style.borderRadius = "50%";
  //gameover.appendChild(cerrar);
  gameover.style.display = "block";
}

function showScoreboard() {
  event.stopPropagation();
  const container = document.getElementById("scoreboard-container");
  container.innerHTML = "";

  const addr = window.webxdc.selfAddr;
  const list = document.createElement("ol");
  list.className = "w3-ol";
  highscores().forEach((item) => {
    const name = document.createElement("span");
    name.className = "w3-large";
    name.textContent =
      item.name.length > 20 ? item.name.substring(0, 20) + "…" : item.name;

    const score = document.createElement("span");
    score.textContent = item.score;
    score.className = "w3-right";

    const li = document.createElement("li");
    if (item.addr == addr) {
      const strong = document.createElement("strong");
      strong.appendChild(name);
      strong.appendChild(score);
      li.appendChild(strong);
    } else {
      li.appendChild(name);
      li.appendChild(score);
    }
    list.appendChild(li);
  });

  container.appendChild(list);
  document.getElementById("scoreboard").style.display = "block";
}

function updateHighscore(addr, name, score) {
  if (highscore(addr) < score) {
    PLAYERS[addr] = { name: name, score: score };
  }
}

function highscore(addr) {
  return PLAYERS[addr] ? PLAYERS[addr].score : 0;
}

function highscores() {
  return Object.keys(PLAYERS)
    .map((addr) => {
      const player = PLAYERS[addr];
      player.addr = addr;
      return player;
    })
    .sort((a, b) => b.score - a.score);
}

let PLAYERS = {};

updateLoader();
