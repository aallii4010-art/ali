// Snake Game Code

class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.snake = [{x: 9, y: 9}];
        this.food = this._createFood();
        this.direction = {x: 0, y: 0};
        this.score = 0;
        this.interval = null;
    }

    start() {
        document.addEventListener('keydown', (event) => this._changeDirection(event));
        this.interval = setInterval(() => this._update(), 100);
    }

    _update() {
        this._moveSnake();
        if (this._checkCollision()) {
            this._endGame();
        } else {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._drawSnake();
            this._drawFood();
        }
    }

    _moveSnake() {
        const head = this.snake[0];
        const newHead = {x: head.x + this.direction.x, y: head.y + this.direction.y};

        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.snake.unshift(newHead);
            this.food = this._createFood();
            this.score++;
        } else {
            this.snake.pop();
            this.snake.unshift(newHead);
        }
    }

    _createFood() {
        // Create food at random position
        return {x: Math.floor(Math.random() * this.canvas.width / 10), y: Math.floor(Math.random() * this.canvas.height / 10)};
    }

    _drawSnake() {
        this.snake.forEach(segment => {
            this.context.fillStyle = 'green';
            this.context.fillRect(segment.x * 10, segment.y * 10, 10, 10);
        });
    }

    _drawFood() {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.food.x * 10, this.food.y * 10, 10, 10);
    }

    _changeDirection(event) {
        switch(event.key) {
            case 'ArrowUp':
                this.direction = {x: 0, y: -1}; break;
            case 'ArrowDown':
                this.direction = {x: 0, y: 1}; break;
            case 'ArrowLeft':
                this.direction = {x: -1, y: 0}; break;
            case 'ArrowRight':
                this.direction = {x: 1, y: 0}; break;
        }
    }

    _checkCollision() {
        const head = this.snake[0];
        return head.x < 0 || head.x >= this.canvas.width / 10 || head.y < 0 || head.y >= this.canvas.height / 10 ||
               this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    _endGame() {
        clearInterval(this.interval);
        alert(`Game Over! Your score was: ${this.score}`);
    }
}

// Initialize the game
const game = new SnakeGame('gameCanvas');
game.start();
