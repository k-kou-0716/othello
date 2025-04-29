/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //波線の原因を探す
  const [turnColor, setTurnColor] = useState<number>(1);
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  const validMoves: boolean[][] = board.map((row) => row.map(() => false));

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] !== 0) continue;
      for (const [dx, dy] of directions) {
        let nx = x + dx;
        let ny = y + dy;
        let count = 0;
        while (
          board[ny] !== undefined &&
          board[ny][nx] !== undefined &&
          board[ny][nx] === 2 / turnColor
        ) {
          nx += dx;
          ny += dy;
          count++;
        }
        //一枚でも相手のコマを挟んでいるか
        if (count > 0 && board[ny] !== undefined && board[ny][nx] === turnColor) {
          validMoves[y][x] = true;
          break;
        }
      }
    }
  }

  const clickHandler = (x: number, y: number) => {
    //候補地じゃなかったら置けない
    //これを消すと上のコードが悪さをして変なところに置ける。=>後で確かめる
    if (!validMoves[y][x]) return;

    const newBoard = structuredClone(board);

    if (board[y][x] !== 0) return;

    directions.forEach(([dx, dy]) => {
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
        }
      }
    });
    newBoard[y][x] = turnColor;
    setBoard(newBoard);
    setTurnColor(2 / turnColor);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => {
            const isValid = validMoves[y][x];
            return (
              <div
                key={`${x}-${y}`}
                //isValidがtrueなら色がつく
                className={`${styles.cell} ${isValid ? styles.valid : ''}`}
                onClick={() => clickHandler(x, y)}
              >
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
