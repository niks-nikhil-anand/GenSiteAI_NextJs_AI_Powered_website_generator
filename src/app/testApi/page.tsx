"use client"
import { useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await fetch("/api/openAI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Test OpenAI API</h1>
      <textarea
        className="border p-2 w-full my-2"
        rows="4"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={sendMessage}
      >
        Send
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
