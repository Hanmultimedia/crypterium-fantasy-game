"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingPotion = void 0;
const mongoose = require('mongoose');
const UserPotionSettingSchema = new mongoose.Schema({
    eth: { type: String, required: true },
    hp_uid: { type: String, required: true },
    sp_uid: { type: String, required: true },
    hp_percent: { type: Number, required: true },
    sp_percent: { type: Number, required: true },
});
async function settingPotion(eth, hp_uid, sp_uid, hp_percent, sp_percent) {
    let UserPotionSetting;
    try {
        UserPotionSetting = mongoose.model('UserPotionSetting');
    }
    catch (error) {
        UserPotionSetting = mongoose.model('UserPotionSetting', UserPotionSettingSchema);
    }
    const update = {};
    update["hp_uid"] = hp_uid;
    update["sp_uid"] = sp_uid;
    update["hp_percent"] = hp_percent;
    update["sp_percent"] = sp_percent;
    const result = await UserPotionSetting.findOneAndUpdate({ eth: eth }, { $set: update }, { new: true });
    if (!result) {
        const userPotionSetting = new UserPotionSetting({
            eth,
            hp_uid,
            sp_uid,
            hp_percent,
            sp_percent
        });
        await userPotionSetting.save();
    }
}
exports.settingPotion = settingPotion;
/*import { db } from "../arena.config";
import { firestore } from "firebase-admin";

async function settingPotion(eth:string, hp_uid: string , sp_uid: string , hp_percent : number , sp_percent : number): Promise<any> {

  await db.collection('User').doc(eth).collection('Setting').doc("Potion").set({
    hp_uid : hp_uid,
    sp_uid : sp_uid,
    hp_percent : hp_percent,
    sp_percent : sp_percent
    }, {merge: true})

  return null
}

export {
  settingPotion
}*/ 
