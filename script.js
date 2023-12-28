document.addEventListener('DOMContentLoaded', () => {
    const gameBox = document.getElementById('game-box');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-btn');
    const container = document.querySelector('.container');

    let score = 0;
    let highScore = 0;

    const snakeSize = 20;
    let snake = [
        { x: 100, y: 100 },
        { x: 80, y: 100 },
        { x: 60, y: 100 },
    ];

    let food = getRandomFoodPosition();

    let direction = 'right';
    let isGameOver = false;

    function getRandomFoodPosition() {
        const x = Math.floor(Math.random() * (gameBox.clientWidth / snakeSize)) * snakeSize;
        const y = Math.floor(Math.random() * (gameBox.clientHeight / snakeSize)) * snakeSize;
        return { x, y };
    }

    function draw() {
        gameBox.innerHTML = '';

        snake.forEach((segment) => {
            const snakeSegment = document.createElement('div');
            snakeSegment.style.width = snakeSize + 'px';
            snakeSegment.style.height = snakeSize + 'px';
            snakeSegment.style.backgroundColor = '#ff85a2';
            snakeSegment.style.position = 'absolute';
            snakeSegment.style.left = segment.x + 'px';
            snakeSegment.style.top = segment.y + 'px';
            gameBox.appendChild(snakeSegment);
        });

        const foodElement = document.createElement('div');
        foodElement.style.width = snakeSize + 'px';
        foodElement.style.height = snakeSize + 'px';
        foodElement.style.backgroundColor = '#a2ffb8'; // Pastel green color for snake food
        foodElement.style.position = 'absolute';
        foodElement.style.left = food.x + 'px';
        foodElement.style.top = food.y + 'px';
        gameBox.appendChild(foodElement);
    }

    function update() {
        if (isGameOver) return;

        if (snake[0].x === food.x && snake[0].y === food.y) {
            score += 10;
            food = getRandomFoodPosition();
            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        }

        if (
            snake[0].x < 0 ||
            snake[0].x >= gameBox.clientWidth ||
            snake[0].y < 0 ||
            snake[0].y >= gameBox.clientHeight ||
            checkCollisionWithItself()
        ) {
            isGameOver = true;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
            }
            showGameOver();
            return;
        }

        moveSnake();

        scoreElement.textContent = score;

        draw();

        setTimeout(update, 200);
    }

    function moveSnake() {
        let newHead;

        switch (direction) {
            case 'up':
                newHead = { x: snake[0].x, y: snake[0].y - snakeSize };
                break;
            case 'down':
                newHead = { x: snake[0].x, y: snake[0].y + snakeSize };
                break;
            case 'left':
                newHead = { x: snake[0].x - snakeSize, y: snake[0].y };
                break;
            case 'right':
                newHead = { x: snake[0].x + snakeSize, y: snake[0].y };
                break;
        }

        if (
            newHead.x >= 0 &&
            newHead.x < gameBox.clientWidth &&
            newHead.y >= 0 &&
            newHead.y < gameBox.clientHeight
        ) {
            snake.unshift(newHead);
            snake.pop();
        } else {
            isGameOver = true;
            showGameOver();
        }
    }

    function checkCollisionWithItself() {
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }
        return false;
    }

    function showGameOver() {
        gameOverElement.style.display = 'block';
        restartButton.style.display = 'block';
    }

    restartButton.addEventListener('click', restartGame);

    function restartGame() {
        // Reset game state
        isGameOver = false;
        gameOverElement.style.display = 'none';
        restartButton.style.display = 'none';

        score = 0;
        scoreElement.textContent = score;

        snake = [
            { x: 100, y: 100 },
            { x: 80, y: 100 },
            { x: 60, y: 100 },
        ];

        food = getRandomFoodPosition();

        direction = 'right';

        // Start the game loop again
        update();
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case ' ':
                if (isGameOver) restartGame();
                break;
        }
    }

    function handleTouchStart(event) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        const snakeHeadX = snake[0].x;
        const snakeHeadY = snake[0].y;

        const deltaX = touchX - snakeHeadX;
        const deltaY = touchY - snakeHeadY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        }
    }

    gameBox.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('keydown', handleKeyPress);

    // Start the game loop
    update();
});
