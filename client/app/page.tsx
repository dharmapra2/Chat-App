"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  // const messages = ["Asdsfs"];
  const [message, setMessage] = useState("");

  return (
    <div className="mx-auto flex bg-slate-500 flex-col items-center w-full h-full text-black">
      <div className="flex justify-between w-full h-20 p-2">
        <input
          onChange={(e) => setMessage(e.target.value)}
          className="w-52 h-14 p-3 border-2 rounded-lg"
          placeholder="Message..."
        />
        <button
          onClick={(e) => sendMessage(message)}
          className="h-14 w-fit p-3 rounded-lg bg-slate-100"
        >
          Send Message
        </button>
      </div>
      <div className="flex flex-col justify-between w-full h-full">
        {messages.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </div>
    </div>
  );
}
