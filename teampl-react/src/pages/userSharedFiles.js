import React, {useContext} from 'react';

import {Toast} from "primereact/toast";
import {OverlayPanel} from "primereact/overlaypanel";
import {Tooltip} from "primereact/tooltip";
import {Card} from 'primereact/card';
import {Button} from "primereact/button";
import {SplitButton} from "primereact/splitbutton";
import { Dialog } from 'primereact/dialog';
import {Menu} from 'primereact/menu';
import {InputText} from 'primereact/inputtext';
import {UpdatesScroll} from '../components/updatesScroll';
import {Messages} from "primereact/messages";

import {firebaseAuth} from "../providers/UserProvider";

import {Ripple} from "primereact/ripple";
import { ToggleButton } from 'primereact/togglebutton';
import PremiumGift from '../img/graphics/premiumGift.jpg';
import loginRequired from '../img/graphics/loginBanner.png';
import teamplLogo from '../img/icons/teampl-logo-black-small.png';
import GetFileMetadata from '../components/GetFileMetadata';
import GetFileToView from '../components/GetFileToView';

import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
import workplace from '../img/graphics/workplace.jpg';
import success from '../img/graphics/success.webp';

import {Gift, Bell, User,Key, Mail, RefreshCw, HelpCircle, LogOut, Settings} from "react-feather";
import SignUp from "../components/SignUpComponent";
import SignIn from "../components/SignInComponent";

import '../css/login.css';
import {StyleSheet, css} from "aphrodite";
import {fadeIn, fadeOut, headShake} from "react-animations";
import {Redirect, useHistory} from 'react-router-dom';
import {Input} from "antd";
import {authMethods} from "../firebase/authMethods";
import { FileUpload } from 'primereact/fileupload';
import {UserContext} from "../providers/UserProvider";
import firebase from "firebase";
import axios from 'axios';

import FileViewer from "../components/FileViewer";
import FileDeleter from "../components/FileDeleter";
import {SelectButton} from "primereact/selectbutton";
import FileSharer from "../components/FileSharer";
import {SharedFileMetadata} from "../components/SharedFileMetadata";
import FileNameUpdater from "../components/FileNameUpdater";
import {InputNumber} from "primereact/inputnumber";
import {ColorPicker} from "primereact/colorpicker";
import Search from "react-feather/dist/icons/search";
import UpdateMeta from "../components/updateMeta";

let user = null;
let userName = null;

const ItemPutter = (props) => {
    const {metadata, setMetadata} = useContext(firebaseAuth);
    if(metadata.loading || !("storeData" in metadata.data)){
        return "Refreshing from Server...";
    }
    let clGridName = "p-col-12 p-md-6 p-lg-3";
    let finalOut = [];
    if(!Array.isArray(metadata.data.storeData.sharedFileList)){
        metadata.data.storeData.sharedFileList = Object.values(metadata.data.storeData.sharedFileList);
    }
    if(metadata.data.storeData.sharedFileList.length === 0){
        finalOut = 'No files shared :( '
    }else
    for(let i =  metadata.data.storeData.sharedFileList.length-1; i >=0; i--){
        let filename = metadata.data.storeData.sharedFileList[i];
        let storeData = metadata.data.storeData;
        if(props.filter !== ''){
            if(!metadata.data.storeData.fileName[filename].toLowerCase().includes(props.filter.toLowerCase()) && !metadata.data.storeData.fileDesc[filename].toLowerCase().includes(props.filter.toLowerCase()))
                continue;
        }
        let menuOptions = [
            {
                label: <p style={{color: 'black', margin: '0'}}>About</p>,
                icon: 'pi pi-info-circle',
                command: ()=>{props.showMetadata(filename, storeData.fileName[filename])}
            },
            {
                label: <p style={{color: 'black', margin: '0'}}>Rename</p>,
                icon: 'pi pi-pencil',
                command: ()=>{props.showFileRename(filename, storeData.fileName[filename])}
            },
            {
                label: <p style={{color: 'black', margin: '0'}}>Metadata</p>,
                icon: 'pi pi-search',
                command: ()=>{props.showMetaEditor(filename, storeData.fileName[filename], storeData.fileDesc[filename])}
            },
            {
                label: <p style={{color: 'red', margin: '0'}}>Delete</p>,
                icon: 'pi pi-trash',
                command: ()=>{props.showFileDeleter(filename, storeData.fileName[filename])}
            },

        ];
        finalOut.push(<div className={clGridName}>
                        <Card
                            title={storeData.fileName[filename]}
                            footer={<div>
                                <div style={{
                                    width: "116px",
                                    margin: "auto",
                                    display: "block",
                                whiteSpace: "nowrap",
                                }}>
                               <SplitButton label="Open" icon="pi pi-file" className="p-button-primary"
                                       onClick={()=>props.fileViewerOpen(filename, storeData.fileName[filename])}
                                            model={menuOptions}/>
                                </div></div>}>
                            <div style={{height: "75px", marginTop: "-40px"}}>
                                <p style={{width: "100%", color: "rgba(0,0,0,0.7)"}}>
                                    ({Math.round(metadata.data.storeData.fileSize[filename]/1e4)/100}MB)
                                </p>
                                <p style={{marginTop:"5px",whiteSpace: "wrap", height: "66px", overflowWrap: "break-word", overflow:"scroll"}}>{storeData.fileDesc[filename]}</p>
                            </div>
                        </Card>
                     </div>);
    }
    return finalOut;
};

