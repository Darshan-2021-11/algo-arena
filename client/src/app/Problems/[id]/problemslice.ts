import { createSlice } from "@reduxjs/toolkit";

export const problemSlice = createSlice({
    name:'problem',
    initialState:{
        test:false,
        totaltestcases:0,
        currenttestcase:0,
        testdata:[]
    },
    reducers:{
        starttest(state,action){
            state.totaltestcases = action.payload;
            state.test = true;
            console.log('starting')
        },
        endtest(state){
            state.test = false;
        },
        completetest(state,action){
            state.currenttestcase ++;
            state.testdata.push(action.payload);
        }
    }
})

export const { starttest, endtest, completetest } = problemSlice.actions;

export default problemSlice.reducer;