// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const message = body?.message;

//     if (!message) {
//       return NextResponse.json(
//         { success: false, error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { success: false, error: "Missing Gemini API key" },
//         { status: 500 }
//       );
//     }

//     const response = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
//       {
//         contents: [{ parts: [{ text: message }] }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey,
//         },
//       }
//     );

//     const reply =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "⚠️ No response from Gemini";

//     return NextResponse.json({ success: true, reply });
//   } catch (error) {
//     console.error(
//       "❌ Gemini API error:",
//       error.response?.data || error.message
//     );

//     // Return the actual Gemini error to the frontend
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.response?.data || { message: error.message },
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const message = body?.message;

//     if (!message) {
//       return NextResponse.json(
//         { success: false, error: "Message cannot be empty" },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { success: false, error: "Missing Gemini API key" },
//         { status: 500 }
//       );
//     }

//     const response = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
//       { contents: [{ parts: [{ text: message }] }] },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey,
//         },
//       }
//     );

//     const reply =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "⚠️ No response from Gemini";

//     return NextResponse.json({ success: true, reply });
//   } catch (error) {
//     console.error(
//       "❌ Gemini API error:",
//       error.response?.data || error.message
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error: error.response?.data || { message: error.message },
//       },
//       { status: 500 }
//     );
//   }
// }

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { history = [], message } = await req.json();

  if (!message) {
    return NextResponse.json(
      { success: false, error: "message should not be empty" },
      { status: 400 }
    );
  }

  const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apikey) {
    return NextResponse.json(
      { success: false, error: "api key is missing" },
      { status: 500 }
    );
  }

  const prompt =
    history
      .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n") + `\nUser: ${message}\nBot:`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apikey}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "no response from gemini!";

    return NextResponse.json({ success: true, reply }, { status: 200 });
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);

    return NextResponse.json(
      {
        success: false,
        error: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
