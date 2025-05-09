'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
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

  const calcBoardWithCandidates = (board: number[][]) => {
    const newBoard = structuredClone(board);
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
          //一枚でも相手の駒を挟んでいるか
          if (count > 0 && board[ny] !== undefined && board[ny][nx] === turnColor) {
            newBoard[y][x] = 3;
            break;
          }
        }
      }
    }
    return newBoard;
  };

  console.log(calcBoardWithCandidates(board));
  console.log(board);

  // //候補地を表示
  // const candidate = board.map((row) => row.map(() => false));
  // for (let y = 0; y < 8; y++) {
  //   for (let x = 0; x < 8; x++) {
  //     if (board[y][x] !== 0) continue;
  //     for (const [dx, dy] of directions) {
  //       let nx = x + dx;
  //       let ny = y + dy;
  //       let count = 0;
  //       while (
  //         board[ny] !== undefined &&
  //         board[ny][nx] !== undefined &&
  //         board[ny][nx] === 2 / turnColor
  //       ) {
  //         nx += dx;
  //         ny += dy;
  //         count++;
  //       }
  //       //一枚でも相手の駒を挟んでいるか
  //       if (count > 0 && board[ny] !== undefined && board[ny][nx] === turnColor) {
  //         candidate[y][x] = true;
  //         break;
  //       }
  //     }
  //   }
  // }

  //オセロのプログラム
  const clickHandler = (x: number, y: number) => {
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
          newBoard[y][x] = turnColor;
          setTurnColor(2 / turnColor);
        }
      }
    });
    setBoard(newBoard);
  };

  //駒の数チェック
  const flatBoard = board.flat();
  const b = flatBoard.filter((cell) => cell === 1);
  const w = flatBoard.filter((cell) => cell === 2);

  return (
    <div className={styles.container}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreText}>
          黒{b.length} : 白{w.length}
        </div>
      </div>
      <div className={styles.board}>
        {calcBoardWithCandidates(board).map((row, y) =>
          row.map((color, x) => {
            // const tf = candidate[y][x];
            return (
              <div
                key={`${x}-${y}`}
                //isValidがtrueなら色がつく
                className={`${styles.cell} ${color === 3 ? styles.candidate : ''}`}
                onClick={() => clickHandler(x, y)}
              >
                {color !== 0 && color !== 3 && (
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
