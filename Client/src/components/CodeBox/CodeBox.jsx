import React, { useEffect, useRef, useState } from 'react';
import style from "./CodeBox.module.css";
import CodeEditor from '../CodeEditor/CodeEditor';
import OutputPanel from '../OutputPanel/OutputPanel';
import { PiDotsThreeVerticalBold } from "react-icons/pi";

function CodeBox() {
    const [editorWidth,setEditorWidth]=useState(window.innerWidth/2)
    const [code,setCode]=useState("// some comment")
    const [fileDragover,setFileDragover]=useState(false)
    const [outputLoading,setOutputLoading]=useState(false)
    const [tabs,setTabs]=useState(
        [
          {
            name: "main.js",
            data:"// some comment"
          }
        ]
    )
    const [activeTabName,setActiveTabName]=useState(tabs[0]?.name)
    const [output,setOutput]=useState(null)
    const containerRef=useRef(null)
    var x, w
    const mouseMoveHandler=(e)=>{
        window.getSelection().removeAllRanges()
        var dx = e.clientX - x;
        var cw = w + dx;
        if(cw<window.innerWidth-100){
            setEditorWidth(cw)
        }
    }
    const mouseUpHandler=(e)=>{
        containerRef.current.classList.remove(style.mouseCursorResizer)
        containerRef.current.removeEventListener("mouseup",mouseUpHandler);
        containerRef.current.removeEventListener("mousemove",mouseMoveHandler);
    }
    const executeCode=async ()=>{
        if(code==''){
            return
        }
        console.log(code)
        setOutputLoading(true)
        const url="http://localhost:8080/code/run"
        const res=await fetch(url,    
            {
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(
                    {
                        code:code
                    }
                )
            }
        )
        if(res.status==405){
            // error occured
            const output=await res.json()
            setOutput(output)
        }else if(res.status==202){
            // successful code execution
            const output=await res.json()
            // console.log("")
            output.data=output.data.replace(/\n$/,"")
            output.data=">> "+output.data.replaceAll("\n","\n>> ")
            setOutput(output)
        }
        setOutputLoading(false)
    }
  return (
    <div
        className={style.container}
        ref={containerRef}
        onDragOver={()=>{
            setFileDragover(true)
        }}
        onDragExit={()=>setFileDragover(false)}
    >
        <CodeEditor
            width={editorWidth}
            code={code}
            setCode={setCode}
            tabs={tabs}
            setTabs={setTabs}
            activeTabName={activeTabName}
            setActiveTabName={setActiveTabName}
        />
        <div className={style.resizer}
            onMouseDown={(e)=>{
                x=e.clientX
                w=editorWidth
                
                containerRef.current.classList.add(style.mouseCursorResizer)
                containerRef.current.addEventListener("mousemove",mouseMoveHandler)
                containerRef.current.addEventListener("mouseup",mouseUpHandler)
            }}
        >
            <span
                style={{
                    fontSize:"20px"
                }}
            >
                <PiDotsThreeVerticalBold/>
            </span>
        </div>
        <OutputPanel
            output={output}
            executeCode={executeCode}
            loading={outputLoading}
        />
        
        {
            fileDragover &&

            <div
                className={style.dropBox}
                onDrop={ async (e)=>{
                    e.preventDefault()
                    setFileDragover(false)
                    const file=e.dataTransfer.files[0]
                    // console.log(file.name)
                    const fileData=await file.text()
                    setTabs(prev=>(
                        [{
                            name: file.name,
                            data: fileData
                        },...prev]
                    ))
                    setActiveTabName(file.name)
                }}
                onDragExit={()=>setFileDragover(false)}
            >   
                <div
                    className={style.centerBox}
                >
                    <h2>Drop File Here</h2>
                </div>
            </div>
        }
    </div>
  )
}

export default CodeBox