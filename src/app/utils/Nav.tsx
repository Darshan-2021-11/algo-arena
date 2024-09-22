import React from 'react'
import style from './Nav.module.css'
import Link from 'next/link'

const Nav: React.FC = () => {
  return (
    <div className={[style.bg].join(" ")}>
      <picture>
        <Link href={'/Home'}>
        <img className={[style.img].join(" ")} src="/algoarena.png" alt="AlgoArena logo" />
        </Link>
      </picture>
      <div className={[style.p].join(" ")}><h6><Link href={'/Problems'}>Practice</Link></h6></div>
      <div className={[style.e].join(" ")}><h6>Explore</h6></div>
      <div className={[style.l].join(" ")}><h6><Link href={'/Auth/Login'}>Log in</Link></h6></div>
    </div>
  )
}

export default Nav
