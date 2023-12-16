

export async function fetchRarityRatings(docId:string): Promise<any> {
  
  if(docId == "free-standard")
  {
    return {
      "Common": 0.5,
      "Rare": 0.35,
      "Super Rare":0.10,
      "Epic":0.05
    };
  }

  if(docId == "premium-standard")
  {
    return {
      "Common": 0,
      "Rare": 0.55,
      "Super Rare":0.35,
      "Epic":0.10
    };
  }

  /*const doc = await db.collection('RarityRatings').doc(docId).get()

  if (doc.exists) {
    return doc.data()
  }*/
  return null
}