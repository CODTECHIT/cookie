import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product image storage
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'daksha_food/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// Banner image storage
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'daksha_food/banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 600, crop: 'limit', quality: 'auto' }],
  },
});

// Logo storage
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'daksha_food/settings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
  },
});

export const uploadProductImages = multer({ 
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadBannerImage = multer({ 
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadLogo = multer({ 
  storage: logoStorage,
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB
});
export { cloudinary };
