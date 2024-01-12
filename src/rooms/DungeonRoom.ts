import { Room, Client } from "colyseus";
import { fetchHeroes } from "../services/fetchHeroes";
import { addMaterials } from "../services/addMaterials";
import { fetchWaveMonsters } from "../services/fetchWaveMonsters";
import { usePotions } from "../services/usePotions";
import { createDungeonRecord, finishDungeon, updateDungeonRecord } from "../services/makeDungeonRecord";
import { DungeonState, RewardState } from "./DungeonState";
import mongoose from 'mongoose';
export class DungeonRoom extends Room<DungeonState> {
  maxClients = 1;
  map:string;
  async onCreate(options:any) {

    await mongoose.connect('mongodb+srv://CPAY-CF-USER:CPh76oCwQsLELHBg@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const db = mongoose.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    options.ethAddress = options.ethAddress.toLowerCase();
    this.roomId = options.ethAddress;
    console.log("Dungeon created!", options);
    this.setState(new DungeonState());

    this.setSeatReservationTime(100000) 
    const characters = await fetchHeroes(options.ethAddress);
    
 
    const dungeonId = await createDungeonRecord(options.ethAddress, characters, options.map)
    this.map = options.map;
    this.state.wave = 1;
    this.state.ethAddress = options.ethAddress;
    this.state.map = options.map
    this.state.dungeonId = dungeonId
    this.state.heroes = characters;

    this.onMessage("incrementWave", (client, data) => {
    this.state.wave++;

    this.state.heroes.forEach((hero) => {
        hero.hp = data[hero.id].hp;
        hero.sp = data[hero.id].sp;
        if (hero.hp > 0) {
          hero.lastWave = this.state.wave - 1
        }
      });
      updateDungeonRecord(this.state.ethAddress, this.state.heroes, this.state.wave, this.state.dungeonId)
    });

    this.onMessage("respawnMonsters", async () => {
      const monsters = await fetchWaveMonsters(options.map, this.state.wave)
      this.state.monsters = monsters
    });

    this.onMessage("finishDungeon", async () => {
      const rewards = await finishDungeon(this.state.ethAddress, this.state.wave, this.state.dungeonId, this.state.map, this.state.heroes)
      const rewardSchema = new RewardState()
      rewardSchema.data = rewards
      this.state.rewards = rewardSchema

      this.clock.setTimeout(() => {
        this.disconnect()
      }, 5000)
    })

    this.onMessage("usePotions", async (client, data) => {
      const result = await usePotions(data.eth,data.uid,data.amount);
    })

    this.onMessage("addMaterials", async (client, data) => {
      const result = await addMaterials(this.state.ethAddress,data.mat_uid,data.amount);
      if(result)
      {
        //this.state.diamonds = result["diamond"]
        //this.state.potions_inventory.push(result["potion"] as Potion_Inventory)
      }
    })
  }

  async onJoin(client: Client) {
    this.broadcast("messages", `${client.sessionId} joined.`);
    console.log(client.sessionId, "joined!");

    const monsters = await fetchWaveMonsters(this.map, 1)
    this.state.monsters = monsters;
    console.log("FinishedfetchWaveMonsters")
    //console.log(monsters)
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
