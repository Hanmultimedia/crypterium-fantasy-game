
import { fetchDiamond } from "./fetchDiamond";
import { fetchItemPotionPools } from "../services/itemPotionPools";
import { Potion,Potion_Inventory } from "../rooms/MenuState";
import mongoose, { Schema, Document }  from 'mongoose';

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

export async function usePotions(eth:string, uid: string , amount: number): Promise<any> {

    let Inventory: any;
    try {
      Inventory = mongoose.model("Inventory");
    } catch (error) {
      Inventory = mongoose.model("Inventory", InventorySchema);
    }

      let update = { $inc: { [`potions.${uid}.quantity`]: -1 } };
      const options = { new: true };
      const result = await Inventory.findOneAndUpdate({ eth:eth }, update, options);

    //await db.collection('Inventory').doc(eth).collection('Potion').doc(uid).set({
    //quantity: firestore.FieldValue.increment(-amount)
    //}, {merge: true})

  return null
}