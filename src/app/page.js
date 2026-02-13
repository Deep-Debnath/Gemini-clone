"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Add, ContentCopy, Done } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function Gemini() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
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

    const userMsg = { role: "user", text: input, image: selectedFile || null };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        history: [...messages, userMsg],
        message: currentInput,
        image: selectedFile || null,
      });

      const botMsg = { role: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.log(err.response);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Something went wrong. Try again after some time",
        },
      ]);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="w-full bg-[#212121] text-[#ECECEC] font-sans">
      <div className="h-screen max-w-4xl mx-auto p-6 grid grid-rows-[auto_1fr_auto_7px]">
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
                    <div className="flex flex-col items-end max-w-[75%]">
                      {/* Image (separate block) */}
                      {m.image && (
                        <img
                          src={`data:image/png;base64,${m.image}`}
                          alt="preview"
                          className="mb-2 w-32 h-32 object-cover rounded-xl border border-[#3a3a3a]"
                        />
                      )}

                      {m.text && (
                        <div className="bg-[#2f2f2f] px-4 py-3 rounded-2xl text-[15px]">
                          {m.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                        max-w-full
                        text-[15px]
                        leading-7
                        [&_h2]:text-2xl
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

        <div className="w-full">
          <form onSubmit={sendMessage} className="max-w-4xl">
            {selectedFile && (
              <div className="mb-1 relative w-fit">
                <img
                  src={`data:image/png;base64,${selectedFile}`}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-xl border border-[#3a3a3a]"
                />

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="absolute cursor-pointer -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="relative flex items-center">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();

                  reader.onloadend = () => {
                    const base64 = reader.result.split(",")[1];
                    setSelectedFile(base64);
                  };

                  reader.readAsDataURL(file);
                }}
              />
              <label
                htmlFor="imageUpload"
                className="absolute left-5 cursor-pointer text-gray-400 hover:text-white transition"
              >
                <Add size={20} />
              </label>

              <input
                className="w-full bg-[#2f2f2f] sm:py-4 p-3 pl-12 pr-20 rounded-full focus:outline-none text-white placeholder-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedFile ? "Ask about selected file" : "Ask anything"
                }
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute sm:scale-100 scale-95 sm:right-2 right-1 bg-white text-black px-4 py-2 rounded-full font-medium disabled:opacity-50"
              >
                Ask
              </button>
            </div>
          </form>
        </div>

        <div className="text-sm text-center mt-1 text-gray-300">
          Chatbot can make mistakes
        </div>
      </div>
    </div>
  );
}
