"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { login, logout as logoutSlice, useAuth } from "../lib/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import Dp from "./Auth/dp";
import Popup from "./popup";
import { setMessage } from "../lib/slices/popupSlice";

const Nav: React.FC = () => {
  const router = useRouter();
  const route = usePathname();

  const [show, setshow] = useState(false);

  const { loggedIn, username, admin, id } = useSelector(useAuth);
  const dispatch = useDispatch();

  const protectedUri = ["/Explore", "/Problems", "/User", "/LeaderBoard", "/duet", "/Admin"];

  useEffect(() => {
    if (!loggedIn) {
      for (let i = 0; i < protectedUri.length; i++) {
        if (route.startsWith(protectedUri[i])) {
          router.push("/Sign-up");
          return;
        }
      }
    }

    if (!admin) {
      if (route.startsWith("/Admin")) {
        router.push("/");
      }
    }
  }, [route, loggedIn]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/Api/User/Auth/VerifyCookie");
        if (data.success) {
          console.log(data)
          dispatch(login({ name: data.user.name, id: data.user.id, admin: data.user.admin, email:data.user.email, type:data.user.photo?.type, data:data.user.photo?.data }));
          router.push("/");
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.get("/Api/User/Auth/Logout");
      if (data.success) {
        dispatch(logoutSlice());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 w-full flex items-center justify-between p-4 fixed top-0 left-0 z-[10000] h-16">
        <div className="flex items-center">
          <Link href="/" className="mr-4 text-yellow-500 font-sans">
            AlgoArena
          </Link>
          {loggedIn && (
            <>
              {admin ? (
                <>
                  <div className="px-2">
                      <Link href="/Admin/Addproblem">add</Link>
                  </div>
                  <div className="px-2">
                      <Link href="/Admin/Addproblems">upload</Link>
                  </div>
                  <div className="cursor-pointer px-2">
                    <Link href="/Admin/Problems">list</Link>
                  </div>
                  <div className="cursor-pointer px-2">
                    <Link href="/Admin/Contest">contest</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-2">
                    <h6>
                      <Link href="/Problems">Practice</Link>
                    </h6>
                  </div>
                  <div className="cursor-pointer px-2">
                    <Link href="/Explore">Explore</Link>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center">
          <div>
            {!loggedIn ? (
              <div className="flex items-center">
                <div className="text-green-500 mr-5 px-2">
                  <h6>
                    <Link href="/Sign-up">Sign up</Link>
                  </h6>
                </div>
                <div className="text-red-500 px-2">
                  <h6>
                    <Link href="/Sign-in">Log in</Link>
                  </h6>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center relative">
                  {
                    username &&
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setshow(prev => !prev)}
                    >
                     <Dp size="small"/>
                    </div>
                  }

                  {
                    show &&
                    <div
                      className="transition-all absolute top-12 right-0 bg-zinc-700 pt-3 pb-3 pl-3 pr-3 rounded-xl"
                    >
                      <div className="flex items-center justify-start">
                      <Dp size="medium"/>
                        {username && <div className="pl-2 text-xl font-bold">{username?.slice(0, 9)}</div>}
                      </div>
                      <div
                        className="flex flex-col items-start justify-center mt-5"
                      >
                        <Link
                          className="p-2 hover:bg-zinc-800 rounded-md flex items-center justify-center"
                          onClick={() => { setshow(false) }}
                          href={`/User/${id}`}><MdSpaceDashboard className="p-0.5 box-content" />Dashboard</Link>
                        <Link
                          onClick={() => { setshow(false) }}
                          className="p-2 hover:bg-zinc-800 rounded-md flex items-center justify-center"
                          href={"/User/Update"}><FaUserEdit className="p-0.5 box-content" />Edit user</Link>
                        <p
                          onClick={async() => { 
                            await logout();
                            setshow(false) 
                          }}
                          className="p-2 text-red-500 hover:text-red-600 cursor-pointer rounded-md flex items-center justify-center"

                        ><IoIosLogOut className="p-0.5 box-content" />Log out</p>

                      </div>
                    </div>
                  }

                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-16 w-screen"></div>

      <Popup/>
    </>
  );
};

export default Nav;