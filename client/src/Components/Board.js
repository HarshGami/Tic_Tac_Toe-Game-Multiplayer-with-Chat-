import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import "./board.css";

function Board({ result, setResult }) {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    checkTie();
    checkWin();
  }, [board]);

  async function chooseBox(box) {
    if (turn === player && board[box] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "Game-move",
        data: { box, player },
      });

      setBoard(
        board.map((val, index) => {
          if (index === box && val === "") {
            return player;
          }
          return val;
        })
      );
    }
  }

  const checkWin = () => {
    win.forEach((pattern) => {
      const first = board[pattern[0]];
      if (first === "") return;

      let foundpattern = true;
      pattern.forEach((index) => {
        if (board[index] !== first) {
          foundpattern = false;
        }
      });

      if (foundpattern) {
        setResult({ winner: first, state: "won" });
      }
    });
  };

  const checkTie = () => {
    let filled = true;

    board.forEach((box) => {
      if (box === "") {
        filled = false;
      }
    });

    if (filled) {
      setResult({ winner: "none", state: "tie" });
    }
  };

  channel.on((e) => {
    if (e.type === "Game-move" && e.user.id !== client.userID) {
      setPlayer(e.data.player === "X" ? "O" : "X");
      setTurn(e.data.player === "X" ? "O" : "X");
      setBoard(
        board.map((val, index) => {
          if (index === e.data.box && val === "") {
            return e.data.player;
          }
          return val;
        })
      );
    }
  });

  return (
    <div class="container">
      <div
        class="box bl0 bt0"
        onClick={() => {
          chooseBox(0);
        }}
      >
        <span class="boxtext">{board[0]}</span>
      </div>
      <div
        class="box bt0"
        onClick={() => {
          chooseBox(1);
        }}
      >
        <span class="boxtext">{board[1]}</span>
      </div>
      <div
        class="box bt0 br0"
        onClick={() => {
          chooseBox(2);
        }}
      >
        <span class="boxtext">{board[2]}</span>
      </div>
      <div
        class="box bl0"
        onClick={() => {
          chooseBox(3);
        }}
      >
        <span class="boxtext">{board[3]}</span>
      </div>
      <div
        class="box"
        onClick={() => {
          chooseBox(4);
        }}
      >
        <span class="boxtext">{board[4]}</span>
      </div>
      <div
        class="box br0"
        onClick={() => {
          chooseBox(5);
        }}
      >
        <span class="boxtext">{board[5]}</span>
      </div>
      <div
        class="box bl0 bb0"
        onClick={() => {
          chooseBox(6);
        }}
      >
        <span class="boxtext">{board[6]}</span>
      </div>
      <div
        class="box bb0"
        onClick={() => {
          chooseBox(7);
        }}
      >
        <span class="boxtext">{board[7]}</span>
      </div>
      <div
        class="box bb0 br0"
        onClick={() => {
          chooseBox(8);
        }}
      >
        <span class="boxtext">{board[8]}</span>
      </div>
    </div>
  );
}

export default Board;
