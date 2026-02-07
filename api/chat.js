export default async function handler(req, res) {

  // ✅ ADD THIS BLOCK (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ ADD THIS BLOCK (handle preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ⬇️ EVERYTHING BELOW CAN STAY EXACTLY THE SAME
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