const homeMenuItems = [
    {
        label: 'My Files',
        items: [
            {label: 'My Files', icon: 'pi pi-file-o', command: ()=>window.location.href = '/home.js'},
            {label: 'Shared Files', icon: 'pi pi-share-alt', command: ()=>window.location.href = '/shared.js'},
        ]
    },
    {
        label: 'My Tasks',
        items: [
            {label: 'New Project ??', icon: 'pi pi-check-square', command: ()=>window.location.href='/project.js'},
            {label: 'Team+ A.I ??', icon: 'pi pi-chart-line', command: ()=>window.location.href = '/project-ai.js'},
        ]
    }
];

const SignOutButton = (props) => {
    const {setErrors, setToken, token, errors} = useContext(firebaseAuth);
    return( <LogOut  style={{float: 'right'}}
        id={"button-logout"} size={25} strokeWidth={1.2} onClick={()=>authMethods.signout(setErrors, setToken)}/>)
};

const ValidateUser = (props) => {
    firebase.auth().onAuthStateChanged(function(u){
        if(u) user = firebase.auth().currentUser;
        if(user === null){
            alert('[Team+] Invalid access! Please Login First' + user);
            window.location.replace('/login.js');
        }
        else console.log(user);
        firebase.database().ref('users/'+user.uid).on("value", function(snapshot){
            console.log(snapshot.val());
            userName = snapshot.name;
            props.onLoad(snapshot.val());
            return null;
        })
    });
    return null;
};
const styles = StyleSheet.create({
    load: {
        animationName: fadeIn,
        animationDuration: '1s'
    },
    unload: {
        animationName: fadeOut,
        animationDuration: '1s'
    },
    bounce: {
        animationName: headShake,
        animationDuration: '0.7s'
    }
});

export class UserSharedFiles extends React.Component {
    constructor(props) {
        super(props);
        this.myInput = React.createRef();
        console.log('login');
        this.state = {
            'giftHover': '',
            'bellHover': '',
            'loginButton': 'Register',
            'displaySignUp': false,
            'displayUpload': false,
            'SignUpSuccess': false,
            'displaySignIn': false,
            'SignInSuccess': false,
            'snapshot' : {username: 'loading', createdDate: 'loading', userLv: 0, name: 'loading'},
            'validated' : false,
            'metaUpdateRequested': false,
            'displayFileViewer': false,
            'displayFileDeleter': false,
            'displayFileSharer': false,
            'displayFileRename': false,
            'selectedFile': null,
            'selectedFileFullName': '',
            'dlFileForView': false,
            'openFileViewer': false,
            'viewFilePath': '',
            'viewFileBlob': '',
            'tempFileSaveData': '',
            'tempFileUpdateNeeded': false,
            'formattedTextCheck': false,
            'settingHover': '',
            'displaySettings': false,
            'displayWidth':  700,
            'modalBackgroundColor': '#FFFFFF',
            'displayMetaEditor': false,
            'selectedMeta': '',

            'filter': ''
        };
        this.clickLogin = this.clickLogin.bind(this);
        this.handler = this.handler.bind(this);
        this.userDataValidated = this.userDataValidated.bind(this);
        this.showUploadModal = this.showUploadModal.bind(this);
        this.showFileViewer = this.showFileViewer.bind(this);
        this.showFileDeleter = this.showFileDeleter.bind(this);
        this.showFileSharer = this.showFileSharer.bind(this);
        this.showFileMetadata = this.showFileMetadata.bind(this);
        this.showFileRename = this.showFileRename.bind(this);
        this.showMetaEditor = this.showMetaEditor.bind(this);
    }


