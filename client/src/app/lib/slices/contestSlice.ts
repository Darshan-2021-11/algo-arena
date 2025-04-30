import { RootState } from "@/app/lib/store";
import { createSlice } from "@reduxjs/toolkit";


export interface value{
    problems:string[]
}

const initialState : value ={
   problems:[]
}

const contestSlice = createSlice({
    name:"contest",
    initialState,
    reducers:{
       updateProblem(state, action){
        state.problems = action.payload;
       }
    }
})

export const {updateProblem} = contestSlice.actions;
export const useContest = (state:RootState)=>state.contest as value;
export default contestSlice.reducer;