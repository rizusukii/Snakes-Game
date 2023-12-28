document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const snakeHead = document.getElementById('snake');
    const food = document.getElementById('food');
    const scoreElement = document.getElementById('score');

    let score = 0;
    let snakeLength = 5;
    let snakeDirection = 'right';
    let snakeBody = [{ x: 0, y: 0 }];

    function updateSnake() {
        for (let i = 0; i < snakeBody.length; i++) {
            let segmentElement = document.getElementById(`segment-${i}`);
            if (!segmentElement) {
                segmentElement = document.createElement('div');
                segmentElement.className = 'snake-body';
                segmentElement.id = `segment-${i}`;
                gameContainer.appendChild(segmentElement);
            }
            segmentElement.style.left = `${snakeBody[i].x * 20}px`;
            segmentElement.style.top = `${snakeBody[i].y * 20}px`;
        }
    }

    function updateFood() {
        const randomX = Math.floor(Math.random() * 29);
        const randomY = Math.floor(Math.random() * 29);
        food.style.left = `${randomX * 20}px`;
        food.style.top = `${randomY * 20}px`;
    }

    function checkCollision() {
        const head = snakeBody[0];
        if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30) {
            gameOver();
        }

        snakeBody.slice(1).forEach((segment) => {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
            }
        });

        if (head.x === parseInt(food.style.left) / 20 && head.y === parseInt(food.style.top) / 20) {
            score += 10;
            snakeLength++;
            updateFood();
            updateScore();
        }
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    function gameOver() {
        alert(`Game Over! Your score is ${score}`);
        snakeLength = 5;
        score = 0;
        snakeBody = [{ x: 0, y: 0 }];
        snakeDirection = 'right';
        updateSnake();
        updateFood();
        updateScore();
    }

    function gameLoop() {
        const head = { ...snakeBody[0] };
        switch (snakeDirection) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        snakeBody.unshift(head);
        if (snakeBody.length > snakeLength) {
            snakeBody.pop();
        }

        checkCollision();
        updateSnake();
        setTimeout(gameLoop, 200);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (snakeDirection !== 'down') {
                    snakeDirection = 'up';
                }
                break;
            case 'ArrowDown':
                if (snakeDirection !== 'up') {
                    snakeDirection = 'down';
                }
                break;
            case 'ArrowLeft':
                if (snakeDirection !== 'right') {
                    snakeDirection = 'left';
                }
                break;
            case 'ArrowRight':
                if (snakeDirection !== 'left') {
                    snakeDirection = 'right';
                }
                break;
        }
    });

    updateFood();
    gameLoop();
});
