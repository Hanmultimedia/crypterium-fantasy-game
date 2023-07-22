"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpNextLevel = exports.addExpToHero = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const character_schema_1 = require("./character.schema");
const CharacterModel = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
async function addExpToHero(eth, hero, exp) {
    if (!exp)
        return;
    let level = hero.level;
    //console.log("need exp " + getExpNextLevel(hero.level) + " have " + (hero.exp + exp))
    if (hero.exp + exp >= getExpNextLevel(hero.level)) {
        //level++;
        const increment = { $inc: { exp: exp, level: 1, statPoint: 10 } };
        const character = await CharacterModel.findOneAndUpdate({ _id: hero.id }, increment, { new: true });
        if (!character) {
            throw new Error('Character not found');
        }
        ///////
        //await db.collection("Character").doc(hero.id).set({
        //  exp: firestore.FieldValue.increment(exp),
        //  level: level,
        //  statPoint: firestore.FieldValue.increment(10),
        //}, {merge: true})
        ///////
    }
    else {
        //console.log("just add ")  
        const increment = { $inc: { exp: exp } };
        const character = await CharacterModel.findOneAndUpdate({ _id: hero.id }, increment, { new: true });
        if (!character) {
            throw new Error('Character not found');
        }
        ///////
        //await db.collection("Character").doc(hero.id).set({
        //  exp: firestore.FieldValue.increment(exp),
        //}, {merge: true})
        ///////
    }
}
exports.addExpToHero = addExpToHero;
function getExpNextLevel(lv) {
    if (lv < 84) {
        let exponent = 1.5;
        let baseXP = 240;
        return Math.floor(baseXP * Math.pow(lv, exponent));
    }
    else if (lv < 90) {
        let exponent = 1.5;
        let baseExp = 270;
        let modifier = (lv - 83) / 100;
        return Math.floor(baseExp * Math.pow(lv, exponent + modifier));
    }
    else {
        let exponent = 1.5;
        let baseExp = 300;
        let modifier = (lv - 83) / 100;
        return Math.floor(baseExp * Math.pow(lv, exponent + modifier));
    }
}
exports.getExpNextLevel = getExpNextLevel;
