"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function page() {
  const [msg, setMsg] = useState<string>("");
  const { sendMessage, messages } = useSocket();
  return (
    <>
      <h1>Chat Page</h1>

      <div>
        <textarea
          style={{
            height: "100px",
            width: "300px",
          }}
          value={msg}
          placeholder="Enter your message..."
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessage(msg);
          }}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
}
