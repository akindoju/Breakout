const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const pregameContainer = document.getElementById('pregame-container');
const pregameBtn = document.getElementById('pregame-btn');
const endGameContainer = document.getElementById('end-game-container');
const finalScore = document.getElementById('final-score');
const scoreEl = document.getElementById('score');
const replayBtn = document.getElementById('replay-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

//create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Entire Game function
function startGame() {
  //draw paddle on canvas
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = '#0076b1';
    ctx.fill();
    ctx.closePath();
  }

  //draw ball on canvas
  function drawball() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0076b1';
    ctx.fill();
    ctx.closePath();
  }

  //draw score on canvas
  function drawScore() {
    // ctx.font = '20px Arial';
    // ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  }

  //draw bricks on canvas
  function drawBricks() {
    bricks.forEach((column) => {
      column.forEach((brick) => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.visible ? '#0076b1' : 'transparent';
        ctx.fill();
        ctx.closePath();
      });
    });
  }

  //move paddle on canvas
  function movePaddle() {
    paddle.x += paddle.dx;

    //wall detection
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }

  //move ball on canvas
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1; //that is ball.dx = ball.dx * -1
    }

    //wall collision(top/bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }

    //paddle collision
    if (
      ball.x - ball.size > paddle.x &&
      ball.x + ball.size < paddle.x + paddle.w &&
      ball.y + ball.size > paddle.y
    ) {
      ball.dy = -ball.speed;
    }

    //brick collision
    bricks.forEach((column) => {
      column.forEach((brick) => {
        if (brick.visible) {
          if (
            ball.x - ball.size > brick.x && // left brick side check
            ball.x + ball.size < brick.x + brick.w && // right brick side check
            ball.y + ball.size > brick.y && // top brick side check
            ball.y - ball.size < brick.y + brick.h // bottom brick side check
          ) {
            ball.dy *= -1;
            brick.visible = false;

            increaseScore();
          }
        }
      });
    });

    //hit bottomwall -lose
    if (ball.y + ball.size > canvas.height) {
      // score = 0;
      // showAllBricks();
      endGame();
    }
  }

  //Increase Score
  function increaseScore() {
    score++;
    scoreEl.innerHTML = score;
  }

  //make all bricks reappear
  function showAllBricks() {
    bricks.forEach((column) => {
      column.forEach((brick) => {
        brick.visible = true;
      });
    });
  }

  //draw everything
  function draw() {
    //clear Rect
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawball();
    // drawScore();
    drawBricks();
  }

  //update canvas drawings and animation
  function update() {
    moveBall();
    movePaddle();

    //draw everything
    draw();

    requestAnimationFrame(update);
  }

  update();

  //keydown function
  function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      paddle.dx = -paddle.speed;
    }
  }

  //keyup function
  function keyUp(e) {
    if (
      e.key === 'Right' ||
      e.key === 'ArrowRight' ||
      e.key === 'Left' ||
      e.key === 'ArrowLeft'
    ) {
      paddle.dx = 0;
    }
  }

  function endGame() {
    ball.x = 0;
    ball.y = 0;

    endGameContainer.classList.add('show');
    finalScore.innerText = `Your final score is ${score}`;

    replayBtn.addEventListener('click', () => {
      function restartGame() {
        pregameContainer.innerHTML = '';
        pregameContainer.style.display = 'none';
        startGame();
        window.location.reload();
      }

      endGameContainer.classList.remove('show');
      restartGame();
    });
  }

  //keyboard event handlers
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  //Rules and close event handlers
  rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
  });
}

//start game event listeners
pregameBtn.addEventListener('click', () => {
  pregameContainer.classList.add('remove');

  startGame();
});

// if (score % (brickRowCount * brickRowCount) === 0) {
//   showAllBricks();
//   score = 0;
// }
