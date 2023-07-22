import mongoose, { Schema, Document }  from 'mongoose';
import { fetchSkillPool } from "./skillPools";

interface BaseSkillModel extends Document {
    uid:string;
    des: string;
    name: string;
    level: number;
    jobRequired: string;
    created_date: Date;
    updated_date: Date;
}

const baseSkillSchema = new Schema({
    uid: { type: String, required: true },
    des: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true },
    jobRequired: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});

baseSkillSchema.pre<BaseSkillModel>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function createSkill(): Promise<any> {

  const skillPools = fetchSkillPool()

   // Connect to MongoDB using the SRV connection string
  //mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const connection = mongoose.connection;
  return new Promise((resolve, reject) => {
    connection.on('open', async () => {
      console.log("MongoDB database connection established successfully");
      //Define the schema for the "BaseMonster" collection
    
    // Create a model for the "BaseMonster" collection
    let Skill: any;
    try {
      Skill = mongoose.model<BaseSkillModel>('Skill');
    } catch (error) {
      Skill = mongoose.model<BaseSkillModel>('Skill', baseSkillSchema);
    }
  
    for (let i = 0 ; i < skillPools.length ; i++){
      const newSkill = new Skill(skillPools[i]);
      await newSkill.save()
      .then(() => {
          
          if(i+1 >= skillPools.length){
            //console.log("Create monsters successfully")
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