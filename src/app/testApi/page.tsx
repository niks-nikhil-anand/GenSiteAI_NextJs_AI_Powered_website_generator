"use client";
import { useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty requests

    setResponse("");
    setLoading(true);

    try {
      const res = await fetch("/api/openAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.body) throw new Error("No response body received");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let text = decoder.decode(value);
        for (let char of text) {
          await new Promise((resolve) => setTimeout(resolve, 50)); // Typing effect
          setResponse((prev) => prev + char);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Test OpenAI API</h1>
      <textarea
        className="border p-2 w-full my-2"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-400"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Loading..." : "Send"}
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-semibold">Response:</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}
