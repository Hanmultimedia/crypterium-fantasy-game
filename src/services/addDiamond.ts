import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      diamond: Number,
      coupon: Number,
      // other fields as required
    });


export async function addDiamond(eth:string , diamond:number) {

  if (!diamond) return;

  try {
    //console.log("Fetch User To update Diamond")

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
    user.diamond += diamond
    await user.save();
    }

  } catch (error) {
    console.log(error);
  }
  
}