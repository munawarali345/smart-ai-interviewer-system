export const openRouterClient = async (messages: any, model?: string) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model || "openai/gpt-4o-mini",
      messages,
      response_format: {type: 'json_object'}
    })
  });

  return res.json();
};