import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

export interface processState{
    authprocess:boolean,
    samplepapercreation:boolean,
    answersubmition:boolean,
    connectionreq:boolean,
    connectionacc:boolean,
    connfetching:boolean,
    loader:{name:string,msg:string}[]
}

const initialState :processState = {
    authprocess:false,
    samplepapercreation:true,
    answersubmition:true,
    connectionacc:true,
    connectionreq:true,
    connfetching:true,
    loader:[]
}

const processSlice = createSlice({
    name:"process",
    initialState,
    reducers:{
        authInit(state,action){
            if(!state.authprocess){
                return;
            }
            state.authprocess = false;
            state.loader.push({name:'auth',msg:action.payload});
        },
        authEnd(state){
            if(state.authprocess){
                return;
            }
            state.authprocess = true;
            state.loader = state.loader.filter(({name})=> name !== 'auth');
        },
        samplepapercreationInit(state,action){
            if(!state.samplepapercreation){
                return;
            }
            state.samplepapercreation = false;
            state.loader.push({name:'samplepapercreation',msg:action.payload});
        },
        samplepapercreationEnd(state){
            if(state.samplepapercreation){
                return;
            }
            state.samplepapercreation = true;
            state.loader = state.loader.filter(({name})=> name !== 'samplepapercreation');
        },
        answersubmitionInit(state,action){
            if(!state.answersubmition){
                return;
            }
            state.answersubmition = false;
            state.loader.push({name:'answersubmition',msg:action.payload});
        },
        answersubmitionEnd(state){
            if(state.answersubmition){
                return;
            }
            state.answersubmition = true;
            state.loader = state.loader.filter(({name})=> name !== 'answersubmition');
        },
        connectionaccInit(state,action){
            if(!state.connectionacc){
                return;
            }
            state.connectionacc = false;
            state.loader.push({name:'connectionacc',msg:action.payload});
        },
        connectionaccEnd(state){
            if(state.connectionacc){
                return;
            }
            state.connectionacc = true;
            state.loader = state.loader.filter(({name})=> name !== 'connectionacc');
        },
        connectionreqInit(state,action){
            if(!state.connectionreq){
                return;
            }
            state.connectionreq = false;
            state.loader.push({name:'connectionreq',msg:action.payload});
        },
        connectionreqEnd(state){
            if(state.connectionreq){
                return;
            }
            state.connectionreq = true;
            state.loader = state.loader.filter(({name})=> name !== 'connectionreq');
        },
        connfetchingInit(state,action){
            if(!state.connfetching){
                return;
            }
            state.connfetching = false;
            state.loader.push({name:'connfetching',msg:action.payload});
        },
        connfetchingEnd(state){
            if(state.connfetching){
                return;
            }
            state.connfetching = true;
            state.loader = state.loader.filter(({name})=> name !== 'connfetching');
        },
        
    }
})

export const {authInit, authEnd, samplepapercreationInit, samplepapercreationEnd, answersubmitionEnd, answersubmitionInit, connectionaccEnd,connectionaccInit, connectionreqEnd, connectionreqInit, connfetchingEnd, connfetchingInit} = processSlice.actions;
export const useProcess = (state:RootState) =>state.process as processState
export default processSlice.reducer;