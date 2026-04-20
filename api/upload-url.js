import { put } from '@vercel/blob';

// This endpoint handles the server-side token generation for client uploads
// Using the handleUpload pattern for larger files (videos)
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename, X-Category');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const contentType = req.headers['content-type'] || 'video/mp4';
    const filename = req.headers['x-filename'] || `upload-${Date.now()}`;
    const category = req.headers['x-category'] || 'videos';

    // Stream the body directly to Vercel Blob (no buffering)
    const blob = await put(`${category}/${filename}`, req, {
      access: 'public',
      contentType,
    });

    return res.status(200).json({
      url: blob.url,
      category,
      filename,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
