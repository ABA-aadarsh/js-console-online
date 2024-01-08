import React from 'react'
import style from "./Navbar.module.css"

function Navbar() {
  return (
    <header
      className={style.navbar}
    >
      <div>
        <h3>Logo</h3>
      </div>
    </header>
  )
}

export default Navbar