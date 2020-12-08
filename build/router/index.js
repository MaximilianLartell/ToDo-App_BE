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
const service_1 = require("../service");
const users_1 = require("../service/remote/users");
const lists_1 = require("../service/remote/lists");
const items_1 = require("../service/remote/items");
const typeGuards_1 = require("../types/typeGuards");
const helpers_1 = require("../utils/helpers");
const router = express_1.default.Router();
router.post('/auth/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        const auth = yield service_1.validateCredentials(credentials);
        if (typeGuards_1.isError(auth)) {
            res.statusCode = 403;
            res.json(auth);
        }
        else {
            const user = yield service_1.signIn(credentials.userName);
            res.json(user);
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.json(err.message);
    }
}));
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = req.body;
    try {
        const user = yield service_1.createUser(credentials);
        if (typeGuards_1.isError(user)) {
            res.statusCode = 400;
            res.json(user);
        }
        else {
            res.json(user);
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.json(err.message);
    }
}));
router.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield users_1.findUserById(id);
        if (typeGuards_1.isError(user)) {
            res.statusCode = 400;
            res.json(user);
        }
        else {
            res.json(user);
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.json(err.message);
    }
}));
router.get('/lists/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = helpers_1.reqIdParser(req.params.id);
    try {
        const lists = yield lists_1.findManyLists(ids);
        res.json(lists);
    }
    catch (err) {
        res.statusCode = 500;
        res.json(err.message);
    }
}));
router.get('/items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = helpers_1.reqIdParser(req.params.id);
    try {
        const items = yield items_1.findManyItems(ids);
        res.json(items);
    }
    catch (err) {
        res.statusCode = 500;
        res.json(err.message);
    }
}));
exports.default = router;
