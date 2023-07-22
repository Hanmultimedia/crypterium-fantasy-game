
import { Equipment } from "../rooms/MenuState";
import { firestore } from "firebase-admin";

export async function CopyCollection(eth:string,id:string): Promise<any> {
  
     const e = {
      uid: "",
      name: "",
      type: "obj.name",
      abilities: [],
      description: "10000",
      equipSlot: 100,
      jobRequired: {
      Archer: false,
      Acolyte: false,
      Mage: false,
      Lancer: false,
      Swordman: false
      },
      icon: "",
      isDelete: "",
      aspd: 0,
      atk: 0,
      cri: 0,
      criDamage: 0,
      def: 0,
      flee: 0,
      mAtk: 0,
      mDef: 0,
      speed: 0,
      price: 0
    }

  //await db.collection('Equipment').doc(id).set(e)

  
}