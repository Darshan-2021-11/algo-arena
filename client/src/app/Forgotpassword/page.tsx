import Link from "next/link"

const Forgotpassword =()=>{
    return(
        <>
        <div
        className="w-screen bg-black flex items-center justify-center"
        style={{
            height:"calc( 100vh - 64px )"
        }}
        >
            <div
            className="flex-col flex items-center justify-center"
            >
                <Link 
                className="underline mb-4 pb-3 pt-3 pl-2 pr-2 shadow-md shadow-gray-700  rounded-lg bg-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-all"
                href={"/Forgotpassword/WithEmail"}
                >
                <p >Login with Email</p>
                </Link>
                <Link 
                className="underline mb-4 pb-3 pt-3 pl-2 pr-2 shadow-md shadow-gray-700  rounded-lg bg-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-all"
                href={"/Forgotpassword/Changepassword"}
                >
                <p >Login with link</p>
                </Link>
                <Link 
                className="underline mb-4 pb-3 pt-3 pl-2 pr-2 shadow-md shadow-gray-700  rounded-lg bg-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-all"
                href={"/Forgotpassword/Magiclink"}
                >
                <p className=" underline">Change password</p>
                </Link>

                <Link 
                className="underline mb-4 pb-3 pt-3 pl-2 pr-2 shadow-md shadow-gray-700  rounded-lg bg-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-all"
                href={"/Sign-in"}
                >
                <p className=" underline">Go back</p>
                </Link>
            </div>
        </div>
        </>
    )
}

export default Forgotpassword