import Groq from "groq-sdk";
import { validateEnv } from "./validateEnv";

// Validate environment variables at startup
const env = validateEnv();

// Groq client - api key is now guaranteed to exist
const client = new Groq({
    apiKey: env.GROQ_API_KEY,
});

export default client;