import React, { useState, useEffect } from 'react';
import './PuzzleGame.css';

const GRID_SIZE = 4;
const EMPTY = 0;

function getShuffledTiles() {
  let arr = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
  let shuffled;
  do {
    shuffled = arr.slice().sort(() => Math.random() - 0.5);
  } while (!isSolvable(shuffled));
  return shuffled;
}

function isSolvable(tiles) {
  let invCount = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) invCount++;
    }
  }
  const emptyRow = Math.floor(tiles.indexOf(EMPTY) / GRID_SIZE);
  if (GRID_SIZE % 2 === 1) {
    return invCount % 2 === 0;
  } else {
    return (invCount + emptyRow) % 2 === 1;
  }
}

function isSolved(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === EMPTY;
}

const PuzzleGame = () => {
  const [tiles, setTiles] = useState(getShuffledTiles());
  const [won, setWon] = useState(false);

  useEffect(() => {
    setWon(isSolved(tiles));
  }, [tiles]);

  const moveTile = (idx) => {
    const emptyIdx = tiles.indexOf(EMPTY);
    const canMove =
      (idx === emptyIdx - 1 && emptyIdx % GRID_SIZE !== 0) ||
      (idx === emptyIdx + 1 && idx % GRID_SIZE !== 0) ||
      idx === emptyIdx - GRID_SIZE ||
      idx === emptyIdx + GRID_SIZE;
    if (canMove) {
      const newTiles = tiles.slice();
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles);
    }
  };

  const handleReset = () => {
    setTiles(getShuffledTiles());
    setWon(false);
  };

  return (
    <div className="puzzle-container">
      <h2>Sliding Puzzle Game</h2>
      <div className="puzzle-grid">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            className={`puzzle-tile${tile === EMPTY ? ' empty' : ''}`}
            onClick={() => moveTile(idx)}
          >
            {tile !== EMPTY ? tile : ''}
          </div>
        ))}
      </div>
      {won && <div className="puzzle-message">🎉 You solved it!</div>}
      <button className="puzzle-reset" onClick={handleReset}>Reset</button>
    </div>
  );
};

export default PuzzleGame; 