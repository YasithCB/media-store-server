import * as subCategoryModel from "../models/subCategoryModel.js";
import {error, success} from "../helpers/response.js";

// GET all subcategories
export const getSubCategories = async (req, res) => {
    try {
        const data = await subCategoryModel.getAllSubCategories();
        return success(res, data);
    } catch (err) {
        return error(res, err.message);
    }
};

export const getSubCategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const data = await subCategoryModel.getSubCategoriesByCategoryId(categoryId);
        return success(res, data, "Subcategories fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};


// GET subcategory by ID
export const getSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await subCategoryModel.getSubCategoryById(id);
        if (!data) return error(res, "Subcategory not found", 404);
        return success(res, data);
    } catch (err) {
        return error(res, err.message);
    }
};

// CREATE subcategory
export const addSubCategory = async (req, res) => {
    try {
        const { category_id, name, description, image } = req.body;
        const result = await subCategoryModel.createSubCategory({ category_id, name, description, image });
        return success(res, result, "Subcategory created", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

// UPDATE subcategory
export const editSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, image } = req.body;
        const result = await subCategoryModel.updateSubCategory(id, { category_id, name, description, image });
        if (!result) return error(res, "Update failed", 400);
        return success(res, { updated: result }, "Subcategory updated");
    } catch (err) {
        return error(res, err.message);
    }
};

// DELETE subcategory
export const removeSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await subCategoryModel.deleteSubCategory(id);
        if (!result) return error(res, "Delete failed", 400);
        return success(res, { deleted: result }, "Subcategory deleted");
    } catch (err) {
        return error(res, err.message);
    }
};
