export interface Stat {
  atk: number
  def: number
  mAtk: number
  mDef: number
  hpMAX: number
  spMAX: number
  hit: number;
  flee: number;
  cri: number;
  aspd: number;
  speed: number;
  range: number;
}

export interface CharacterData{
  id: string;
  uid: string;
  position: number;
  stat: Stat
  job: string
  level: number;
  name: string;
  statPoint: number;
}

export interface Monster {
  job: string
  level: number;
  name: string;
  atk: number
  def: number
  mAtk: number
  mDef: number
  hpMAX: number
  spMAX: number
  hit: number;
  flee: number;
  cri: number;
  aspd: number;
  speed: number;
  range: number;
}