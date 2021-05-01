import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Edit3, User} from "react-feather";
import firebase from "firebase";
import axios from 'axios';
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import Card from "primereact/card";

const Definitions = (props)=>{
  let finalOut = [<div style={{color: "cornflowerblue", }}
    onClick={()=>{if(!props.editorActive){props.setEditorActive(true)}}}
  >
      <b><i className={"pi pi-plus-circle"}/> Add Definition</b>
  </div>];
  if(props.editorActive){
      finalOut.unshift(<div>
          <span className={'p-float-label'} style={{width: "100%"}}>
                    <Edit3 id={"edit-icon"} size={15} strokeWidth={1.2}/>
                    <InputText onChange={(e)=>{
                        props.setWord(e.target.value);
                    }}
                               name={"word"} value={props.word} placeholder="Word" id={"addWord"}
                               style={{transform: "translate(0px, -7px)", width: "16%", fontWeight: "700"}}
                    />
                    <InputText onChange={(e)=>{
                        props.setDef(e.target.value);
                    }}
                               name={"definition"} value={props.definition} placeholder="Definition of word" id={"addDefinition"}
                               style={{transform: "translate(0px, -7px)", width: "70%"}}
                    />
                    <i className={"pi pi-plus"} style={{fontSize: "19px", marginLeft: "50px", fontWeight: "3 00"}}
                       onClick={(e)=>{
                        let parsedText = `${props.word} means ${props.definition}. `;
                        let toAdd = {word: props.word, parsed: parsedText};
                        props.addDefinition(toAdd);
                        props.setWord('');props.setDef('');
                        props.setEditorActive(false);
                    }}/>
          </span>
      </div>);
  }
  let words = 'Defined Words: ';
    for(let i = 0; i < props.definitionList.length; i++){
        words = words + props.definitionList[i].word + ', ';
    }
    finalOut.unshift(<div style={{marginBottom: "10px"}}>
        {words}
    </div>);

    finalOut.unshift(<div style={{marginTop: "10px"}}></div>);
  return finalOut;
};

class AiUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'In this study, ',
            saving: false,
            editorActive: false,
            addWord: '',
            addDefinition: '',
            definitionList : [],
            username: props.username,
            closeModal: props.closeModal
        }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render(){
        return(
            <div>
                <div className={"definitions"}><Definitions
                    editorActive={this.state.editorActive} setEditorActive={(val)=>this.setState({editorActive: val})}
                    setWord = {(val)=>this.setState({addWord: val})} setDef = {(val)=>this.setState({addDefinition: val})}
                    word = {this.state.addWord} definition = {this.state.addDefinition}
                    addDefinition={(val)=>this.setState({definitionList: this.state.definitionList.concat(val)})}
                    definitionList = {this.state.definitionList}
                /></div>
                <InputTextarea rows={5} cols={30} value={this.state.value} onChange={(e)=>this.setState({value: e.target.value})}  autoResize
                    style={{
                        overflow: "hidden",
                        marginTop: "14px",
                        padding: "9px 12px",
                        width: "98%",
                        height: "108px",
                        border: "black solid 1px",
                        borderRadius: "15px",
                    }}
                />
                <div>
                    <h3 style={{fontWeight: "100", fontSize: "14px", marginTop: "5px"}}>&nbsp;*Once you click 'Done', the above text will be uploaded to the server and will be visible publicly</h3>
                </div>
                    <Button className={"p-button-info p-button-raised p-button-rounded"} icon={"pi pi-check"} label={this.state.saving?'Uploading request to server...':`Upload to Team+ A.I`}
                            style={{width: "99%", marginBottom: "0px"}}
                            onClick={()=>{
                                if(!this.state.saving){
                                    this.setState({saving: true});
                                    let finalTxt = '';
                                    for(let i = 0; i < this.state.definitionList.length; i++){
                                        finalTxt += this.state.definitionList[i].parsed;
                                    }
                                    finalTxt += this.state.value;
                                    let file = new Blob([finalTxt], {type: 'text/txt'});
                                    let formData = new FormData();
                                    formData.append('fileUpload', file, 'AI.txt');
                                    axios.post(
                                        `https://api.gbshs.kr/tmpl/ai/uploads.php?user=${this.state.username}`,
                                        formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        }
                                    ).then(()=>{
                                        console.log('Sent update request to server');
                                        this.state.closeModal();
                                    }).catch(()=>{
                                        console.log('File update failed');
                                        alert('Upload Failed :(');
                                        this.setState({saving: false});
                                    })
                                }

                            }}
                    />
            </div>
        )
    }
}

export default AiUploader;