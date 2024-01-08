import React, { useEffect, useRef, useState } from 'react';
import style from "./CodeBox.module.css";
import CodeEditor from '../CodeEditor/CodeEditor';
import OutputPanel from '../OutputPanel/OutputPanel';
import { PiDotsThreeVerticalBold } from "react-icons/pi";

function CodeBox() {
    const [editorWidth,setEditorWidth]=useState(window.innerWidth/2)
    const [code,setCode]=useState("// some comment")
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
        if(res.status==402){
            const output=await res.json()
            console.log(output)
        }else if(res.status==405){
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

        
    }
  return (
    <div
        className={style.container}
        ref={containerRef}
    >
        <CodeEditor
            width={editorWidth}
            code={code}
            setCode={setCode}
        />
        <div className={style.resizer}
            // draggable={true}
            onMouseDown={(e)=>{
                x=e.clientX
                w=editorWidth
                
                containerRef.current.classList.add(style.mouseCursorResizer)
                containerRef.current.addEventListener("mousemove",mouseMoveHandler)
                containerRef.current.addEventListener("mouseup",mouseUpHandler)
            }}
            // onMouseUp={()=>{
            //     console.log("it happened 2")
            //     containerRef.current.removeEventListener("mousemove",mouseMoveHandler);
            //     containerRef.current.removeEventListener("mouseup",mouseUpHandler);
            // }}
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
        />
    </div>
  )
}

export default CodeBox