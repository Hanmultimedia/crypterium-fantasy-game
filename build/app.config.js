"use strict";
//import config from "@colyseus/tools";
//import { monitor } from "@colyseus/monitor";
//import { playground } from "@colyseus/playground";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Import your Room files
 */
const MyRoom_1 = require("./rooms/MyRoom");
const MenuRoom_1 = require("./rooms/MenuRoom");
const TreasureRoom_1 = require("./rooms/TreasureRoom");
const ArenaRoom_1 = require("./rooms/ArenaRoom");
const DungeonRoom_1 = require("./rooms/DungeonRoom");
exports.default = config({
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom_1.MyRoom);
        gameServer.define('MenuRoom', MenuRoom_1.MenuRoom);
        gameServer.define('TreasureRoom', TreasureRoom_1.TreasureRoom);
        gameServer.define('ArenaRoom', ArenaRoom_1.ArenaRoom);
        gameServer.define('DungeonRoom', DungeonRoom_1.DungeonRoom);
        //const port = 3000;
        //gameServer.listen(port);
    },
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!!");
        });
        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            //app.use("/", playground);
        }
        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        //app.use("/colyseus", monitor());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
