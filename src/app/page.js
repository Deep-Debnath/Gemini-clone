"use client";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton, Button, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function Gemini() {
  const [loading, setloading] = useState(false);
  const [messages, setmessages] = useState([]);
  const [input, setinput] = useState("");

  const endref = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gemini-chat");
      if (saved) setmessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      endref.current?.scrollIntoView({ behavior: "smooth" });
      localStorage.setItem("gemini-chat", JSON.stringify(messages));
    }
  }, [messages]);

  const sendmessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setinput("");
    setloading(true);
    const usermsg = { role: "user", text: input };
    setmessages((prev) => [...prev, usermsg]);

    try {
      const response = await axios.post("/api/chat", {
        history: [...messages],
        message: input,
      });

      const botmsg = { role: "bot", text: response.data.reply };
      setmessages((prev) => [...prev, botmsg]);
    } catch (err) {
      console.error("Frontend Error:", err);
      const botmsg = {
        role: "bot",
        text: "⚠️ " + err.response.data.error.error.message,
      };
      setmessages((prev) => [...prev, botmsg]);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">🤖 Gemini Chat</h1>
      <Tooltip title="clear chat" placement="top" arrow>
        <IconButton
          aria-label="clear chat"
          sx={{
            color: "red",
            bgcolor: "white",
            transition: "ease 300ms",
            ":hover": { bgcolor: "red", color: "white", scale: "1.2" },
            ":active": { scale: "0.9" },
            p: 1,
            mb: 1,
            alignSelf: "self-end",
          }}
          onClick={() => setmessages([])}
        >
          <Delete fontSize="medium" />
        </IconButton>
      </Tooltip>

      <div className="flex-1 overflow-y-auto border p-4 rounded-lg bg-gray-50">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`my-2 p-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-500 text-white self-end text-right"
                  : "bg-gray-300 text-black self-start text-left"
              }`}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endref} />
        <AnimatePresence>
          {loading && (
            <motion.p
              className="text-gray-500"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              Gemini is typing...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <form className="flex mt-4" onSubmit={sendmessage}>
        <input
          className="flex-1 border rounded-l-lg p-2"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Ask Gemini anything..."
        />
        <motion.button
          className={`${
            loading || (!input.trim() ? "bg-blue-400" : "")
          } bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 `}
          disabled={loading || !input.trim()}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
