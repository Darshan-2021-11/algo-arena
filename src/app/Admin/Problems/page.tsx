import { useState } from "react";
import { body } from "../Addproblem/page";

const Problems = () => {
    
    const [page, setpage] = useState(1);
    const [problems, setproblems] = useState<body[]>([]);
    const [lastpage, setlas] = useState(2);
    
    const fetchProblems = ()=>{
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
        {/* fetch problems by page */}
        {/* load problems by scrolling to end */}
        {/* denote end */}
        {/* 2 btns for deleting and updating  */}
        {/* delete will be from this page */}
        {/* confirm delete */}
        {/* update will take it to update page */}
        </>
    )
}

export default Problems