import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const category = req.query.category || '';
    const prefix = category ? `${category}/` : undefined;
    
    const { blobs } = await list({ prefix });

    const items = blobs.map(b => ({
      url: b.url,
      filename: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
      category: b.pathname.startsWith('guest/') ? 'guest' : 
                b.pathname.startsWith('videos/') ? 'videos' : 'other',
    }));

    return res.status(200).json({ items });
  } catch (err) {
    console.error('List error:', err);
    return res.status(500).json({ error: 'Failed to list uploads' });
  }
}