    componentDidMount() {
        this.toast.show([
            {severity: "success", summary: 'Login Success', detail: 'Welcome to TeamPl!', life: 5000}
        ]);
        return null;
    }

    handler(){
        console.log("handler call");
        this.setState({
           displaySignUp: false,
            SignUpSuccess: true
        });
    }

    handlerSignIn(){
        console.log("handler call");
        this.setState({
            displaySignUp: false,
            SignUpSuccess: true
        });
    }

    teamplPremium = {
        header: <img src={PremiumGift} alt={"Card"} className={"premium-gift-img"} style={{width: "197px", marginBottom: "-10px"}}/>,
        footer: <span><Button label="Purchase" icon="pi pi-check" style={{width: "100%"}} className="p-ripple p-d-flex"
                              onClick={()=>this.setState({
                                  displayBasic: true
                              })}
        /></span>
    };
    teamplLogin = {
        header: <img src={loginRequired} alt={"Card"} className={"premium-login-img"} style={{}}/>,
        footer: <span><Button label="Login" icon="pi pi-check" style={{width: "100%"}} className="p-ripple p-d-flex"
        /></span>
    };
    userDataValidated(snapshot){
        console.log(snapshot);
        this.setState({
            snapshot: snapshot,
            validated: true,
            metaUpdateRequested: true
        });
    };
    render(){
        return(
            <div id={"login"} className={css(styles.load)}>
                <div id={"messages"}>
                    <Toast ref={(el) => this.toast = el}/>
                </div>
                {(this.state.validated)?null:<ValidateUser onLoad={this.userDataValidated}/>}
                {(this.state.metaUpdateRequested)?<GetFileMetadata username={this.state.snapshot.username} onLoad={()=>this.setState({metaUpdateRequested: false})}
                    returnLog = {(arr)=>this.toast.show(arr)}
                />:null}

                <div id={"login-flex"} className={"p-grid"}>
                    <div id={"login-left"} className={"p-col-12 p-sm-0 p-md-4 p-lg-4"}>
                        <div id={"login-left-inner"} className={"p-shadow-5"}>
                            <div id={"login-left-navbar"} >
                                <Gift id={"button-gift"} size={25} strokeWidth={1.2} className={this.state.giftHover}
                                      onMouseEnter={()=>this.setState({giftHover: 'featherIcon-hover'})}
                                      onMouseLeave={()=>this.setState({giftHover: ''})}
                                      onClick={(e)=>this.opPremium.toggle(e)}
                                />
                                <Bell id={"button-bell"} size={25} strokeWidth={1.2} className={this.state.bellHover}
                                      onMouseEnter={()=>this.setState({bellHover: 'featherIcon-hover'})}
                                      onMouseLeave={()=>this.setState({bellHover: ''})}
                                      onClick={(e)=>this.opNotification.toggle(e)}
                                />
                                <SignOutButton/>
                            </div>
                            <div id={"teampl-logo-div"} style={{marginBottom: "20px"}} >
                                <div id={'teampl-logo'} className={'teampl-logo-div'} style={{marginTop: '5vh'}}>
                                    <img src={teamplLogo} className={'teampl-logo-img'}/>
                                </div>
                                <div id={'teampl-logo-text'}>
                                    <h2>Welcome, {this.state.snapshot.username}!</h2>
                                </div>
                            </div>
                            <div id={"teampl-home-menu-div"} style={{width: "200px", margin: "auto"}}>
                                <Menu model={homeMenuItems}/>
                            </div>
                        </div>
                    </div>
                    <div id={"login-right"} className={"p-col-12 p-sm-12 p-md-8 p-lg-8"}>
                        <div id={"login-right-inner"} className={"p-shadow-5"}>
                            <div id={"login-right-navbar"} >
                                    <RefreshCw
                                        id={"button-refresh"} size={20} strokeWidth={2.5} className={this.state.refreshHover}
                                        onMouseEnter={()=>this.setState({refreshHover: 'pi-spin'})}
                                        onMouseLeave={()=>this.setState({refreshHover: ''})}
                                        onClick={()=>this.setState({metaUpdateRequested: true})}
                                    />
                                <h2 style={{display: 'inline-block',
                                    margin: '-5px 14px 8px 16px',
                                    fontSize: '20px',
                                    transform: 'translate(-4px, -3px)'
                                }}>Shared Files</h2>
                                <HelpCircle
                                    id={"button-info"} size={20} strokeWidth={2.5} className={this.state.infoHover}
                                    style={{float: 'right'}}
                                    onMouseEnter={()=>this.setState({infoHover: 'featherIcon-hover'})}
                                    onMouseLeave={()=>this.setState({infoHover: ''})}
                                    onClick={(e)=>this.setState({displayInfo: true})}
                                />
                                <Settings
                                    id={"button-info"} size={20} strokeWidth={2.5} className={this.state.settingHover}
                                    style={{float: 'right', marginRight: '10px'}}
                                    onMouseEnter={()=>this.setState({settingHover: 'featherIcon-hover'})}
                                    onMouseLeave={()=>this.setState({settingHover: ''})}
                                    onClick={(e)=>this.setState({displaySettings: true})}
                                />
                                <span className={'p-float-label'}  style={{width: "150px", float: "right", transform: "translate(-14px, -6px)"}}>
                                    <Search  id={"user-icon"} size={15} strokeWidth={1.2}/>
                                     <InputText value={this.state.filter} onChange={(e)=>this.setState({filter: e.target.value})}
                                                placeholder={"Search..."}
                                     />
                                </span>
                            </div>
                            <div id={"homeApplet"}></div>
                            {this.state.snapshot.username === null ? 'De' :
                                <div id={"fileView"} className={"p-grid"} style={{overflow: "scroll",
                                height: "65vh"}}>
                                <ItemPutter itemCnt={30} showMetadata={this.showFileMetadata} modalOpen={this.showUploadModal} fileViewerOpen={this.showFileViewer} showFileDeleter={this.showFileDeleter} showFileSharer={this.showFileSharer} showFileRename={this.showFileRename}
                                    filter={this.state.filter} showMetaEditor={this.showMetaEditor}
                                />
                            </div>

                            }

                        </div>
                    </div>
                </div>
                <OverlayPanel ref={(el)=>this.opPremium = el} showCloseIcon={true} style={{top: "19vh"}} id={'opPremium'}>
                    <Card footer={this.teamplPremium.footer} header={this.teamplPremium.header} title={"Team+ Premium"} subTitle={"Team+ ???????????? ???????????? ????????? ?????????"}>
                    </Card>
                </OverlayPanel>
                <OverlayPanel ref={(el)=>this.opNotification = el} showCloseIcon={true} style={{top: "19vh"}} id={'opNotification'}>
                    <Card footer={this.teamplLogin.footer} header={this.teamplLogin.header} title={"Login Required"} subTitle={"???????????? ????????? ??????????????????."}>
                    </Card>
                </OverlayPanel>
                <Dialog header="Settings" visible={this.state.displaySettings} style={{ width: '90vw' }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> this.setState({displaySettings: false})} />
                </div>} onHide={() => this.setState({displaySettings: false})}>
                    <div style={{height: "45vh", width: "60vw"}}>
                        <b>Pop-up width: </b>
                        <InputNumber value={this.state.displayWidth} onValueChange={(e)=>this.setState({displayWidth: e.value})}
                                     min={200} max={1400} showButtons buttonLayout={"stacked"} suffix={"px"}/>
                        <br/>
                        <b>Pop-up color: </b>
                        <ColorPicker value={this.state.modalBackgroundColor} onChange={(e)=>this.setState({modalBackgroundColor: e.value})}/>
                    </div>
                </Dialog>
                <Dialog header="?????? ???????????? ?????? ???????????????" visible={this.state.displayBasic} style={{ width: '50vw' }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> this.hideModal()} />
                </div>} onHide={() => this.hideModal()}>
                    <p>Thank you for taking interest in Team+. We're sorry to inform you that out project is currently in development and this functionality  is not ready yet.
                        In the final version, you will be able to support the devs by purchasing a  subscription to Team+. When the option to subscribe  is available,  please donate then.
                        With Love,
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog visible={this.state.displayMetaEditor} header="Team+ Metadata Editor"  style={{ width: this.state.displayWidth+'px' , backgroundColor: this.state.backgroundColor }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> {this.setState({displayMetaEditor: false, metaUpdateRequested: true})}} />
                </div>} onHide={() => {this.setState({displayMetaEditor: false, metaUpdateRequested: true})}}>
                    <UpdateMeta username={this.state.snapshot.username} closeDialog={()=>{this.setState({displayMetaEditor: false , metaUpdateRequested: true})}}
                                filename={this.state.selectedFileFullName} filepath={this.state.selectedFile} metadata={this.state.selectedMeta}
                    />
                </Dialog>
                <Dialog visible={this.state.displayFileRename} header="Team+ File Rename"  style={{ width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor}} footer={<Button label="??????" icon="pi pi-check" onClick={()=>this.setState({displayFileRename: false})} />}
                        onHide={() => {this.setState({displayFileRename: false, metaUpdateRequested: true})}}>
                    <FileNameUpdater fileName={this.state.selectedFileFullName} filePath={this.state.selectedFile} username={this.state.snapshot.username}
                                     onUpdate={()=>{this.setState({displayFileRename: false, metaUpdateRequested: true})}}
                    />
                </Dialog>
                <Dialog visible={this.state.displayInfo} header="About Team+"  style={{ width: '50vw' }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> this.hideInfo()} />
                </div>} onHide={() => this.hideInfo()}>
                    <p>Team+??? ???????????? ??? ?????? ??????????????????, ????????? ??????, ??????, ??????, ?????? ???????????? ???????????? ???????????????.
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog visible={this.state.displayFileSharer} header="Team+ File Share"  style={{ width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> {this.setState({displayFileSharer: false})}} />
                </div>} onHide={() => {this.setState({displayFileSharer: false})}}>

                    <FileSharer username={this.state.snapshot.username} fileName={this.state.selectedFileFullName} filePath={this.state.selectedFile}/>

                </Dialog>
                <Dialog visible={this.state.displayFileMetadata} header="Team+ File Info"  style={{ width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor }} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> {this.setState({displayFileMetadata: false})}} />
                </div>} onHide={() => {this.setState({displayFileMetadata: false})}}>

                    <SharedFileMetadata username={this.state.snapshot.username} fileName={this.state.selectedFileFullName}
                                        filePath={this.state.selectedFile}/>

                </Dialog>
                <Dialog visible={this.state.displayUpload} header="Team+ File Upload"  style={{  width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor}} footer={<div>
                    <Button label="??????" icon="pi pi-check" onClick={()=> this.hideUploadModal()} />
                </div>} onHide={() => this.hideUploadModal()}>
                    <FileUpload name={"fileUpload[]"}
                                url={"https://api.gbshs.kr/tmpl/uploads.php?user="+this.state.snapshot.username} multiple/>
                </Dialog>
                <Dialog visible={this.state.displayFileDeleter} header="Team+ File Delete"  style={{  width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor }} footer={<div>
                </div>} onHide={() => {this.setState({displayFileDeleter: false, metaUpdateRequested: true})}}>
                    <FileDeleter filename={this.state.selectedFileFullName} filepath={this.state.selectedFile} user={this.state.snapshot.username}
                        onDelete={()=>{this.setState({displayFileDeleter: false, metaUpdateRequested: true})}} shared={true}
                    />
                </Dialog>
                <Dialog visible={this.state.displayFileViewer} header="Team+ File Viewer"  style={{ width: this.state.displayWidth+'px', backgroundColor: this.state.backgroundColor }}
                        footer={<div>
                    <Button className={"p-button-secondary"} label="????????????" icon="pi pi-cloud-download" onClick={()=> {
                        let a = document.createElement('a');
                        document.body.appendChild(a);
                        a.style="display:none";
                        a.href = this.state.viewFilePath;
                        a.download = this.state.selectedFileFullName;
                        a.click();
                    }} />
                    <Button label="?????? (????????????)" icon="pi pi-check" onClick={()=> this.hideFileViewer()} />
                </div>}
                        onHide={() => {
                    this.setState({displayFileViewer: false, openFileViewer: false, metaUpdateRequested: true});
                    if(this.state.tempFileUpdateNeeded){
                        this.setState({tempFileUpdateNeeded : false});
                        let user = this.state.snapshot.username; let fileName = this.state.selectedFile;
                        let fileCustomName = this.state.selectedFileFullName; let mime = 'text/tef';
                        let data ='';
                        if(this.state.formattedTextCheck) data = this.state.tempFileSaveData.htmlValue;
                        else data = this.state.tempFileSaveData.textValue;
                        console.log('Saving data: '+data);
                        let file = new Blob([data], {type: mime});
                        let formData = new FormData();
                        formData.append('fileUpload', file, fileCustomName);
                        axios.post(
                            `https://api.gbshs.kr/tmpl/updateFile.php?user=${user}&fileName=${fileName}`,
                            formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        ).then(()=>{
                            console.log('Sent update request to server');
                        }).catch(()=>{
                            console.log('File update failed');
                        })
                    }
                }}><div>
                    {this.state.openFileViewer?
                        <ToggleButton onLabel="Save as Team+ Formatted Text" offLabel="Save as Plain Text (As original file format)" onIcon="pi pi-check" offIcon="pi pi-times"
                                      checked={this.state.formattedTextCheck} onChange={(e) => this.setState({formattedTextCheck: e.value})} />
                    :null}         <p style={{display: "inline", verticalAlign: "super"}}>{this.state.selectedFileFullName}</p></div>
                    {(this.state.dlFileForView ? <GetFileToView
                        shared={true}
                        onLoad={()=>this.setState({dlFileForView: false})}
                        filePath={(path)=>this.setState({viewFilePath: path})} username={this.state.snapshot.username} fileName={this.state.selectedFile}
                        dataPath={(blob)=>this.setState({viewFileBlob: blob, openFileViewer: true})} username={this.state.snapshot.username} fileName={this.state.selectedFile}/>: null)}
                    {(this.state.openFileViewer ? <FileViewer type={this.state.selectedFileFullName.substr(this.state.selectedFileFullName.lastIndexOf('.') + 1)} data={this.state.viewFilePath}
                                                              blob={this.state.viewFileBlob} saveData={(data)=>{this.setState({tempFileSaveData: data, tempFileUpdateNeeded: true});}}/>:'Loading...')}

                </Dialog>
        </div>
        );
    }
    showMetaEditor(file, fullPath, meta){
        this.setState({
            displayMetaEditor: true,
            selectedFile: file,
            selectedFileFullName: fullPath,
            selectedMeta: meta
        })
    }
    showFileRename(file, fullPath){
        this.setState({
            displayFileRename: true,
            selectedFile: file,
            selectedFileFullName: fullPath
        });
    }
    showFileMetadata(file, fullPath){
        this.setState({
            displayFileMetadata: true,
            selectedFile: file,
            selectedFileFullName: fullPath
        })
    }
    showFileSharer(file, fullPath){
        this.setState({
            displayFileSharer: true,
            selectedFile: file,
            selectedFileFullName: fullPath
        });
    }
    showFileViewer(file, fullPath){
        this.setState({
            displayFileViewer: true,
            selectedFile: file,
            dlFileForView: true,
            selectedFileFullName: fullPath
        })
    }
    hideFileViewer(file){
        this.setState({
            displayFileViewer: false
        })
    }
    showFileDeleter(file, fullPath){
        this.setState({
           displayFileDeleter: true,
           selectedFile: file,
           selectedFileFullName: fullPath
        });
    }
    showUploadModal(){
        this.setState({
          displayUpload: true
        })
    }
    hideUploadModal(){
        this.setState({
            displayUpload: false,
            metaUpdateRequested: true
        })
    }
    hideModal(){
        this.setState({
            displayBasic: false
        })
    }
    hideInfo(){
        this.setState({
            displayInfo: false
        })
    }

    clickLogin(){
        console.log('button prewss');
        if(this.state.loginButton === 'Register'){
            this.setState({displaySignUp: true});
        }else if(this.state.loginButton === 'Login'){
            this.setState({displaySignIn: true});
        }
    }

    getInputValue(ev){
        if(ev.target.value === '') this.setState({loginButton: 'Register'});
        else this.setState({loginButton: 'Login'});
        this.setState({loginValue: ev.target.value});
    }
    getInputUpdate(ev){
        console.log(ev.key);
        if(ev.key === 'Enter') this.clickLogin();
        if(ev.key === 'Backspace' && ev.target.value === '' && !this.state.hasAnimated) {
            this.setState({loginBounce: true, hasAnimated: true});
        }
        else this.setState({loginBounce: false, hasAnimated: false});
    }
}

