"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  // const { sendMessage, messages } = useSocket();
  const messages = ["Asdsfs"];
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className="w-52 h-14 p-3 border-2 rounded-lg"
          placeholder="Message..."
        />
        <button
          // onClick={(e) => sendMessage(message)}
          className="h-14 w-14 p-3 rounded-lg"
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </div>
    </div>
  );
}
