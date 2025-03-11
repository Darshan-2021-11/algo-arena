import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";


type UserRole = 'guardian' | 'child';
interface paper {
    title:string,
    date:Date,
    score:number,
    creater:string,
}

interface Resp {
    title:string,
    date:Date,
    score:number,
    responses:number
}

export interface value{
    username:string | null,
    fullname:string | null,
    email:string | null,
    type:UserRole | null,
    loggedIn:boolean,
    rememberme:boolean,
    samplepapers:paper[],
    responses:Resp[]
}

const initialState : value ={
    username: null,
    fullname:null,
    email:null,
    type:null,
    loggedIn:false,
    rememberme:true,
    samplepapers:[],
    responses:[]
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login(state, action){
            const {username, fullname, email, type} = action.payload;
            state.username = username;
            state.fullname = fullname;
            state.email = email;
            state.type = type;
            state.loggedIn = true;
            
        },
        logout(state){
            state.username = null;
            state.fullname = null;
            state.email = null;
            state.type = null;
            state.loggedIn = false;
            state.samplepapers =[];
            state.responses = [];
        },
        memory(state){
            state.rememberme != state.rememberme;
        }
    }
})

export const {login, logout, memory} = authSlice.actions;
export const useAuth = (state:RootState)=>state.auth as value;
export default authSlice.reducer;