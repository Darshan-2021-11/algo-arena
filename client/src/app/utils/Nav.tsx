"use client";
import style from "./Nav.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, logout, useAuth } from "../lib/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const Nav: React.FC = () => {
  const router = useRouter();

  const {loggedIn, username} = useSelector(useAuth);
  const dispatch = useDispatch();



  useEffect(()=>{
    (async()=>{
      try {
        const {data} = await axios.get("/Api/Auth/VerifyCookie");
        if(data.success){
          dispatch(login(data.user.name))

        }
        console.log(data)
      } catch (error) {
        console.log(error);
      }
     
    })()
  },[])


  return (
    <div className={[style.bg].join(" ")}>
      <div className={style.left}>
        <Link href={"/Home"} className={[style.img].join(" ")}>
          AlgoArena
          {/* <img className={[style.img].join(" ")} src="/algoarena.png" alt="AlgoArena logo" /> */}
        </Link>

        <div className={[style.p].join(" ")}>
          <h6>
            <Link href={"/Problems"}>Practice</Link>
          </h6>
        </div>
        <div className={[style.e].join(" ")}>
          <Link href={"/Explore"}>Explore</Link>
        </div>
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
          ) : (
            <div className={style.left}>
              <div className={[style.e].join(" ")}>
                {username ? (
                  <div
                    className={style.left}
                    onClick={()=>router.push("/User/Dashboard")}
                  >
                    <img
                      className={[style.im].join(" ")}
                      src="/person.png"
                      alt="Profile_Picture"
                    />
                    <span className="text-blue-600 text-sm"> {username} </span>
                  </div>
                ) : (
                  <a href="/Sign-in" className="text-blue-400">
                    Log in
                  </a>
                )}
              </div>
              <button
                className="text-red-600 ml-5 pl-1 text-sm"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
