const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");
const playerNameInput = document.getElementById("player-name");
const startGameButton = document.getElementById("start-game");
const restartGameButton = document.getElementById("restart-game");
const player = document.getElementById("player");
const scoreboard = document.getElementById("scoreboard");
const scoreElement = document.getElementById("score");
const leaderboardElement = document.getElementById("leaderboard");

let score = 0;
let obstacles = [];
let gameInterval;
let playerName = "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// ฟังก์ชันเริ่มเกม
function startGame() {
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    score = 0;
    scoreElement.textContent = score;
    obstacles = [];
    player.style.left = "380px";
    player.style.top = "280px";

    gameInterval = setInterval(() => {
        score++;
        scoreElement.textContent = score;

        if (score % 100 === 0 && score <= 10000) {
            spawnObstacle();
        }

        if (score >= 10000) {
            endGame();
        }

        moveObstacles();
        checkCollision();
    }, 20);
}

// ฟังก์ชันจบเกม
function endGame() {
    clearInterval(gameInterval);
    saveScore();
    showLeaderboard();
}

// ฟังก์ชันบันทึกคะแนน
function saveScore() {
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// ฟังก์ชันแสดงกระดานคะแนน
function showLeaderboard() {
    gameScreen.classList.add("hidden");
    leaderboardScreen.classList.remove("hidden");
    leaderboardElement.innerHTML = "";
    leaderboard.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(li);
    });
}

// ฟังก์ชันสร้างอุปสรรค
function spawnObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = Math.random() * 760 + "px";
    obstacle.style.top = Math.random() * 560 + "px";
    gameScreen.querySelector(".game-container").appendChild(obstacle);
    obstacles.push(obstacle);
}

// ฟังก์ชันเคลื่อนที่อุปสรรค
function moveObstacles() {
    obstacles.forEach((obstacle) => {
        // ตำแหน่งของผู้เล่น
        const playerX = parseFloat(player.style.left);
        const playerY = parseFloat(player.style.top);

        // ตำแหน่งของอุปสรรค
        const obstacleX = parseFloat(obstacle.style.left);
        const obstacleY = parseFloat(obstacle.style.top);

        // คำนวณทิศทางไปยังผู้เล่น
        const dx = playerX - obstacleX;
        const dy = playerY - obstacleY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // ปรับความเร็วของอุปสรรค
        const speed = 2 + score / 500; // ความเร็วเพิ่มขึ้นตามคะแนน
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // อัปเดตตำแหน่งของอุปสรรค
        obstacle.style.left = Math.max(0, Math.min(760, obstacleX + moveX)) + "px";
        obstacle.style.top = Math.max(0, Math.min(560, obstacleY + moveY)) + "px";
    });
}

// ฟังก์ชันตรวจสอบการชน
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            endGame();
        }
    });
}

// ฟังก์ชันควบคุมการลากเมาส์
gameScreen.addEventListener("mousemove", (event) => {
    const rect = gameScreen.querySelector(".game-container").getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    player.style.left = Math.max(0, Math.min(760, x - 20)) + "px";
    player.style.top = Math.max(0, Math.min(560, y - 20)) + "px";
});
// เริ่มเกมเมื่อกดปุ่ม
startGameButton.addEventListener("click", () => {
    playerName = playerNameInput.value || "ผู้เล่นไม่มีชื่อ";
    startGame();
});

// เล่นอีกครั้ง
restartGameButton.addEventListener("click", () => {
    leaderboardScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
});

