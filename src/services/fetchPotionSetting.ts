const mongoose = require('mongoose');
const UserPotionSettingSchema = new mongoose.Schema({
  eth: { type: String, required: true },
  hp_uid: { type: String, required: true },
  sp_uid: { type: String, required: true },
  hp_percent: { type: Number, required: true },
  sp_percent: { type: Number, required: true },
});

export async function fetchPotionSetting(eth:string): Promise<any> {
//console.log("Fetch Potion Setting")
let UserPotionSetting: any;

try {
  UserPotionSetting =  mongoose.model('UserPotionSetting');
} catch (error) {
  UserPotionSetting = mongoose.model('UserPotionSetting', UserPotionSettingSchema);
}

const setting = await UserPotionSetting.findOne({ eth : eth });
const settings:any[] = []
if(setting)
{
let s = []
s["hpuid"] = setting.hp_uid
s["spuid"] = setting.sp_uid
s["hppercent"] = setting.hp_percent
s["sppercent"] = setting.sp_percent
settings.push(s)
//console.log(settings)  
}
return settings;

}

/*
export async function fetchPotionSetting(eth:string): Promise<any> {
  
  const snapshot = await db.collection('User').doc(eth).collection('Setting').get()
  const settings:any[] = []
  snapshot.forEach((doc) => {
    const data:any = doc.data()
      let setting = []
      setting["hpuid"] = data.hp_uid
      setting["spuid"] = data.sp_uid
      setting["hppercent"] = data.hp_percent
      setting["sppercent"] = data.sp_percent
      settings.push(setting)
  });

  return settings
}*/