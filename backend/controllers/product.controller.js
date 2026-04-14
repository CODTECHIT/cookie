import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { cloudinary } from "../middleware/upload.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/products  (public + admin)
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      lowStock,
      page = 1,
      limit = 20,
      search,
    } = req.query;
    const filter = {};
    if (category) {
      const Category = (await import("../models/Category.js")).default;
      const parts = category.split(",");
      const ids = parts.filter(
        (p) => p.length === 24 && /^[0-9a-fA-F]{24}$/.test(p),
      );
      const slugs = parts.filter(
        (p) => p.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(p),
      );

      let finalIds = [...ids];
      if (slugs.length > 0) {
        const categoriesFromSlugs = await Category.find({
          slug: { $in: slugs },
        }).select("_id");
        finalIds = [...finalIds, ...categoriesFromSlugs.map((c) => c._id)];
      }

      if (finalIds.length > 1) {
        filter.categoryId = { $in: finalIds };
      } else if (finalIds.length === 1) {
        filter.categoryId = finalIds[0];
      }
    }
    if (featured === "true") filter.isFeatured = true;
    if (lowStock === "true") filter.totalStock = { $lte: 10 }; // Assuming low stock is total sum or similar
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .select(
          "name slug description shortDescription images variants isFeatured price totalStock avgRating reviewCount isActive tags metaTitle metaDescription lowStockThreshold",
        )
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean(),
      Product.countDocuments(filter),
    ]);
    successResponse(res, {
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/products/:idOrSlug
export const getProductById = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    let product;

    // Check if it's a valid MongoDB ObjectId
    if (idOrSlug.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      product = await Product.findById(idOrSlug)
        .populate("categoryId", "name slug")
        .lean();
    } else {
      product = await Product.findOne({ slug: idOrSlug })
        .populate("categoryId", "name slug")
        .lean();
    }

    if (!product) return errorResponse(res, "Product not found", 404);

    const reviews = await Review.find({ productId: product._id })
      .populate("customerId", "name")
      .select("rating comment status createdAt customerId")
      .sort({ createdAt: -1 })
      .lean();

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      userId: r.customerId,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.status === "Approved",
      createdAt: r.createdAt,
    }));

    successResponse(res, { ...product, reviews: formattedReviews });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/products  (admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      categoryId,
      description,
      shortDescription,
      variants,
      tags,
      isFeatured,
      metaTitle,
      metaDescription,
    } = req.body;

    // Build images array from uploaded files
    // ✅ Ensure Cloudinary URLs are used (secure_url is the Cloudinary secure URL)
    const images = (req.files || []).map((file, idx) => {
      // Use secure_url from Cloudinary response, fallback to path
      const cloudinaryUrl = file.secure_url || file.path;
      if (!cloudinaryUrl || cloudinaryUrl.includes("localhost")) {
        throw new Error(
          `Invalid image URL returned: ${cloudinaryUrl}. Check Cloudinary configuration.`,
        );
      }
      return {
        url: cloudinaryUrl,
        publicId: file.filename,
        isMain: idx === 0,
      };
    });

    let parsedVariants = [];
    try {
      if (variants) {
        parsedVariants =
          typeof variants === "string" ? JSON.parse(variants) : variants;
      }
    } catch {
      return errorResponse(res, "Invalid variants data format", 400);
    }

    let parsedTags = [];
    try {
      if (tags) {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      }
    } catch {
      parsedTags = [];
    }

    const finalSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const product = await Product.create({
      name,
      slug: finalSlug,
      categoryId,
      description,
      shortDescription,
      images,
      variants: parsedVariants,
      tags: parsedTags,
      isFeatured: isFeatured === "true" || isFeatured === true,
      metaTitle,
      metaDescription,
    });

    successResponse(res, product, "Product created successfully", 201);
  } catch (err) {
    console.error("❌ Create Product Error:", err);

    // Handle Mongoose specific errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return errorResponse(res, messages.join(", "), 400);
    }
    if (err.code === 11000) {
      return errorResponse(res, "Slug or duplicate key already exists", 400);
    }

    errorResponse(res, err.message || "Error occurred while creating product");
  }
};

