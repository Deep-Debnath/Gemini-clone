import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { history = [], message, image } = await req.json();

  if (!message) {
    return NextResponse.json(
      { success: false, error: "message should not be empty" },
      { status: 400 },
    );
  }

  const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apikey) {
    return NextResponse.json(
      { success: false, error: "api key is missing" },
      { status: 500 },
    );
  }

  const prompt =
    history
      .map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n") + `\nUser: ${message}\nBot:`;

  const parts = [{ text: prompt }];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: image,
      },
    });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apikey}`,
      {
        contents: [
          {
            role: "user",
            parts,
            // parts: [
            //   { text: prompt },
            //   {
            //     inlineData: {
            //       mimeType: "image/png", // or image/jpeg
            //       data: base64Image,
            //     },
            //   },
            // ],
          },
        ],
      },
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
      { status: 500 },
    );
  }
}
