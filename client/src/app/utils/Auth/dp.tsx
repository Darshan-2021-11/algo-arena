import { base64ToArrayBuffer } from "@/app/lib/arraybufferhandler"
import { RootState } from "@/app/lib/store"
import { useEffect, useRef } from "react"
import { FaRegUserCircle } from "react-icons/fa"
import { useSelector } from "react-redux"

interface prop {
    size: string,
    photo?:{data:string,type:string} |null
}

const Dp: React.FC<prop> = ({ size,photo }) => {
    const img = useSelector((state: RootState) => state.auth.img);

    const imgref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        try {
            let obj : string;
            if(photo===null){
                return;
            }
            if(photo){
                const arraybuffer = base64ToArrayBuffer(photo.data);
                const blob = new Blob([arraybuffer], { type: photo.type });
                const defimg = imgref.current;
                if (defimg) {
                    obj = URL.createObjectURL(blob);
                    defimg.src = obj;
                    defimg.onload=()=>{
                        URL.revokeObjectURL(obj);
                    }
                }
                return;
            }
            if (img) {
                const arraybuffer = base64ToArrayBuffer(img.data);
                const blob = new Blob([arraybuffer], { type: img.type });
                const defimg = imgref.current;
                if (defimg) {
                    obj = URL.createObjectURL(blob);
                    defimg.src = obj;
                    defimg.onload=()=>{
                        URL.revokeObjectURL(obj);
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }
    }, [img,photo]);


    return (
        <div >
            <div className="flex items-center justify-start">
                {
                    img||photo ?
                        <img ref={imgref} className={`${size === "big" ? "w-24 h-24" : size === "small" ? "w-6 h-6" : "w-9 h-9"} rounded-full border-2 object-cover border-white`} />
                        :
                        <FaRegUserCircle className={`${size === "big" ? "w-24 h-24" : size === "small" ? "w-6 h-6" : "w-9 h-9"} `} />


                }

            </div>

        </div>
    )
}

export default Dp;