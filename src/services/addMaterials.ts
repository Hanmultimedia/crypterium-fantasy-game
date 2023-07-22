import { fetchDiamond } from "./fetchDiamond";
import { fetchItemPotionPools } from "../services/itemPotionPools";
import { Potion,Potion_Inventory } from "../rooms/MenuState";
import { CharacterSchema } from './character.schema';  
import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

const MaterialsSchema = new Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const InventorySchema = new Schema({
    eth: { type: String, required: true },
    materials: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});

export async function addMaterials(eth:string, mat_uid: string , amount: number): Promise<any> {

  const result = []

    //Add Material section
    console.log("Check Material inventory")
    let Inventory: any;
    try {
      Inventory = mongoose.model("InventoryMaterial");
    } catch (error) {
      Inventory = mongoose.model("InventoryMaterial", InventorySchema);
    }

    let updatedInventory = await Inventory.findOne(
    { eth: eth}
    );

    if (updatedInventory) {
    console.log("Update Material in inventory")
    if (!updatedInventory.materials) {
      updatedInventory.materials = new Map();
    }
    if (!updatedInventory.materials.has(mat_uid)) {
      updatedInventory.materials.set(mat_uid, { uid: mat_uid, quantity: 0 });
    }
    updatedInventory.materials.get(mat_uid).quantity += amount;
    await updatedInventory.save();
    }else
    {
      console.log("Create New Materials")
      let MaterialsModel: any;
      try {
        MaterialsModel = mongoose.model("Materials");
      } catch (error) {
        MaterialsModel = mongoose.model("Materials", MaterialsSchema);
      }
      const newMaterials = new MaterialsModel({ uid:mat_uid,quantity:amount });

      updatedInventory = await Inventory.create({
        eth: eth,
      materials: new Map([[mat_uid, { uid: mat_uid, quantity: newMaterials.quantity }]])
      });
    }
    
    console.log("Finish add materials")
    //mongoose.connection.close();
    return true
}