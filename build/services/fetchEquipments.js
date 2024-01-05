"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEquipments = void 0;
//import { db } from "../arena.config";
//import { Equipment } from "../rooms/MenuState";
const MenuState_1 = require("../rooms/MenuState");
const createEquipment_1 = require("../services/createEquipment");
const mongoose_1 = __importDefault(require("mongoose"));
async function fetchEquipments() {
    const db = mongoose_1.default.connection;
    // we're connected!
    // console.log("Connected with mongo to get equipments")
    const EquipmentModel = mongoose_1.default.model('Equipment', createEquipment_1.baseEquipmentSchema);
    try {
        const equipments_data = await EquipmentModel.find({});
        const equipments = [];
        for (let i = 0; i < equipments_data.length; i++) {
            const data = equipments_data[i];
            const equipment = new MenuState_1.Equipment();
            equipment.uid = data.uid;
            equipment.name = data.name;
            equipment.type = data.type;
            equipment.abilities = data.abilities;
            equipment.description = data.description;
            //console.log(data.jobRequired)
            if (data.jobRequired) {
                equipment.jobRequired_Swordman = data.jobRequired["Swordman"];
                equipment.jobRequired_Lancer = data.jobRequired["Lancer"];
                equipment.jobRequired_Magician = data.jobRequired["Mage"];
                equipment.jobRequired_Archer = data.jobRequired["Archer"];
                equipment.jobRequired_Acolyte = data.jobRequired["Acolyte"];
            }
            equipment.price = data.price;
            equipment.icon = data.icon;
            equipment.isDelete = false;
            equipment.aspd = data.aspd;
            equipment.atk = data.atk;
            equipment.cri = data.cri;
            equipment.criDamage = data.criDamage;
            equipment.def = data.def;
            equipment.flee = data.flee;
            equipment.slot = data.slot;
            equipment.mAtk = data.mAtk;
            equipment.mDef = data.mDef;
            equipment.speed = data.speed;
            equipment.hit = data.hit;
            equipment.range = 0;
            equipment.hpMAX = data.hpMAX;
            equipment.spMAX = data.spMAX;
            equipment.rarity = "normal";
            if (equipment.uid.startsWith("9")) {
                equipment.rarity = "nft";
            }
            equipments.push(equipment);
        }
        //mongoose.connection.close()
        //console.log("return equipments")
        //console.log(equipments)
        return equipments;
    }
    catch (err) {
        console.log(err);
        return err;
        // mongoose.connection.close()
    }
    /*
    const snapshot = await db.collection('Equipment').get()
    const equipments:any[] = []
    snapshot.forEach((doc) => {
      const data:any = doc.data()
      const equipment = new Equipment()
      equipment.uid = data.uid
      equipment.name = data.name
      equipment.type = data.type
      equipment.abilities = data.abilities
      equipment.description = data.description
      equipment.equipSlot = data.equipSlot
      if(data.jobRequired){
        equipment.jobRequired_Archer = data.jobRequired.Archer
        equipment.jobRequired_Acolyte = data.jobRequired.Acolyte
        equipment.jobRequired_Magician = data.jobRequired.Mage
        equipment.jobRequired_Lancer = data.jobRequired.Lancer
        equipment.jobRequired_Swordman = data.jobRequired.Swordman
        //console.log(equipment.uid)
        //console.log(data.jobRequired)
      }
      equipment.price = data.price
      equipment.icon = data.icon
      equipment.isDelete = data.isDelete
      equipment.aspd = data.aspd
      equipment.atk = data.atk
      equipment.cri = data.cri
      equipment.criDamage = data.criDamage
      equipment.def = data.def
      equipment.flee = data.flee
      equipment.slot = data.slot
      equipment.mAtk = data.mAtk
      equipment.mDef = data.mDef
      equipment.speed = data.speed
      equipment.hit = data.hit
      equipment.range = data.range
      equipment.hpMAX = data.hpMAX
      equipment.spMAX = data.spMAX
  
      equipments.push(equipment)
    });
  
    return equipments*/
}
exports.fetchEquipments = fetchEquipments;
