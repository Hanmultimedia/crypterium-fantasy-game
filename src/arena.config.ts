import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
//import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { WebSocketTransport } from  "@colyseus/ws-transport";
import { MyRoom } from "./rooms/MyRoom";
import  { DungeonRoom }  from "./rooms/DungeonRoom";
import  { MenuRoom }  from "./rooms/MenuRoom";
import  { TreasureRoom }  from "./rooms/TreasureRoom";
import  { ArenaRoom }  from "./rooms/ArenaRoom";
const port = Number(process.env.PORT);
import cors from "cors";
import { fetchCharacters } from "./services/fetchCharacters";
import { fetchCharacterSkills } from "./services/fetchCharacterSkills";
import { fetchSkillsByJob } from "./services/fetchSkillsByJob";
import { fetchEquipments } from "./services/fetchEquipments";
import { fetchPotions } from "./services/fetchPotions";
import { fetchEquipmentsInventory } from "./services/fetchEquipmentsInventory";
import { fetchMaterialsInventory } from "./services/fetchMaterialsInventory";
import { fetchPotionsInventory } from "./services/fetchPotionsInventory";
import { fetchPotionSetting } from "./services/fetchPotionSetting";
import { Schema, type, ArraySchema} from "@colyseus/schema"
import { Equipment_Inventory } from "./rooms/MenuState";
import { Potion_Inventory } from "./rooms/MenuState";
import { Materials_Inventory } from "./rooms/MenuState";
import { Potion_Setting } from "./rooms/MenuState";
import { settingPotion } from "./services/settingPotion";
import { Room, Client } from "colyseus";
import updateCooldown from './services/cooldown/updateCooldown';
import getCooldown from './services/cooldown/getCooldown';

