import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import Pusher from "pusher-js";
import axios from "axios";

import { Container, Header, Messages, Message, Write } from "./styles";

Pusher.logToConsole = true;

const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: "us2",
});

function App() {
  const [hidden, setHidden] = useState(false);

  const [repository, setRepository] = useState(null);
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const defineRepository = () => {
      const repositoryElement = document.querySelector(
        "#js-repo-pjax-container > div.bg-gray-light.pt-3.hide-full-screen.mb-5 > div > div > h1 > strong > a"
      );

      if (repositoryElement) {
        setRepository(repositoryElement.getAttribute("href").replace(/\//, ""));
      }

      setTimeout(defineRepository, 5000);
    };

    defineRepository();
  }, []);

  useEffect(() => {
    if (!repository) return;

    const channelName = `channel-${repository.replace("/", "-")}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("messages", (message) =>
      setMessages((messages) => [...messages, { id: uuid(), ...message }])
    );

    return () => pusher.unsubscribe(channelName);
  }, [repository]);

  useEffect(() => {
    const userElement = document.querySelector("header .avatar.avatar-user");

    if (!userElement) return;

    setUser(userElement.getAttribute("alt").replace("@", ""));
  }, []);

  function sendMessage(event) {
    if (event.which !== 13) {
      return;
    }

    event.preventDefault();

    if (!user) {
      alert("Você não esta logado no GitHub!");
      return;
    }

    axios.post("https://github-chat-api.herokuapp.com", {
      data: { author: user, description: newMessage },
      channel: `channel-${repository.replace("/", "-")}`,
    });

    setNewMessage("");
  }

  if (!repository) return <></>;

  return (
    <Container className={hidden && "hidden"}>
      <Header onClick={() => setHidden(!hidden)}>
        <h1>{repository}</h1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </Header>

      {!!messages.length && (
        <Messages>
          {messages.map((message) => (
            <Message key={message.id}>
              <a
                href={`https://www.github.com/${message.author}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{message.author}:
              </a>
              <span>{message.description}</span>
            </Message>
          ))}
        </Messages>
      )}

      <Write
        placeholder="Write a message to chat..."
        value={newMessage}
        onChange={(event) => setNewMessage(event.target.value)}
        onKeyPress={sendMessage}
      />
    </Container>
  );
}

export default App;
