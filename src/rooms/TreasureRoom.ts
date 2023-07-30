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

    this.state.wave = 1;
    this.state.ethAddress = options.ethAddress;
    this.state.map = options.map
    this.state.dungeonId = options.ethAddress
    this.state.heroes = characters;
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
      const monster = await fetchRandomMonster(options.map, this.state.wave);
      this.state.spawners_monsters[data.index].character.length = 0;
      this.state.spawners_monsters[data.index].character.push(monster);
    });

    this.onMessage("spawnBoss", async (client, data) => {
      const monster = await fetchRandomBoss(options.map, this.state.wave);
      this.state.spawners_boss[data.index].character.length = 0;
      this.state.spawners_boss[data.index].character.push(monster);
    });

    this.onMessage("spawnChest", async (client, data) => {
      const chest = await fetchRandomChest(data.map, this.state.wave);
      this.state.spawners_chests[data.index].character.length = 0;
      this.state.spawners_chests[data.index].character.push(chest);
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
      let coin = await addCoin(this.state.ethAddress,data.type)
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
