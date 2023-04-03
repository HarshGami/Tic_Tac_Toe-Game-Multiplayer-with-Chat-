import React, { useState } from "react";
import Board from "./Board";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Window, MessageList, MessageInput } from "stream-chat-react";
import "./chat.css";

function Game({ channel, setChannel, setRivalUsername }) {
  const [playerJoined, setplayerJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });

  channel.on("user.watching.start", async (e) => {
    setplayerJoined(e.watcher_count === 2);
  });

  channel.on("member_removed", () => {
    setplayerJoined(false);
  });
  if (!playerJoined) {
    return (
      <>
        <Card body>Waiting for other palyer to join...</Card>
        <Button
          variant="danger"
          type="submit"
          className="m-1"
          onClick={async () => {
            await channel.stopWatching();
            setChannel(null);
            setRivalUsername("");
          }}
        >
          Leave Game
        </Button>
      </>
    );
  }

  return (
    <>
      <div>
        <Navbar bg="light" expand="lg">
          <Container fluid>
            <Navbar.Brand href="#">
              {result.state === "won" && (
                <div>{result.winner} Won the Game</div>
              )}
              {result.state === "tie" && <div>Game is a {result.state}</div>}
            </Navbar.Brand>
            <Button
              variant="danger"
              type="submit"
              className="m-1"
              onClick={async () => {
                await channel.sendEvent({
                  type: "member_removed",
                });
                await channel.stopWatching();
                setChannel(null);
                setRivalUsername("");
              }}
            >
              Leave Game
            </Button>
          </Container>
        </Navbar>
        <Board result={result} setResult={setResult} />
        <div>
          <Window>
            <MessageList
              disableDateSeparator
              closeReactionSelectorOnClick
              hideDeletedMessages
              messageActions={["react"]}
            />
            <MessageInput noFiles />
          </Window>
        </div>
      </div>
    </>
  );
}

export default Game;
