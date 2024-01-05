"use strict";
// user.model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    eth: String,
    diamond: Number,
    coupon: Number,
    coupon2: Number,
    profilename: String,
    profilepic: Number,
    stamina: Number,
    battlepoint: { type: Number, default: 0 },
    arenastamina: Number
    // other fields as required
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.UserModel = UserModel;
