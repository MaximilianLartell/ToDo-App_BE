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
const express_1 = __importDefault(require("express"));
require("./config");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./db"));
const types_1 = require("./types");
const typeGuards_1 = require("./types/typeGuards");
const service_1 = require("./service");
const users_1 = require("./service/remote/users");
const socket_io_1 = __importDefault(require("socket.io"));
const router_1 = __importDefault(require("./router"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const lists_1 = require("./service/remote/lists");
const PORT = process.env.PORT || 8000;
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
db_1.default.connect();
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use('/api', router_1.default);
io.on('connect', (socket) => {
    socket.emit('connect');
    socket.on(types_1.Events.CREATE_LIST, (newList) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const created = yield service_1.createList(newList);
            if (typeGuards_1.isList(created)) {
                const updatedUser = yield users_1.findUserById(created.creatorId);
                socket.emit(types_1.Events.CREATE_LIST, created, updatedUser);
            }
            else {
                socket.emit('error', created.message);
            }
        }
        catch (err) {
            socket.emit('error', err.message);
        }
    }));
    socket.on(types_1.Events.JOIN_LIST, (listId) => {
        socket.join(listId);
        io.to(listId).emit(types_1.Events.JOIN_LIST, `Someone joined ${listId}`);
    });
    socket.on(types_1.Events.NEW_ITEM, (newItem) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const created = yield service_1.createItem(newItem);
            if (typeGuards_1.isItem(created)) {
                const updatedList = yield lists_1.findListById(created.listId);
                io.to(newItem.listId).emit(types_1.Events.NEW_ITEM, created, updatedList);
            }
            else {
                socket.emit('error', created.message);
            }
        }
        catch (err) {
            socket.emit('error', err.message);
        }
    }));
    socket.on(types_1.Events.TOGGLE_DONE, (itemId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const item = yield service_1.toggleDone(itemId);
            if (typeGuards_1.isItem(item)) {
                io.to(item.listId).emit(types_1.Events.TOGGLE_DONE, item);
            }
            else {
                socket.emit('error', item.message);
            }
        }
        catch (err) {
            socket.emit('error', err.message);
        }
    }));
    socket.on(types_1.Events.REMOVE_ITEM, (itemId, listId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const removedItem = yield service_1.deleteItem(itemId, listId);
            if (typeGuards_1.isItem(removedItem)) {
                io.to(listId).emit(types_1.Events.REMOVE_ITEM, removedItem);
            }
            else {
                socket.emit('error', removedItem.message);
            }
        }
        catch (err) {
            socket.emit('error', err.message);
        }
    }));
    socket.on(types_1.Events.REMOVE_LIST, (listId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const removedList = yield service_1.deleteList(listId);
            if (typeGuards_1.isList(removedList)) {
                io.emit(types_1.Events.REMOVE_LIST, removedList);
            }
            else {
                socket.emit('error', removedList.message);
            }
        }
        catch (err) {
            socket.emit('error', err.message);
        }
    }));
    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
    });
});
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
