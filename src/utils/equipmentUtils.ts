export function calcNFTBonus(character:any,data:any) {

  const copied = character;
  let angelCount = 0;
  let aresCount = 0;
  let apolloCount = 0;
  let athenaCount = 0;

  for (let i = 0; i <= 8; i++) {
  const propertyName = `slot_${i}`;

  if (data.equipments[propertyName]) {
    
    if(data.equipments[propertyName] === "900001")
    {
      //angel amulet
      character.def += 5
      character.mDef += 5
      character.flee += 5
      angelCount++
    }

    if(data.equipments[propertyName] === "900002")
    {
      //ares ring
      character.def += 5
      character.mDef += 5
      character.atk += copied.atk*0.01
      character.mAtk += copied.atk*0.01
      aresCount++;
    }

    if(data.equipments[propertyName] === "900003")
    {
      //angel aguard
      character.def += 5
      character.mDef += 5
      character.spMAX += copied.spMAX*0.05
      angelCount++
    }

    if(data.equipments[propertyName] === "900004")
    {
      //ares amulet
      character.def += 5
      character.mDef += 5
      aresCount++
    }

    if(data.equipments[propertyName] === "900005")
    {
      //angel boot
      character.speed += 1
      character.flee += 10
      character.hpMAX += copied.hpMAX*0.05
      angelCount++
    }

    if(data.equipments[propertyName] === "900006")
    {
      //angel halo
      character.flee += 15
      angelCount++
    }

    if(data.equipments[propertyName] === "900007")
    {
      //athena boot
      character.def += 10
      character.hpMAX += copied.hpMAX*0.03
      athenaCount++;
    }

    if(data.equipments[propertyName] === "900008")
    {
      //athena shield
      character.def += 10
      character.mDef += 10
      athenaCount++;
    }

    if(data.equipments[propertyName] === "900009")
    {
      //apollo helmet
      apolloCount++;
      character.cri += 5
    }

    if(data.equipments[propertyName] === "900010")
    {
      //apollo armor
      apolloCount++;
      character.cri += 5
    }

    if(angelCount == 2)
    {
    }

    if(angelCount == 3)
    {
    }

    if(angelCount == 4)
    {
    }

    if(aresCount == 2)
    {
    }

    if(athenaCount == 2)
    {
      character.hpMAX += copied.hpMAX * 0.1
    }

    if(apolloCount == 2)
    {
      character.hpMAX += copied.hpMAX * 0.1
    }
}
}

  return character

}

export function calcNFTBonus2(data:any) {

  let angelCount = 0;
  let aresCount = 0;
  let apolloCount = 0;
  let athenaCount = 0;

      data.attributes.str += data.attributes.str + (2*data.star)
      data.attributes.vit += data.attributes.vit + (2*data.star)
      data.attributes.dex += data.attributes.dex + (2*data.star)
      data.attributes.luk += data.attributes.luk + (2*data.star)
      data.attributes.agi += data.attributes.agi + (2*data.star)
      data.attributes.int += data.attributes.int + (2*data.star)

  for (let i = 0; i <= 8; i++) {
  const propertyName = `slot_${i}`;

  if (data.equipments[propertyName]) {
    
    if(data.equipments[propertyName] === "900001")
    {
      //angel amulet
      data.attributes.str += 1
      data.attributes.vit += 1
      data.attributes.dex += 1
      data.attributes.luk += 1
      data.attributes.agi += 1
      data.attributes.int += 1
      angelCount++
    }

    if(data.equipments[propertyName] === "900002")
    {
      //ares ring
      aresCount++;
    }

    if(data.equipments[propertyName] === "900003")
    {
      //angel aguard
      angelCount++
    }

    if(data.equipments[propertyName] === "900004")
    {
      //ares amulet
      aresCount++
    }

    if(data.equipments[propertyName] === "900005")
    {
      //angel boot
      angelCount++
    }

    if(data.equipments[propertyName] === "900006")
    {
      //angel halo
      data.attributes.int += 1
      angelCount++
    }

    if(data.equipments[propertyName] === "900007")
    {
      //athena boot
      data.attributes.vit += 5
      athenaCount++;
    }

    if(data.equipments[propertyName] === "900008")
    {
      //athena shield
      data.attributes.vit += 10
      athenaCount++;
    }

    if(data.equipments[propertyName] === "900009")
    {
      //apollo helmet
      data.attributes.vit += 3
      data.attributes.agi += 3
      apolloCount++;
    }

    if(data.equipments[propertyName] === "900010")
    {
      //apollo armor
      data.attributes.vit += 1
      data.attributes.agi += 3
      apolloCount++;
    }

    if(angelCount == 2)
    {
      data.attributes.str += 5
      data.attributes.vit += 5
      data.attributes.dex += 5
      data.attributes.luk += 5
      data.attributes.agi += 5
      data.attributes.int += 5
    }

    if(angelCount == 3)
    {
      data.attributes.str += 10
      data.attributes.vit += 10
      data.attributes.dex += 10
      data.attributes.luk += 10
      data.attributes.agi += 10
      data.attributes.int += 10
    }

    if(angelCount == 4)
    {
      data.attributes.str += 15
      data.attributes.vit += 15
      data.attributes.dex += 15
      data.attributes.luk += 15
      data.attributes.agi += 15
      data.attributes.int += 15
    }

    if(aresCount == 2)
    {
      data.attributes.str += 1
      data.attributes.vit += 1
      data.attributes.dex += 1
      data.attributes.luk += 1
      data.attributes.agi += 1
      data.attributes.int += 1
    }

    if(athenaCount == 2)
    {
      data.attributes.str += 3
      data.attributes.vit += 3
      data.attributes.dex += 3
      data.attributes.luk += 3
      data.attributes.agi += 3
      data.attributes.int += 3
    }

    if(apolloCount == 2)
    {
      data.attributes.str += 3
      data.attributes.vit += 3
      data.attributes.dex += 3
      data.attributes.luk += 3
      data.attributes.agi += 3
      data.attributes.int += 3
    }

    /*const equipment = equipments.find(c => c.uid === data.equipments[propertyName]);

    character.atk += equipment.atk;
    character.def += equipment.def;
    character.mAtk += equipment.mAtk;
    character.mDef += equipment.mDef;
    character.hpMAX += equipment.hpMAX;
    character.spMAX += equipment.spMAX;
    character.hit += equipment.hit;
    character.flee += equipment.flee;
    character.cri += equipment.cri;
    character.aspd += equipment.aspd;
    character.speed += equipment.speed;
    character.range += equipment.range;*/

  }
}
  return data

}
