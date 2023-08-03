import { Room, Client } from "colyseus";
import { fetchHeroesTreasure } from "../services/fetchHeroesTreasure";
import { fetchWaveMonsters } from "../services/fetchWaveMonsters";
import { fetchRandomMonster } from "../services/fetchRandomMonster";
import { fetchRandomBoss } from "../services/fetchRandomBoss";
import { fetchRandomChest } from "../services/fetchRandomChest";
import { addExpToHero } from "../services/addExpToHero";
import { addDiamond } from "../services/addDiamond";
import { addCoin } from "../services/addCoin";
import { addPotion } from "../services/addPotion";
import { usePotions } from "../services/usePotions";
import { createDungeonRecord, finishDungeon, updateDungeonRecord } from "../services/makeDungeonRecord";
import { DungeonState, RewardState,Character_Array } from "./DungeonState";
import { TreasureState_T } from "./TreasureState";
import mongoose from 'mongoose';
import { fetchDiamond } from "../services/fetchDiamond";
import { fetchCoin } from "../services/fetchCoin";

import { Character } from "./DungeonState";
import { makeStat } from "../utils/initStats";

class CharacterTemplate {
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

constructor(attributes: Attributes, job:string, uid:string, slug:string, position:number, level:number, hp:number, sp:number, speed:number, range:number) {
    this.attributes = attributes;
    this.job = job;
    this.uid = uid;
    this.slug = slug;
    this.position = position;
    this.level = level;
    this.hp = hp;
    this.sp = sp;
    this.speed = speed;
    this.range = range;
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

const buffCombinations = {
  "Swordman+Swordman": ["Swordman", "Swordman"],
  "Lancer+Lancer": ["Lancer", "Lancer"],
  "Archer+Archer": ["Archer", "Archer"],
  "Magician+Magician": ["Magician", "Magician"],
  "Acolyte+Acolyte": ["Acolyte", "Acolyte"],
  // Add more 2-character combinations as needed
  // ...
};

// Buff combinations configuration for 3-characters
const buffCombinations3 = {
  "Swordman+Lancer+Archer": ["Swordman", "Lancer", "Archer"],
  "Swordman+Lancer+Magician": ["Swordman", "Lancer", "Magician"],
  "Swordman+Lancer+Acolyte": ["Swordman", "Lancer", "Acolyte"],
  "Swordman+Archer+Magician": ["Swordman", "Archer", "Magician"],
  "Swordman+Archer+Acolyte": ["Swordman", "Archer", "Acolyte"],
  "Swordman+Magician+Acolyte": ["Swordman", "Magician", "Acolyte"],
  "Lancer+Archer+Magician": ["Lancer", "Archer", "Magician"],
  "Lancer+Archer+Acolyte": ["Lancer", "Archer", "Acolyte"],
  "Lancer+Magician+Archer": ["Lancer", "Magician", "Archer"],
  "Archer+Magician+Acolyte": ["Archer", "Magician", "Acolyte"],
  // Add more 3-character combinations as needed
  // ...
};


export class TreasureRoom extends Room<DungeonState> {
  maxClients = 1;

  async onCreate(options:any) {
    this.roomId = options.ethAddress;
    //console.log("Treasure created!", options);
    this.setState(new DungeonState());
    this.setSeatReservationTime(100000) 

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));


    const teams = {
    1: { characters: [], jobs: new Set() },
    2: { characters: [], jobs: new Set() },
    3: { characters: [], jobs: new Set() },
  };

  for (const character of characters) {
    if (character.treasure1 >= 0) {
      teams[1].characters.push(character);
      teams[1].jobs.add(character.job);
    }
    if (character.treasure2 >= 0) {
      teams[2].characters.push(character);
      teams[2].jobs.add(character.job);
    }
    if (character.treasure3 >= 0) {
      teams[3].characters.push(character);
      teams[3].jobs.add(character.job);
    }
  }

  // Create sets to keep track of heroes used in combinations for each team
  const heroesUsedIn2Combo = { 1: new Set(), 2: new Set(), 3: new Set() };
  const heroesUsedIn3ComboTeam = { 1: new Set(), 2: new Set(), 3: new Set() };

  // Check and apply 2-characters buff combinations for all teams
  for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
    for (const combinationName in buffCombinations) {
      const { requiredJobs } = buffCombinations[combinationName];

      if (requiredJobs.every((job) => teams[teamIndex].jobs.has(job))) {
        // Apply 2-characters buff combination for the current team
        teams[teamIndex].characters.forEach((character) => {
          if (requiredJobs.includes(character.job)) {
            // Apply custom stats for the combination buff
            // For example:
            if (combinationName === "Swordman+Swordman" && character.job === "Swordman") {
              character.def += 20;
            } else if (combinationName === "Lancer+Lancer" && character.job === "Lancer") {
              character.atk += 35;
            } else if (combinationName === "Archer+Archer" && character.job === "Archer") {
              character.hit += 10;
            }
          }
        });

        // Add the heroes used in this combination to the set
        requiredJobs.forEach((job) => heroesUsedIn2Combo[teamIndex].add(job));
        console.log(`Player in Team ${teamIndex} received the ${combinationName} buff!`);
      }
    }
  }

