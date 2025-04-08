import { Problem } from "./problemModel"

export interface contestmodel {
    name :string
    startTime:Date
    endTime:Date
    type:string
    problems:Array<string>
}

export interface contestproblemmodel extends Problem {
	alias: string
	score: number
}
