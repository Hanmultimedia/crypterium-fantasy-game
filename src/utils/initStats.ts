export function makeStat(character: Character) {
  return {
    atk: calcHeroAtk(character),
    def: calcHeroDef(character),
    mAtk: calcHeroMatk(character),
    mDef: calcHeroMdef(character),
    hit: calcHeroHit(character),
    flee: calcHeroFlee(character),
    cri: calcHeroCri(character),
    aspd: calcHeroAtkSpeed(character),
    hpMAX: calcHeroHPMax(character),
    spMAX: calcHeroSPMax(character),
    speed: character.speed,
    range: character.range,
  }
}

interface Attributes {
  vit: number;
  agi: number;
  int: number;
  str: number;
  luk: number;
  dex: number;
}
interface Character {
  attributes: Attributes;
  job: string;
  uid: string;
  slug: string;
  position: number;
  level: number;
  hp: number;
  sp: number;
  speed: number;
  range: number;
}


function calcHeroAtk(character: Character) {
  let bonus = 0;
  let level = character.level;
  if (
    character.job === "Swordman" ||
    character.job === "Lancer"
  ) {
    bonus += level;
  }
  let str = character.attributes.str;
  let luk = character.attributes.luk;
  let dex = character.attributes.dex;

  let weapon = 0;
  if (character.job !== "Archer") {
    return Math.floor(
      str * 1.25 +
        (level * 1.75) / (str + level) +
        str * 10 +
        bonus +
        (luk / 2) * 0.2 +
        (dex / 2) * 0.2 +
        (str / 5) * 3
    );
  } else {
    return Math.floor(
      dex * 0.75 +
        (level * 1.75) / (dex + level) +
        dex * 10 +
        bonus +
        (luk / 2) * 0.2 +
        (str / 2) * 0.2 +
        (dex / 5) * 3
    );
  }
}

function calcHeroMatk(character) {
  let bonus = 0;
  let level = character.level;
  if (
    character.job === "Acolyte" ||
    character.job === "Magician"
  ) {
    bonus += level;
  }
  let int = character.attributes.int;
  let luk = character.attributes.luk;
  let weapon = 0;
  return Math.floor(
    int * 1.4 +
      (level * 1.75) / (int + level) +
      int * 10 +
      bonus +
      (luk / 2) * 0.2 +
      (int / 5) * 4
  );
}

function calcHeroDef(character) {
  let vit = character.attributes.vit;
  let armor = 0;
  return Math.floor(vit / 2 + vit * 5);
}

function calcHeroMdef(character) {
  let vit = character.attributes.vit;
  let int = character.attributes.int;
  let armor = 0;
  return Math.floor((vit / 2) * 0.5 + vit * 2.5 + int);
}

function calcHeroHPMax(character) {
  let bonus = 0;
  if (character.job === "Swordman") {
    bonus += character.level * 10;
  }
  let vit = character.attributes.vit;

  return Math.floor(character.hp + vit * 25);
}

function calcHeroSPMax(character) {
  let bonus = 0;
  if (
    character.job === "Acolyte" ||
    character.job === "Magician"
  ) {
    bonus += character.level * 5;
  }
  let int = character.attributes.int;

  return Math.floor(character.sp + (int / 2) * 10);
}

function calcHeroHit(character) {
  let bonus = 0;
  if (character.job === "Archer") {
    bonus += character.level;
  }
  let dex = character.attributes.dex;
  let agi = character.attributes.agi;

  return Math.floor(dex * 2 + agi + bonus + dex * 10);
}

function calcHeroFlee(character) {
  let luk = character.attributes.luk;
  let agi = character.attributes.agi;

  return Math.floor(luk + (agi / 2) * 2 + luk * 5);
}

function calcHeroCri(character) {
  let bonus = 0;
  if (character.job === "Lancer") {
    bonus += character.level * 0.1;
  }
  let luk = character.attributes.luk;

  return (luk / 2) * 0.3 + bonus + luk;
}

function calcHeroDropRate(luk, level) {
  return 0;
}

function calcHeroAtkSpeed(character) {
  let bonus = 0;
  let agi = character.attributes.agi;

  return 1 + (agi / 2) * 0.05 + bonus + agi * 0.05;
}