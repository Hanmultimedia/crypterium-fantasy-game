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
import { Schema, Document }  from 'mongoose';
import { updateTreasureStat } from '../services/stat/updateTreasureStat';

  const baseMonsterSchema = new Schema({
    uid: { type: String, required: true },
    atk: { type: Number, required: true },
    def: { type: Number, required: true },
    name: { type: String, required: true },
    aspd: { type: Number, required: true },
    cri: { type: Number, required: true },
    exp: { type: Number, required: true },
    free: { type: Number, required: true },
    hit: { type: Number, required: true },
    hp: { type: Number, required: true },
    level: { type: Number, required: true },
    mAtk: { type: Number, required: true },
    mDef: { type: Number, required: true },
    range: { type: Number, required: true },
    speed: { type: Number, required: true },
    type: { type: String, required: true },
    vision: { type: Number, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});



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
  characters:any;

  async onCreate(options:any) {
    options.ethAddress = options.ethAddress.toLowerCase();
    this.roomId = options.ethAddress;
    //console.log("Treasure created!", options);
    this.setState(new DungeonState());
    this.setSeatReservationTime(100000) 

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:CPh76oCwQsLELHBg@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
       // Listen for the 'disconnected' event
    /*db.on('disconnected', () => {
      console.log('Database connection lost. Reconnecting...');
      // Mongoose will automatically attempt to reconnect
    });*/

    this.characters = await fetchHeroesTreasure(options.ethAddress);
    const monsters = await fetchWaveMonsters(options.map, 1)

    let MonsterModel;

    try 
    {
      MonsterModel = mongoose.model('BaseMonster');
    }catch (error)
    {
      MonsterModel = mongoose.model('BaseMonster',baseMonsterSchema);
    }
    
    const monsters_data = await MonsterModel.find({});

    this.calculateBuff(options)

    this.state.wave = 1;
    this.state.ethAddress = options.ethAddress;
    this.state.map = options.map
    this.state.dungeonId = options.ethAddress
    this.state.heroes = this.characters;

    if(this.state.heroes.length >= 10)
    {
      this.state.characterBuff1 = true;
    }

    if(this.state.heroes.length >= 15)
    {
      this.state.characterBuff2 = true;
    }

    this.state.drop = 0.0;
    this.state.diamond = await fetchDiamond(options.ethAddress) 
    this.state.bit = await fetchCoin(options.ethAddress,1)
    this.state.doge = await fetchCoin(options.ethAddress,2)    
    this.state.coin = await fetchCoin(options.ethAddress,3) 
    //this.state.monsters = monsters;
    for(let i = 0 ; i < 15 ; i++)
    {
      this.state.spawners_monsters.push(new Character_Array())
    }

    for(let i = 0 ; i < 15 ; i++)
    {
      this.state.spawners_chests.push(new Character_Array())
    }

    for(let i = 0 ; i < 1 ; i++)
    {
      this.state.spawners_boss.push(new Character_Array())
    }

this.onMessage("spawnMonster", async (client, data) => {
  //console.log("spawnMonster" + data.index);
  // Fetch the random monster
  const monster = await fetchRandomMonster(options.map, this.state.wave , monsters_data);

  // Ensure the data.index is within the bounds of the spawners_monsters array
  if (data.index >= 0 && data.index < this.state.spawners_monsters.length) {
    // Use setAt method to update the element at the specified index
    this.state.spawners_monsters[data.index].character.length = 0;
    this.state.spawners_monsters[data.index].character.push(monster);
  }
});


    this.onMessage("spawnBoss", async (client, data) => {
      const monster = await fetchRandomBoss(options.map, this.state.wave)
      this.state.spawners_boss[data.index].character.length = 0;
      this.state.spawners_boss[data.index].character.push(monster)
    });

    this.onMessage("updateTreasureStat", async (client, data) => {
      const result = await updateTreasureStat(data.id, data.hp , data.sp , data.ethOwner)
    });

    this.onMessage("spawnChest", async (client, data) => {
      //console.log("spawnChest"+data.index)
      //if(data.index){
        const chest = await fetchRandomChest(data.map, this.state.wave , monsters_data)
        //console.log(chest)
        this.state.spawners_chests[data.index].character.length = 0;
        this.state.spawners_chests[data.index].character.push(chest)
      //}
      //console.log("Spawn chest ")
     // console.log(chest)
    });


    //console.log(this.state.heroes)

    this.onMessage("recieveExp", async (client, data) => {
    const heroIndex = this.state.heroes.findIndex(c => c.id == data.character_id);

  if (heroIndex !== -1) {
    // Update the hero's experience in the array

    // Perform level-up checks and other logic
    let result = await addExpToHero(this.state.ethAddress, this.state.heroes[heroIndex], data.exp);
    this.state.heroes[heroIndex].exp += data.exp;
    this.state.heroes[heroIndex].level = result;

    this.characters = await fetchHeroesTreasure(options.ethAddress);
    this.state.heroes = this.characters;
    this.calculateBuff(options)
    //this.state.heroes[heroIndex].exp += data.exp;
    //this.state.heroes[heroIndex].level = result;

    // Rest of your code...
  }
});

    /*this.onMessage("recieveExp", async (client, data) => {
      const hero = this.state.heroes.find(c => c.id == data.character_id)
      //console.log("recieveExp")
      if(hero){
        //console.log("found hero " + hero.id)
        let result = await addExpToHero(this.state.ethAddress,hero,data.exp)
        //characters = await fetchHeroesTreasure(options.ethAddress);
        //this.state.heroes = characters;
      }
    });*/

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

  calculateBuff(options:any)
  {
    this.state.buffDescriptions.length = 0

      this.state.buffs1.length = 0;
      this.state.buffs2.length = 0;
      this.state.buffs3.length = 0;

      for (let j = 0; j < 3; j++) {
          this.state.buffs1.push(false);
          this.state.buffs2.push(false);
          this.state.buffs3.push(false);
      }
    
  
    const teams = {
      1: { characters: [], jobs: new Set() },
      2: { characters: [], jobs: new Set() },
      3: { characters: [], jobs: new Set() },
    };

    for (const character of this.characters) {
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

//const buffDescriptions: { [teamIndex: number]: string[] } = {};
for(let i = 0 ; i < 3 ; i++){
  this.state.buffDescriptions.push("");
}
// Check and apply 2-characters buff combinations for all teams
for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {

  this.state.buffDescriptions[teamIndex] = ""
  let found : boolean = false

  for (const combinationName in buffCombinations) {
    const requiredJobs = buffCombinations[combinationName];

    // Check if all required jobs are present in the team and at least two characters of each job are present
    if (
      requiredJobs.every((job) => teams[teamIndex].jobs.has(job)) &&
      requiredJobs.every((job) => teams[teamIndex].characters.filter((character) => character.job === job).length === 2)
      && requiredJobs.every((job) => !heroesUsedIn2Combo[teamIndex].has(job))
    ) {

      if(teamIndex == 1)
      {
        this.state.buffs1[0] = true;
      }
      if(teamIndex == 2)
      {
        this.state.buffs2[0] = true;
      }
      if(teamIndex == 3)
      {
        this.state.buffs3[0] = true;
      }
      
      // Apply 2-characters buff combination for the current team
      teams[teamIndex].characters.forEach((character) => {
        if (!found && requiredJobs.includes(character.job)) {
          found = true
          // Apply custom stats for the combination buff
          switch (combinationName) {
            case "Swordman+Swordman":
              character.def += 20;
              this.state.buffDescriptions[teamIndex-1] += ("Def +20\n")
              break;
            case "Lancer+Lancer":
              character.atk += 35;
              this.state.buffDescriptions[teamIndex-1] += ("Atk +35\n")
              break;
            case "Archer+Archer":
              character.hit += 10;
              this.state.buffDescriptions[teamIndex-1] += ("Hit +10\n")
              break;
            case "Magician+Magician":
              character.mAtk += 30;
              this.state.buffDescriptions[teamIndex-1] += ("mAtk +30\n")
              break;
            case "Acolyte+Acolyte":
              character.hpMAX += 80;
              this.state.buffDescriptions[teamIndex-1] += ("Max HP +80\n")
              break;
            // Add more cases for other 2-characters buffs here
            // ...
            default:
              break;
          }
        }
      });

      // Add the heroes used in this combination to the set
      requiredJobs.forEach((job) => heroesUsedIn2Combo[teamIndex].add(job));
      //console.log(`Player in Team ${teamIndex} received the ${combinationName} buff! ${options.ethAddress}`);
      //console.log(this.state.buffDescriptions[teamIndex-1])
      break;
    }

  }
}

/////

// Create a set to keep track of unique jobs in each player's team
const uniqueJobsByTeam = { 1: new Set(), 2: new Set(), 3: new Set() };

// Iterate through the characters and add their jobs to the corresponding team's uniqueJobs set
for (const character of this.characters) {
  if (character.treasure1 >= 0) {
    uniqueJobsByTeam[1].add(character.job);
  }
  if (character.treasure2 >= 0) {
    uniqueJobsByTeam[2].add(character.job);
  }
  if (character.treasure3 >= 0) {
    uniqueJobsByTeam[3].add(character.job);
  }
}

// Check if any team has all five unique jobs for 5-characters buff
for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {
  const hasAllJobs = uniqueJobsByTeam[teamIndex].size === 5;
  if (hasAllJobs) {

     this.state.buffDescriptions[teamIndex-1] += ("All Stats +6\n")
     this.state.buffDescriptions[teamIndex-1] += ("Speed +0.3\n")

      if(teamIndex == 1)
      {
        this.state.buffs1[2] = true;
      }
      if(teamIndex == 2)
      {
        this.state.buffs2[2] = true;
      }
      if(teamIndex == 3)
      {
        this.state.buffs3[2] = true;
      }

    // Apply 5-characters buff for the current team
    teams[teamIndex].characters.forEach((character) => {
      // Apply custom stats for the 5-characters buff
     character.int += 6
     character.vit += 6
     character.agi += 6
     character.dex += 6
     character.luk += 6
     character.str += 6

     //console.log(character.attributes)

     const modifiedAttributes = {
      str: 6,
      int: 6,
      vit: 6,
      dex: 6,
      luk: 6,
      agi: 6,
    };

      const character_forstat = new CharacterTemplate(modifiedAttributes,character.job,character.uid,"",0,character.level,character.hp,character.sp,character.speed,character.range)
      const stat = makeStat(character_forstat)

      // Apply custom stats for 5-characters buff
      // For example:
    character.atk += stat.atk
    character.def += stat.def
    character.mAtk += stat.mAtk
    character.mDef += stat.mDef
    character.hpMAX += stat.hpMAX
    character.spMAX += stat.spMAX
    character.hit += stat.hit
    character.flee += stat.flee
    character.cri += stat.cri
    character.aspd += stat.aspd
    character.speed += 0.3

    });

    //console.log(`Player in Team ${teamIndex} received the 5-characters buff! ${options.ethAddress}`);
  }
}

////

// Check and apply 3-characters buff combinations for all teams
for (let teamIndex = 1; teamIndex <= 3; teamIndex++) {

  let found : boolean = false
  for (const combinationName in buffCombinations3) {
    const requiredJobs = buffCombinations3[combinationName];
     const hasAllJobs = uniqueJobsByTeam[teamIndex].size === 5;
    // Check if all required jobs are present in the team and not already used in a 2-character combination
    if (!found && !hasAllJobs&&
      requiredJobs.every((job) => teams[teamIndex].jobs.has(job)) &&
      requiredJobs.every((job) => !heroesUsedIn2Combo[teamIndex].has(job))
      && requiredJobs.every((job) => !heroesUsedIn3ComboTeam[teamIndex].has(job))
    ) {

      if(teamIndex == 1)
      {
        this.state.buffs1[1] = true;
      }
      if(teamIndex == 2)
      {
        this.state.buffs2[1] = true;
      }
      if(teamIndex == 3)
      {
        this.state.buffs3[1] = true;
      }
      // Apply 3-characters buff combination for the current team
      teams[teamIndex].characters.forEach((character) => {
        if (!found && requiredJobs.includes(character.job)) {
          //console.log("Not Found")
          // Apply custom stats for the combination buff
        switch (combinationName) {
        case "Swordman+Lancer+Archer":
          this.characters.forEach((character) => {
            character.aspd += 0.3
            character.hit += 10
          });

            this.state.buffDescriptions[teamIndex-1] += ("Aspd +0.3\n")
            this.state.buffDescriptions[teamIndex-1] += ("Hit +10\n")
          break;
        case "Swordman+Lancer+Magician":
          this.characters.forEach((character) => {
            character.def += 25
            character.mDef += 25
          });

            this.state.buffDescriptions[teamIndex-1] += ("Def +25\n")
            this.state.buffDescriptions[teamIndex-1] += ("mDef +25\n")
          break;
        case "Swordman+Lancer+Acolyte":
          this.characters.forEach((character) => {
            character.def += 40
            character.hpMAX += 100
          });

            this.state.buffDescriptions[teamIndex-1] += ("Def +40\n")
            this.state.buffDescriptions[teamIndex-1] += ("Max HP +100\n")
          break;
        case "Swordman+Archer+Magician":
          this.characters.forEach((character) => {
            character.atk += 45
            character.hit += 10
          });

            this.state.buffDescriptions[teamIndex-1] += ("Atk +45\n")
            this.state.buffDescriptions[teamIndex-1] += ("Hit +10\n")
          break;
        case "Swordman+Archer+Acolyte":
          this.characters.forEach((character) => {
            character.def += 40
            character.flee += 5
          });

            this.state.buffDescriptions[teamIndex-1] += ("Def +40\n")
            this.state.buffDescriptions[teamIndex-1] += ("Flee +5\n")
          break;
        case "Swordman+Magician+Acolyte":
          this.characters.forEach((character) => {
            character.hpMAX += 150
            character.spMAX += 100
          });

            this.state.buffDescriptions[teamIndex-1] += ("HP Max +150\n")
            this.state.buffDescriptions[teamIndex-1] += ("SP Max +100\n")
          break;
        case "Lancer+Archer+Magician":
          this.characters.forEach((character) => {
            character.range += 50
          });

            this.state.buffDescriptions[teamIndex-1] += ("Range +1\n")
          break;
        case "Lancer+Archer+Acolyte":
          this.characters.forEach((character) => {
            character.cri += 7
            character.flee += 5
          });

            this.state.buffDescriptions[teamIndex-1] += ("Cri +7\n")
            this.state.buffDescriptions[teamIndex-1] += ("Flee +5\n")
          break;
        case "Lancer+Magician+Acolyte":
          this.characters.forEach((character) => {
            character.mAtk += 30
            character.spMAX += 100
          });

            this.state.buffDescriptions[teamIndex-1] += ("mAtk +30\n")
            this.state.buffDescriptions[teamIndex-1] += ("Max SP +100\n")
          break;
        case "Archer+Magician+Acolyte":
          this.characters.forEach((character) => {
            character.mAtk += 40
            character.hit += 10
          });

            this.state.buffDescriptions[teamIndex-1] += ("mAtk +40\n")
            this.state.buffDescriptions[teamIndex-1] += ("Hit +10\n")
          break;


        // Add more cases for other 3-characters buffs here
        // ...

        default:
          break;
      }

      found = true;

        }
      });

      // Add the heroes used in this combination to the set
      requiredJobs.forEach((job) => heroesUsedIn3ComboTeam[teamIndex].add(job));
      //console.log(`Player in Team ${teamIndex} received the ${combinationName} buff! ${options.ethAddress}`);
      break;
    }
  }
}
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
