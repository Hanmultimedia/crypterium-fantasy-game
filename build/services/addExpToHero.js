"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpNextLevel = exports.addExpToHero = exports.LevelupLogSchema = exports.ExperienceLogSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const character_schema_1 = require("./character.schema");
const CharacterModel = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
exports.ExperienceLogSchema = new mongoose_1.Schema({
    characterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Character', required: true },
    amount: { type: Number, required: true },
    ethAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.LevelupLogSchema = new mongoose_1.Schema({
    characterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Character', required: true },
    level: { type: Number, required: true },
    exp: { type: Number, required: true },
    ethAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const ExperienceLogModel = mongoose_1.default.model('ExperienceLog', exports.ExperienceLogSchema);
const LevelupLogModel = mongoose_1.default.model('LevelupLog', exports.LevelupLogSchema);
async function addExpToHero(eth, hero, exp) {
    if (!exp)
        return;
    let level = hero.level;
    if (hero.exp + exp >= getExpNextLevel(hero.level)) {
        //console.log(eth + " " + hero.uid + " Level Up " + getExpNextLevel(hero.level) + " have " + (hero.exp + exp) + " " + "level" + hero.level);
        const increment = { $inc: { exp: exp, level: 1, statPoint: 10 } };
        const updatedCharacter = await CharacterModel.findOneAndUpdate({ _id: hero.id }, increment, { new: true });
        if (!updatedCharacter) {
            throw new Error('Character not found');
        }
        level++;
        // Create and save the experience log
        /*const experienceLog = new ExperienceLogModel({
          characterId: hero.id,
          amount: exp,
          ethAddress: eth, // Add the eth address to the log
        });*/
        //await experienceLog.save();
        // Create and save the experience log
        const levelupLog = new LevelupLogModel({
            characterId: hero.id,
            level: level,
            exp: (hero.exp + exp),
            ethAddress: eth, // Add the eth address to the log
        });
        await levelupLog.save();
    }
    else {
        const increment = { $inc: { exp: exp } };
        const updatedCharacter = await CharacterModel.findOneAndUpdate({ _id: hero.id }, increment, { new: true });
        if (!updatedCharacter) {
            throw new Error('Character not found');
        }
        // Create and save the experience log
        const experienceLog = new ExperienceLogModel({
            characterId: hero.id,
            amount: exp,
            ethAddress: eth, // Add the eth address to the log
        });
        await experienceLog.save();
    }
    return level;
}
exports.addExpToHero = addExpToHero;
function getExpNextLevel(lv) {
    if (lv < 14) {
        let exponent = 1.5;
        let baseXP = 240;
        return Math.floor(baseXP * Math.pow(lv, exponent));
    }
    else if (lv < 24) {
        let exponent = 1.7;
        let baseExp = 20;
        return Math.floor((baseExp * lv) * Math.pow(lv, exponent));
    }
    else if (lv < 39) {
        let exponent = 1.7;
        let baseExp = 35;
        return Math.floor((baseExp * lv) * Math.pow(lv, exponent));
    }
    else {
        let exponent = 1.8;
        let baseExp = 45;
        return Math.floor((baseExp * lv) * Math.pow(lv, exponent));
    }
    /*if (lv < 84) {
      let exponent = 1.5;
      let baseXP = 240;
      return Math.floor(baseXP * Math.pow(lv, exponent));
    } else if (lv < 90) {
      let exponent = 1.5
      let baseExp = 270
      let modifier = (lv - 83)/100
      return Math.floor(baseExp * Math.pow(lv, exponent + modifier))
    } else {
      let exponent = 1.5
      let baseExp = 300
      let modifier = (lv - 83)/100
      return Math.floor(baseExp * Math.pow(lv, exponent + modifier))
    }*/
}
exports.getExpNextLevel = getExpNextLevel;
