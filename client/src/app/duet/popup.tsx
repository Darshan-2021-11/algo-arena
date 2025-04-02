import { v4 } from "uuid";
import { useSocket } from "../lib/contexts/socketContext";

const Popup =()=>{
    const {msgs, errs, setmsgs, seterrs} = useSocket();
    return(
        <div
        className="absolute bottom-0 right-0 flex flex-col-reverse"
        >
            {
                msgs.map((msg, i)=>(
                    <div
                    key={v4()}
                    onClick={()=>{
                        const copymsgs : string[] = [];
                        for(let j=0;j<msgs.length;j++){
                            if(j!== i) copymsgs.push(msgs[i]);
                        }
                        setmsgs(copymsgs);
                    }}
                    className="bg-black text-green-700 flex items-center m-2 pt-1 pb-1 pl-2 cursor-pointer"
                    >
                        {msg}
                    </div>
                ))
            }
            {
                errs.map((err, i)=>(
                    <div
                    key={v4()}
                    onClick={()=>{
                        const copyerrs : string[] = [];
                        for(let j=0;j<errs.length;j++){
                            if(j!== i) copyerrs.push(errs[i]);
                        }
                        seterrs(copyerrs);
                    }}
                    className="bg-black text-red-700 flex items-center m-2 pt-1 pb-1 pl-2 cursor-pointer"
                    >
                        {err}
                    </div>
                ))
            }
        </div>
    )
}

export default Popup;