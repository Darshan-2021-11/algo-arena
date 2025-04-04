import { v4 } from "uuid";

export var currentId : string | undefined ;

export const generateId = ()=>{
   currentId =  v4()
}