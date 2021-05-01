import React, {useContext} from 'react';

import {Toast} from "primereact/toast";
import {OverlayPanel} from "primereact/overlaypanel";
import {Tooltip} from "primereact/tooltip";
import {Card} from 'primereact/card';
import {Button} from "primereact/button";
import { Dialog } from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {UpdatesScroll} from '../components/updatesScroll';
import {Messages} from "primereact/messages";

import {firebaseAuth} from "../providers/UserProvider";

import {Ripple} from "primereact/ripple";
import { ToggleButton } from 'primereact/togglebutton';
import PremiumGift from '../img/graphics/premiumGift.jpg';
import loginRequired from '../img/graphics/loginBanner.png';
import teamplLogo from '../img/icons/teampl-logo-black-small.png';

import 'primeflex/primeflex.css'
import workplace from '../img/graphics/workplace.jpg';
import success from '../img/graphics/success.webp';

import {Redirect} from 'react-router-dom';

import {Gift, Bell, User,Key, Mail, RefreshCw, HelpCircle} from "react-feather";
import SignUp from "../components/SignUpComponent";
import SignIn from "../components/SignInComponent";

import '../css/login.css';
import {StyleSheet, css} from "aphrodite";
import {fadeIn, fadeOut, headShake} from "react-animations";
import {Input} from "antd";
import {authMethods} from "../firebase/authMethods";
import {UserContext} from "../providers/UserProvider";

const AuthTest = (props) => {
    const {handleSignUp} = useContext(firebaseAuth);
    return(<div></div>);
};

