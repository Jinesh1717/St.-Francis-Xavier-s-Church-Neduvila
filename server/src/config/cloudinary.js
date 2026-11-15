const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload a file buffer to Cloudinary or fallback to local uploads folder
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} folder
 * @returns {Promise<{ url: string, public_id: string }>}
 */
const uploadToCloudinary = async (fileBuffer, originalName = 'upload', folder = 'church_neduvila') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback for development if Cloudinary credentials are not yet configured:
  // Store file in server/public/uploads and return a local URL
  const uploadsDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalName) || '.jpg';
  const uniqueId = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const filename = `${uniqueId}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, fileBuffer);

  return {
    url: `/uploads/${filename}`,
    public_id: `local_${filename}`,
  };
};

/**
 * Delete an image by public_id from Cloudinary or local fallback
 * @param {string} public_id
 * @returns {Promise<boolean>}
 */
const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return false;

  if (isCloudinaryConfigured && !public_id.startsWith('local_')) {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result.result === 'ok';
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err);
      return false;
    }
  }

  // Fallback local deletion
  if (public_id.startsWith('local_')) {
    try {
      const filename = public_id.replace('local_', '');
      const filePath = path.join(__dirname, '../../public/uploads', filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return true;
    } catch (err) {
      console.error('Error deleting local upload:', err);
      return false;
    }
  }

  return true;
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
};

