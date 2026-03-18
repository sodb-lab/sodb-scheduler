export default async function handler(req, res) {
  const auth = req.headers['x-app-password'];
  if (auth !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
      req.on('error', reject);
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: "Tu es un expert en marketing musical pour artistes rap/trap français. Tu écris des captions courtes, percutantes, authentiques. Ton urban, direct. Réponds UNIQUEMENT avec la caption, sans guillemets ni explications.",
        messages: [{ role: 'user', content: body.prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data));
      return res.status(response.status).json({ error: data.error?.message || 'Erreur Anthropic' });
    }

    const caption = data.content?.[0]?.text || '';
    if (!caption) {
      console.error('Empty caption, full response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Caption vide reçue' });
    }

    return res.status(200).json({ caption });
  } catch (err) {
    console.error('Caption handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
