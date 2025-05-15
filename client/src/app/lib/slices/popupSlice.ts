'use client'
import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "@/app/lib/store";
import {v4 as uuidv4} from 'uuid';

export interface MESSAGE{
    id:string,
    data:string,
    timeid:NodeJS.Timeout|null,
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
            const timeid = setTimeout(() => {
                removeMessage(id);
            }, 3000);
            const value = {
                data, 
                id,
                timeid
            }
            state.message.push(value);
        },
        setError:(state, action:{payload:string})=>{
            const data = action.payload;
            if(!data) return;
            const id = uuidv4();
            const timeid = setTimeout(() => {
                removeError(id);
            }, 6000);
            const value = {
                data, 
                id,
                timeid
            }
            state.error.push(value);
        },
        removeMessage(state, action:{payload:string}){
            if(!action.payload) return;
            for(let i=0;i<state.message.length;i++){
                if(state.message[i].id == action.payload){
                    let data = state.message.splice(i,1)[0];
                    data?.timeid && clearTimeout(data.timeid);
                    break;
                }
            }
        },
        removeError(state, action:{payload:string}){
            if(!action.payload) return;
            for(let i=0;i<state.error.length;i++){
                if(state.error[i].id == action.payload){
                    let data = state.error.splice(i,1)[0];
                    data?.timeid && clearTimeout(data.timeid);
                    break;
                }
            }
        }
    }
})

export const {setMessage, removeMessage, setError, removeError} = popupSlice.actions;
export const usePopup = (state:RootState) =>state.popup as PopupState
export default popupSlice.reducer;