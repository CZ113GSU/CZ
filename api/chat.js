import OpenAI from "openai";

export default async function handler(req, res) {
  const { prompt, system, history, model, temperature, max_tokens } = req.body;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...history,
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
