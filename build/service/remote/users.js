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
exports.toggleOnline = exports.updateUser = exports.addUser = exports.userExist = exports.findUserByName = exports.findManyUsers = exports.findUserById = exports.findAllUsers = void 0;
const types_1 = require("../../types");
const user_1 = __importDefault(require("../../db/models/user"));
const helpers_1 = require("../../utils/helpers");
const parseResponse = (document) => ({
    userId: document.userId,
    userName: document.userName,
    createdLists: [...document.createdLists],
    subscribedLists: [...document.subscribedLists],
    online: document.online,
});
exports.findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    return users.map((el) => parseResponse(el));
});
exports.findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield user_1.default.findOne({ userId: id });
    if (!document)
        return helpers_1.errorMessage(types_1.Message.USER_NOT_FOUND);
    return parseResponse(document);
});
exports.findManyUsers = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({ userId: { $in: arr } });
    if (users.length === 0)
        helpers_1.errorMessage(types_1.Message.USER_NOT_FOUND);
    return users.map((el) => parseResponse(el));
});
exports.findUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield user_1.default.findOne({ userName: name });
    if (!document)
        return helpers_1.errorMessage(types_1.Message.USER_NOT_FOUND);
    return parseResponse(document);
});
exports.userExist = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield user_1.default.findOne({ userName: name });
    if (!document)
        return false;
    return true;
});
exports.addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield new user_1.default(user).save();
    return parseResponse(document);
});
exports.updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield user_1.default.findOneAndUpdate({ userId: user.userId }, {
        createdLists: user.createdLists,
        subscribedLists: user.subscribedLists,
    }, { new: true, useFindAndModify: false });
    if (!document)
        return helpers_1.errorMessage(types_1.Message.USER_NOT_FOUND);
    return parseResponse(document);
});
exports.toggleOnline = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield user_1.default.findOneAndUpdate({ userId: user.userId }, {
        online: !user.online,
    }, { new: true, useFindAndModify: false });
    if (!document)
        return helpers_1.errorMessage(types_1.Message.USER_NOT_FOUND);
    return parseResponse(document);
});
