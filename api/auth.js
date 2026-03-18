export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });
    if (body.password === process.env.APP_PASSWORD) {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
