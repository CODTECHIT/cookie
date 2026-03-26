import Banner from '../models/Banner.js';
import SiteSetting from '../models/SiteSetting.js';
import { cloudinary } from '../middleware/upload.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ---- BANNERS ----

export const getBanners = async (req, res) => {
  try {
    const { position, active } = req.query;
    const filter = {};
    if (position) filter.position = position;
    if (active === 'true') {
      const now = new Date();
      filter.isActive = true;
      filter.$or = [{ showFrom: { $lte: now } }, { showFrom: null }];
      filter.$and = [{ $or: [{ showUntil: { $gte: now } }, { showUntil: null }] }];
    }
    const banners = await Banner.find(filter).sort({ sortOrder: 1 });
    successResponse(res, banners);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, position, isActive, sortOrder } = req.body;
    
    // In multipart forms, files are in req.file. If no file, try raw URL from req.body
    const imageUrl = req.file?.path || req.body.imageUrl || req.body.image;
    const imagePublicId = req.file?.filename || req.body.imagePublicId || '';

    if (!imageUrl) {
      return errorResponse(res, 'Banner image asset is required', 400);
    }

    // Determine numerical sortOrder
    const finalSortOrder = Number(sortOrder || req.body.sortOrder || 0);

    const banner = await Banner.create({
      title,
      subtitle,
      imageUrl,
      imagePublicId,
      linkUrl: link || req.body.linkUrl,
      position: position || 'hero',
      sortOrder: isNaN(finalSortOrder) ? 0 : finalSortOrder,
      isActive: isActive === 'true' || isActive === true
    });

    successResponse(res, banner, 'Visual asset deployed successfully', 201);
  } catch (err) {
    console.error('❌ Create Banner Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    errorResponse(res, err.message || 'Error occurred while creating banner');
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { link, isActive, sortOrder } = req.body;
    const update = { ...req.body };

    // Handle image file or raw field updates
    if (req.file) { 
        update.imageUrl = req.file.path; 
        update.imagePublicId = req.file.filename; 
    } else if (req.body.image) {
        update.imageUrl = req.body.image;
    }

    // Correctly map fields and check for NaN
    if (link) update.linkUrl = link;
    if (isActive !== undefined) update.isActive = isActive === 'true' || isActive === true;
    
    // Explicitly update position if provided
    if (req.body.position) update.position = req.body.position;
    
    const finalSortOrder = Number(sortOrder || req.body.sortOrder);
    if (!isNaN(finalSortOrder)) {
        update.sortOrder = finalSortOrder;
    } else {
        delete update.sortOrder; // Don't try to update with NaN
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!banner) return errorResponse(res, 'Banner not found', 404);
    successResponse(res, banner, 'Visual asset updated successfully');
  } catch (err) {
    console.error('❌ Update Banner Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    errorResponse(res, err.message || 'Error occurred while updating banner');
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner?.imagePublicId) await cloudinary.uploader.destroy(banner.imagePublicId);
    await banner?.deleteOne();
    successResponse(res, null, 'Banner deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// ---- SITE SETTINGS ----

export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    successResponse(res, settings);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { brandName, email, phone, whatsapp, address, seoTitle, seoDescription } = req.body;
    const update = { 
        brandName, 
        email, 
        phone, 
        whatsapp, 
        address, 
        seoTitle, 
        seoDescription 
    };

    if (req.file) {
        update.logoUrl = req.file.path;
    }

    // Use findOneAndUpdate with upsert: true to create if not exists
    const settings = await SiteSetting.findOneAndUpdate(
      {}, 
      { $set: update }, 
      { new: true, upsert: true, runValidators: true }
    );

    successResponse(res, settings, 'Global identity updated successfully');
  } catch (err) {
    console.error('❌ Update Settings Error:', err);
    errorResponse(res, err.message || 'Error occurred while updating site settings');
  }
};
