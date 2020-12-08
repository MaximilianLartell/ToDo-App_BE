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
exports.deleteList = exports.signOut = exports.signIn = exports.deleteItem = exports.toggleDone = exports.createItem = exports.validateCredentials = exports.createList = exports.createUser = void 0;
const users_1 = require("./remote/users");
const lists_1 = require("./remote/lists");
const items_1 = require("./remote/items");
const passwords_1 = require("./remote/passwords");
const types_1 = require("../types");
const typeGuards_1 = require("../types/typeGuards");
const helpers_1 = require("../utils/helpers");
const passwords_2 = require("./remote/passwords");
// CONNECT = 'connect',
// DISCONNECT = 'disconnect',
// CREATE_USER = 'create_user', [X]
// SIGN_IN = 'sign_in', [X]
// SIGN_OUT = 'sign_out',
// CREATE_LIST = 'create_list' [X],
// JOIN_LIST = 'join_list', [X]
// REMOVE_LIST = 'remove_list',
// NEW_ITEM = 'new_item', [X]
// REMOVE_ITEM = 'remove_item',
// MARK_DONE = 'mark_done' [X],
exports.createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = newUser;
    const userCheck = yield users_1.findUserByName(userName);
    if (typeGuards_1.isUser(userCheck))
        return helpers_1.errorMessage(types_1.Message.NAME_TAKEN);
    const user = helpers_1.formatNewUser(newUser);
    const passwordObj = { userId: user.userId, password };
    yield passwords_2.addPassword(passwordObj);
    return yield users_1.addUser(user);
});
exports.createList = (newList) => __awaiter(void 0, void 0, void 0, function* () {
    const { creatorId } = newList;
    const list = helpers_1.formatNewList(newList);
    const user = yield users_1.findUserById(creatorId);
    if (typeGuards_1.isError(user))
        return user;
    yield users_1.updateUser(Object.assign(Object.assign({}, user), { createdLists: [...user.createdLists, list.listId] }));
    return yield lists_1.addList(list);
});
exports.validateCredentials = ({ userName, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.findUserByName(userName);
    if (typeGuards_1.isError(user))
        return user;
    const correctPassword = yield passwords_1.findPasswordByUserId(user.userId);
    if (password !== correctPassword.password)
        return helpers_1.errorMessage(types_1.Message.WRONG_PASSWORD);
    return true;
});
exports.createItem = (newItem) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId } = newItem;
    const item = helpers_1.formatNewItem(newItem);
    const list = yield lists_1.findListById(listId);
    if (typeGuards_1.isError(list))
        return list;
    yield lists_1.updateList(Object.assign(Object.assign({}, list), { items: [...list.items, item.itemId] }));
    return yield items_1.addItem(item);
});
exports.toggleDone = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield items_1.findItemById(itemId);
    if (typeGuards_1.isError(item))
        return item;
    return yield items_1.updateItem(item);
});
exports.deleteItem = (itemId, listId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield items_1.removeItem(itemId);
    const list = yield lists_1.findListById(listId);
    if (typeGuards_1.isError(item))
        return item;
    if (typeGuards_1.isError(list))
        return list;
    const listItems = list.items.filter((el) => el !== itemId);
    yield lists_1.updateList(Object.assign(Object.assign({}, list), { items: listItems }));
    return item;
});
exports.signIn = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield users_1.findUserByName(userName);
    if (typeGuards_1.isError(res))
        return res;
    if (!res.online)
        return yield users_1.toggleOnline(res);
    else
        return res;
});
exports.signOut = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield users_1.toggleOnline(user);
    }
    catch (err) {
        return helpers_1.errorMessage(err.message);
    }
});
exports.deleteList = (listId) => __awaiter(void 0, void 0, void 0, function* () {
    const removedList = yield lists_1.removeList(listId);
    if (typeGuards_1.isError(removedList))
        return removedList;
    yield items_1.removeManyItems(removedList.items);
    return removedList;
});
