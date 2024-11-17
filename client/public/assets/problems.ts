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
    },
    {
        id: 2,
        hidden_testcases: [
            {
                question: `5
                1 2 3 4`,
                answer: `5`
            },
            {
                question: `4
                1 2 3`,
                answer: `4`
            },
            {
                question: `2
                2`,
                answer: `1`
            },
            {
                question: `6
                1 2 3 4 5`,
                answer: `6`
            },
            {
                question: `10
                1 5 4 3 2 7 8 9 10`,
                answer: `6`
            }
        ]
    },
    {
        id: 3,
        hidden_testcases:[
            {
                question: `ATTCGGGA`,
                answer: `3`
            },
            {
                question: `AAAAAAAAAA`,
                answer: `10`
            },
            {
                question: `ACACACACAC`,
                answer: `1`
            },
            {
                question:`ACCGGGTTTT`,
                answer: `4`
            },
            {
                question:`A`,
                answer:`1`
            }

        ]

        },
        {
            id: 4,
            hidden_testcases:[
                {
                    question:`10
1 1 1 1 1 1 1 1 1 1`,
                    answer: `0`

                },
                {
                    question: `10
1000000000 1 1 1 1 1 1 1 1 1`,
                    answer:`8999999991`
                },
                {
                    question: `10
6 10 4 10 2 8 9 2 7 7`,
                   answer:`31`
                },
                {
                    question: `1
329873232`,
                    answer:`0`
                }
            ]
        },
        {
            id: 5,
            hidden_testcases:[
                {
                    question: `1`,
                    answer: `0`
                },
                {
                    question: `2`,
                    answer: `0
6`
                },
                {
                    question: `3`,
                    answer: `0
6
28`
                },
                {
                    question:`4`,
                    answer: `0
6
28
96`
                },
                {
                    question:`5`,
                    answer:`0
6
28
96
252`
                }
    
            ]
    
            },
            {
                id:6,
                hidden_testcases:[
                    {
                        question: `7`,
                        answer: `128`
                    },
                    {
                        question: `15`,
                        answer: `32768`
                    },
                    {
                        question: `27`,
                        answer: `134217728`
                    },
                    {
                        question:`255`,
                        answer: `396422633`
                    },
                    {
                        question:`447`,
                        answer:`941778035`
                    }
     
                ]
            },
            {
                id:7,
                hidden_testcases:[
                    {
                        question: `395`,
                        answer: `97`
                    },
                    {
                        question: `871`,
                        answer: `215`
                    },
                    {
                        question: `239`,
                        answer:`57`
                    },
                    {
                        question:`535`,
                        answer: `132`
                    },
                    {
                        question:`977`,
                        answer:`242`
                    }
     
                ]
            },
            
            {
                id:8,
                hidden_testcases:[
                    {
                        question: `4
842572599 577431753
733431661 716735123
409325692 74067624
753728522 940667932`,
                        answer: `YES
YES
NO
YES`
                    },
                    {
                        question: `1
11 4`,
                        answer: `NO`
                    },
                    {
                        question: `4
0 0
0 1
0 2
0 3`,
                        answer:`YES
NO
NO
NO`
                    },
                    {
                        question:`3
2 1
2 2
3 3`,
                        answer: `YES
NO
YES`
                    },
                
     
                ]
            },
            {
                id:9,
                hidden_testcases:[
                    {
                        question: `10
1 1 1 1 1 1 1 1 1 1`,
                        answer: `1`
                    },
                    {
                        question: `10
7 4 10 9 6 1 8 2 5 3`,
                        answer: `10`
                    },
                    {
                        question: `10
5 9 5 5 10 9 3 1 8 8`,
                        answer:`6`
                    },
                    {
                        question:`4
1 2 8 9`,
                        answer: `4`
                    },
                    {
                        question:`1
1`,
                        answer:`1`
                    }
     
                ]
            },
            {
                id:10,
                hidden_testcases:[
                    {
                        question: `10 10 0
37 62 56 69 34 46 10 86 16 49
50 95 47 43 9 62 83 71 71 7`,
                        answer: `1`
                    },
                    {
                        question: `10 10 10
90 41 20 39 49 21 35 31 74 86
14 24 24 7 82 85 82 4 60 95`,
                        answer: `6`
                    },
                    {
                        question: `10 10 1000
59 5 65 15 42 81 58 96 50 1
18 59 71 65 97 83 80 68 92 67`,
                        answer:`10`
                    },
                    {
                        question:`10 10 1000000000
25 80 59 43 67 21 77 5 8 99
66 41 62 24 88 55 1 53 50 60`,
                        answer: `10`
                    },
                    {
                        question:`5 2 2
2 2 2 40 50
40 50`,
                        answer:`2`
                    }
     
                ]
            },
            {
                id:11,
                hidden_testcases:[
                    {
                        question: `8
1 2 3 4 5 6 7`,
                        answer: `8`
                    },
                    {
                        question: `5
2 3 4 5`,
                        answer: `1`
                    },
                    {
                        question: `7
1 2 3 5 6 7`,
                        answer:`4`
                    },
                    {
                        question:`9
1 2 3 4 6 7 8 9`,
                        answer: `5`
                    },
                    {
                        question:`2
2`,
                        answer:`1`
                    }
     
                ]
            },

            {
                id:12,
                hidden_testcases:[
                    {
                        question: `1 1
1`,
                        answer: `8`
                    },
                    {
                        question: `1 2`,
                        answer: `2`
                    },
                    {
                        question: `2 1`,
                        answer:`1`
                    },
                    {
                        question:`2 2`,
                        answer: `3`
                    },
                    {
                        question:`7 5`,
                        answer:`11165`
                    }
     
                ]
            },

            {
                id:13,
                hidden_testcases:[
                    {
                        question: `60`,
                        answer: `3014`
                    },
                    {
                        question: `81`,
                        answer: `5435`
                    },
                    {
                        question: `20`,
                        answer:`339`
                    },
                    {
                        question:`94`,
                        answer: `7285`
                    },
                    {
                        question:`29`,
                        answer:`690`
                    }
     
                ]
            },

            {
                id:13,
                hidden_testcases:[
                    {
                        question: `60`,
                        answer: `3014`
                    },
                    {
                        question: `81`,
                        answer: `5435`
                    },
                    {
                        question: `20`,
                        answer:`339`
                    },
                    {
                        question:`94`,
                        answer: `7285`
                    },
                    {
                        question:`29`,
                        answer:`690`
                    }
     
                ]
            },

            {
                id:14,
                hidden_testcases:[
                    {
                        question: `100
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100`,
                        answer: `3043`
                    },
                    {
                        question: `100
71 19 26 18 57 78 80 89 31 26 37 38 77 24 64 7 69 86 52 8 60 87 24 80 39 35 92 93 41 18 53 34 99 55 54 95 51 83 95 66 91 80 72 37 59 7 29 87 57 20 55 29 84 4 7 83 99 100 50 46 74 28 6 99 25 81 23 28 83 45 90 86 91 95 7 32 56 58 49 68 2 96 46 43 35 83 52 83 96 64 61 10 24 45 91 5 54 100 18 12`,
                        answer: `3086`
                    },
                   
     
                ]
            },






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
                    answer: `3 10 5 16 8 4 2 1`
                }
            ],
        },

        {
            id: 2,
            title: "Missing Number",
            difficulty: 1,
            topics: ["implementation"],
            question: `
             You are given all numbers between 1,2,\ldots,n except one. Your task is to find the missing number.            
            `


            ,
            constraints: [
             `2 \le n \le 2 \cdot 10^5`


            ],
            sample_testcases: [
                {
                    question: `5
2 3 1 5`,
                    answer: `4`
                }
            ],
        },

        {
            id: 3,
            title: "DNA Sequence",
            difficulty: 1,
            topics: ["strings"],
            question: `
            You are given a DNA sequence: a string consisting of characters A, C, G, and T. Your task is to find the longest repetition in the sequence. This is a maximum-length substring containing only one type of character.
Input
The only input line contains a string of n characters.
Output
Print one integer: the length of the longest repetition. 
            `


            ,
            constraints: [
            `1 \le n \le 10^6`
            ],
            sample_testcases: [
                {
                    question: `ATTCGGGA`,
                    answer: `3`
                }
            ],
        },

        {
            id: 4,
            title: "Increasing Array",
            difficulty: 1,
            topics: ["Arrays"],
            question: `
           You are given an array of n integers. You want to modify the array so that it is increasing, i.e., every element is at least as large as the previous element.
On each move, you may increase the value of any element by one. What is the minimum number of moves required? 
            `


            ,
            constraints: [
            `1 \le n \le 10^6`
            ],
            sample_testcases: [
                {
                    question: `ATTCGGGA`,
                    answer: `3`
                }
            ],
        },
        {
            id: 5,
            title: "Two Knights",
            difficulty: 3,
            topics: ["Combinatorics"],
            question: `Your task is to count for k=1,2,\ldots,n the number of ways two knights can be placed on a k \times k chessboard so that they do not attack each other.
Input
The only input line contains an integer n.
Output
Print n integers: the results.


            `


            ,
            constraints: [
          
             `1 \le n \le 10000`
            ],
            sample_testcases: [
                {
                    question: `8`,
                    answer: `0
6
28
96
252
550
1056
1848`
                }
            ],
        },

        {
            id: 6,
            title: "Bit Strings",
            difficulty: 3,
            topics: ["Combinatorics"],
            question: `Your task is to calculate the number of bit strings of length n.
For example, if n=3, the correct answer is 8, because the possible bit strings are 000, 001, 010, 011, 100, 101, 110, and 111.

Input
The only input line has an integer n.
Output
Print the result modulo 10^9+7.
`


            ,
            constraints: [
          
             `1 \le n \le 10^6`
            ],
            sample_testcases: [
                {
                    question: `3`,
                    answer: `8`
                }
            ],
        },

        {
            id: 7,
            title: "Trailing Zeroes",
            difficulty: 4,
            topics: ["Math"],
            question: ` Your task is to calculate the number of trailing zeros in the factorial n!.For example, 20!=2432902008176640000 and it has 4 trailing zeros.
            Input
            The only input line has an integer n.
            Output
            Print the number of trailing zeros in n!.`
            ,
            constraints: [
          
             `1 \le n \le 10^9`
            ],
            sample_testcases: [
                {
                    question: `20`,
                    answer: `4`
                }
            ],
        },
        {
            id: 8,
            title: "Coin Piles",
            difficulty: 4,
            topics: ["Game Theory"],
            question: `You have two coin piles containing a and b coins. On each move, you can either remove one coin from the left pile and two coins from the right pile, or two coins from the left pile and one coin from the right pile.
Your task is to efficiently find out if you can empty both the piles.
Input
The first input line has an integer t: the number of tests.
After this, there are t lines, each of which has two integers a and b: the numbers of coins in the piles.
Output
For each test, print "YES" if you can empty the piles and "NO" otherwise. `
            ,
            constraints: [
          
             `1 \le t \le 10^5
0 \le a, b \le 10^9`
            ],
            sample_testcases: [
                {
                    question: `3
2 1
2 2
3 3`,
                    answer: `YES
NO
YES`
                }
            ],
        },
        {
            id: 9,
            title: "Distinct numbers",
            difficulty: 1,
            topics: ["sorting"],
            question: `You are given a list of n integers, and your task is to calculate the number of distinct values in the list.
Input
The first input line has an integer n: the number of values.
The second line has n integers x_1,x_2,\dots,x_n.
Output
Print one integers: the number of distinct values. `
            ,
            constraints: [
          
             `1 \le n \le 2 \cdot 10^5
1 \le x_i \le 10^9`
            ],
            sample_testcases: [
                {
                    question: `5
2 3 2 2 3`,
                    answer: `2`
                }
            ],
        },

        {
            id: 10,
            title: "Buildings",
            difficulty: 3,
            topics: ["sorting"],
            question: `There are n applicants and m free apartments. Your task is to distribute the apartments so that as many applicants as possible will get an apartment.
Each applicant has a desired apartment size, and they will accept any apartment whose size is close enough to the desired size.
Input
The first input line has three integers n, m, and k: the number of applicants, the number of apartments, and the maximum allowed difference.
The next line contains n integers a_1, a_2, \ldots, a_n: the desired apartment size of each applicant. If the desired size of an applicant is x, he or she will accept any apartment whose size is between x-k and x+k.
The last line contains m integers b_1, b_2, \ldots, b_m: the size of each apartment.
Output
Print one integer: the number of applicants who will get an apartment. `
            ,
            constraints: [
          
             `1 \le n, m \le 2 \cdot 10^5
0 \le k \le 10^9
1 \le a_i, b_i \le 10^9`
            ],
            sample_testcases: [
                {
                    question: `4 3 5
60 45 80 60
30 60 75`,
                    answer: `2`
                }
            ],
        },
        {
            id:11,
            title:"Find the missing number",
            difficulty:2,
            topics: ["implementation"],
            question:`There is an array which have n-1 elements between 1 to n. 1 element is missing there, write a program to find the missing number.
            Input
            The first input line has n: the number of elements
            The second input line has n-1 elements, which are present in the array.
            Output
            Print one integer: the missing number.`
            ,
            constraints:[
                `2 \le n \le 2 \cdot 10^5`
            ],
            sample_testcases: [
                {
                 question: `4
1 2 4`,
                 answer:`3`
                }
            ],

            
        },

        {
            id:12,
            title:"Counting Necklaces",
            difficulty:5,
            topics: ["Math"],
            question:`
            Your task is to count the number of different necklaces that consist of n pearls and each pearl has m possible colors.
Two necklaces are considered to be different if it is not possible to rotate one of them so that they look the same.
Input
The only input line has two numbers n and m: the number of pearls and colors.
Output
Print one integer: the number of different necklaces modulo 10^9+7. 
            
            `            ,
            constraints:[
                `1 \le n,m \le 10^6`
            ],
            sample_testcases: [
                {
                 question: `4 3`,
                 answer:`24`
                }
            ],

            
        },

        {
            id:13,
            title:"Sum of divisors",
            difficulty:5,
            topics: ["Math"],
            question:`Let \sigma(n) denote the sum of divisors of an integer n. For example, \sigma(12)=1+2+3+4+6+12=28.
Your task is to calculate the sum \sum_{i=1}^n \sigma(i) modulo 10^9+7.
Input
The only input line has an integer n.
Output
Print \sum_{i=1}^n \sigma(i) modulo 10^9+7.
            `            ,
            constraints:[
                `1 \le n \le 10^{12}`
            ],
            sample_testcases: [
                {
                 question: `5`,
                 answer:`21`
                }
            ],

            
        },
        
        {
            id:14,
            title:"Counting Coprime pairs",
            difficulty:5,
            topics: ["Math"],
            question:`Given a list of n positive integers, your task is to count the number of pairs of integers that are coprime (i.e., their greatest common divisor is one).
Input
The first input line has an integer n: the number of elements.
The next line has n integers x_1,x_2,\dots,x_n: the contents of the list.
Output
Print one integer: the answer for the task.
            `            ,
            constraints:[
                `1 \le n \le 10^5
1 \le x_i \le 10^6`
            ],
            sample_testcases: [
                {
                 question: `8
5 4 20 1 16 17 5 15`,
                 answer:`19`
                }
            ],

            
        },






       


           




    ]