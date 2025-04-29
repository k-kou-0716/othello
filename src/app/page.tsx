'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = structuredClone(board);

    const direcitons = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];

    if (board[y][x] !== 0) return;
    let flippedAny = false;
    direcitons.forEach(([dx, dy]) => {
      let ny = y + dy,
        nx = x + dx;
      const count = [];
      while (
        board[ny] !== undefined &&
        board[ny][nx] !== undefined &&
        board[ny][nx] === 2 / turnColor
      ) {
        count.push([nx, ny]);
        ny += dy;
        nx += dx;
        if (
          //一枚でも相手の駒を挟んでいるか
          count.length > 0 &&
          board[ny] !== undefined &&
          board[ny][nx] !== undefined &&
          board[ny][nx] === turnColor
        ) {
          count.forEach(([cx, cy]) => {
            newBoard[cy][cx] = turnColor;
          });
          flippedAny = true;
        }
      }
    });
    //少なくとも一方向ひっくり返したか
    if (!flippedAny) return;
    newBoard[y][x] = turnColor;
    setBoard(newBoard);
    setTurnColor(2 / turnColor);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
