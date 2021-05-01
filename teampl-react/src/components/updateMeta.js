import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Edit3} from "react-feather";
import firebase from "firebase";
import axios from 'axios';
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";

class UpdateMeta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closeDoc : props.closeDialog,
            fileName: props.filename,
            filePath: props.filepath,
            username: props.username,
            inputBuffer: props.metadata,
        }
    }
    componentDidMount() {
        console.log(this.state.filePath);
    }

    componentWillUnmount() {
        axios.get(`https://api.gbshs.kr/tmpl/updateMetadata.php?user=${this.state.username}&fileName=${this.state.filePath}&metadata=${this.state.inputBuffer}`);
    }
    render(){
        return(<div>
            <h3 style={{display: "inline-block",}}><b>Edit Metadata for:</b>{this.state.fileName}</h3>
            <div className="p-inputgroup" style={{
                display: "block",
                width: "100%"
            }}>
                <span className={'p-float-label'} style={{width: "100%"}}>
                    <Edit3 id={"edit-icon"} size={15} strokeWidth={1.2}/>
                    <InputText onChange={(e)=>{
                        this.setState({inputBuffer: e.target.value});
                    }}
                               name={"title"} value={this.state.inputBuffer} placeholder="Metadata (cannot be empty)" id={"addUsername"}
                               style={{transform: "translate(0px, -7px)"}}
                    />
                </span>
            </div>
            *Updates will be saved on close &nbsp;
            **A refresh may be required
        </div>)
    }
}

export default UpdateMeta;