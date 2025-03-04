import React, { useState, useEffect, useRef } from "react";

type UserData = {
  id: string;
  message: string;
};

function Chat() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [input, setInput] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket)

    if (!ws) {

      socket.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          console.log("receivedData", receivedData)
          setUserData((prev) => [...prev, receivedData]);
        } catch (error) {
          console.error("Invalid JSON:", event.data);
        }
      };

      socket.onclose = () => {
        console.warn("WebSocket kapandı.");
      };
    }

    return () => {
      socket.close();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const sendMessage = () => {
    if (ws && input.trim().length > 0 && ws.readyState === WebSocket.OPEN) {
      ws.send(input);
      setInput("");
    } else {
      console.warn("WebSocket bağlantısı açık değil.");
    }
  };

  return (
    <div>
      <h2>WebSocket Chat Uygulaması</h2>
      <div>
        <input
          value={input}
          onChange={handleChange}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gönder</button>
      </div>

      <ul>
        {userData.map((item) => (
          <li
            style={{
              backgroundColor: "white",
              color: "black",
              padding: "8px",
              margin: "4px 0",
              borderRadius: "4px",
              listStyle: "none",
            }}
            key={item.id}
          >
            {item.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
