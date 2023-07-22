import mongoose, { Schema, Document }  from 'mongoose';
import { fetchEquipmentPool } from "./equipmentPools2";

interface BaseEquipmentModel extends Document {
    uid:string;
    description: string;
    name: string;
    abilities: string[];
    jobRequired: [];
    aspd: number;
    atk: number;
    cri: number;
    criDamage : number;
    def : number;
    flee : number;
    hit : number;
    hpMAX : number;
    spMAX : number;
    mAtk : number;
    mDef : number;
    speed : number;
    price : number;
    slot: number;
    icon: string;
    type: string;
    range: number;
    isDelete: boolean;
    created_date: Date;
    updated_date: Date;
    level_required: Number;
}

export const baseEquipmentSchema = new Schema({
    uid: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    abilities: { type: ["String"], required: true },
    jobRequired: { type: Schema.Types.Mixed, required: true },
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

baseEquipmentSchema.pre<BaseEquipmentModel>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function createEquipment(): Promise<any> {

  const equipmentPools = fetchEquipmentPool()

   // Connect to MongoDB using the SRV connection string
  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const connection = mongoose.connection;

      console.log("Create Equipment Set");
      //Define the schema for the "BaseEquipment" collection
    
    // Create a model for the "BaseEquipment" collection
    let Equipment: any;
    try {
      Equipment = mongoose.model<BaseEquipmentModel>('Equipment');
    } catch (error) {
      Equipment = mongoose.model<BaseEquipmentModel>('Equipment', baseEquipmentSchema);
    }
  
    for (let i = 0 ; i < equipmentPools.length ; i++){
      const newEquipment = new Equipment(equipmentPools[i]);
      await newEquipment.save()
      .then(() => {
          
          if(i+1 >= equipmentPools.length){
            //console.log("Create monsters successfully")
            
            //connection.close();
          }
      })
      .catch(err => 
        {
          console.log(err);
          //connection.close();
        });
      }
}