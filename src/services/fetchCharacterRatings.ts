//import { db } from "../arena.config";

export async function fetchCharacterRatings(docId:string): Promise<any> {
  
  //const doc = await db.collection('CharacterRatings').doc(docId).get()

  //if (doc.exists) {
  //  return doc.data()
  //}

  if(docId == "standard")
  {
    return {
      "Acolyte": 0.15,
      "Archer": 0.15,
      "Lancer": 0.25,
      "Magician": 0.2,
      "Swordman": 0.25,
    };
  }

  return null
}