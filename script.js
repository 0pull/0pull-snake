// Получаем элементы HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restart");
const specialCode = document.getElementById("special-code");

// Размер клетки
const box = 20;

// Начальные параметры игры
let snake = [{ x: 8 * box, y: 8 * box }]; // Начальная позиция змейки
let direction = null; // Направление движения
let food = generateFood(); // Случайная позиция еды
let score = 0; // Счёт игрока
let gameStarted = false; // Флаг для предотвращения автоматического завершения игры

// Генерация еды в случайной позиции
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// Отрисовка змейки
function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "#0000e0";
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });
}

// Отрисовка еды
function drawFood() {
  ctx.fillStyle = "#0000e0";
  ctx.fillRect(food.x, food.y, box, box);
}

// Обновление игры
function updateGame() {
  if (!gameStarted) return; // Если игра ещё не началась, ничего не делаем

  const head = { x: snake[0].x, y: snake[0].y };

  // Изменение координат головы в зависимости от направления
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Столкновение с границами или самим собой
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  // Проверка на поедание еды
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.innerText = `points: ${score}`;
    food = generateFood();

    // Показываем секретный код при 10 очках
    if (score === 10) {
      specialCode.classList.remove("hidden");
    }
  } else {
    snake.pop(); // Убираем хвост, если еда не съедена
  }

  // Добавляем новую голову
  snake.unshift(head);

  // Очистка холста и отрисовка игры
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
}

// Завершение игры
function endGame() {
  clearInterval(gameInterval); // Остановка игрового цикла
  gameOverScreen.classList.remove("hidden"); // Показываем сообщение об окончании
  gameStarted = false; // Останавливаем игру
}

// Перезапуск игры
function restartGame() {
  snake = [{ x: 8 * box, y: 8 * box }];
  direction = null;
  food = generateFood();
  score = 0;
  scoreDisplay.innerText = `Очки: ${score}`;
  gameOverScreen.classList.add("hidden");
  specialCode.classList.add("hidden");
  gameStarted = false; // Устанавливаем флаг, что игра началась
  gameInterval = setInterval(updateGame, 100); // Перезапуск игрового цикла
}

// Управление с клавиатуры
document.addEventListener("keydown", (event) => {
  if (!gameStarted) gameStarted = true; // Начинаем игру при первом нажатии клавиши
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Управление с кнопок на экране
document.getElementById("up").addEventListener("click", () => {
  if (!gameStarted) gameStarted = true; // Начинаем игру при первом нажатии кнопки
  if (direction !== "DOWN") direction = "UP";
});
document.getElementById("left").addEventListener("click", () => {
  if (!gameStarted) gameStarted = true;
  if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("down").addEventListener("click", () => {
  if (!gameStarted) gameStarted = true;
  if (direction !== "UP") direction = "DOWN";
});
document.getElementById("right").addEventListener("click", () => {
  if (!gameStarted) gameStarted = true;
  if (direction !== "LEFT") direction = "RIGHT";
});

// Обработчик кнопки "Начать заново"
restartButton.addEventListener("click", restartGame);

// Запуск игры
let gameInterval = setInterval(updateGame, 100);