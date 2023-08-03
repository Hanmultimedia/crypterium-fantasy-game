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

    let characters = await fetchHeroesTreasure(options.ethAddress);
    const monsters = await fetchWaveMonsters(options.map, 1)
    //const dungeonId = await createDungeonRecord(options.ethAddress, characters, options.map)

    //

        const uniqueJobs = new Set();
    for (const character of characters) {
      uniqueJobs.add(character.job);
    }

    // Create a set to keep track of heroes used in 2-character combinations
    const heroesUsedIn2Combo = new Set();

    // Check and apply 2-characters buff combinations
    for (const combinationName in buffCombinations) {
      const requiredJobs = buffCombinations[combinationName];
      const hasCombination = requiredJobs.every((job) => uniqueJobs.has(job));

      if (hasCombination) {
        // Apply 2-characters buff combination with custom character stats
        switch (combinationName) {
          case "Swordman+Swordman":
            characters.forEach((character) => {
              character.def += 20;
            });
            break;
          case "Lancer+Lancer":
            characters.forEach((character) => {
              character.atk += 35;
            });
            break;
          case "Archer+Archer":
            characters.forEach((character) => {
              character.hit += 10;
            });
            break;
          case "Magician+Magician":
            characters.forEach((character) => {
              character.mAtk += 30;
            });
            break;
          case "Acolyte+Acolyte":
            characters.forEach((character) => {
              character.hpMAX += 80;
            });
            break;

          // Add more cases for other 2-characters buffs here
          // ...

          default:
            break;
        }

        // Optionally, you can apply a generic buff for all 2-character combinations here
        // For example:
        // options.player.applyBuff(combinationName);
        console.log(`Player received the ${combinationName} buff!`);

        // Add the heroes used in this 2-character combination to the set
        requiredJobs.forEach((job) => heroesUsedIn2Combo.add(job));
      }
    }

    // Check and apply 3-characters buff combinations
    // Here, we use a separate set to keep track of heroes used in 3-character combinations
    const heroesUsedIn3Combo = new Set();
    for (const character of characters) {
      for (const combinationName in buffCombinations3) {
        const requiredJobs = buffCombinations3[combinationName];
        const hasCombination = requiredJobs.every((job) => uniqueJobs.has(job));

        // Check if the heroes used in this 3-character combination have not been used in 2-character combinations
        if (hasCombination && !requiredJobs.some((job) => heroesUsedIn2Combo.has(job))) {
          const comboHeroes = requiredJobs.join("+");

          // Check if the heroes used in this 3-character combination have not been used before
          if (!heroesUsedIn3Combo.has(comboHeroes)) {
            heroesUsedIn3Combo.add(comboHeroes);

            // Apply 3-characters buff combination with custom character stats
      switch (combinationName) {
        case "Swordman+Lancer+Archer":
          characters.forEach((character) => {
            character.aspd += 0.3
            character.hit += 10
          });
          break;
        case "Swordman+Lancer+Magician":
          characters.forEach((character) => {
            character.def += 25
            character.mDef += 25
          });
          break;
        case "Swordman+Lancer+Acolyte":
          characters.forEach((character) => {
            character.def += 40
            character.hpMAX += 100
          });
          break;
        case "Swordman+Archer+Magician":
          characters.forEach((character) => {
            character.atk += 45
            character.hit += 10
          });
          break;
        case "Swordman+Archer+Acolyte":
          characters.forEach((character) => {
            character.def += 40
            character.flee += 5
          });
          break;
        case "Swordman+Magician+Acolyte":
          characters.forEach((character) => {
            character.hpMAX += 150
            character.spMAX += 100
          });
          break;
        case "Lancer+Archer+Magician":
          characters.forEach((character) => {
            character.range += 50
          });
          break;
        case "Lancer+Archer+Acolyte":
          characters.forEach((character) => {
            character.cri += 7
            character.flee += 5
          });
          break;
        case "Lancer+Magician+Acolyte":
          characters.forEach((character) => {
            character.mAtk += 30
            character.spMAX += 100
          });
          break;
        case "Archer+Magician+Acolyte":
          characters.forEach((character) => {
            character.mAtk += 40
            character.hit += 10
          });
          break;


        // Add more cases for other 3-characters buffs here
        // ...

        default:
          break;
      }

            // Optionally, you can apply a generic buff for all 3-character combinations here
            // For example:
            // options.player.applyBuff(combinationName);
            console.log(`Player received the ${combinationName} buff!`);
          }
        }
      }
    }

  // Check if the player has all five unique jobs for 5-characters buff
  const hasAllJobs = uniqueJobs.size === 5;
  if (hasAllJobs) {
    // Apply 5-characters buff with custom character stats
    characters.forEach((character) => {

     character.int += 10
     character.vit += 10
     character.agi += 10
     character.dex += 10
     character.luk += 10
     character.str += 10

     //console.log(character.attributes)

     const modifiedAttributes = {
      str: character.str,
      int: character.int,
      vit: character.vit,
      dex: character.dex,
      luk: character.luk,
      agi: character.agi,
    };

      const character_forstat = new CharacterTemplate(modifiedAttributes,character.job,character.uid,"",0,character.level,character.hp,character.sp,character.speed,character.range)
      const stat = makeStat(character_forstat)
      const characer = new Character()

      // Apply custom stats for 5-characters buff
      // For example:
    character.atk = characer.atk
    character.def = characer.def
    character.mAtk = characer.mAtk
    character.mDef = characer.mDef
    character.hpMAX = characer.hpMAX
    character.spMAX = characer.spMAX
    character.hit = characer.hit
    character.flee = characer.flee
    character.cri = characer.cri
    character.aspd = characer.aspd
    character.speed += 0.3
    });

    console.log("Player received the special buff!");
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
      console.log(data)
      //if(data.index){
        const chest = await fetchRandomChest(data.map, this.state.wave)
        //this.state.spawners_chests[data.index].character.length = 0;
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
