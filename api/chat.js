export default async function handler(req, res) {
  console.log("METHOD:", req.method);

  // 🔹 CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔹 Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method not allowed" });
  }

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

    // 🔹 Call OpenAI API
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

    // 🔹 Log full OpenAI response for debugging
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    // 🔹 Handle OpenAI errors gracefully
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return res.status(200).json({ text: "(OpenAI API error: " + data.error.message + ")" });
    }

    // 🔹 Return chat content
    return res.status(200).json({
      text: data.choices?.[0]?.message?.content || "(no response)"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ text: "(server error)" });
  }
}
