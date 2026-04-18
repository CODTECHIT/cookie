import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const PRODUCT_MAX_FILE_SIZE_MB = Number(
  process.env.PRODUCT_MAX_FILE_SIZE_MB || 4,
);
const BANNER_MAX_FILE_SIZE_MB = Number(
  process.env.BANNER_MAX_FILE_SIZE_MB || 4,
);
const LOGO_MAX_FILE_SIZE_MB = Number(process.env.LOGO_MAX_FILE_SIZE_MB || 1);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product image storage
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "daksha_food/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  },
});

// Banner image storage
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "daksha_food/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1920, height: 600, crop: "limit", quality: "auto" },
    ],
  },
});

// Logo storage
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "daksha_food/settings",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
});

export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: PRODUCT_MAX_FILE_SIZE_MB * 1024 * 1024 },
});

export const uploadBannerImage = multer({
  storage: bannerStorage,
  limits: { fileSize: BANNER_MAX_FILE_SIZE_MB * 1024 * 1024 },
});

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: LOGO_MAX_FILE_SIZE_MB * 1024 * 1024 },
});
export { cloudinary };
