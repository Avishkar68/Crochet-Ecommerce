import Category from '../models/Category.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({}).lean();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}
