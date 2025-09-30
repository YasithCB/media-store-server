import * as UserModel from "../models/userModel.js";
import { success, error } from "../helpers/response.js";

// get all users
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        return success(res, users, "Users fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// get user by id
export const getUser = async (req, res) => {
    try {
        const user = await UserModel.getUserById(req.params.id);
        if (!user) return error(res, "User not found", 404);
        return success(res, user, "User fetched successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// create user
export const createUser = async (req, res) => {
    try {
        const newUser = await UserModel.createUser(req.body);
        return success(res, newUser, "User created successfully", 201);
    } catch (err) {
        return error(res, err.message);
    }
};

// update user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.updateUser(req.params.id, req.body);
        return success(res, updatedUser, "User updated successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

// delete user
export const deleteUser = async (req, res) => {
    try {
        await UserModel.deleteUser(req.params.id);
        return success(res, null, "User deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};
