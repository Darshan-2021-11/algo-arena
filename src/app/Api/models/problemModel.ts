export interface TESTCASE {
    questions:Array<any>
    answers:Array<any>
}

export interface EXAMPLE {
    input:string,
    output:string,
    Explanation:string | null
}

export interface Problem {
    id:string,
    title:string,
    question:string,
    topics:Array<string>,
    Examples:Array<EXAMPLE>,
    constraints:Array<string>,
    testcases:TESTCASE,
    difficulty:string
}

export interface ProblemTrailer {
    id:string,
    title:string,
    topics:Array<string>,
    difficulty:string
}