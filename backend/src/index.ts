require("dotenv").config();
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env["GITHUB_TOKEN"], // Use the API key from the environment
});

async function handlePrompt(prompt: string, model: string) {
  try {
    const stream = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
      stream: true, // Enable streaming
    });

    let responseText = "";

    // Stream the response in real-time
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      responseText += content;
      process.stdout.write(content); // Stream to terminal
    }

    console.log("\n\nFinal Response:", responseText);
  } catch (err) {
    console.error("Error processing prompt:", err);
  }
}

// Example usage
(async () => {
  console.log("Processing template prompt...");
  await handlePrompt("Give the React code for a to-do list creation", "openai/gpt-4o");

  console.log("\nProcessing another prompt...");
  await handlePrompt("What is 2+2?", "openai/gpt-4o");
})();