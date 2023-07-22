import { fetchDiamond } from "./fetchDiamond";
import { fetchEquipments } from "../services/fetchEquipments";
import { Equipment,Equipment_Inventory } from "../rooms/MenuState";
import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

export const EquipmentSchema: Schema = new Schema({
  uid: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const EquipmentModel = mongoose.model('EquipmentInventory', EquipmentSchema , 'EquipmentInventory');

export const InventoryEquipmentSchema: Schema = new Schema({
  eth: { type: String, required: true },
  equipments: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        quantity: { type: Number, required: true }
    }
    }
});

//export const InventoryEquipment = mongoose.model('InventoryEquipment', InventoryEquipmentSchema , 'InventoryEquipment');    
export async function buyEquipment(eth:string, equipment_uid: string , amount: number): Promise<any> {

  let diamonds = await fetchDiamond(eth)
  const equipments = await fetchEquipments()
  const equipment = equipments.find((e:any) => e.uid === equipment_uid) as Equipment
  const e = new Equipment_Inventory()
  e.uid = equipment.uid
  const price = equipment.price * amount
  const result:any = []
  if(diamonds >= price )
  {
    console.log(eth + " buy equipment " + equipment_uid)

//
try {
   
    // Define your user schema
    console.log("Fetch User To update Diamond")
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {
      user.diamond -= price
      await user.save();
    }

  } catch (error) {
    console.log(error);
  }
//
    result["diamond"] = diamonds-price
    result["equipment"] = e
    result["amount"] = amount

//
    console.log("Check equipment inventory")

    let InventoryEquipment: any;
    try {
      InventoryEquipment = mongoose.model('InventoryEquipment');
    } catch (error) {
      InventoryEquipment = mongoose.model('InventoryEquipment', InventoryEquipmentSchema);
    }

    let updatedInventory = await InventoryEquipment.findOne(
    { eth: eth}
    );

    if (updatedInventory) {
    console.log("Update in inventory")
    if (!updatedInventory.equipments) {
      updatedInventory.equipments = new Map();
    }
    if (!updatedInventory.equipments.has(equipment.uid)) {
      updatedInventory.equipments.set(equipment.uid, { uid: equipment.uid, quantity: 0 });
    }
    updatedInventory.equipments.get(equipment.uid).quantity += amount;
    await updatedInventory.save();
    }else
    {
      console.log("Create New Equipment")
      const newEquipment = new EquipmentModel({ uid:equipment.uid,quantity:amount });

      updatedInventory = await InventoryEquipment.create({
        eth: eth,
      equipments: new Map([[newEquipment.uid, { uid: newEquipment.uid, quantity: newEquipment.quantity }]])
      });
    }
    
    console.log("Finish buy equipment")
    //mongoose.connection.close();
    return result
//
  }
  else
  {
    result["diamond"] = diamonds
    result["equipment"] = e
    result["amount"] = 0
    return result
  }
}