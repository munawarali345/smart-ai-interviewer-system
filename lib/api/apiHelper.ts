import API_URL from "@/config/api";

// fetch interview on server
async function getInterviewById (interviewId: string) {

  // SSR mein full URL use karna hoga
  // Client-side mein relative path kaam karta hai, SSR mein nahi
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/interview/${interviewId}`;
  
  const res = await fetch(url, {
    cache: "no-store"
  });

  if(!res.ok) {
    const errorText = await res.text();
    throw new Error("Failed to fetch interview");
  }

  const data = await res.json();
  return data.data;

};
// end here

export default getInterviewById;