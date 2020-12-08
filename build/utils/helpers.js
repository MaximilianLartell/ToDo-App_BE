"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqIdParser = exports.formatNewItem = exports.formatNewList = exports.formatNewUser = exports.errorMessage = void 0;
exports.errorMessage = (message) => ({
    type: 'Error',
    message,
});
exports.formatNewUser = (newUser) => {
    const { userName } = newUser;
    return {
        userId: createId(),
        userName: userName,
        createdLists: [],
        subscribedLists: [],
        online: true,
    };
};
exports.formatNewList = (newList) => {
    const { creatorId, listName } = newList;
    return {
        listId: createId(),
        listName,
        creatorId: creatorId,
        users: [creatorId],
        items: [],
    };
};
exports.formatNewItem = ({ creatorId, listId, description, }) => {
    return {
        itemId: createId(),
        creatorId: creatorId,
        description: description,
        listId: listId,
        done: false,
    };
};
const createId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 15; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
};
exports.reqIdParser = (str) => {
    return str.split(',');
};
