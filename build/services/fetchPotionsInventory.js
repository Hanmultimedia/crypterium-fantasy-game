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
exports.fetchPotionsInventory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InventorySchema = new mongoose_1.Schema({
    eth: { type: String, required: true },
    potions: {
        type: Map,
        of: {
            uid: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    }
});
const Inventory = mongoose_1.default.model('Inventory', InventorySchema);
async function fetchPotionsInventory(eth) {
    const inventory = await Inventory.findOne({ eth: eth });
    // console.log("Your potion")
    // console.log(inventory)
    let filteredPotions = [];
    if (!inventory) {
        return filteredPotions;
    }
    inventory.potions.forEach((potion) => {
        console.log(potion);
        if (potion.quantity > 0) {
            let p = [];
            p["uid"] = potion.uid;
            p["amount"] = potion.quantity;
            filteredPotions.push(p);
        }
    });
    // console.log("filtered")
    // console.log(filteredPotions)
    //const potions = inventory.potions.filter(potion => potion.quantity > 0);
    return filteredPotions;
}
exports.fetchPotionsInventory = fetchPotionsInventory;
/*import { db } from "../arena.config";
import { Potion } from "../rooms/MenuState";
export async function fetchPotionsInventory(eth:string): Promise<any> {
  
  const snapshot = await db.collection('Inventory').doc(eth).collection('Potion').
  where('quantity', '>', 0).get()
  const potions:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
    let potion = []
    potion["uid"] = doc.id
    potion["amount"] = data.quantity
    potions.push(potion)
  });

  return potions
}
*/ 
