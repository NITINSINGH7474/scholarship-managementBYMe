// src/utils/storage.js
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

/**
 * Ensure upload directory exists
 */
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save buffer from multer memory storage to uploads directory
 * file: { originalname, buffer, mimetype, size }
 * returns { filename, url }
 */
async function saveFile(file) {
  ensureUploadDir();
  const ext = path.extname(file.originalname) || '';
  const name = `${Date.now()}-${nanoid(8)}${ext}`;
  const dest = path.join(UPLOAD_DIR, name);
  await fs.promises.writeFile(dest, file.buffer);
  // URL is the path on disk; we provide route-based streaming via storage.streamFile
  return { filename: name, url: dest };
}

/**
 * Stream a saved file to response (secure)
 */
function streamFile(res, filePath, downloadName) {
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: 'File not found' });
    return;
  }
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName || path.basename(filePath)}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

module.exports = {
  saveFile,
  streamFile,
  UPLOAD_DIR
};
