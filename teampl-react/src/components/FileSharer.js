import React, {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {User} from "react-feather";
import firebase from "firebase";
import axios from 'axios';

class FileSharer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersToShare : [],
            usersToShareEmail: [],
            fileName: props.fileName,
            filePath: props.filePath,
            username: props.username,
            inputBuffer: '',
            errorMessage: '',
        }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
        for(let i = 0; i < this.state.usersToShare.length; i++)
            axios.get(`https://api.gbshs.kr/tmpl/shareFile.php?user=${this.state.username}&fileName=${this.state.filePath}&shareTo=${this.state.usersToShare[i]}&permission=edit`);
    }

    addedUserViewer(){
        let out = [
            <p>{this.state.fileName} <b>will be shared with {this.state.usersToShare.length} people.</b></p>
        ];
        for(let e = 0; e < this.state.usersToShare.length; e++){
                out.push(<p>
                    <b>#{e+1}</b> | {this.state.usersToShare[e]} <span className={"p-tag p-tag-success p-tag-rounded"} style={{float: "right"}}> ··· {this.state.usersToShareEmail[e]}</span>
                </p>)
        }
        return(out);
    }

    render(){
        return(<div>
            <h3 style={{display: "inline-block",}}>Share File {this.state.fileName} with :</h3>
            <div className="p-inputgroup" style={{
                display: "inline-block",
                width: "57%"
            }}>
                <span className={'p-float-label'} style={{width: "100%"}}>
                    <User id={"user-icon"} size={15} strokeWidth={1.2}/>
                    <InputText onChange={(e)=>{
                        this.setState({inputBuffer: e.target.value});
                    }}
                               name={"username"} value={this.state.inputBuffer} placeholder="Press Enter to add" id={"addUsername"}
                               onKeyPress={(e)=>{
                                   if(e.key === 'Enter' && this.state.inputBuffer !== '' && !this.state.usersToShare.includes(this.state.inputBuffer) && this.state.username !== this.state.inputBuffer){
                                       let newUser = this.state.inputBuffer;
                                       let userData = {};
                                       console.log(`Add user ${this.state.inputBuffer}`);
                                       this.setState({inputBuffer: ''});
                                       firebase.database().ref('usernames/'+newUser).on("value", (snapshot)=>{
                                           console.log(snapshot.val());
                                           if(snapshot.val() !== null){
                                               console.log(this.state.usersToShare);
                                               this.setState({
                                                   usersToShare: [...this.state.usersToShare, newUser],
                                                   usersToShareEmail: [...this.state.usersToShareEmail, snapshot.val().email]
                                               });
                                           }else{
                                               console.log('NOT A USER');
                                               this.setState({
                                                   errorMessage: `[ERROR] '${newUser}' is not a registered user.`
                                               })
                                           }
                                       })
                                   }
                               }}
                               style={{transform: "translate(0px, -7px)"}}
                    />
                </span>
            </div>
            <div><p id={"errorMsg"} style={{color: "indianred", marginTop: 0}}>{this.state.errorMessage}</p></div>
            <div>{this.addedUserViewer()}</div>
        </div>)
    }
}

export default FileSharer;