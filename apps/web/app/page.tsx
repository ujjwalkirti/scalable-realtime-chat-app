"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function page() {
  const [msg, setMsg] = useState<string>("");
  const { sendMessage, messages } = useSocket();
  return (
    <section className="flex flex-col items-center px-3 h-screen">
      <h1 className="text-2xl font-bold my-5">Chat Page</h1>
      <div className="h-3/5 border border-black w-full mb-3">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div className="w-full flex flex-col items-center px-3">
        <textarea
          className="border-2 border-gray-300 p-2 w-full h-32 rounded-md"
          value={msg}
          placeholder="Enter your message..."
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessage(msg);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2 w-36 hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </section>
  );
}
