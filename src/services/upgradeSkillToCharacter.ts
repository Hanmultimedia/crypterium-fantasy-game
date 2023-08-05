
import { fetchDiamond } from "./fetchDiamond";
import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });

interface BaseSkillModel extends Document {
    uid:string;
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

const CharacterSkillSchema = new Schema({
    character_id: { type: String, required: true },
    skills: {
    type: Map,
    of: {
        uid: { type: String, required: true },
        name: { type: String, required: true },
        level: { type: Number, required: true },
        jobRequired: { type: String, required: true }
      }
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
});

CharacterSkillSchema.pre<any>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function upgradeSkillToCharacter(eth:string,character_id: string , skill_id: string ,level:number): Promise<any> {
  
  let diamonds = await fetchDiamond(eth)
  const price = 
  [
    150,
    250,
    350,
    500,
    700,
    1000,
    1000,
    1000,
    1000,
    1000
  ]

  if(diamonds >= price[level] )
  {

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;
  //db.on('error', console.error.bind(console, 'connection error:'));

  let Inventory: any;
  try {
      Inventory = mongoose.model("Character_Skill");
  } catch (error) {
      Inventory = mongoose.model("Character_Skill", CharacterSkillSchema);
  }
  console.log("Upgrade Skill")
  let update = { $inc: { [`skills.${skill_id}.level`]: 1 } };
  const options = { new: true };
  const result = await Inventory.findOneAndUpdate({ character_id }, update, options);
  console.log("Upgrade Skill Finished")
  console.log(result)

  try {
    // Connect to MongoDB using your srv string
    // Define your user schema
    console.log("Fetch User To update Diamond")
    // Create a model from the schema

    let User: any;
    try {
      User =  mongoose.model('User');
    } catch (error) {
      User = mongoose.model('User', userSchema);
    }
    // Use the model to query for a user with a matching eth address
    let user = await User.findOne({ eth });
    // If a user was found, return coupon
    if (user) {
    user.diamond -= price[level]
    await user.save();
    }

  } catch (error) {
    console.log(error);
  }

  }
}