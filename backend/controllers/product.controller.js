import Product from '../models/Product.js';
import { cloudinary } from '../middleware/upload.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/products  (public + admin)
export const getProducts = async (req, res) => {
  try {
    const { category, featured, lowStock, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (category) {
      const categoryIds = category.split(',').filter(id => id.length === 24); // Ensure valid hex ObjectId format
      if (categoryIds.length > 1) {
        filter.categoryId = { $in: categoryIds };
      } else if (categoryIds.length === 1) {
        filter.categoryId = categoryIds[0];
      }
    }
    if (featured === 'true') filter.isFeatured = true;
    if (lowStock === 'true') filter.totalStock = { $lte: 10 }; // Assuming low stock is total sum or similar
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate('categoryId', 'name slug').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    successResponse(res, { products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name slug');
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, product);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/products  (admin)
export const createProduct = async (req, res) => {
  try {
    const { 
      name, slug, categoryId, description, shortDescription, 
      variants, tags, isFeatured, metaTitle, metaDescription 
    } = req.body;

    // Build images array from uploaded files
    const images = (req.files || []).map((file, idx) => ({
      url: file.path,
      publicId: file.filename,
      isMain: idx === 0,
    }));

    let parsedVariants = [];
    try {
      if (variants) {
        parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      }
    } catch {
      return errorResponse(res, 'Invalid variants data format', 400);
    }

    let parsedTags = [];
    try {
      if (tags) {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      }
    } catch {
      parsedTags = [];
    }

    // Auto-generate slug if missing
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      name, 
      slug: finalSlug, 
      categoryId, 
      description, 
      shortDescription,
      images, 
      variants: parsedVariants,
      tags: parsedTags,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      metaTitle, 
      metaDescription,
    });

    successResponse(res, product, 'Product created successfully', 201);
  } catch (err) {
    console.error('❌ Create Product Error:', err);
    
    // Handle Mongoose specific errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    if (err.code === 11000) {
      return errorResponse(res, 'Slug or duplicate key already exists', 400);
    }
    
    errorResponse(res, err.message || 'Error occurred while creating product');
  }
};

// PUT /api/products/:id  (admin)
export const updateProduct = async (req, res) => {
  try {
    const { variants, tags, isFeatured } = req.body;
    const update = { ...req.body };

    if (variants) {
      try {
        update.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch {
        return errorResponse(res, 'Invalid variants data format', 400);
      }
    }

    if (tags) {
      try {
        update.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        // Ignore tag parsing errors
      }
    }

    if (isFeatured !== undefined) {
      update.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // Append new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        isMain: false,
      }));
      update.$push = { images: { $each: newImages } };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return errorResponse(res, 'Product not found', 404);
    successResponse(res, product, 'Product updated successfully');
  } catch (err) {
    console.error('❌ Update Product Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return errorResponse(res, messages.join(', '), 400);
    }
    errorResponse(res, err.message || 'Error occurred while updating product');
  }
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);

    // Delete images from Cloudinary
    for (const img of product.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }
    await product.deleteOne();
    successResponse(res, null, 'Product deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PATCH /api/products/:id/stock  (admin — quick stock update)
export const updateStock = async (req, res) => {
  try {
    const { variantIndex, stockQty } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, 'Product not found', 404);
    product.variants[variantIndex].stockQty = stockQty;
    await product.save();
    successResponse(res, product, 'Stock updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
