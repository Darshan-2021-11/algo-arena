import React from 'react'
import style from './Nav.module.css'

const Nav: React.FC = () => {
  return (
    <div className={[style.bg].join(" ")}>
      <picture>
        <img className={[style.img].join(" ")} src="/algoarena.png" alt="AlgoArena logo" />
      </picture>
      <div className={[style.p].join(" ")}><h6>Practice</h6></div>
      <div className={[style.e].join(" ")}><h6>Explore</h6></div>
      <div className={[style.l].join(" ")}><h6>Log in</h6></div>
    </div>
  )
}

export default Nav
