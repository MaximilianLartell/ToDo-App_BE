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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPassword = exports.findPasswordByUserId = void 0;
const types_1 = require("../../types");
const password_1 = __importDefault(require("../../db/models/password"));
const parseResponse = (document) => ({
    userId: document.userId,
    password: document.password,
});
exports.findPasswordByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield password_1.default.findOne({ userId: id });
    if (!document)
        throw new Error(types_1.Message.NOT_FOUND);
    return parseResponse(document);
});
exports.addPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield new password_1.default(password).save();
    return parseResponse(document);
});
