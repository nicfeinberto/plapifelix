const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "bird.png";

const backgroundImage = new Image();
backgroundImage.src = "bird.png";

const bird = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -9,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 140;
let pipeFrequency = 90;
let frameCount = 0;
let score = 0;
let isGameOver = false;

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    gameOver();
  }
}

function handleKeyPress(event) {
  if (event.code === "Space" && !isGameOver) {
    bird.velocity = bird.lift;
  } else if (event.code === "Space" && isGameOver) {
    resetGame();
  }
}

document.addEventListener("keydown", handleKeyPress);

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
  ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
}

function updatePipes() {
  if (frameCount % pipeFrequency === 0) {
    const top = Math.random() * (canvas.height - pipeGap - 20) + 20;
    pipes.push({ x: canvas.width, top });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }

    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver();
    }
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
  isGameOver = true;
  ctx.fillStyle = "#ff0000";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  isGameOver = false;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameOver) {
    drawBird();
    updateBird();
    updatePipes();
    pipes.forEach(drawPipe);
    drawScore();
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();