let rooms = {};
let gameServerGlobal;
export default  Arena({

    getId: () => "5392f78a31185dccc2582d679976544d",

    initializeGameServer: (gameServer) => {

        //gameServer.define('MyRoom', MyRoom);
       rooms["DungeonRoom"] = gameServer.define("DungeonRoom", DungeonRoom).enableRealtimeListing();
       rooms["MenuRoom"] = gameServer.define("MenuRoom", MenuRoom).enableRealtimeListing();
       rooms["TreasureRoom"] = gameServer.define("TreasureRoom", TreasureRoom).enableRealtimeListing();
       gameServer.define("ArenaRoom", ArenaRoom).enableRealtimeListing();
       gameServerGlobal = gameServer
    },

    initializeTransport: (options) => {

        return new WebSocketTransport({});

        /**
         * Define your server transports as Legacy WS (legacy)
         */
        // return new WebSocketTransport({
        //     ...options,
        //     pingInterval: 5000,
        //     pingMaxRetries: 3,
        // });
    },

    initializeExpress: (app) => {

        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        app.get("/get_character_skills/:characterid/:characterjob",async (req, res) => {
            const {characterid,characterjob} = req.params
            let skills = [];
            try {
            skills = await fetchCharacterSkills(characterid,characterjob)
            res.status(200).send(skills)
            } catch (error) {
                console.log(error)
                res.status(500).send(skills)
            }
        });

        app.get("/get_skills_by_job/:characterjob",async (req, res) => {
            const {characterjob} = req.params
            let skills = [];
            try {
            skills = await fetchSkillsByJob(characterjob)
            res.status(200).send(skills)
            } catch (error) {
                console.log(error)
                res.status(500).send(skills)
            }
        });

         app.get("/get_all_equipments/",async (req, res) => {
            let equipments = [];
            try {
            equipments = await fetchEquipments()
            //.log("Final Equipments")
            //console.log(equipments)
            res.status(200).send(equipments)

            } catch (error) {
                console.log(error)
                res.status(200).send(equipments)
            }
        });

        app.get("/calculate_equipments/:eth",async (req, res) => {
            const {eth} = req.params
            let equipments = [];
            let equipments_inventory_uid = [];
            let equipments_inventory = [];
            try {
            equipments = await fetchEquipments()
            equipments_inventory_uid = await fetchEquipmentsInventory(eth)

            equipments_inventory = new ArraySchema<Equipment_Inventory>()

           // for(let i = 0 ; i < equipments.length ; i++)
           // {
           for(let j = 0 ; j < equipments_inventory_uid.length ; j++)
           {
                    const e = new Equipment_Inventory()
                    e.uid = (equipments_inventory_uid[j])["uid"]
                    e.amount = (equipments_inventory_uid[j])["amount"]
                    equipments_inventory.push(e)
           }
     
            //}
            res.status(200).send(equipments_inventory)

            } catch (error) {
                console.log(error)
                res.status(200).send(equipments_inventory)
            }
        });

app.get("/get_current_onlines", async (req, res) => {
    try {

        console.log(gameServerGlobal.transport.wss.clients)
        if (!gameServerGlobal.transport.wss.clients) {
            console.log("No clients")
            res.status(200).send({ onlineCount: -1 });
        } else {
            const clientCount = gameServerGlobal.transport.wss.clients.size;
            console.log("return clients " + clientCount)
            res.status(200).send({ onlineCount: clientCount });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});


        app.get("/inventory_potions/:eth",async (req, res) => {
            const {eth} = req.params
            let potions = [];
            let potions_inventory_uid = [];
            let potions_inventory = [];
            try {
            potions = await fetchPotions()
            potions_inventory_uid = await fetchPotionsInventory(eth)
            potions_inventory = new ArraySchema<Potion_Inventory>()

            for(let i = 0 ; i < potions.length ; i++)
            {
            for(let j = 0 ; j < potions_inventory_uid.length ; j++)
            {
                if((potions_inventory_uid[j])["uid"] === potions[i].uid)
                {
                    const e = new Potion_Inventory()
                    e.uid = potions[i].uid
                    e.amount = (potions_inventory_uid[j])["amount"]
                    potions_inventory.push(e)
                }
            }
     
            }
            console.log("Final Potion")
            console.log(potions_inventory)
            res.status(200).send(potions_inventory)

            } catch (error) {
                console.log(error)
                res.status(200).send(potions_inventory)
            }
        });

        app.get("/inventory_materials/:eth",async (req, res) => {
            const {eth} = req.params
            //let potions = [];
            let potions_inventory_uid = [];
            let potions_inventory = [];
            try {
            //potions = await fetchPotions()
            potions_inventory_uid = await fetchMaterialsInventory(eth)
            potions_inventory = new ArraySchema<Materials_Inventory>()

            for(let j = 0 ; j < potions_inventory_uid.length ; j++)
            {
                    const e = new Potion_Inventory()
                    e.uid = (potions_inventory_uid[j])["uid"]
                    e.amount = (potions_inventory_uid[j])["amount"]
                    potions_inventory.push(e)
            }
     
            
            console.log("Final Materials")
            console.log(potions_inventory)
            res.status(200).send(potions_inventory)

            } catch (error) {
                console.log(error)
                res.status(200).send(potions_inventory)
            }
        });


        app.get("/setting_potion/:eth/:hpuid/:spuid/:hppercent/:sppercent/",async (req, res) => {
            const {eth,hpuid,spuid,hppercent,sppercent} = req.params
            try {
                await settingPotion(eth,hpuid,spuid,parseInt(hppercent),parseInt(sppercent))
                res.status(200).send()
            } catch (error) {
                console.log(error)
                res.status(500).send()
            }
        });

        app.get("/online",async (req, res) => {
            res.status(200).send("online")
        });

        app.get("/get_setting_potion/:eth",async (req, res) => {
            const {eth} = req.params
            try {
                let settings = await fetchPotionSetting(eth)
                console.log("result")
                if(settings.length > 0){
                console.log(settings[0])
                const s = new Potion_Setting()
                s.hp_uid = ""
                s.sp_uid = ""
                s.hp_percent = 0
                s.sp_percent = 0

                s.hp_uid = settings[0].hpuid
                s.sp_uid = settings[0].spuid
                s.hp_percent = settings[0].hppercent
                s.sp_percent = settings[0].sppercent
                console.log("final " + settings[0].hpuid + " " + settings[0].spuid + " " + settings[0].hppercent + " " + 
                    settings[0].sppercent)
                console.log(s)
                res.status(200).send(s)
                }else
                {
                    const s = new Potion_Setting()
                    s.hp_uid = ""
                    s.sp_uid = ""
                    s.hp_percent = 0
                    s.sp_percent = 0
                   res.status(200).send(s) 
                }
            } catch (error) {
                console.log(error)
                res.status(500).send()
            }
        });

        app.get("/get_points_need/:point1/:point2/:point3/:point4/:point5/:point6",async (req, res) => {
            const {point1,point2,point3,point4,point5,point6} = req.params
            const points = 
            [
                point1,
                point2,
                point3,
                point4,
                point5,
                point6
            ]
            let needs = [];
            try {

                for(let i = 0 ; i < points.length ; i++)
                {
                    let calcStat = 0
                    if (parseInt(points[i]) < 100) {
                        calcStat = Math.floor((parseInt(points[i]) - 1) / 10) + 2;
                    } else {
                        calcStat = (4 * (Math.floor((parseInt(points[i]) - 100) / 5))) + 16;
                    }
                    needs.push(calcStat)
                }

                res.status(200).send(needs)
            } catch (error) {
                console.log(error)
                res.status(500).send(needs)
            }
        });

        app.get('/cooldowns/:character_id/:cooldown/:ethOwner', async (req, res) => {
            const { character_id, cooldown, ethOwner } = req.params;
            try {
                await updateCooldown.update(character_id, parseInt(cooldown), ethOwner);
                res.status(200).send();
            } catch (error) {
                console.log(error);
                res.status(500).send();
            }
        });

        app.get('/cooldowns/:character_id', async (req, res) => {
            const { character_id } = req.params;
            try {
            const cooldown = await getCooldown.get(character_id);
            res.status(200).json({ cooldown });
            } catch (error) {
                console.log(error);
                res.status(500).send();
            }
        });

        //app.use(cors());

        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        console.log(`Listening on ws://localhost:${ port }`)
    }
});



