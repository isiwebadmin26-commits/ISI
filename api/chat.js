// api/chat.js
/**
 * Serverless Groq Chat Completion Proxy
 * Provides server-side API execution using GROQ_API_KEY without exposing keys to clients.
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = 
    process.env.GROQ_API_KEY || 
    process.env.VITE_GROQ_API_KEY || 
    req.headers['authorization']?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'Missing Groq API Key. Set GROQ_API_KEY in environment or pass Authorization header.' 
    });
  }

  try {
    const { messages, model = 'llama-3.3-70b-versatile', temperature = 0.6, max_tokens = 1024 } = req.body || {};

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      return res.status(groqRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[API CHAT EXCEPTION]', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err?.message });
  }
}
