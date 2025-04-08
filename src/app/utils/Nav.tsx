"use client";
import style from "./Nav.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { login, logout as logoutSlice, useAuth } from "../lib/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const Nav: React.FC = () => {
  const router = useRouter();
  const route = usePathname();

  const { loggedIn, username, admin } = useSelector(useAuth);
  const dispatch = useDispatch();

  const protectedUri = ['/Explore', '/Problems', '/User', '/LeaderBoard', '/duet', "/Admin"];

  useEffect(() => {
    if (!loggedIn) {
      for (let i = 0; i < protectedUri.length; i++) {
        if (route.startsWith(protectedUri[i])) {
          router.push("/Sign-up")
          return;
        }
      }
    }

    if (!admin) {
      if (route.startsWith("/Admin")) {
        router.push('/')
      }
    }

  }, [route, loggedIn]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/Api/Auth/VerifyCookie");
        if (data.success) {
          dispatch(login({ name: data.user.name, id: data.user.id, admin: data.user.admin }))
          router.push("/")
        }
        console.log(data)
      } catch (error) {
        console.log(error);
      }

    })()
  }, [])

  const logout = async () => {
    try {
      const { data } = await axios.get("/Api/Auth/Logout");
      if (data.success) {
        dispatch(logoutSlice());
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div className={[style.bg].join(" ")}>
      <div className={style.left}>
        <Link href={"/"} className={[style.img].join(" ")}>
          AlgoArena
          {/* <img className={[style.img].join(" ")} src="/algoarena.png" alt="AlgoArena logo" /> */}
        </Link>
        {
          loggedIn &&
          <>
            {
              admin ?
                <>
                 <div className={[style.p].join(" ")}>
                    <h6>
                      <Link href={"/Admin/Addproblem"}>add</Link>
                    </h6>
                  </div>
                  <div className={[style.p].join(" ")}>
                    <h6>
                      <Link href={"/Admin/Addproblems"}>upload</Link>
                    </h6>
                  </div>
                  <div className={[style.e].join(" ")}>
                    <Link href={"/Explore"}>list</Link>
                  </div>
                </>
                :
                <>
                  <div className={[style.p].join(" ")}>
                    <h6>
                      <Link href={"/Problems"}>Practice</Link>
                    </h6>
                  </div>
                  <div className={[style.e].join(" ")}>
                    <Link href={"/Explore"}>Explore</Link>
                  </div>
                  </>
            }

          </>
        }

      </div>
      <div className={style.left}>
        <div>
          {!loggedIn ? (
            <div className={style.left}>
              <div className={[style.s].join(" ")}>
                <h6>
                  <Link href={"/Sign-up"}>Sign up</Link>
                </h6>
              </div>
              <div className={[style.l].join(" ")}>
                <h6>
                  <Link href={"/Sign-in"}>Log in</Link>
                </h6>
              </div>
            </div>
          ) : <>
            {
              admin ?
                <></>
                :
                <>
                </>
            }
            <div className={style.left}>
              <div className={[style.e].join(" ")}>
                {username && (
                  <div
                    className={style.left}
                    onClick={() => router.push("/User/Dashboard")}
                  >
                    <img
                      className={[style.im].join(" ")}
                      src="/person.png"
                      alt="Profile_Picture"
                    />
                    <span className="text-blue-600 text-sm"> {username.length > 5 ? username.substring(0,6)+"..." : username} </span>
                  </div>
                )}
              </div>
              <button
                className="text-red-600 ml-5 pl-1 text-sm"
                onClick={() => {
                  logout();
                }}
              >
                Log out
              </button>
            </div>
          </>
          }
        </div>
      </div>
    </div>
    <div className="h-16 w-screen"></div>
    </>
  );
};

export default Nav;
