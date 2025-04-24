import { arrayBufferToBase64, base64ToArrayBuffer } from "@/app/lib/arraybufferhandler"
import { updateImg, useAuth } from "@/app/lib/slices/authSlice"
import { RootState } from "@/app/lib/store"
import axios from "axios"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaRegUserCircle } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"

interface prop {
    update: boolean
    size: string
}

const ProfileImage: React.FC<prop> = ({ update, size }) => {
    const img = useSelector((state: RootState) => state.auth.img);

    const imgref = useRef<HTMLImageElement>(null);
    const inputref = useRef<HTMLInputElement>(null);

    const [load, setload] = useState(false);

    const dispatch = useDispatch();

    const updateImage = async (blob: Blob) => {
        try {
            if (!blob) {
                return;
            }
            const body = new FormData();
            body.set("image", blob);

            const url = "/Api/User/Update/Image";
            const { data } = await axios.post(url, body);
            if (data.success) {
                const buffer = await blob.arrayBuffer();
                const str = arrayBufferToBase64(buffer);
                const payload = {
                    type: blob.size,
                    data: str
                }
                dispatch(updateImg(payload));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getblob = (file: File, scale: number, type: string): Promise<Blob | null> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = URL.createObjectURL(file);

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return reject(new Error("Failed to get canvas context"));
                }
                const { width, height } = image;
                canvas.height = height;
                canvas.width = width;
                ctx.drawImage(image, 0, 0, width, height);
                const maxsize = 500 * 1024;
                canvas.toBlob((blob) => {
                    if (!blob?.size) {
                        return reject(new Error("Failed to get blob"));
                    }
                    if (blob.size <= maxsize) {
                        return resolve(blob);
                    } else if (scale > 0.1) {
                        return resolve(getblob(file, scale - 0.1, type));
                    } else {
                        reject(new Error("unable to compress image to desired size"));
                    }
                }, "image/jpeg", scale)
            }
        })
    }

    const changeImage = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            if (load) {
                return;
            }
            setload(true);
            const files = e.currentTarget.files;
            if (files && files.length > 0) {
                const file = files[0] as File;

                if (file && file instanceof File) {
                    const regex = /image\//;
                    if(!regex.test(file.type)){
                        return;
                    }
                    const blob = await getblob(file, 1, file.type);
                    if (blob) {
                        updateImage(blob);
                    }
                }
            }

        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setload(false);
        }
    };

    useEffect(() => {
        try {
            if (img) {
                const arraybuffer = base64ToArrayBuffer(img.data);
                const blob = new Blob([arraybuffer], { type: img.type });
                const defimg = imgref.current;
                if (defimg) {
                    const obj = URL.createObjectURL(blob);
                    defimg.src = obj;
                    defimg.onload = () => {
                        URL.revokeObjectURL(obj);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [img]);

    const removeImage = async () => {
        try {
            if (inputref.current) {
                inputref.current.value = ""
            }

            const url = "/Api/User/Delete/Image";
            const { data } = await axios.delete(url);
            if (data.success) {
                dispatch(updateImg(null));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div key={v4()}>
            <input key={v4()} onChange={changeImage} type="file" name="image" id="img" className="hidden" accept="image/*" />
            <div className="flex items-center justify-start">
                {
                    !update ?
                        img ?
                                <img ref={imgref} className={`${size === "big" ? "w-28 h-28 m-5" : size === "small" ? "w-6 h-6" : "w-9 h-9"} rounded-full border-2 object-cover border-white`} />
                            :
                            <FaRegUserCircle className={`${size === "big" ? "w-28 h-28 m-5" : size === "small" ? "w-6 h-6" : "w-9 h-9"} `} />

                        :
                        img ?
                            <>
                                <img ref={imgref} className={`${size === "big" ? "w-28 h-28 m-5" : size === "small" ? "w-6 h-6" : "w-9 h-9"} rounded-full border-2 object-cover border-white`} />
                                <button
                                    onClick={removeImage}
                                    className="cursor-pointer flex items-center justify-center w-16 h-8 text-white bg-red-700 p-1 rounded-md"
                                >
                                    remove
                                </button>

                            </>
                            :
                            <div
                                className="relative"
                            >
                                {
                                    load &&
                                    <div
                                        className={`absolute left-0 top-0 ${size === "big" ? "w-28 h-28 m-5" : size === "small" ? "w-6 h-6" : "w-9 h-9"} rounded-full border-2 bg-black opacity-75 border-white flex items-center justify-center`}
                                    >
                                        <AiOutlineLoading3Quarters className="animate-spin" />
                                    </div>
                                }
                                <label htmlFor="img">
                                    <FaRegUserCircle className={`${size === "big" ? "w-28 h-28 m-5" : size === "small" ? "w-6 h-6" : "w-9 h-9"} `} />
                                </label>


                            </div>
                }

            </div>

        </div>
    )
}

export default ProfileImage;