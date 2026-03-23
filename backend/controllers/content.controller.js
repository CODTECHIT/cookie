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
    const imageUrl = req.file?.path || req.body.imageUrl;
    const imagePublicId = req.file?.filename || '';
    const banner = await Banner.create({ ...req.body, imageUrl, imagePublicId });
    successResponse(res, banner, 'Banner created', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const updateBanner = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) { update.imageUrl = req.file.path; update.imagePublicId = req.file.filename; }
    const banner = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!banner) return errorResponse(res, 'Banner not found', 404);
    successResponse(res, banner, 'Banner updated');
  } catch (err) {
    errorResponse(res, err.message);
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
    const update = { ...req.body };
    if (req.file) update.logoUrl = req.file.path;
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(update);
    } else {
      Object.assign(settings, update);
      await settings.save();
    }
    successResponse(res, settings, 'Settings updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
