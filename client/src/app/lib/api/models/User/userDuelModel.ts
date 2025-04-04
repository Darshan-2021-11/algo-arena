import mongoose, { model, Schema } from "mongoose";

const userDuelSchema = new Schema({
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        unique:true,
        required:[true,"user is required."]
    },
    duels:{
        type: Number,
      default: 0,
      min: [0, "Duels cannot be negative."],
      validate: {
        validator: function (this:any):boolean {
          return this.duels === this.wins + this.draws + this.losses;
        },
        message: "Duels must equal the sum of wins, draws, and losses.",
      },
    },
    wins:{
        type:Number,
        default:0,
        min: [0, "Submissions cannot be negative."]
    },
    draws:{
        type:Number,
        default:0,
        min: [0, "Submissions cannot be negative."]
    },
    losses:{
        type:Number,
        default:0,
        min: [0, "Submissions cannot be negative."]
    }
})

const UserDuel = mongoose.models.UserDuel || model("UserDuel",userDuelSchema);
export default UserDuel;