// PUT /api/products/:id  (admin)
export const updateProduct = async (req, res) => {
  try {
    const { variants, tags, isFeatured, existingImages: existingImagesRaw } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, "Product not found", 404);

    // Update fields from req.body
    const allowedFields = [
      "name",
      "slug",
      "description",
      "shortDescription",
      "categoryId",
      "isActive",
      "lowStockThreshold",
      "discount",
    ];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'slug') {
          product[field] = req.body[field]
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        } else {
          product[field] = req.body[field];
        }
      }
    }

    if (variants) {
      try {
        const parsed = typeof variants === "string" ? JSON.parse(variants) : variants;
        product.variants = parsed;
      } catch {
        return errorResponse(res, "Invalid variants data format", 400);
      }
    }

    if (tags) {
      try {
        const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
        product.tags = Array.isArray(parsedTags) 
          ? parsedTags.filter(t => t && t.trim() !== "") 
          : [];
      } catch {
        // Fallback or ignore
      }
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    // 📸 Handle Image Management (Add/Remove)
    let finalImages = product.images;

    // If admin sent a specific list of remaining images, use that
    if (existingImagesRaw) {
      try {
        finalImages = typeof existingImagesRaw === "string" 
          ? JSON.parse(existingImagesRaw) 
          : existingImagesRaw;
      } catch (err) {
        console.error("Failed to parse existingImagesRaw", err);
      }
    }

    // Append new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => {
        const cloudinaryUrl = file.secure_url || file.path;
        return {
          url: cloudinaryUrl,
          publicId: file.filename,
          isMain: false,
        };
      });
      finalImages = [...finalImages, ...newImages];
    }
    
    // Ensure at least one image is main if images exist
    if (finalImages.length > 0 && !finalImages.some(img => img.isMain)) {
      finalImages[0].isMain = true;
    }

    product.images = finalImages;

    await product.save();
    successResponse(res, product, "Product updated successfully");
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    errorResponse(res, err.message || "Error occurred while updating product");
  }
};

// DELETE /api/products/:id  (admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    console.log(`🗑️ Deletion request received for: ${idOrSlug}`);

    let product;
    // Check if it's a valid MongoDB ObjectId
    if (idOrSlug.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      product = await Product.findById(idOrSlug);
    } else {
      // Fallback: search by slug if the parameter isn't a valid ObjectId
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      console.warn(`⚠️ Product not found for deletion: ${idOrSlug}`);
      return errorResponse(res, `Product not found: ${idOrSlug}`, 404);
    }

    // ⚡ Resilience Fix: Try deleting images from Cloudinary, but don't fail the whole request if it fails
    if (product.images && product.images.length > 0) {
      try {
        await Promise.all(
          product.images
            .filter((img) => img.publicId)
            .map((img) => cloudinary.uploader.destroy(img.publicId)),
        );
      } catch (cloudErr) {
        console.error(
          "⚠️ Cloudinary cleanup failed during product deletion:",
          cloudErr.message,
        );
      }
    }

    await product.deleteOne();
    successResponse(res, null, "Product deleted successfully");
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    errorResponse(res, err.message || "Failed to delete product");
  }
};

// PATCH /api/products/:id/stock  (admin — quick stock update)
export const updateStock = async (req, res) => {
  try {
    const { variantIndex, stockQty } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, "Product not found", 404);
    product.variants[variantIndex].stockQty = stockQty;
    await product.save();
    successResponse(res, product, "Stock updated");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/products/:id/reviews  (public — approved reviews for a product)
export const getProductReviews = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    const product =
      idOrSlug.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrSlug)
        ? await Product.findById(idOrSlug)
        : await Product.findOne({ slug: idOrSlug });
    if (!product) return errorResponse(res, "Product not found", 404);

    const reviews = await Review.find({ productId: product._id })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    const formatted = reviews.map((r) => ({
      _id: r._id,
      userId: r.customerId,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.status === "Approved",
      createdAt: r.createdAt,
    }));

    successResponse(res, formatted);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/products/:id/reviews  (customer submits review)
export const createProductReview = async (req, res) => {
  try {
    const { id: idOrSlug } = req.params;
    const { rating, comment } = req.body;
    const product =
      idOrSlug.length === 24 && /^[0-9a-fA-F]{24}$/.test(idOrSlug)
        ? await Product.findById(idOrSlug)
        : await Product.findOne({ slug: idOrSlug });
    if (!product) return errorResponse(res, "Product not found", 404);

    const review = await Review.create({
      productId: product._id,
      customerId: req.user._id,
      rating,
      comment,
    });

    successResponse(res, review, "Review submitted", 201);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return errorResponse(res, messages.join(", "), 400);
    }
    errorResponse(res, err.message);
  }
};

// POST /api/products/sync - Bulk fetch products by ID for cart synchronization
export const syncProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return errorResponse(res, "Invalid product IDs", 400);

    const products = await Product.find({ 
      _id: { $in: ids },
      isActive: { $ne: false } // Only return active products
    }).select("name variants images shortDescription totalStock");

    successResponse(res, products);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
