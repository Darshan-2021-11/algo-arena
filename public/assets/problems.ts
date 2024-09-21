interface TESTCASE {
    questions:Array<any>
    answers:Array<any>
}

interface EXAMPLE {
    input:string,
    output:string,
    Explanation:string | null
}

interface PROBLEM {
    id:string,
    title:string,
    question:string,
    topics:Array<string>,
    Examples:Array<EXAMPLE>,
    constraints:Array<string>,
    testcases:TESTCASE

}


const PROBLEMS : Array<PROBLEM> = [
    {
        id:"43253530800",
        title:"Two Sum",
        question:"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.",
        topics:["Array","Hash Table"],
        Examples:[
            {
                input:"nums = [2,7,11,15], target = 9",
                output:"[0,1]",
                Explanation:"Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input:" nums = [3,2,4], target = 6",
                output:"[1,2]",
                Explanation:null
            },
            {
                input:"nums = [3,3], target = 6",
                output:"[0,1]",
                Explanation:null
            }
        ],
        constraints:[
            "2 <= nums.length <= 104",
            "-109 <= nums[i] <= 109",
            "-109 <= target <= 109",
            "Only one valid answer exists."
        ],
        testcases:{
            questions:[[2,7,11,15],[3,2,4],[3,3]],
            answers:[9,6,6]
        }
    },
    {
        id:"43253530801",
        title:"Add Two Numbers",
        question:  `
        You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.
        `,
        topics:["Linked List","Math","Recursion"],
        Examples:[
            {
                input:"l1 = [2,4,3], l2 = [5,6,4]",
                output:"[7,0,8]",
                Explanation:"342 + 465 = 807."
            },
            {
                input:"l1 = [0], l2 = [0]",
                output:"[0]",
                Explanation:null
            },
            {
                input:"l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
                output:"[8,9,9,9,0,0,0,1]",
                Explanation:null
            }
        ],
        constraints:[
            "The number of nodes in each linked list is in the range [1, 100]",
            "0 <= Node.val <= 9",
            "It is guaranteed that the list represents a number that does not have leading zeros."
        ],
        testcases:{
            questions:[[2,4,3],[0],[9,9,9,9,9,9,9]],
            answers:[[5,6,4],[0],[9,9,9,9]]
        }
    },
    {
        id:"43253530802",
        title:"Longest Substring Without Repeating Characters",
        question:  `
        Given a string s, find the length of the longest substring without repeating characters.`,
        topics:["Hash Table","String","String Window"],
        Examples:[
            {
                input:"s = 'abcabcbb'",
                output:"3",
                Explanation:"The answer is 'abc', with the length of 3."
            },
            {
                input:`s = "bbbbb"`,
                output:"1",
                Explanation:`The answer is "b", with the length of 1.`
            },
            {
                input:`s = "pwwkew"`,
                output:"3",
                Explanation:`The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.`
            }
        ],
        constraints:[
            "0 <= s.length <= 5 * 104",
            "s consists of English letters, digits, symbols and spaces."
        ],
        testcases:{
            questions:["abcabcbb","bbbbb","pwwkew"],
            answers:[3,1,3]
        }
    },
    {
        id:"43253530800",
        title:"Two Sum",
        question:"Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.",
        topics:["Array","Hash Table"],
        Examples:[
            {
                input:"nums = [2,7,11,15], target = 9",
                output:"[0,1]",
                Explanation:"Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input:" nums = [3,2,4], target = 6",
                output:"[1,2]",
                Explanation:null
            },
            {
                input:"nums = [3,3], target = 6",
                output:"[0,1]",
                Explanation:null
            }
        ],
        constraints:[
            "2 <= nums.length <= 104",
            "-109 <= nums[i] <= 109",
            "-109 <= target <= 109",
            "Only one valid answer exists."
        ],
        testcases:{
            questions:[[2,7,11,15],[3,2,4],[3,3]],
            answers:[9,6,6]
        }
    },
    {
        id:"43253530801",
        title:"Add Two Numbers",
        question:  `
        You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.
        `,
        topics:["Linked List","Math","Recursion"],
        Examples:[
            {
                input:"l1 = [2,4,3], l2 = [5,6,4]",
                output:"[7,0,8]",
                Explanation:"342 + 465 = 807."
            },
            {
                input:"l1 = [0], l2 = [0]",
                output:"[0]",
                Explanation:null
            },
            {
                input:"l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
                output:"[8,9,9,9,0,0,0,1]",
                Explanation:null
            }
        ],
        constraints:[
            "The number of nodes in each linked list is in the range [1, 100]",
            "0 <= Node.val <= 9",
            "It is guaranteed that the list represents a number that does not have leading zeros."
        ],
        testcases:{
            questions:[[2,4,3],[0],[9,9,9,9,9,9,9]],
            answers:[[5,6,4],[0],[9,9,9,9]]
        }
    },
    {
        id:"43253530802",
        title:"Longest Substring Without Repeating Characters",
        question:  `
        Given a string s, find the length of the longest substring without repeating characters.`,
        topics:["Hash Table","String","String Window"],
        Examples:[
            {
                input:"s = 'abcabcbb'",
                output:"3",
                Explanation:"The answer is 'abc', with the length of 3."
            },
            {
                input:`s = "bbbbb"`,
                output:"1",
                Explanation:`The answer is "b", with the length of 1.`
            },
            {
                input:`s = "pwwkew"`,
                output:"3",
                Explanation:`The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.`
            }
        ],
        constraints:[
            "0 <= s.length <= 5 * 104",
            "s consists of English letters, digits, symbols and spaces."
        ],
        testcases:{
            questions:["abcabcbb","bbbbb","pwwkew"],
            answers:[3,1,3]
        }
    }
]