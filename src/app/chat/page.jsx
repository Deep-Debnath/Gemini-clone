// "use client";
// import { useState } from "react";
// import axios from "axios";

// export default function ChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessage = { role: "user", text: input };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("/api/chat", { message: input });
//       const botMessage = { role: "bot", text: res.data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "⚠️ Error: Could not reach Gemini." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">🤖 Gemini Chat</h1>

//       <div className="flex-1 overflow-y-auto border p-4 rounded-lg bg-gray-50">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`my-2 p-2 rounded-lg ${
//               m.role === "user"
//                 ? "bg-blue-500 text-white self-end text-right"
//                 : "bg-gray-300 text-black self-start text-left"
//             }`}
//           >
//             {m.text}
//           </div>
//         ))}
//         {loading && <p className="text-gray-500">Gemini is typing...</p>}
//       </div>

//       <div className="flex mt-4">
//         <input
//           className="flex-1 border rounded-l-lg p-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask Gemini anything..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
//           disabled={loading}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function Gemini() {
//   const [message, setmessage] = useState([]);
//   const [input, setinput] = useState("");
//   const [loading, setloading] = useState(false);

//   const sendmessage = async (e) => {
//     e.preventDefault()
//     if (!input.trim()) return;
//     const newmessage = { role: "user", text: input };
//     setmessage((prev) => [...prev, newmessage]);
//     setinput("");
//     setloading(true);

//     try {
//       const response = await axios.post("/api/chat", { message: input });
//       const botmessage = { role: "bot", text: response.data.reply };
//       setmessage((prev) => [...prev, botmessage]);
//     } catch (err) {
//       const botmessage = { role: "bot", text: "Error could not reach Gemini" };
//       setmessage((prev) => [...prev, botmessage]);
//     } finally {
//       setloading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">🤖 Gemini Chat</h1>

//       <div className="flex-1 overflow-y-auto border p-4 rounded-lg bg-gray-50">
//         {message.map((m, i) => (
//           <div
//             key={i}
//             className={`my-2 p-2 rounded-lg ${
//               m.role === "user"
//                 ? "bg-blue-500 text-white self-end text-right"
//                 : "bg-gray-300 text-black self-start text-left"
//             }`}
//           >
//             {m.text}
//           </div>
//         ))}
//         {loading && <p className="text-gray-500">Gemini is typing...</p>}
//       </div>

//       <form className="flex mt-4" onSubmit={sendmessage}>
//         <input
//           className="flex-1 border rounded-l-lg p-2"
//           value={input}
//           onChange={(e) => setinput(e.target.value)}
//           placeholder="Ask Gemini anything..."
//         />
//         <motion.button
//           className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
//           disabled={loading||!input.trim()}
//           drag
//         >
//           Send
//         </motion.button>
//       </form>
//     </div>
//   );
// }