const SignUpSuccess = (props) => {
    return(
        <div>
            <img src={success} style={{width: "121px", margin: "auto", display: "block"}}/>
            <p style={{width: "200px", margin: "auto", textAlign: "center"}}>Your Account is Ready!</p>
        </div>
    );
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

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.myInput = React.createRef();
        console.log('login');
        this.state = {
            'giftHover': '',
            'bellHover': '',
            'loginButton': 'Register',
            'displaySignUp': false,
            'SignUpSuccess': false,
            'displaySignIn': false,
            'SignInSuccess': false,
        };
        this.clickLogin = this.clickLogin.bind(this);
        this.handler = this.handler.bind(this);
        this.handlerSignIn = this.handlerSignIn.bind(this);
    }

    componentDidMount() {
        this.toast.show([
            {severity: "success", summary: 'Load Complete', detail: 'Welcome to TeamPl!', life: 5000},
            {severity: "info", summary: 'This App is in Beta', detail: '모바일에서는 정상적으로 작동하지 않을 수도 있습니다', life: 15000}
        ]);
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

    render(){
        return(<div id={"login"} className={css(styles.load)}>
                <AuthTest/>
                <div id={"messages"}>
                    <Toast ref={(el) => this.toast = el}/>
                </div>
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
                            </div>
                            <div id={"teampl-logo-div"} >
                                <div id={'teampl-logo'} className={'teampl-logo-div'} style={{marginTop: '5vh'}}>
                                    <img src={teamplLogo} className={'teampl-logo-img'}/>
                                </div>
                                <div id={'teampl-logo-text'}>
                                    <h2>Welcome to Team+</h2>
                                </div>
                            </div>
                            <div id={"teampl-login-bar"}>
                                <div id={"login-username"} className={css(
                                    this.state.loginBounce ? styles.bounce : '',
                                )}>
                                    <span className={'p-float-label'}>
                                        <User id={"user-icon"} size={15} strokeWidth={1.2}></User>
                                        <InputText
                                            placeholder={"Username"} id={'user-login-input'} value={this.state.loginValue}
                                            onChange={(e)=>{this.getInputValue(e)}} ref={(input)=>this.myInput = input}
                                                onKeyDown={(e)=>this.getInputUpdate(e)}
                                            />
                                    </span>
                                </div>
                                <div>
                                    <Button
                                        label={this.state.loginButton} onClick={this.clickLogin}
                                        className={"p-button-raised p-button-rounded"}
                                        id={"login-button"}
                                    />
                                </div>
                                <div id={"social-tab"} className={"p-d-flex p-jc-center"}>
                                    <Button icon={"pi pi-google"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon p-mr-2"} />
                                    <Button icon={"pi pi-spin pi-spinner"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon p-mr-2"}/>
                                    <Button icon={"pi pi-facebook"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon p-mr-2"}/>
                                </div>
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
                                    />
                                <h2 style={{display: 'inline-block',
                                    margin: '-5px 14px 8px 16px',
                                    fontSize: '20px',
                                    transform: 'translate(-4px, -3px)'
                                }}>What's New?</h2>
                                <HelpCircle
                                    id={"button-info"} size={20} strokeWidth={2.5} className={this.state.infoHover}
                                    style={{float: 'right'}}
                                    onMouseEnter={()=>this.setState({infoHover: 'featherIcon-hover'})}
                                    onMouseLeave={()=>this.setState({infoHover: ''})}
                                    onClick={(e)=>this.setState({displayInfo: true})}
                                />


                            </div>
                            <div className={"UpdateScroller"}>
                                <UpdatesScroll title={"•  Notifications (29)"} topMargin={"0.5vh"} url={"/data/notificationHome.json"}/>
                                <UpdatesScroll title={"•  Team+ Updates (V.0.12.1)"} topMargin={"2vh"} url={"/data/releaseUpdates.json"}/>
                            </div>
                        </div>
                    </div>
                </div>
                <OverlayPanel ref={(el)=>this.opPremium = el} showCloseIcon={true} style={{top: "19vh"}} id={'opPremium'}>
                    <Card footer={this.teamplPremium.footer} header={this.teamplPremium.header} title={"Team+ Premium"} subTitle={"Team+ 프리미엄 멤버십을 경험해 보세요"}>
                    </Card>
                </OverlayPanel>
                <OverlayPanel ref={(el)=>this.opNotification = el} showCloseIcon={true} style={{top: "19vh"}} id={'opNotification'}>
                    <Card footer={this.teamplLogin.footer} header={this.teamplLogin.header} title={"Login Required"} subTitle={"로그인이 필요한 서비스입니다."}>
                    </Card>
                </OverlayPanel>
                <Dialog header="아직 지원하지 않는 기능입니다" visible={this.state.displayBasic} style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideModal()} />
                </div>} onHide={() => this.hideModal()}>
                    <p>Thank you for taking interest in Team+. We're sorry to inform you that out project is currently in development and this functionality  is not ready yet.
                        In the final version, you will be able to support the devs by purchasing a  subscription to Team+. When the option to subscribe  is available,  please donate then.
                        With Love,
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog visible={this.state.displayInfo} header="About Team+"  style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideInfo()} />
                </div>} onHide={() => this.hideInfo()}>
                    <p>Team+은 혁신적인 팀 관리 소프트웨어로, 연구의 시작, 계획, 분담, 결론 작성까지 자동으로 관리합니다.
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog header="Team+ 가입하기" visible={this.state.displaySignUp} style={{ width: '500px', borderRadius: '30px'}} footer={<div></div>} onHide={() => this.hideSignUp()}>
                    {this.state.SignUpSuccess ? <SignUpSuccess/> : <SignUp handler={this.handler}/>}
                </Dialog>
                <Dialog header="Team+ 로그인" visible={this.state.displaySignIn} style={{ width: '500px', borderRadius: '30px'}} footer={<div></div>} onHide={() => this.hideSignIn()}>
                    {this.state.SignInSuccess ? <SignUpSuccess/> : <SignIn handler={this.handlerSignIn} uname={this.state.loginValue}/>}
                </Dialog>
        </div>
        );
    }
    hideSignIn(){
        this.setState({
            displaySignIn: false
        });
    }
    hideSignUp(){
        this.setState({
           displaySignUp: false
        });
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

