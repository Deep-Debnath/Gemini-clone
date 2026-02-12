"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ContentCopy, Done } from "@mui/icons-material";

export default function Gemini() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("gemini-chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("gemini-chat", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        history: [...messages, userMsg],
        message: currentInput,
      });

      const botMsg = { role: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch(err) {
      console.log(err);
      
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#212121] text-[#ECECEC] font-sans">
      <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 border-b border-[#303030] pb-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
            Chatbot
          </h1>

          <button
            onClick={() => setMessages([])}
            className="text-sm px-3 py-1 border border-[#303030] hover:bg-[#303030] transition rounded-md"
          >
            Clear Chat
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-8">
          <AnimatePresence>
            {messages.length > 0 ? (
              messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={m.role === "user" ? "flex justify-end" : ""}
                >
                  {m.role === "user" ? (
                    <div className="bg-[#2f2f2f] px-4 py-3 rounded-2xl max-w-[75%] text-[15px]">
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className="
                        max-w-[85%]
                        text-[15px]
                        leading-7
                        [&_ol]:list-decimal
                        [&_ol]:ml-6
                        [&_ol]:my-4
                        [&_ul]:list-disc
                        [&_ul]:ml-6
                        [&_ul]:my-4
                        [&_li]:my-1
                      "
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ children, className }) {
                            const match = /language-(\w+)/.exec(
                              className || "",
                            );
                            const codeString = String(children).replace(
                              /\n$/,
                              "",
                            );

                            if (match) {
                              return (
                                <div className="relative group my-5">
                                  <SyntaxHighlighter
                                    language={match[1]}
                                    style={okaidia}
                                    PreTag="div"
                                    customStyle={{
                                      background: "#1e1e1e",
                                      borderRadius: "14px",
                                      padding: "18px",
                                      fontSize: "14px",
                                      lineHeight: "1.6",
                                      margin: 0,
                                      fontFamily:
                                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                    }}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>

                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(codeString);
                                      setCopiedIndex(i);
                                      setTimeout(
                                        () => setCopiedIndex(null),
                                        2000,
                                      );
                                    }}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-[#2a2a2a] hover:bg-[#3a3a3a] p-1.5 rounded-md"
                                  >
                                    {copiedIndex === i ? (
                                      <Done fontSize="small" />
                                    ) : (
                                      <ContentCopy fontSize="small" />
                                    )}
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <code className="bg-[#2f2f2f] px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-xl mt-16">
                Ready to ask?
              </p>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 ml-2">
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="max-w-4xl">
          <div className="relative w-full">
            <input
              className="w-full bg-[#2f2f2f] sm:p-4 p-3 pr-20 rounded-full focus:outline-none text-[15px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute top-1/2 sm:right-2 right-1 -translate-y-1/2 px-4 py-2 rounded-full bg-white text-black font-medium disabled:opacity-50"
            >
              Ask
            </button>
          </div>
        </form>
        <div className="text-sm text-center mt-2 text-gray-300">
          Chatbot can make mistakes
        </div>
      </div>
    </div>
  );
}
