export default async function handler(req, res) {
  const auth = req.headers['x-app-password'];
  if (auth !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Profile IDs par plateforme
  const PROFILE_IDS = {
    tiktok: process.env.PROFILE_ID_TIKTOK || '69ba388c4a051d6635dce635',
    instagram: process.env.PROFILE_ID_INSTAGRAM || '',
    youtube: process.env.PROFILE_ID_YOUTUBE || '',
    facebook: process.env.PROFILE_ID_FACEBOOK || '',
    twitter: process.env.PROFILE_ID_TWITTER || '',
  };

  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });

    const profileId = PROFILE_IDS[body.platform];
    if (!profileId) {
      return res.status(400).json({ error: `Aucun compte connecté pour ${body.platform}` });
    }

    const payload = {
      profile_id: profileId,
      platform: body.platform,
      media_ids: body.media_ids,
      caption: body.caption,
      ...(body.scheduled_at ? { scheduled_at: body.scheduled_at } : {})
    };

    const response = await fetch('https://api.zernio.com/v1/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
