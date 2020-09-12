import React, { useState, useEffect, useRef } from "react";
import uuid from "react-uuid";
import Pusher from "pusher-js";
import axios from "axios";

import { Container, Header, Messages, Message, Write } from "./styles";

function App() {
  const [hidden, setHidden] = useState(true);
  const lastMessage = useRef();

  const [repository, setRepository] = useState(null);
  const [user, setUser] = useState(null);

  const [membersTotal, setMembersTotal] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const defineRepository = () => {
      const repositoryElement = document.querySelector(
        "#js-repo-pjax-container > div.bg-gray-light.pt-3.hide-full-screen.mb-5 > div > div > h1 > strong > a"
      );

      if (repositoryElement) {
        setRepository(
          repositoryElement.getAttribute("href").replace(/\//, "").toLowerCase()
        );
      }

      setTimeout(defineRepository, 5000);
    };

    defineRepository();
  }, []);

  useEffect(() => {
    const userElement = document.querySelector("header .avatar.avatar-user");

    if (!userElement) return;

    setUser(userElement.getAttribute("alt").replace("@", ""));
  }, []);

  useEffect(() => {
    if (!repository || !user) return;

    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
      cluster: "us2",
      authEndpoint: `${process.env.REACT_APP_PUSHER_APP_ENDPOINT}/pusher/auth?user=${user}`,
    });

    const channelName = `presence-${repository.replace("/", "-")}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () =>
      setMembersTotal(channel.members.count)
    );

    channel.bind("pusher:member_added", () =>
      setMembersTotal(channel.members.count)
    );

    channel.bind("pusher:member_removed", () =>
      setMembersTotal(channel.members.count)
    );

    channel.bind("messages", (message) => {
      setMessages((messages) => [...messages, { id: uuid(), ...message }]);

      lastMessage.current.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [repository, user]);

  function sendMessage(event) {
    if (event.which !== 13) {
      return;
    }

    event.preventDefault();

    if (!user) {
      alert("Você não esta logado no GitHub!");
      return;
    }

    const previewNewMessage = newMessage;

    axios
      .post(
        `${
          process.env.REACT_APP_PUSHER_APP_ENDPOINT
        }/presence-${repository.replace("/", "-")}`,
        {
          author: user,
          description: newMessage,
        }
      )
      .catch(() => setNewMessage(previewNewMessage));

    setNewMessage("");
  }

  if (!repository) return <></>;

  return (
    <Container className={hidden && "hidden"}>
      <Header onClick={() => setHidden(!hidden)}>
        <h1>
          <span>{repository}</span>
          <span>({membersTotal})</span>
        </h1>

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

          <div ref={lastMessage}></div>
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
