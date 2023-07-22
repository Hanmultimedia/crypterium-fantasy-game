
import { Skill_Character } from "../rooms/MenuState";
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

baseSkillSchema.pre<BaseSkillModel>('save', function (next) {
    this.updated_date = new Date();
    next();
});

export async function fetchCharacterSkills(character_id:string,job:string): Promise<any> {

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');
  const db = mongoose.connection;

  //db.on('error', console.error.bind(console, 'connection error:'));

    // we're connected!
    console.log("Connected with mongo to get character skills")
    let Inventory: any;
    try {
      Inventory =  mongoose.model('Character_Skill');
    } catch (error) {
      Inventory = mongoose.model('Character_Skill', CharacterSkillSchema);
    }
    try {
      const skills:any[] = []
      const skills_data = await  Inventory.find({character_id:character_id});
      //console.log("Skill Data")
      //console.log(skills_data)
      for(let i = 0 ; i < skills_data.length ; i++){
        for (const key of skills_data[i].skills.keys()) {
            const skill = new Skill_Character()
            const s = skills_data[i].skills.get(key);
            skill.uid = s.uid
            skill.name = s.name
            skill.level = s.level
            skills.push(skill)
            }
      }


      //mongoose.connection.close()
      //console.log("return character skills")
      //console.log(skills)
      return skills;
    } catch (err) {
      console.log(err);
      //mongoose.connection.close()
      return err
    }
  
  /*const snapshot = await db.collection('Character_Skill').doc(character_id).collection('Skill').get()
  const skills:any[] = []

  snapshot.forEach((doc) => {
    const data:any = doc.data()
    let skill = new Skill_Character()
    skill.uid = doc.id
    skill.name = data.name
    skill.level = data.level
    console.log(job)
    console.log(data)
    let passRequirement = false 
    if(job == "Archer" && data.jobRequired[0]=="Archer")
    {
        passRequirement = true
    }

    if(job == "Magician" && data.jobRequired[0]=="Magician")
    {
        passRequirement = true
    }

    if(job == "Swordman" && data.jobRequired[0]=="Swordman")
    {
        passRequirement = true
    }

    if(job == "Acolyte" && data.jobRequired[0]=="Acolyte")
    {
        passRequirement = true
    }

    if(job == "Lancer" && data.jobRequired[0]=="Lancer")
    {
        passRequirement = true
    }

    if(passRequirement){
      skills.push(skill)
    }

  });*/

  //return skills
}