  // Check and apply 3-characters buff combinations for each team
  for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
    for (const combinationName in buffCombinations3) {
      const { requiredJobs } = buffCombinations3[combinationName];

      if (
        requiredJobs.every((job) => teams[teamIndex].jobs.has(job)) &&
        !requiredJobs.some((job) => heroesUsedIn2Combo[teamIndex].has(job))
      ) {
        const comboHeroes = requiredJobs.join("+");
        if (!heroesUsedIn3ComboTeam[teamIndex].has(comboHeroes)) {
          heroesUsedIn3ComboTeam[teamIndex].add(comboHeroes);

          // Apply 3-characters buff combination for the current team
          teams[teamIndex].characters.forEach((character) => {
            if (requiredJobs.includes(character.job)) {
              // Apply custom stats for the combination buff
              // For example:
              if (combinationName === "Swordman+Lancer+Archer") {
                character.aspd += 0.3;
                character.hit += 10;
              } else if (combinationName === "Swordman+Lancer+Magician") {
                character.def += 25;
                character.mDef += 25;
              }
            }
          });

          console.log(`Player in Team ${teamIndex} received the ${combinationName} buff!`);
        }
      }
    }
  }

  // Check if the player has all five unique jobs for 5-characters buff
  const hasAllJobs = new Set([...teams[1].jobs, ...teams[2].jobs, ...teams[3].jobs]).size === 5;
  if (hasAllJobs) {
    // Apply 5-characters buff with custom character stats for each team
    for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
      teams[teamIndex].characters.forEach((character) => {
        //character.int += 10;
        //character.vit += 10;
        // Apply other stat adjustments as needed for each team
      });
    }

    console.log("Player received the special buff for all teams!");
  }


    this.state.wave = 1;
    this.state.ethAddress = options.ethAddress;
    this.state.map = options.map
    this.state.dungeonId = options.ethAddress
    this.state.heroes = characters;

    if(this.state.heroes.length >= 10)
    {
      this.state.characterBuff1 = true;
    }

    if(this.state.heroes.length >= 15)
    {
      this.state.characterBuff1 = true;
    }

    this.state.drop = 0.0;
    this.state.diamond = await fetchDiamond(options.ethAddress) 
    this.state.bit = await fetchCoin(options.ethAddress,1)
    this.state.doge = await fetchCoin(options.ethAddress,2)    
    this.state.coin = await fetchCoin(options.ethAddress,3) 
    //this.state.monsters = monsters;
    for(let i = 0 ; i < 7 ; i++)
    {
      this.state.spawners_monsters.push(new Character_Array())
    }

    for(let i = 0 ; i < 7 ; i++)
    {
      this.state.spawners_chests.push(new Character_Array())
    }

    for(let i = 0 ; i < 1 ; i++)
    {
      this.state.spawners_boss.push(new Character_Array())
    }

    this.onMessage("spawnMonster", async (client, data) => {
      //if(data.index){
      const monster = await fetchRandomMonster(options.map, this.state.wave)
      this.state.spawners_monsters[data.index].character.length = 0;
      this.state.spawners_monsters[data.index].character.push(monster)
      //}
    });

    this.onMessage("spawnBoss", async (client, data) => {
      const monster = await fetchRandomBoss(options.map, this.state.wave)
      this.state.spawners_boss[data.index].character.length = 0;
      this.state.spawners_boss[data.index].character.push(monster)
    });

    this.onMessage("spawnChest", async (client, data) => {
      
      //if(data.index){
        const chest = await fetchRandomChest(data.map, this.state.wave)
        //console.log(chest)
        this.state.spawners_chests[data.index].character.length = 0;
        this.state.spawners_chests[data.index].character.push(chest)
      //}
      //console.log("Spawn chest ")
     // console.log(chest)
    });

    this.onMessage("recieveExp", async (client, data) => {
      const hero = this.state.heroes.find(c => c.id == data.character_id)
      //console.log("recieveExp")
      if(hero){
        //console.log("found hero " + hero.id)
        let result = await addExpToHero(this.state.ethAddress,hero,data.exp)
        characters = await fetchHeroesTreasure(options.ethAddress);
        this.state.heroes = characters;
      }
    });

    this.onMessage("recieveDiamond", async (client, data) => {
      //console.log(data.eth +" recieveDiamond")
      let result = await addDiamond(this.state.ethAddress,data.diamond)
      this.state.diamond = await fetchDiamond(options.ethAddress) 
    });

    this.onMessage("recieveCoin", async (client, data) => {
      let coin = await addCoin(this.state.ethAddress,data.type,this)
      //console.log("drop state is " + coin)
      if(data.type == "boss")
      {
        this.state.star = 0;
      }
      this.state.drop = coin;
      this.state.bit = await fetchCoin(options.ethAddress,1)
      this.state.doge = await fetchCoin(options.ethAddress,2)    
      this.state.coin = await fetchCoin(options.ethAddress,3) 
    });

    this.onMessage("recievePotion", async (client, data) => {
      console.log("Add potion!")
      let result = await addPotion(this.state.ethAddress,data.amount)
    });

    this.onMessage("finishDungeon", async () => {
      //const rewards = await finishDungeon(this.state.ethAddress, this.state.wave, this.state.dungeonId, this.state.map, this.state.heroes)
      //const rewardSchema = new RewardState_T()
      //rewardSchema.data = rewards
      //this.state.rewards = rewardSchema

      //this.clock.setTimeout(() => {
      //  this.disconnect()
      //}, 5000)
    })

    this.onMessage("usePotions", async (client, data) => {
      const result = await usePotions(data.eth,data.uid,data.amount);
    })
  }

  onJoin(client: Client) {
    this.broadcast("messages", `${client.sessionId} joined.`);

    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    this.broadcast("messages", `${client.sessionId} left.`);
    console.log(client.sessionId, "left!");
    //this.state.characters.delete(client.sessionId);
  }

  onDispose() {
    console.log("Dispose Huntroom");
  }
}
