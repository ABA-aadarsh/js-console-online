import React, { useState } from 'react'
import style from "./OutputPanel.module.css"

function OutputPanel(
    {
        output,
        executeCode=()=>{}
    }
) {
  return (
    <div
        className={style.container}
    >
        <div className={style.panel}>
            <div
                className={style.tab}
            >
                <span>Output</span>
            </div>

            <button
                onClick={executeCode}
                style={{marginLeft:"20px"}}
            >Run</button>
        </div>
        <div
            className={style.outputBox}
        >
            <h3
                className={style.title}
            >{output?.title}</h3>
            <pre>
                <p
                    className={style.data}
                >{output?.data}</p>
            </pre>
        </div>
    </div>
  )
}

export default OutputPanel