'use client'
import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "@/app/store";
import {v4 as uuidv4} from 'uuid';

export interface MESSAGE{
    id:string,
    data:string,
    timeid:NodeJS.Timeout|null,
    initialTime:number
}

export interface PopupState{
    message: MESSAGE[],
    error: MESSAGE[],
}

const initialState: PopupState = {
    message:[],
    error:[],
}

export const popupSlice = createSlice({
    name:"popup",
    initialState,
    reducers:{
        setMessage:(state, action:{payload:string})=>{
            const data = action.payload;
            if(!data) return;
            const id = uuidv4();
            const value = {
                data, 
                id,
                initialTime:Date.now(),
                timeid:null
            }
            state.message.push(value);
        },
        setError:(state, action:{payload:string})=>{
            const data = action.payload;
            if(!data) return;
            const id = uuidv4();
            const value = {
                data, 
                id,
                initialTime:Date.now(),
                timeid:null
            }
            state.error.push(value);
        },
        removeMessage(state, action:{payload:string}){
            if(!action.payload) return;
            for(let i=0;i<state.message.length;i++){
                if(state.message[i].id == action.payload){
                    let data = state.message.splice(i,1)[0];
                    data?.timeid && clearTimeout(data?.timeid);
                    break;
                }
            }
        },
        removeError(state, action:{payload:string}){
            if(!action.payload) return;
            for(let i=0;i<state.error.length;i++){
                if(state.error[i].id == action.payload){
                    let data = state.error.splice(i,1)[0];
                    data?.timeid && clearTimeout(data?.timeid);
                    break;
                }
            }
        },
        updateMessage(state, action:{payload:MESSAGE[]}){
            state.message = action.payload;
        },
        updateError(state, action:{payload:MESSAGE[]}){
            state.error = action.payload;
        },
    }
})

export const {setMessage, removeMessage, setError, updateError, updateMessage, removeError} = popupSlice.actions;
export const usePopup = (state:RootState) =>state.popup as PopupState
export default popupSlice.reducer;