"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterOldSchema = exports.CharacterSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CharacterSchema = new mongoose_1.Schema({
    level: { type: Number, required: true },
    exp: { type: Number, required: true },
    rarity: { type: String, required: true },
    name: { type: String, required: true },
    job: { type: String, required: true },
    uid: { type: String, required: true },
    hp: { type: Number, required: true },
    sp: { type: Number, required: true },
    range: { type: Number, required: true },
    speed: { type: Number, required: true },
    attributes: { type: mongoose_1.Schema.Types.Mixed, required: true },
    equipments: { type: mongoose_1.Schema.Types.Mixed, required: true },
    skill_equip: { type: mongoose_1.Schema.Types.Mixed, required: true },
    bonus: { type: mongoose_1.Schema.Types.Mixed, required: true },
    free: { type: Boolean, required: true },
    ethAddress: { type: String, required: true },
    statPoint: { type: Number, required: true },
    team1: { type: Number, required: true },
    treasure1: { type: Number, required: true },
    treasure2: { type: Number, required: true },
    treasure3: { type: Number, required: true },
    star: { type: Number, required: true, default: 0 },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now }
});
exports.CharacterOldSchema = new mongoose_1.Schema({
    level: { type: Number, required: true },
    rarity: { type: String, required: true },
    name: { type: String, required: true },
    job: { type: String, required: true },
    uid: { type: String, required: true },
    range: { type: Number, required: true },
    bonus: { type: mongoose_1.Schema.Types.Mixed, required: true },
    cbt: { type: Boolean, required: true },
    ethAddress: { type: String, required: true },
    _created_at: { type: Date, default: Date.now },
    _updated_at: { type: Date, default: Date.now },
    str: { type: Number, required: true },
    agi: { type: Number, required: true },
    int: { type: Number, required: true },
    vit: { type: Number, required: true },
    dex: { type: Number, required: true },
    luk: { type: Number, required: true },
    spMax: { type: Number, required: true },
    hpMax: { type: Number, required: true },
});
exports.CharacterSchema.pre('save', function (next) {
    this.updated_date = Date.now();
    next();
});
