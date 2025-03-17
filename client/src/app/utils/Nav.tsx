"use client";
import React, { useEffect, useState, useRef } from "react";
import style from "./Nav.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/slices/authSlice";
import { useSelector } from "react-redux";

const Nav: React.FC = () => {
  const router = useRouter();

  const data = useSelector(useAuth);

  const [userName, setUserName] = useState<string | null>();

  useEffect(() => {
    const userdata = localStorage.getItem("user");
    if (!userdata) return;
    const user = JSON.parse(userdata);

    if (user) {
      setUserName(user.name);
    }
  }, [userName]);

  useEffect(() => {
    if (typeof window !== "undefined" && userName != null)
      window.sessionStorage.setItem("userName", userName);
  }, [userName]);

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
          {!userName ? (
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
                {userName ? (
                  <div
                    className={style.left}
                    onClick={()=>router.push("/User/Dashboard")}
                  >
                    <img
                      className={[style.im].join(" ")}
                      src="/person.png"
                      alt="Profile_Picture"
                    />
                    <span className="text-blue-600 text-sm"> {userName} </span>
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
                  setUserName(null);
                  localStorage.removeItem("user");
                  router.push("/Home");
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
