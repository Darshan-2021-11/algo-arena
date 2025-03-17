export interface TESTCASE {
    question:string,
    answer:string
}

export interface HIDDEN_TESTCASE {
    id: number,
    hidden_testcases:Array<TESTCASE>,
}


export interface Problem {
    id:number,
    title:string,
    difficulty:number,
    topics:Array<string>,
    question:string,
    constraints:Array<string>,
    sample_testcases:Array<TESTCASE>,
}