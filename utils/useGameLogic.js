import { useState } from 'react';

const useGameLogic = () => {
  const [gameScore, setGameScore] = useState(0);

  const filterZero = (row) => {
    return row.filter((num) => num !== 0);
  };

  const isGameWon = (grid) => {
    for (let c = 0; c < grid.length; c++) {
      for (let r = 0; r < grid[c].length; r++) {
        if (grid[c][r] === 2048) {
          return true;
        }
      }
    }
    return false;
  };

  const isGameLost = (grid) => {
    for (let c = 0; c < grid.length; c++) {
      for (let r = 0; r < grid[c].length; r++) {
        if (grid[c][r] === 0) {
          return false;
        }
        if (c !== grid.length - 1 && grid[c][r] === grid[c + 1][r]) {
          return false;
        }
        if (r !== grid[c].length - 1 && grid[c][r] === grid[c][r + 1]) {
          return false;
        }
      }
    }
    return true;
  };

  const slide = (row) => {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        setGameScore((prevScore) => prevScore + row[i]);
        row[i + 1] = 0;
      }
    }

    row = filterZero(row);

    while (row.length < 4) {
      row.push(0);
    }

    return row;
  };

  const swipeUp = (grid) => {
    for (let r = 0; r < grid[0].length; r++) {
      let row = grid.map((_, c) => grid[c][r]);
      row = slide(row);
      for (let c = 0; c < grid.length; c++) {
        grid[c][r] = row[c];
      }
    }

    return grid;
  };

  const swipeDown = (grid) => {
    for (let r = 0; r < grid[0].length; r++) {
      let row = grid.map((_, c) => grid[c][r]);
      row.reverse();
      row = slide(row);
      row.reverse();
      for (let c = 0; c < grid.length; c++) {
        grid[c][r] = row[c];
      }
    }

    return grid;
  };

  const swipeLeft = (grid) => {
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      const newRow = slide(row);
      grid[r] = newRow;
    }

    return grid;
  };

  const swipeRight = (grid) => {
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r].slice().reverse();
      const newRow = slide(row);
      grid[r] = newRow.reverse();
    }

    return grid;
  };

  const getScore = () => {
    return gameScore;
  };

  const resetScore = () => {
    setGameScore(0);
  };

  return {
    swipeLeft,
    swipeRight,
    swipeUp,
    swipeDown,
    isGameWon,
    isGameLost,
    getScore,
    resetScore,
  };
};

export default useGameLogic;
