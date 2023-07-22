"use strict";
/*import { db } from "../arena.config";
import { Potion } from "../rooms/MenuState";
export async function fetchEquipmentsInventory(eth:string): Promise<any> {
  
  const snapshot = await db.collection('Inventory').doc(eth).collection('Equipment').get()
  const equipments:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
    let equipment = []
    equipment["uid"] = doc.id
    equipment["amount"] = data.quantity
    equipments.push(equipment)
  });

  return equipments
}*/
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
exports.fetchEquipmentsInventory = exports.InventoryEquipment = exports.InventoryEquipmentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.InventoryEquipmentSchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    equipments: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    }
});
exports.InventoryEquipment = mongoose_1.default.model('InventoryEquipment', exports.InventoryEquipmentSchema);
async function fetchEquipmentsInventory(eth) {
    const inventory = await exports.InventoryEquipment.find({ eth: eth });
    const equipments = [];
    inventory[0].equipments.forEach((value, key) => {
        equipments.push({
            uid: key,
            amount: value.quantity
        });
    });
    //console.log('InventoryEquipment');
    //console.log(equipments);
    return equipments;
}
exports.fetchEquipmentsInventory = fetchEquipmentsInventory;
/*export async function fetchEquipmentsInventory(eth:string): Promise<any> {

    let InventoryEquipment: any;
    try {
      InventoryEquipment = mongoose.model('InventoryEquipment');
    } catch (error) {
      InventoryEquipment = mongoose.model('InventoryEquipment', InventoryEquipmentSchema);
    }

    const inventory = await InventoryEquipment.find({ eth });
    console.log('InventoryEquipment');
    console.log(inventory);
    return inventory;
}*/ 
