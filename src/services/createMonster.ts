import mongoose, { Schema, Document }  from 'mongoose';
import { fetchMonsterPool } from "./monsterPools";

interface BaseMonsterModel extends Document {
    uid: string;
    atk: number;
    def: number;
    name: string;
    aspd: number;
    cri: number;
    exp:number;
    free:number;
    hit:number;
    hp:number;
    level:number;
    mAtk:number;
    mDef: number;
    range:number;
    speed:number;
    type:string;
    vision:number;
    created_date: Date;
    updated_date: Date;
}

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

baseMonsterSchema.pre<BaseMonsterModel>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function createMonster(): Promise<any> {

  const monsterPools = fetchMonsterPool()

   // Connect to MongoDB using the SRV connection string
  //mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const connection = mongoose.connection;
  let newMonster
  return new Promise((resolve, reject) => {
    connection.on('open', async () => {
      console.log("MongoDB database connection established successfully");
      //Define the schema for the "BaseMonster" collection
    
    // Create a model for the "BaseMonster" collection
    let BaseMonster: any;
    try {
      BaseMonster =  mongoose.model<BaseMonsterModel>('BaseMonster');
    } catch (error) {
      BaseMonster = mongoose.model<BaseMonsterModel>('BaseMonster', baseMonsterSchema);
    }
  
    for (let i = 0 ; i < monsterPools.length ; i++){
      // Insert a new document into the "BaseMonster" collection
      newMonster = new BaseMonster(monsterPools[i]);
      await newMonster.save()
      .then(() => {
          
          if(i+1 >= monsterPools.length){
            console.log("Create monsters successfully")
            resolve("success");
            //connection.close();
          }
      })
      .catch(err => 
        {
          console.log(err);
          reject(err)
          //connection.close();
        });
      }
    });
  });
}