import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';

export const uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `classloop/${folder}`,
      resource_type: resourceType,
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    logger.error('Cloudinary upload error:', err.message);
    throw new Error('Media upload failed');
  }
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    logger.error('Cloudinary delete error:', err.message);
  }
};
