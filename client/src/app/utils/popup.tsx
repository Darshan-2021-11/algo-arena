import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { removeError, removeMessage, usePopup } from "../lib/slices/popupSlice";

const Popup =()=>{
    // const {msgs, errs, setmsgs, seterrs} = useSocket();
    const {message, error} = useSelector(usePopup);
    const dispatch = useDispatch();
    return(
        <div
        className="absolute bottom-0 right-0 flex flex-col-reverse"
        >
            {
                message.map((msg)=>(
                    <div
                    key={v4()}
                    onClick={()=>{
                        dispatch(removeMessage(msg.id))
                    }}
                    className="bg-black text-green-700 flex items-center m-2 pt-1 pb-1 pl-2 cursor-pointer"
                    >
                        {msg.data}
                    </div>
                ))
            }
            {
                error.map((err, i)=>(
                    <div
                    key={v4()}
                    onClick={()=>{
                        dispatch(removeError(err.id));
                    }}
                    className="bg-black text-red-700 flex items-center m-2 pt-1 pb-1 pl-2 cursor-pointer"
                    >
                        {err.data}
                    </div>
                ))
            }
        </div>
    )
}

export default Popup;