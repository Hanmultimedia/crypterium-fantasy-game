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
exports.refine = exports.InventoryEquipmentSchema = exports.EquipmentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const character_schema_1 = require("./character.schema");
const addMaterials_1 = require("./addMaterials");
exports.EquipmentSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true },
    enchantmentLevel: { type: Number, required: true }
});
const Character = mongoose_1.default.model('Character', character_schema_1.CharacterSchema);
exports.InventoryEquipmentSchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    equipments: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true },
            enchantmentLevel: { type: Number, required: true }
        }
    }
});
const InventoryEquipment = mongoose_1.default.model('InventoryEquipment');
async function refine(eth, equipment_uid, from, to, mat, mat_amount) {
    //console.log("Equip " + equipment_uid + " to " + character_id)
    console.log("Refine " + mat_amount);
    let inventory = await InventoryEquipment.findOne({ eth: eth });
    if (inventory) {
        //console.log("Update in inventory")
        if (!inventory.equipments) {
            inventory.equipments = new Map();
        }
        if (!inventory.equipments.has(equipment_uid)) {
            inventory.equipments.set(equipment_uid, { uid: equipment_uid, quantity: 0 });
        }
        //success
        inventory.equipments.get(equipment_uid).quantity -= 1;
        let successChance = 0;
        let degradeChance = 0;
        let destroyChance = 0;
        switch (to) {
            case (1):
                successChance = 90;
                degradeChance = 0;
                break;
            case (2):
                successChance = 80;
                degradeChance = 0;
                break;
            case (3):
                successChance = 70;
                degradeChance = 0;
                break;
            case (4):
                successChance = 60;
                degradeChance = 0;
                break;
            case (5):
                successChance = 50;
                degradeChance = 5;
                break;
            case (6):
                successChance = 45;
                degradeChance = 5;
                break;
            case (7):
                successChance = 40;
                degradeChance = 5;
                break;
            case (8):
                successChance = 35;
                degradeChance = 5;
                break;
            case (9):
                successChance = 30;
                degradeChance = 10;
                break;
            case (10):
                successChance = 25;
                degradeChance = 10;
                break;
            case (11):
                successChance = 20;
                degradeChance = 10;
                break;
            case (12):
                successChance = 15;
                degradeChance = 10;
                break;
            default:
                break;
        }
        let random = Math.floor(Math.random() * 101);
        if (random < successChance) {
            //success
            // Extract base UID by removing the refinement level
            let baseUid = equipment_uid.replace(/\+\d+$/, '');
            // Extract the old refinement level and increment it
            let match = equipment_uid.match(/\+(\d+)$/);
            let oldLevel = match ? parseInt(match[1], 10) : 0; // Default to 0 if no level found
            //console.log(equipment_uid + " oldLevel" + oldLevel)
            let newLevel = oldLevel + 1;
            // Construct the new equipment_uid with the incremented refinement level
            let newEquipmentUid = `${baseUid}+${newLevel}`;
            console.log("newEquipmentUid " + newEquipmentUid);
            // Check if the new equipment_uid exists in the inventory
            if (!inventory.equipments.has(newEquipmentUid)) {
                inventory.equipments.set(newEquipmentUid, { uid: equipment_uid, quantity: 0 });
            }
            // Increment the quantity of the new equipment_uid
            inventory.equipments.get(newEquipmentUid).quantity += 1;
            inventory.equipments.get(newEquipmentUid).enchantmentLevel = to;
            //inventory.equipments.get(equipment_uid).enchantmentLevel = to;
            await (0, addMaterials_1.addMaterials)(eth, mat, -mat_amount);
            await inventory.save();
            return 1;
        }
        else {
            let fail = Math.floor(Math.random() * 101);
            //destroy
            if (fail < destroyChance) {
                await (0, addMaterials_1.addMaterials)(eth, mat, -mat_amount);
            }
            else if (fail < degradeChance) {
                // Extract base UID by removing the refinement level
                let baseUid = equipment_uid.replace(/\+\d+$/, '');
                // Extract the old refinement level and increment it
                let match = equipment_uid.match(/\+(\d+)$/);
                let oldLevel = match ? parseInt(match[1], 10) : 0; // Default to 0 if no level found
                //console.log(equipment_uid + " oldLevel" + oldLevel)
                let newLevel = oldLevel - 1;
                // Construct the new equipment_uid with the incremented refinement level
                let newEquipmentUid = `${baseUid}+${newLevel}`;
                if (newLevel == 0) {
                    let newEquipmentUid = `${baseUid}`;
                }
                // Check if the new equipment_uid exists in the inventory
                if (!inventory.equipments.has(newEquipmentUid)) {
                    inventory.equipments.set(newEquipmentUid, { uid: equipment_uid, quantity: 0 });
                }
                // Increment the quantity of the new equipment_uid
                inventory.equipments.get(newEquipmentUid).quantity += 1;
                //inventory.equipments.get(equipment_uid).enchantmentLevel = to;
                await (0, addMaterials_1.addMaterials)(eth, mat, -mat_amount);
                await inventory.save();
                return 3;
            }
            else {
                inventory.equipments.get(equipment_uid).quantity += 1;
                await (0, addMaterials_1.addMaterials)(eth, mat, -mat_amount);
                await inventory.save();
                return 2;
            }
        }
        await inventory.save();
    }
    //InventoryEquipment.equipments.set(equipment_uid, { uid: equipment_uid, quantity: -1 });
    return true;
}
exports.refine = refine;
/*export async function equipToCharacter(eth:string, character_id: string , equipment_uid: string , slot : number): Promise<any> {

  const equipments = await fetchEquipments()
  const equipment = equipments.find( c => c.uid === equipment_uid)
  const characters = await fetchCharacters(eth)
  const character = characters.find( c => c.id === character_id)

  if(slot == 0)
  {
    character.slot_0 = equipment_uid;
  }
  else if(slot == 1)
  {
    character.slot_1 = equipment_uid;
  }
  else if(slot == 2)
  {
    character.slot_2 = equipment_uid;
  }
  else if(slot == 3)
  {
    character.slot_3 = equipment_uid;
  }
  else if(slot == 4)
  {
    character.slot_4 = equipment_uid;
  }
  else if(slot == 5)
  {
    character.slot_5 = equipment_uid;
  }

  const equipments_arr = {
      slot_0: character.slot_0,
      slot_1: character.slot_1,
      slot_2: character.slot_2,
      slot_3: character.slot_3,
      slot_4: character.slot_4,
      slot_5: character.slot_5,
  }

  await db.collection('Character').doc(character_id).set(
    {
      equipments : equipments_arr
    }, {merge: true}
    )

  await db.collection('Inventory').doc(eth).collection('Equipment').doc(equipment_uid).set({
    quantity: firestore.FieldValue.increment(-1)
    }, {merge: true})

  return null
}*/ 
