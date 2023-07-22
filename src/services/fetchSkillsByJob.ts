
import { Skill } from "../rooms/MenuState";
import mongoose, { Schema, Document }  from 'mongoose';

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

export async function fetchSkillsByJob(job:string): Promise<any> {
  
  /*const snapshot = await db.collection('Skill').get()
  const skills:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
    const skill = new Skill()
    skill.uid = doc.id
    skill.name = data.name
    if(data.jobRequired){
      skill.jobRequired = data.jobRequired
    }
    skill.level = data.level
    skill.des = data.des
    if(skill.jobRequired.includes(job)){
      skills.push(skill)
    }

  });*/

  //await mongoose.connect('mongodb+srv://CPAY-CF-USER:Pul6GVdRV5C7j82f@cpay-cf.zcgbftb.mongodb.net/crypterium-fantasy-game?retryWrites=true&w=majority');

  const db = mongoose.connection;

  //db.on('error', console.error.bind(console, 'connection error:'));

    // we're connected!
    console.log("Connected with mongo to get skills")

    let SkillModel: any;
    try {
      SkillModel =  mongoose.model('Skill');
    } catch (error) {
      SkillModel = mongoose.model('Skill', baseSkillSchema);
    }
    
    try {
      const skills_data = await  SkillModel.find({jobRequired:job});
      const skills:any[] = []
      //console.log(skills_data)
      for(let i = 0 ; i < skills_data.length ; i++){
        const skill = new Skill()
        skill.uid = skills_data[i].uid
        skill.name = skills_data[i].name
        skill.des = skills_data[i].des
        if(skills_data[i].jobRequired){
          skill.jobRequired.push(skills_data[i].jobRequired)
        }
        skill.level = skills_data[i].level
        skills.push(skill)
      }

      //mongoose.connection.close()
      //console.log("return skills")
      //console.log(skills)
      return skills;
    } catch (err) {
      //console.log(err);
      return err
      //mongoose.connection.close()
    }
}