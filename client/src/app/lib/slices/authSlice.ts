import { RootState } from "@/app/lib/store";
import { createSlice } from "@reduxjs/toolkit";


type UserRole = 'guardian' | 'child';


export interface value{
    username:string | null,
    type:UserRole | null,
    loggedIn:boolean,
    rememberme:boolean,
}

const initialState : value ={
    username: null,
    type:null,
    loggedIn:false,
    rememberme:true,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login(state, action){
            state.username = action.payload;
            state.loggedIn = true;
            
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