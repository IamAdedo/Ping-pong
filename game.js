const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 14;
const PLAYER_X = 30;
const AI_X = WIDTH - 30 - PADDLE_WIDTH;

// Game objects
let player = {
    x: PLAYER_X,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#4CAF50"
};

let ai = {
    x: AI_X,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#f44336"
};

let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 5,
    dx: 5,
    dy: 5,
    color: "#fff"
};

let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = "32px", color = "#fff") {
    ctx.fillStyle = color;
    ctx.font = `${size} Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    // Randomize initial direction
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Game logic
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size >= HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.dy *= -1;
    }

    // Ball collision with player paddle
    if (
        ball.x <= player.x + player.width &&
        ball.x >= player.x &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.x = player.x + player.width; // Prevent sticking
        ball.dx *= -1.04; // Speed up slightly
        // Add some "English" based on where it hit the paddle
        let collidePoint = (ball.y + ball.size/2) - (player.y + player.height/2);
        collidePoint = collidePoint / (player.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Ball collision with AI paddle
    if (
        ball.x + ball.size >= ai.x &&
        ball.x + ball.size <= ai.x + ai.width &&
        ball.y + ball.size >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.x = ai.x - ball.size; // Prevent sticking
        ball.dx *= -1.04;
        let collidePoint = (ball.y + ball.size/2) - (ai.y + ai.height/2);
        collidePoint = collidePoint / (ai.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Score update
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.size > WIDTH) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement (simple)
    let aiCenter = ai.y + ai.height/2;
    let ballCenter = ball.y + ball.size/2;
    if (aiCenter < ballCenter - 25) {
        ai.y += 5;
    } else if (aiCenter > ballCenter + 25) {
        ai.y -= 5;
    }
    // Clamp AI paddle within canvas
    ai.y = Math.max(0, Math.min(HEIGHT - ai.height, ai.y));
}

// Drawing everything
function render() {
    // Clear canvas
    drawRect(0, 0, WIDTH, HEIGHT, "#111");

    // Draw net
    for (let i = 0; i < HEIGHT; i += 30) {
        drawRect(WIDTH / 2 - 2, i, 4, 16, "#fff");
    }

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw ball
    drawRect(ball.x, ball.y, ball.size, ball.size, ball.color);

    // Draw scores
    drawText(playerScore, WIDTH / 4, 50, "40px");
    drawText(aiScore, WIDTH * 3 / 4, 50, "40px");
}

// Main loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse control for player paddle
canvas.addEventListener("mousemove", function(evt) {
    // Translate mouse Y to canvas coordinates
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp within bounds
    player.y = Math.max(0, Math.min(HEIGHT - player.height, player.y));
});

// Start game
resetBall();
gameLoop();
