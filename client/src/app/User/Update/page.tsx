"use client"
import ProfileImage from "@/app/utils/Auth/image";
import UpdatePassword from "./UpdatePassword";
import UpdateEmail from "./UpdateEmail";

const Page = () => {

    return (
        <div
            className="w-screen bg-black"
            style={{
                height: "calc( 100vh - 64px )"
            }}
        >
            <ProfileImage update={true} size={"big"}/>


           <UpdateEmail/>
          <UpdatePassword/>

        </div>
    )
}

export default Page;