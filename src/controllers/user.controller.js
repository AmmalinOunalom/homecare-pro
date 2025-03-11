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
exports.show_all_user = exports.create_user = void 0;
const user_model_1 = require("../model/user.model");
const create_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, first_name, last_name, email, tel, password, gender, status, create_at, update_at, } = req.body;
    try {
        const user = yield user_model_1.user_model.create(req.body);
        res.status(200).send("User created successfully");
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.create_user = create_user;
const show_all_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.user_model.show_all();
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
exports.show_all_user = show_all_user;
