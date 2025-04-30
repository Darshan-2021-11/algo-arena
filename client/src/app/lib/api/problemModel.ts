export interface TESTCASE {
    input:string,
    output:string
}

export interface HIDDEN_TESTCASE {
    id: number,
    hidden_testcases:Array<TESTCASE>,
}


export interface Problem {
    _id:number,
    description:string,
    title:string,
    difficulty:string,
    tags:Array<string>,
    constraints:Array<string>,
    testcases:Array<TESTCASE>,
    spaceLimit?:number,
    timeLimit?:number
    private?:boolean
}