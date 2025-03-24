import { RootState } from "@/app/lib/store";
import { createSlice } from "@reduxjs/toolkit";


export interface value{
    username:string | null,
    admin:boolean,
    loggedIn:boolean,
    rememberme:boolean,
    id:string | null
}

const initialState : value ={
    username: null,
    admin:false,
    loggedIn:false,
    rememberme:true,
    id:null
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
            console.log(action)
        },
        logout(state){
            state.username = null;
            state.loggedIn = false;
        },
        memory(state){
            state.rememberme != state.rememberme;
        }
    }
})

export const {login, logout, memory} = authSlice.actions;
export const useAuth = (state:RootState)=>state.auth as value;
export default authSlice.reducer;