import React, { useEffect, useRef, useState } from 'react'
import style from "./CodeEditor.module.css"
import Editor from '@monaco-editor/react';
import { IoLogoJavascript } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import { IoCodeDownloadSharp } from "react-icons/io5";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { MdDownload } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import JSZip from "jszip"
function CodeEditor(
  {
    width=400,
    code,
    setCode=()=>{},
    tabs=[],
    setTabs=()=>{},
    activeTabName,
    setActiveTabName=()=>{}
  }
) {
  const containerRef = useRef(null)
  const [isFullscreen,setIsFullscreen]=useState(false)
  useEffect(()=>{
    if(activeTabName){
      setTabs(prev=>{
        const i= prev.findIndex(i=>i.name==activeTabName)
        if(i!=-1){
          prev[i].data=code
          return prev
        }
      })
    }
  },[code])

  useEffect(()=>{
    const i=tabs.findIndex(t=>t.name==activeTabName)
    if(i!=-1){
      setCode(tabs[i].data)
    }
  },[activeTabName])
  

  return (
    <div
      className={style.container}
      ref={containerRef}
      style={
        {
          width: `${width}px`
        }
      }
    >
      <div
        className={style.top}
      >
        <button
          className={style.addBtn}
          title="Create New File"
          onClick={()=>{
            let tempN=0
            tabs.forEach((t)=>{
              const fileName=t.name
              const match=fileName.match(/^main(?:-(\d+))?\.js$/)
              if(match && match[1]!==undefined){
                const n = parseInt(match[1])
                if(tempN<n)tempN=n;
              }
            })
            tempN+=1
            const tempName= tempN!=0?`main-${tempN}.js`:"main.js"
            setTabs(prev=>[{name: tempName,data:"// some comment"},...prev])
            setActiveTabName(tempName)
          }}
        >
          <MdOutlineNoteAdd/>
        </button>
        <div
        className={style.tabPanel}
        >
          {
            tabs.map(({name},index)=>(
              <div key={name}
                title={name}
                onClick={(e)=>{
                  setActiveTabName(name)
                }}
                className={style.tab +" "+ (activeTabName==name? style.activeTab : "")}>
                <IoLogoJavascript
                  color='yellow'
                />
                <span
                  className={style.tabName}
                >{name}</span>
                <div
                  className={style.tabBtnContainer}
                >
                  <button
                    className={style.downloadBtn}
                    title={`Download ${name}`}
                    onClick={async ()=>{
                      const tab=tabs.find(t=>t.name==name)
                      if(tab){
                        const blob= new Blob([tab.data],{type:"application/javascript"})
                        const url=URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href=url
                        a.download=name
                        const downloadHandler=()=>{
                          setTimeout(()=>{
                            URL.revokeObjectURL(url)
                            a.removeEventListener("click", downloadHandler)
                          },1000)
                        }
                        a.addEventListener("click",downloadHandler)
                        a.click()
                      }
                    }}
                  >
                    <MdDownload/>
                  </button>
                  <button
                    title="Close"
                    onClick={(e)=>{
                      e.stopPropagation()
                      if(activeTabName==name){
                        const temp=tabs.filter(i=>i.name!=name)
                        setTabs([...temp])
                        if(temp.length>0){
                          setActiveTabName(temp[0].name)
                        }
                      }else{
                        setTabs(prev=>(
                          prev.filter(i=>i.name!=name)
                        ))
                      }
                    }}
                    className={style.closeBtn}
                  >
                    <IoCloseSharp/>
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        <div className={style.actionBtn}>
          <button
            title={isFullscreen?"Exit Fullscreen":"Fullscreen"}
            onClick={async ()=>{
              if(isFullscreen==false){
                await containerRef.current.requestFullscreen()
                setIsFullscreen(true)
              }else{
                await document.exitFullscreen()
                setIsFullscreen(false)
              }
            }}
          >
            {
              isFullscreen ?
              <MdFullscreenExit/>:
              <MdFullscreen/>
            }
          </button>
          <button
            title="Download all"
            onClick={async ()=>{
              const promise=tabs.map(tab=>{
                const blob= new Blob([tab.data],{type:"application/javascript"})
                return {
                  name: tab.name,
                  blobData: blob
                }
              })

              const blobArray= await Promise.all(promise)

              const zip= new JSZip()
              blobArray.forEach(({name,blobData})=>{
                zip.file(name,blobData)
              })
              const zipFile=await zip.generateAsync({type: "blob"})
              const zipFileUrl= URL.createObjectURL(zipFile)
              const a = document.createElement("a")
              a.download="Codes.zip"
              a.href=zipFileUrl
              const downloadHandler=()=>{
                setTimeout(()=>{
                  URL.revokeObjectURL(zipFileUrl)
                  a.removeEventListener("click", downloadHandler)
                },1000)
              }
              a.addEventListener("click",downloadHandler)
              a.click()
            }}
          >
            <IoCodeDownloadSharp/>
          </button>
        </div>
      </div>
      
      <div
        className={style.editorBox}
      >
        {tabs.length>0
         ?
          <Editor
          defaultLanguage="javascript" 
          theme='vs-dark' 
          value={code}
          onChange={(value)=>setCode(value)}
          />
          :
          <p
            style={{textAlign:"center", color:"white"}}
          >
            File Empty. Create New File.
          </p>
        }
      </div>
    </div>
  )
}

export default CodeEditor