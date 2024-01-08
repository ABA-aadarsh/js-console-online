import React from 'react'
import style from "./App.module.css"
import Navbar from './components/Navbar/Navbar'
import CodeBox from './components/CodeBox/CodeBox'

function App() {
  return (
    <div
      className={style.pageContainer}
    >
      <Navbar/>
      <CodeBox/>
    </div>
  )
}

export default App