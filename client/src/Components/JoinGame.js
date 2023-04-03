import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import ChatInput from "./ChatInput";

function JoinGame() {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  async function createChannel(e) {
    e.preventDefault();
    if (rivalUsername === "") {
      alert("Enter RivalUsername");
      return;
    }

    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("user not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  }

  return (
    <div className="my-4 card w-75 mx-auto">
      {channel ? (
        <Channel channel={channel} Input={ChatInput}>
          <Game
            channel={channel}
            setChannel={setChannel}
            setRivalUsername={setRivalUsername}
          />
        </Channel>
      ) : (
        <Form className="my-2 mx-2">
          <Form.Group className="mb-3">
            <Card.Title className="mx-1">Create Game</Card.Title>
            <Form.Control
              type="text"
              placeholder="Username of rival..."
              onChange={(e) => setRivalUsername(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit" onClick={createChannel}>
            Join Game
          </Button>
        </Form>
      )}
    </div>
  );
}

export default JoinGame;
