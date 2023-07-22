"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEquipment = exports.baseEquipmentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const equipmentPools2_1 = require("./equipmentPools2");
exports.baseEquipmentSchema = new mongoose_1.Schema({
    uid: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    abilities: { type: ["String"], required: true },
    jobRequired: { type: mongoose_1.Schema.Types.Mixed, required: true },
    aspd: { type: Number, required: true },
    atk: { type: Number, required: true },
    cri: { type: Number, required: true },
    criDamage: { type: Number, required: true },
    def: { type: Number, required: true },
    flee: { type: Number, required: true },
    hit: { type: Number, required: true },
    hpMAX: { type: Number, required: true },
    spMAX: { type: Number, required: true },
    mAtk: { type: Number, required: true },
    mDef: { type: Number, required: true },
    speed: { type: Number, required: true },
    price: { type: Number, required: true },
    slot: { type: Number, required: true },
    level_required: { type: Number, required: true },
    icon: { type: String, required: true },
    type: { type: String, required: true },
    range: { type: Number, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});
exports.baseEquipmentSchema.pre('save', function (next) {
    this.updated_date = new Date();
    next();
});
async function createEquipment() {
    const equipmentPools = (0, equipmentPools2_1.fetchEquipmentPool)();
    // Connect to MongoDB using the SRV connection string
    //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
    const connection = mongoose_1.default.connection;
    console.log("Create Equipment Set");
    //Define the schema for the "BaseEquipment" collection
    // Create a model for the "BaseEquipment" collection
    let Equipment;
    try {
        Equipment = mongoose_1.default.model('Equipment');
    }
    catch (error) {
        Equipment = mongoose_1.default.model('Equipment', exports.baseEquipmentSchema);
    }
    for (let i = 0; i < equipmentPools.length; i++) {
        const newEquipment = new Equipment(equipmentPools[i]);
        await newEquipment.save()
            .then(() => {
            if (i + 1 >= equipmentPools.length) {
                //console.log("Create monsters successfully")
                //connection.close();
            }
        })
            .catch(err => {
            console.log(err);
            //connection.close();
        });
    }
}
exports.createEquipment = createEquipment;
