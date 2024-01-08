import React, { useEffect, useState } from 'react'
import style from "./CodeEditor.module.css"
import Editor from '@monaco-editor/react';
import { IoLogoJavascript } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import { IoCodeDownloadSharp } from "react-icons/io5";
function CodeEditor(
  {
    width=400,
    code,
    setCode
  }
) {

  const [tabs,setTabs]=useState(
    [
      {
        name: "main.js",
        data:"// some comment"
      },
      // {
      //   name: "hi.js",
      //   data:"// some comment"
      // },
      // {
      //   name: "main1.js",
      //   data:"// some comment"
      // },
      // {
      //   name: "hi1.js",
      //   data:"// some comment"
      // },
      // {
      //   name: "main2.js",
      //   data:"// some comment"
      // },
      // {
      //   name: "hi2.js",
      //   data:"// some comment"
      // }
    ]
  )
  const [activeTabName,setActiveTabName]=useState(tabs[0].name)
  useEffect(()=>{
    if(activeTabName){
      setTabs(prev=>{
        const i= prev.findIndex(i=>i.name==activeTabName)
        prev[i].data=code
        return prev
      })
    }
  },[code])

  useEffect(()=>{
    const i=tabs.findIndex(t=>t.name==activeTabName)
    setCode(tabs[i].data)
  },[activeTabName])
  return (
    <div
      className={style.container}
      style={
        {
          width: `${width}px`
        }
      }
    >
      <div
        className={style.top}
      >
        <div
        className={style.tabPanel}
        >
          

          {
            tabs.map(({name},index)=>(
              <div key={name}
                title={name}
                onClick={()=>setActiveTabName(name)}
                className={style.tab +" "+ (activeTabName==name? style.activeTab : "")}>
                <IoLogoJavascript
                  color='yellow'
                />
                <span>{name}</span>
              </div>
            ))
          }
        </div>

        <div className={style.actionBtn}>
          <button
            title="Fullscreen"
          >
            <MdFullscreen/>
          </button>
          <button
            title="Download all"
          >
            <IoCodeDownloadSharp/>
          </button>
        </div>
      </div>
      
      <div
        className={style.editorBox}
      >
        <Editor
        defaultLanguage="javascript" 
        theme='vs-dark' 
        value={code}
        onChange={(value)=>setCode(value)}
      />
      </div>
    </div>
  )
}

export default CodeEditor