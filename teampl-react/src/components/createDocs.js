import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Edit3} from "react-feather";
import firebase from "firebase";
import axios from 'axios';
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";

class CreateDocs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closeDoc : props.closeDialog,
            fileName: 'NewTeam+Doc',
            username: props.username,
            inputBuffer: 'NewTeam+Doc',
            saving: false,
            fileBuffer: '',
            errorMessage: '',
        }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
        axios.get(`https://api.gbshs.kr/tmpl/updateTitle.php?user=${this.state.username}&fileName=${this.state.filePath}&newFileName=${this.state.inputBuffer}`);
    }
    render(){
        return(<div>
            <h3 style={{display: "inline-block",}}>Title:</h3>
            <div className="p-inputgroup" style={{
                display: "inline-block",
                width: "57%"
            }}>
                <span className={'p-float-label'} style={{width: "100%"}}>
                    <Edit3 id={"edit-icon"} size={15} strokeWidth={1.2}/>
                    <InputText onChange={(e)=>{
                        this.setState({inputBuffer: e.target.value});
                    }}
                               name={"title"} value={this.state.inputBuffer} placeholder="File name" id={"addUsername"}
                               style={{transform: "translate(0px, -7px)"}}
                    />
                </span>
            </div>
            <Editor style={{height:'400px'}} value={'Enter Text, Images & Code here'} onTextChange={(e) => {this.setState({fileBuffer: e.htmlValue})}}/>
            <div>*A refresh may be required after save.</div>
            <Button className={"p-button-info p-button-raised p-button-rounded"} icon={"pi pi-check"} label={this.state.saving?'Uploading file to server...':`Save '${this.state.inputBuffer}.tdocs'`}
                    style={{width: "100%", marginBottom: "20px"}}
                    onClick={()=>{
                        if(!this.state.saving){
                            this.setState({saving: true});
                            console.log(this.state.fileBuffer);
                            let file = new Blob([this.state.fileBuffer], {type: 'tdocs/txt'});
                            let formData = new FormData();
                            formData.append('fileUpload[]', file, this.state.inputBuffer+'.tdocx');
                            axios.post(
                                `https://api.gbshs.kr/tmpl/uploads.php?user=${this.state.username}`,
                                formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            ).then(()=>{
                                console.log('Sent update request to server');
                                this.state.closeDoc();
                            }).catch(()=>{
                                console.log('File update failed');
                                alert('Upload Failed :(');
                                this.setState({saving: false});
                            })
                        }
                        else{alert('File Upload is already in progress...');}
                    }}
            />
        </div>)
    }
}

export default CreateDocs;