"use client";
import { useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState({ prompts: [], uiPrompts: [], error: "" });
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty requests

    setResponse(null);
    setLoading(true);

    try {
      const res = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("API Response:", data); // Debugging

      setResponse(data);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse({ error: "Failed to get a response. Please try again." });
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
          {response.error ? (
            <p className="text-red-500">{response.error}</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Response:</h2>
              {response.prompts && (
                <div className="mt-2">
                  <h3 className="font-semibold">Prompts:</h3>
                  <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                    {JSON.stringify(response.prompts, null, 2)}
                  </pre>
                </div>
              )}
              {response.uiPrompts && (
                <div className="mt-2">
                  <h3 className="font-semibold">UI Prompts:</h3>
                  <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                    {JSON.stringify(response.uiPrompts, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
