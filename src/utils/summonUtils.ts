export function createDistribution(array:any[], weights:any[], size:number){
  const distribution = [];
  const sum = weights.reduce((a, b) => a + b);
  const quant = size / sum;
  for (let i = 0; i < array.length; ++i) {
      const limit = quant * weights[i];
      for (let j = 0; j < limit; ++j) {
          distribution.push(i);
      }
  }
  return distribution;
};

export function randomIndex(distribution:any){
  const index = Math.floor(distribution.length * Math.random());
  return distribution[index];  
};

export function calcBonus(character, key) {
  const max = character.bonus[key]
  const bonus = Math.floor(max * Math.random());
  return bonus
}

export function calcStatBonus(character, key, bonus) {
  return character[key] + bonus[key]
}

export function calcHeroHPMax(character) {
  let bonus = 0;
  bonus += (character.level) * 28
  if (character.job === 'Swordman') {
    bonus += (character.level * 5);
  }
  let vit = character.attributes.vit;
  return Math.floor(
    character.hp + (vit * 25)
  );
}

export function calcHeroSPMax(character) {
  let bonus = 0;
  bonus += (character.level * 10);
  if (character.job === 'Acolyte' || character.job === 'Magician') {
    bonus += (character.level * 5);
  }
  let int = character.attributes.int;
  return Math.floor(
    character.sp + ((int/2) * 10)
  );
}