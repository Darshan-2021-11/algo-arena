import mongoose, { model, Schema } from "mongoose";
import { validate } from "uuid";

const activitySchema = new Schema({
    user:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        unique:true
    },
  
    activity:
        {
            date: {
              type: Date,
              required: true,
            },
            submissions: {
              type: Number,
              default: 0,
              validate:{
                validator:function(val: number){
                  return val >= 0;
                },
                message:"Activity can not go below 0"
              }
            },
          },
    
})

const UserProblem = mongoose.models.UserProblem || model("Activity",activitySchema);
export default UserProblem;