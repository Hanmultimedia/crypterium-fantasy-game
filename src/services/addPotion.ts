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

const PotionSchema = new Schema({
    uid: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const InventorySchema = new Schema({
    eth: { type: String, required: true },
    potions: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});


export async function addPotion(eth:string , amount:number) {

  if (!amount) return;
  const potion_uid = "1003";

  const potions = await fetchItemPotionPools();
  const p = potions.find(p => p.uid === potion_uid)

  const potion = new Potion()
  potion.uid = p.uid
  potion.type = p.type
  potion.name = p.name
  potion.effect = p.effect
  potion.effect_type = p.effect_type
  potion.effect_amount = p.effect_amount
  potion.sprite = p.sprite
  potion.price = p.price

  const result:any = []

    const p2:any = new Potion_Inventory()
    p2.uid = potion.uid
    p2.amount = amount

    result["potion"] = p2
    result["amount"] = amount

    //Add potion section
    let Inventory: any;
    try {
      Inventory = mongoose.model("Inventory");
    } catch (error) {
      Inventory = mongoose.model("Inventory", InventorySchema);
    }

    let updatedInventory = await Inventory.findOne(
    { eth: eth}
    );

    if (updatedInventory) {
    console.log("Update in inventory")
    if (!updatedInventory.potions) {
      updatedInventory.potions = new Map();
    }
    if (!updatedInventory.potions.has(potion.uid)) {
      updatedInventory.potions.set(potion.uid, { uid: potion.uid, quantity: 0 });
    }
    updatedInventory.potions.get(potion.uid).quantity += amount;
    await updatedInventory.save();
    }else
    {
      console.log("Create New Potion")
      let PotionModel: any;
      try {
        PotionModel = mongoose.model("Potion");
      } catch (error) {
        PotionModel = mongoose.model("Potion", PotionSchema);
      }
      const newPotion = new PotionModel({ uid:potion.uid,quantity:amount });

      updatedInventory = await Inventory.create({
        eth: eth,
      potions: new Map([[newPotion.uid, { uid: newPotion.uid, quantity: newPotion.quantity }]])
      });
    }
    
    console.log("Finish add potion reward")
    //mongoose.connection.close();
    return result

  
}