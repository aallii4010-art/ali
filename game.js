'use strict';

class Snake {
    constructor() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.isGrowing = false;
    }

    move() {
        const head = { x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y };
        this.body.unshift(head);
        if (!this.isGrowing) this.body.pop();
        this.isGrowing = false;
    }

    changeDirection(newDirection) {
        const oppositeDirection = { x: -this.direction.x, y: -this.direction.y };
        if (newDirection.x !== oppositeDirection.x || newDirection.y !== oppositeDirection.y) {
            this.direction = newDirection;
        }
    }

    grow() {
        this.isGrowing = true;
    }

    checkCollision(boundary) {
        const head = this.body[0];
        return head.x < 0 || head.x >= boundary.width || head.y < 0 || head.y >= boundary.height;
    }

    checkSelfCollision() {
        const head = this.body[0];
        return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }
}

class Coin {
    constructor(boardWidth, boardHeight) {
        this.position = this.spawn(boardWidth, boardHeight);
    }

    spawn(boardWidth, boardHeight) {
        return {
            x: Math.floor(Math.random() * boardWidth),
            y: Math.floor(Math.random() * boardHeight)
        };
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.context = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.coin = new Coin(this.canvas.width, this.canvas.height);
        this.score = 0;
        this.difficulty = 100;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.setupControls();
    }

    start() {
        this.loop();
    }

    loop() {
        this.update();
        this.render();
        setTimeout(() => this.loop(), this.difficulty);
    }

    update() {
        this.snake.move();

        if (this.snake.checkCollision({ width: this.canvas.width / 10, height: this.canvas.height / 10 })) {
            alert('Game Over');
            this.resetGame();
        }

        if (this.snake.body[0].x === this.coin.position.x && this.snake.body[0].y === this.coin.position.y) {
            this.snake.grow();
            this.coin = new Coin(this.canvas.width, this.canvas.height);
            this.score++;
            this.updateDifficulty();
            this.saveHighScore();
        }

        if (this.snake.checkSelfCollision()) {
            alert('Game Over');
            this.resetGame();
        }
    }

    render() {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw Snake
        this.snake.body.forEach(segment => {
            this.context.fillStyle = 'green';
            this.context.fillRect(segment.x * 10, segment.y * 10, 9, 9);
        });
        // Draw Coin
        this.context.fillStyle = 'gold';
        this.context.fillRect(this.coin.position.x * 10, this.coin.position.y * 10, 9, 9);
        // Draw Score
        this.context.fillStyle = 'black';
        this.context.fillText('Score: ' + this.score, 5, 15);
        this.context.fillText('High Score: ' + this.highScore, 5, 30);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.snake.changeDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    this.snake.changeDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    this.snake.changeDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    this.snake.changeDirection({ x: 1, y: 0 });
                    break;
            }
        });
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            // Implement touch direction logic
        });
    }

    updateDifficulty() {
        if (this.score % 5 === 0) {
            this.difficulty = Math.max(10, this.difficulty - 10);
        }
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
    }

    resetGame() {
        this.snake = new Snake();
        this.coin = new Coin(this.canvas.width, this.canvas.height);
        this.score = 0;
        this.difficulty = 100;
        this.start();
    }
}

const game = new Game();
game.start();
