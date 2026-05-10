const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const indexPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/\n?<!-- ===================== FOOTER ===================== -->[\s\S]*?<\/footer>\n?/i, '\n');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).send(html);
};
