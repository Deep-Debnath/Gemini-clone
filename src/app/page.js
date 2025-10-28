"use client";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
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
      setTimeout(() => {
        setmessages((prev) => [...prev, botmsg]);
        setloading(false);
      }, 400);
    } catch (err) {
      console.error("Frontend Error:", err);
      const botmsg = {
        role: "bot",
        text:
          "⚠️ " + err.response?.data?.error?.error?.message ||
          "Something went wrong.",
      };
      setmessages((prev) => [...prev, botmsg]);
      setloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 font-[Inter]">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <h1
          className="md:text-4xl text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          style={{ marginBottom: 0 }}
        >
          🤖 Gemini Chat
        </h1>

        <Tooltip title="Clear chat" placement="top" arrow>
          <IconButton
            aria-label="clear chat"
            sx={{
              color: "red",
              bgcolor: "white",
              transition: "all 300ms ease",
              ":hover": {
                bgcolor: "red",
                color: "white",
                transform: "scale(1.1)",
              },
              ":active": { transform: "scale(0.9)" },
              p: 1,
            }}
            onClick={() => setmessages([])}
          >
            <Delete fontSize="medium" />
          </IconButton>
        </Tooltip>
      </Box>

      <div
        className="flex-1 overflow-y-auto border border-gray-600 p-4 rounded-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-lg"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <AnimatePresence>
          {messages.length > 0 ? (
            messages.map((m, i) => (
              <motion.div
                key={i}
                className={`my-2 max-w-[75%] px-3 py-2 rounded-xl transition-all duration-300 ${
                  m.role === "user"
                    ? "ml-auto text-right bg-blue-600/80 text-white shadow-sm hover:shadow-blue-500/20"
                    : "bg-gray-100 text-gray-900 border border-gray-200 hover:shadow-md"
                }`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-md leading-relaxed break-words whitespace-pre-wrap">
                  {m.text}
                </p>
              </motion.div>
            ))
          ) : (
            <Typography
              component={motion.div}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              sx={{ textAlign: "center" }}
              className="text-gray-400 italic"
              variant="h6"
            >
              👋 Hello there! How can I assist you today?
            </Typography>
          )}
        </AnimatePresence>

        <div ref={endref} />

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="typing"
              className="relative flex items-center gap-3 mt-4 pl-3 text-sm text-gray-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 blur-lg opacity-30 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />

              <motion.span
                className=" font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wide"
                animate={{
                  backgroundPositionX: ["0%", "100%"],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                Gemini is thinking
              </motion.span>

              <motion.div className="flex gap-2 ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/40"
                    animate={{
                      y: [0, -6, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form className="flex mt-1" onSubmit={sendmessage}>
        <input
          className="flex-1 border border-gray-600 bg-gray-900 text-white rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Ask Gemini anything..."
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className={`px-4 rounded-r-lg text-white ${
            loading || !input.trim()
              ? "bg-blue-500/60 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-500 hover:to-cyan-500"
          }`}
          disabled={loading || !input.trim()}
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
