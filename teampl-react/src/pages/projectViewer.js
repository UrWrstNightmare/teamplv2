import React, {useContext} from 'react';

import {Toast} from "primereact/toast";

import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
import success from '../img/graphics/success.webp';

import '../css/login.css';
import '../css/projectViewer.css';
import {StyleSheet, css} from "aphrodite";
import {fadeIn, fadeOut, headShake} from "react-animations";
import firebase from "firebase";
import {Menubar} from "primereact/menubar";

import logo from '../img/icons/White_Full-Thin_Text_Without_Shadows.png';
import {authMethods} from "../firebase/authMethods";
import {LogOut} from "react-feather";
import {SlideMenu} from "primereact/slidemenu";

import Iframe from "react-iframe";

let user = null;
let userName = null;


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

const items = [
    {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
            {
                label: 'New',
                icon: 'pi pi-fw pi-plus',
                items: [
                    {
                        label: 'Content',
                        icon: 'pi pi-fw pi-bookmark'
                    },
                    {
                        label: 'Data',
                        icon: 'pi pi-fw pi-video'
                    }

                ]
            }
        ]
    },
    {
        label: 'Team',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Manage',
                icon: 'pi pi-fw pi-user-edit',
            },
            {
                label: 'Remove User',
                icon: 'pi pi-fw pi-user-minus',
            },
            {
                label: 'Add User',
                icon: 'pi pi-fw pi-user-plus',
            },
            {
                label: 'Collaboration',
                icon: 'pi pi-fw pi-users'
            }
        ]
    },
    {
        label: 'Tasks',
        icon: 'pi pi-fw pi-paperclip',
        items: [
            {
                label: 'Add Task',
                icon: 'pi pi-fw pi-plus-circle',
            },
            {
                label: 'My Schedule',
                icon: 'pi pi-fw pi-calendar',
            },
            {
                label: 'Manage Tasks',
                icon: 'pi pi-fw pi-compass',
            }
        ]
    },
    {
        label: 'Report',
        icon: 'pi pi-fw pi-file-pdf',
        items: [
            {
                label: 'Research Ideas',
                icon: 'pi pi-fw pi-question-circle',
            },
            {
                label: 'Search Papers',
                icon: 'pi pi-fw pi-search',
            },
            {
                label: 'Citation Tool',
                icon: 'pi pi-fw pi-search-plus'
            },
            {
                label: 'Compile Data',
                icon: 'pi pi-fw pi-chart-bar',
            },
            {
                label: 'AI Thesis Generator',
                icon: 'pi pi-fw pi-android'
            }
        ]
    },
    {
        label: 'Drive',
        icon: 'pi pi-fw pi-folder',
    },
    {
        label: 'Calendar',
        icon: 'pi pi-fw pi-calendar',
    },
];

const leftItems =[
    {
        label:  <div><h3 style={{margin: "0"}}>Project NodongSW</h3><p style={{margin: '0'}}>Team+ Project Management</p></div>
    },
    {
        label:'File',
        icon:'pi pi-fw pi-file',
        items:[
            {
                label:'New',
                icon:'pi pi-fw pi-plus',
                items:[
                    {
                        label:'Bookmark',
                        icon:'pi pi-fw pi-bookmark'
                    },
                    {
                        label:'Video',
                        icon:'pi pi-fw pi-video'
                    },

                ]
            },
            {
                label:'Delete',
                icon:'pi pi-fw pi-trash'
            },
            {
                separator:true
            },
            {
                label:'Export',
                icon:'pi pi-fw pi-external-link'
            }
        ]
    },
    {
        label:'Edit',
        icon:'pi pi-fw pi-pencil',
        items:[
            {
                label:'Left',
                icon:'pi pi-fw pi-align-left'
            },
            {
                label:'Right',
                icon:'pi pi-fw pi-align-right'
            },
            {
                label:'Center',
                icon:'pi pi-fw pi-align-center'
            },
            {
                label:'Justify',
                icon:'pi pi-fw pi-align-justify'
            },

        ]
    },
    {
        label:'Users',
        icon:'pi pi-fw pi-user',
        items:[
            {
                label:'New',
                icon:'pi pi-fw pi-user-plus',

            },
            {
                label:'Delete',
                icon:'pi pi-fw pi-user-minus',

            },
            {
                label:'Search',
                icon:'pi pi-fw pi-users',
                items:[
                    {
                        label:'Filter',
                        icon:'pi pi-fw pi-filter',
                        items:[
                            {
                                label:'Print',
                                icon:'pi pi-fw pi-print'
                            }
                        ]
                    },
                    {
                        icon:'pi pi-fw pi-bars',
                        label:'List'
                    }
                ]
            }
        ]
    },
    {
        label:'Events',
        icon:'pi pi-fw pi-calendar',
        items:[
            {
                label:'Edit',
                icon:'pi pi-fw pi-pencil',
                items:[
                    {
                        label:'Save',
                        icon:'pi pi-fw pi-calendar-plus'
                    },
                    {
                        label:'Delete',
                        icon:'pi pi-fw pi-calendar-minus'
                    },

                ]
            },
            {
                label:'Archieve',
                icon:'pi pi-fw pi-calendar-times',
                items:[
                    {
                        label:'Remove',
                        icon:'pi pi-fw pi-calendar-minus'
                    }
                ]
            }
        ]
    },
    {
        separator:true
    },
    {
        label:'Quit',
        icon:'pi pi-fw pi-power-off'
    }
];


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

export class ProjectViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log('login');
        this.state = {
            validated: false,
        };
        this.userDataValidated = this.userDataValidated.bind(this);
    }


    componentDidMount() {
        this.toast.show([
            {severity: "success", summary: 'Login Success', detail: 'Welcome to TeamPl!', life: 5000}
        ]);
        return null;
    }

    render(){
        return(
            <div id={"login"} className={css(styles.load)}>
                <div id={"messages"}>
                    <Toast ref={(el) => this.toast = el}/>
                </div>
                {(this.state.validated)?null:<ValidateUser onLoad={this.userDataValidated}/>}
                <Menubar style={{borderRadius: "0"}} model={items} start={<img style={{width: "80px",
                    transform: "translate(12px, -2.7px)",
                    margin: "0px 31px 0px 0px"}} src={logo}/>}
                         end = {<LogOut style={{float: 'right', marginRight: '10px'}}
                                         id={"button-logout"} size={20} strokeWidth={1.2} onClick={()=>alert('logout')}/>}
                />
                <div className={"div-main"}>
                    <div className={"p-grid"}>
                        <div className={"p-col-3"}>
                            <div>
                                <SlideMenu model={leftItems} className={"slideMenu"} />
                            </div>
                        </div>
                        <div className={"p-col-9"}>
                            <div className={"right-content"}>
                                <Iframe url={"https://api.gbshs.kr/tmpl/getTaskArrange/index.php"}
                                    width="100%"
                                        height={"100%"}
                                        style={{borderRadius: "25px"}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    userDataValidated(snapshot){
        console.log(snapshot);
        this.setState({
            snapshot: snapshot,
            validated: true,
            metaUpdateRequested: true
        });
    };
}

