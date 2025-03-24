"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_address_user = exports.update_address_user = exports.show_all_address_users = exports.create_address_user = void 0;
const address_users_model_1 = require("../model/address_users.model");
/**
 * Create a new address_user
 */
const create_address_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressUserData = req.body;
        const addressUser = yield address_users_model_1.address_user_model.create_address_user(addressUserData);
        res.status(201).send("Address user created successfully");
    }
    catch (error) {
        res.status(500).send("Failed to create address user");
    }
});
exports.create_address_user = create_address_user;
/**
 * Retrieve all address_users
 */
const show_all_address_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressUsers = yield address_users_model_1.address_user_model.show_all_address_users();
        res.status(200).send(addressUsers);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_address_users = show_all_address_users;
/**
 * Update an address_user
 */
const update_address_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedAddressUser = yield address_users_model_1.address_user_model.update_address_user(Number(id), req.body);
        if (updatedAddressUser) {
            res.status(200).send("Address user updated successfully");
        }
        else {
            res.status(404).send("Address user not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to update address user");
    }
});
exports.update_address_user = update_address_user;
/**
 * Delete an address_user
 */
const delete_address_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedAddressUser = yield address_users_model_1.address_user_model.delete_address_user(Number(id));
        if (deletedAddressUser) {
            res.status(200).send("Address user deleted successfully");
        }
        else {
            res.status(404).send("Address user not found");
        }
    }
    catch (error) {
        res.status(500).send("Failed to delete address user");
    }
});
exports.delete_address_user = delete_address_user;
