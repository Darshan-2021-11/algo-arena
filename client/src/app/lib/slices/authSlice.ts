import { RootState } from "@/app/lib/store";
import { createSlice } from "@reduxjs/toolkit";


export interface value{
    username:string | null,
    admin:boolean,
    loggedIn:boolean,
    rememberme:boolean,
    email:string|null,
    id:string | null,
    img:{
        type:string,
        data:string
    } | null
}

const initialState : value ={
    username: null,
    admin:false,
    loggedIn:false,
    rememberme:true,
    email:null,
    id:null,
    img:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login(state, action){
            state.username = action.payload.name;
            state.id = action.payload.id;
            state.loggedIn = true;
            state.admin = !!action.payload.admin;
            state.email = action.payload.email;
            if(action.payload.type && action.payload.data){
                state.img = {
                    type:action.payload.type,
                    data:action.payload.data
                };
            }
        },
        updateEmail(state, action){
            state.email = action.payload;
        },
        
        updateImg(state, action){
            state.img = action.payload;
        },
        logout(state){
            state.username = null;
            state.id = null;
            state.loggedIn = false;
            state.admin = false;
            state.email = null;
            state.img = null;
        },
        memory(state){
            state.rememberme != state.rememberme;
        }
    }
})

export const {login, logout, memory, updateEmail, updateImg} = authSlice.actions;
export const useAuth = (state:RootState)=>state.auth as value;
export default authSlice.reducer;