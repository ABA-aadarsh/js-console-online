import React from 'react'
import style from "./Navbar.module.css"
import { IoLogoJavascript } from "react-icons/io5";

function Navbar() {
  return (
    <header
      className={style.navbar}
    >
      <div
        className={style.logoContainer}
      >
        <span
          className={style.logo}
        >
          <IoLogoJavascript/>
        </span>
        <h3
          style={{letterSpacing:"0.5px"}}
        >JS-Console-Online</h3>
      </div>
    </header>
  )
}

export default Navbar