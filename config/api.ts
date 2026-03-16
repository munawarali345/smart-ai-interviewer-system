export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  export default API_URL

    // Agar env variable missing ho ya undefined ho
  // to fallback value use hogi (localhost:3000)