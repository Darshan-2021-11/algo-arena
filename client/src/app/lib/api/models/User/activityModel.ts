import mongoose, { model, Schema } from "mongoose";

const dateSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  submissions: {
    type: Number,
    default: 1,
    validate:{
      validator:function(val: number){
        return val >= 0;
      },
      message:"Activity can not go below 0"
    }
  },
},{_id:false})

const activitySchema = new Schema({
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        unique:true
    },
    start:{
      type:Date,
      default:Date.now()
    },
    activity:
        {
          type:[dateSchema],
        },
    
})

const Activity = mongoose.models.Activity || model("Activity",activitySchema);
export default Activity;