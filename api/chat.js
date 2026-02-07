import OpenAI from "openai";

import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { prompt, system, history, model, temperature, max_tokens } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ text: "No prompt received." });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...(history || []),
        { role: "user", content: prompt }
      ],
      temperature: parseFloat(temperature) || 0.7,
      max_tokens: parseInt(max_tokens, 10) || 200
    });

    res.status(200).json({ text: response.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "(error generating response)" });
  }
}



export default async function handler(req, res) {
  try {
    const { prompt, system, history, model, temperature, max_tokens } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ text: "No prompt received." });
    }

    const messages = [];

    if (system) {
      messages.push({ role: "system", content: system });
    }

    if (Array.isArray(history)) {
      messages.push(...history);
    }

    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages,
        temperature: Number(temperature) || 0.7,
        max_tokens: Number(max_tokens) || 200
      })
    });

    const data = await response.json();

    return res.status(200).json({
      text: data.choices?.[0]?.message?.content || "(no response)"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ text: "(server error)" });
  }
}
