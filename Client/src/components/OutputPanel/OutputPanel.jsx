import React, { useState } from 'react'
import style from "./OutputPanel.module.css"
import { IoPlayOutline } from "react-icons/io5";

function OutputPanel(
    {
        output,
        executeCode=()=>{},
        loading
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
                <span
                    style={
                        {
                            display:"inline-block",
                            height:"100%",
                            borderBottom:"1px solid white",
                            paddingBottom:"5px"
                        }
                    }
                >Output</span>
            </div>

            <button
                onClick={executeCode}
                className={style.runBtn}
            >
                <IoPlayOutline
                    style={{paddingTop:"2px", fontSize:"18px"}}
                />
                <span>Run</span>
            </button>
        </div>
        <div
            className={style.outputBox}
        >
            {
                loading?
                <p
                    style={{
                        marginTop:"20px",
                        paddingLeft:"10px"
                    }}
                >Loading...</p>
                :
                <>
                <h3
                    className={style.title}
                    style={
                        {
                            color: output?.status?"inherit":"red"
                        }
                    }
                >{output?.title}</h3>
                <pre>
                    <p
                        className={style.data}
                    >{output?.data || "Note: Click Run Button Above to see ouput."}</p>
                </pre>
                </>
            }
        </div>
    </div>
  )
}

export default OutputPanel