"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessagesSchema = new mongoose_1.default.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
const MessagesModel = mongoose_1.default.model('messages', MessagesSchema);
exports.default = MessagesModel;
