import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 16;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

function isOnSnake(x, y, snake) {
  return snake.some(seg => seg.x === x && seg.y === y);
}

function getRandomFood(snake) {
  let x, y;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
  } while (isOnSnake(x, y, snake));
  return { x, y };
}

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const moveRef = useRef(direction);
  const runningRef = useRef(running);

  useEffect(() => { moveRef.current = direction; }, [direction]);
  useEffect(() => { runningRef.current = running; }, [running]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!runningRef.current) return;
      let newDir;
      switch (e.key) {
        case 'ArrowUp': newDir = { x: 0, y: -1 }; break;
        case 'ArrowDown': newDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': newDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': newDir = { x: 1, y: 0 }; break;
        default: return;
      }
      // Prevent reversing
      if (
        snake.length > 1 &&
        snake[0].x + newDir.x === snake[1].x &&
        snake[0].y + newDir.y === snake[1].y
      ) {
        return;
      }
      setDirection(newDir);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [snake, running]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + moveRef.current.x,
          y: prevSnake[0].y + moveRef.current.y,
        };
        // Collision with wall
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }
        // Collision with self
        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          setRunning(false);
          return prevSnake;
        }
        let newSnake;
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prevSnake];
          setFood(getRandomFood(newSnake));
          setScore(s => s + 1);
        } else {
          newSnake = [newHead, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [food, running]);

  const handleStart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  return (
    <div className="snake-container">
      <h2>Snake Game</h2>
      <div className="snake-score">Score: {score}</div>
      <div className="snake-grid">
        {[...Array(GRID_SIZE)].map((_, y) => (
          <div key={y} className="snake-row">
            {[...Array(GRID_SIZE)].map((_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={x}
                  className={`snake-cell${isHead ? ' head' : ''}${isBody ? ' body' : ''}${isFood ? ' food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {gameOver && <div className="snake-message">Game Over!</div>}
      <button className="snake-btn" onClick={handleStart}>{gameOver ? 'Restart' : running ? 'Restart' : 'Start'}</button>
    </div>
  );
};

export default SnakeGame; 