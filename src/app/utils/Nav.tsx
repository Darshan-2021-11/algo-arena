'use client'
import React from "react";
import style from "./Nav.module.css";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signOut } from 'firebase/auth';

const Nav: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');
  console.log({ user });

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
          <h6>Explore</h6>
        </div>
      </div>
      <div className={style.left}>
        <div>
          {!user && !userSession ? (
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
                <h6>User</h6>
              </div>
              <button onClick={() => {
        signOut(auth)
        sessionStorage.removeItem('user')
        router.push('/Home')
        }}>
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
