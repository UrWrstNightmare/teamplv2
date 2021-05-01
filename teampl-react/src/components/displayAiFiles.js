import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";

export const DisplayAiFiles  = (props)=> {
        console.log(props.metadata);
        let finalOut = [];
        for(let i = props.metadata.fileCnt-1; i >=0 ; i--){
            console.log(i);
            finalOut.push(
                <Card style={{width: "95%", margin: "10px", padding: "20px", paddingTop: "20px", paddingBottom: 0}}
                    header={`Team+ A.I generated abstract #${i}`} footer={<div style={{
                    width: "100%",
                    margin: "auto",
                    display: "block",
                    whiteSpace: "nowrap",
                }}>
                    <Button label="Open" icon="pi pi-file" className="p-button-primary"
                            onClick={()=>props.viewerOpen(i)}
                    />
                </div>}>
                    Submission by {props.metadata.fileCreator[i]}, uploaded on {props.metadata.uploadDate[i]} (filesize: {props.metadata.fileSize[i]}B)
                    <br/>
                    {i > props.metadata.fileProcessed-1 ? <p style={{fontWeight: "300"}}>Server is processing request...</p>:<p style={{fontWeight: "700"}}>Server has generated a response!</p>}
                </Card>
            )
        }
        return finalOut;
};

export default DisplayAiFiles;