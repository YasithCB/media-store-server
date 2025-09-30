import * as CategoryModel from "../models/categoryModel.js";
import {error, success} from "../helpers/response.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAllCategories();
        return success(res, categories, "Categories fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await CategoryModel.getCategoryById(id);
        if (!category) return error(res, "Category not found", 404);
        return success(res, category, "Category fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const createCategory = async (req, res) => {
    const { name, description, icon, image } = req.body;
    try {
        const categoryId = await CategoryModel.createCategory(name, description, icon, image);
        return success(res, { category_id: categoryId }, "Category created successfully", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, icon, image } = req.body;
    try {
        const affectedRows = await CategoryModel.updateCategory(id, name, description, icon, image);
        if (affectedRows === 0) return error(res, "Category not found", 404);
        return success(res, null, "Category updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await CategoryModel.deleteCategory(id);
        if (affectedRows === 0) return error(res, "Category not found", 404);
        return success(res, null, "Category deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
