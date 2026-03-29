import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });
    successResponse(res, categories);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive, sortOrder } = req.body;
    const image = req.file?.path || '';
    const category = await Category.create({ name, slug, description, image, isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true, sortOrder: sortOrder || 0 });
    successResponse(res, category, 'Category created', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.image = req.file.path;
    if (update.isActive !== undefined) {
      update.isActive = update.isActive === 'true' || update.isActive === true;
    }
    if (update.sortOrder !== undefined) {
      update.sortOrder = Number(update.sortOrder) || 0;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!category) return errorResponse(res, 'Category not found', 404);
    successResponse(res, category, 'Category updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Category deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
