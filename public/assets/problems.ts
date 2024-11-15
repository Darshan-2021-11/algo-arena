import { Problem, HIDDEN_TESTCASE } from '../../src/app/Api/models/problemModel';

export const HIDDEN: Array<HIDDEN_TESTCASE> = [
    {
        id: 1,
        hidden_testcases: [
            {
                question: `7`,
                answer: `7 22 11 34 17 52 26 13 40 20 10 5 16 8 4 2 1 `
            },
            {
                question: `15`,
                answer: `15 46 23 70 35 106 53 160 80 40 20 10 5 16 8 4 2 1 `
            },
            {
                question: '5',
                answer: `5 16 8 4 2 1`
            },
            {
                question: `1`,
                answer: `1`
            },
            {
                question: `27`,
                answer: `27 82 41 124 62 31 94 47 142 71 214 107 322 161 484 242 121 364 182 91 274 137 412 206 103 310 155 466 233 700 350 175 526 263 790 395 1186 593 1780 890 445 1336 668 334 167 502 251 754 377 1132 566 283 850 425 1276 638 319 958 479 1438 719 2158 1079 3238 1619 4858 2429 7288 3644 1822 911 2734 1367 4102 2051 6154 3077 9232 4616 2308 1154 577 1732 866 433 1300 650 325 976 488 244 122 61 184 92 46 23 70 35 106 53 160 80 40 20 10 5 16 8 4 2 1 `
            }
        ]
    }
]

export const PROBLEMS: Array<Problem> =
    [
        {
            id: 1,
            title: "Collatz conjecture",
            difficulty: 1,
            topics: ["math", "implementation"],
            question: `Consider an algorithm that takes as input a positive integer n. If n is even, the algorithm divides it by two, and if n is odd, the algorithm multiplies it by three and adds one. The algorithm repeats this, until n is one. For example, the sequence for n=3 is as follows:
3 -> 10->5 -> 16 -> 8 -> 4 -> 2 -> 1
Your task is to simulate the execution of the algorithm for a given value of n.
Input
The only input line contains an integer n.
Output
Print a line that contains all values of n during the algorithm.`


            ,
            constraints: [
                `1 \le n \le 10^6`


            ],
            sample_testcases: [
                {
                    question: `3`,
                    answer: `
3 10 5 16 8 4 2 1`
                }
            ],
        },
    ]