import { Skill } from "../rooms/MenuState";
import { fetchSkills } from "../services/fetchSkills";
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

baseSkillSchema.pre<BaseSkillModel>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function addSkillToCharacter(eth:string, character_id: string , skill_id: string): Promise<any> {

  let diamonds = await fetchDiamond(eth)
  const price = 
  [
    100,
    140,
    180,
    220,
    260,
    300,
    340,
    380,
    420
  ]
  if(diamonds >= price[0] )
  {
  const skills = await fetchSkills()
  const skill = skills.find( c => c.uid == skill_id)

  let s = {
      uid: skill.uid,
      level: 1,
      name: skill.name,
      jobRequired: skill.jobRequired
  }


  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;
  //db.on('error', console.error.bind(console, 'connection error:'));

  /////////////////////////


    //Add potion section
    console.log("Check skill inventory")
    let Inventory: any;
    try {
      Inventory = mongoose.model("Character_Skill");
    } catch (error) {
      Inventory = mongoose.model("Character_Skill", CharacterSkillSchema);
    }

    let updatedInventory = await Inventory.findOne(
    { character_id: character_id}
    );

    if (updatedInventory) {
    console.log("Update skill in inventory")
    if (!updatedInventory.skills) {
      console.log("No Skill Field")
      updatedInventory.skills = new Map();
    }
    if (!updatedInventory.skills.has(skill.uid)) {
      console.log("Skill Field but no skill")
      updatedInventory.skills.set(skill.uid, { uid: skill.uid, level: 1,name:skill.name ,jobRequired: skill.jobRequired  });
    }
    await updatedInventory.save();
    }else
    {
      console.log("Create New Skill")
      let BaseSkillModel: any;
      try {
        BaseSkillModel = mongoose.model("SkillInventory");
      } catch (error) {
        BaseSkillModel = mongoose.model("SkillInventory", baseSkillSchema);
      }
      const newSkill = new BaseSkillModel({ uid: skill.uid, level: 1,name:skill.name ,jobRequired: skill.jobRequired  });

      updatedInventory = await Inventory.create({
       character_id : character_id,
      skills: new Map([[skill.uid, { uid: skill.uid, level: 1,name:skill.name ,jobRequired: skill.jobRequired  }]])
      });
    }
    
    console.log("Finish buy skill")

  /////////////////////////

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
    let user = await User.findOne({ eth:eth });
    // If a user was found, return coupon
    if (user) {
    user.diamond -= price[0]
    await user.save();
    }

  } catch (error) {
    console.log(error);
  }

  //
  //mongoose.connection.close()

    //console.log(character_id + " buy skill " + skill_id)
    //await db.collection('Character_Skill').doc(character_id).collection("Skill").doc(s.uid).set(s)

    //await db.collection('Wallet').doc(eth).set({
    //diamond: firestore.FieldValue.increment(-price[0])
    //}, {merge: true})
  }

  //return null
}