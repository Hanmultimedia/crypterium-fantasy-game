import mongoose, { Schema, Document }  from 'mongoose';

export const userSchema = new mongoose.Schema({
      eth: String,
      status: Boolean
      // other fields as required
    });


export async function userAuth(eth: string) {

  try {
    let User;
    try {
      User = mongoose.model('UserAuth');
    } catch (error) {
      User = mongoose.model('UserAuth', userSchema);
    }

    // Use the model to query for a user with a matching eth address
try {
  let user = await User.findOne({ eth });
  if (!user) {
    user = new User({
      eth,
      status: true,
    });
    await user.save();
  }
  // Rest of your code
} catch (error) {
  console.error("Error while querying the database:", error);
  // Handle the error as needed
}

  } catch (error) {
    console.log(error);
  }
}

export async function userNonAuth(eth: string) {

  try {
    let User;
    try {
      User = mongoose.model('UserAuth');
    } catch (error) {
      User = mongoose.model('UserAuth', userSchema);
    }

    // Use the model to query for a user with a matching eth address
    let user:any = await User.findOne({ eth });
    if (user) {
      user.status = false
    }

    await user.save();

  } catch (error) {
    console.log(error);
  }
}

export async function getOnlineStatus(eth: string) {

  try {
    let User;
    try {
      User = mongoose.model('UserAuth');
    } catch (error) {
      User = mongoose.model('UserAuth', userSchema);
    }

    // Use the model to query for a user with a matching eth address
    let user:any = await User.findOne({ eth });
    if (user) {
      return user.status
    }
    return false

  } catch (error) {
    console.log(error);
    return false
  }
}
