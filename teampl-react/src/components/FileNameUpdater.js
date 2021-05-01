import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Edit3} from "react-feather";
import firebase from "firebase";
import axios from 'axios';

class FileNameUpdater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersToShare : [],
            usersToShareEmail: [],
            fileName: props.fileName,
            filePath: props.filePath,
            username: props.username,
            inputBuffer: props.fileName,
            errorMessage: '',
        }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
            console.log(`https://api.gbshs.kr/tmpl/updateTitle.php?user=${this.state.username}&fileName=${this.state.filePath}&newFileName=${this.state.inputBuffer}`);
            axios.get(`https://api.gbshs.kr/tmpl/updateTitle.php?user=${this.state.username}&fileName=${this.state.filePath}&newFileName=${this.state.inputBuffer}`);
    }
    render(){
        return(<div>
            <h3 style={{display: "inline-block",}}>Rename File {this.state.fileName} with :</h3>
            <div className="p-inputgroup" style={{
                display: "inline-block",
                width: "57%"
            }}>
                <span className={'p-float-label'} style={{width: "100%"}}>
                    <Edit3 id={"edit-icon"} size={15} strokeWidth={1.2}/>
                    <InputText onChange={(e)=>{
                        this.setState({inputBuffer: e.target.value});
                    }}
                               name={"username"} value={this.state.inputBuffer} placeholder="Press Enter to add" id={"addUsername"}
                               style={{transform: "translate(0px, -7px)"}}
                    />
                </span>
            </div>
            <div>*A Refresh may be required after update</div>
        </div>)
    }
}

export default FileNameUpdater;