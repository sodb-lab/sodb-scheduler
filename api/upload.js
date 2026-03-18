export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const auth = req.headers['x-app-password'];
  if (auth !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    const response = await fetch('https://api.zernio.com/v1/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
        'Content-Type': req.headers['content-type'],
      },
      body,
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
