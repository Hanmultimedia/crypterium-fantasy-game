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

import mongoose, { Schema, Document }  from 'mongoose';

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

export const InventoryEquipment = mongoose.model('InventoryEquipment',InventoryEquipmentSchema);

export async function fetchEquipmentsInventory(eth:string): Promise<any> {
    const inventory = await InventoryEquipment.find({ eth:eth });
    const equipments:any[] = [];
    inventory[0].equipments.forEach((value, key) => {
        equipments.push({
            uid: key,
            amount: value.quantity
        })
    })

    //console.log('InventoryEquipment');
    //console.log(equipments);
    return equipments;
}

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