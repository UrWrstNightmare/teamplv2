import React from 'react';
import {Button} from "primereact/button";
import axios from 'axios';

const FileDeleter = (props) => {
    let filename = props.filename; let filepath = props.filepath; let user = props.user; let shared = props.shared;
    let onDelete = props.onDelete;
    return(
        <div>
            <div style={{width: "100%"}}>
                <h3 style={{color: "indianred", margin: "10px 0 10px 0", textAlign: "center"}}>Permanently delete File '{filename}'?</h3>
                <Button className={"p-button-danger p-button-raised p-button-rounded"} icon={"pi pi-trash"} label={`Delete '${filename}'`}
                        style={{width: "100%", marginBottom: "20px"}}
                        onClick={()=>{
                            axios.get(
                                `https://api.gbshs.kr/tmpl/deleteFile.php?user=${user}&fileName=${filepath}${(props.shared?'&shared=true':'')}`
                            ).then(()=>{
                                props.onDelete();
                            }).catch(()=>{
                                alert("File Delete Failed");
                            })
                        }}
                />
            </div>
        </div>
    )
};

export default FileDeleter;