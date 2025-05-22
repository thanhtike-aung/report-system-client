export const chatCompletion = async (prompt: string) => {
  let loading = true;
  let data = null;
  let error = null;
  let success = false;
  try {
    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-medium",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || "API error");
    }
    success = true;
  } catch (err) {
    error = err;
  } finally {
    loading = false;
  }

  return { loading, data, error, success };
};
