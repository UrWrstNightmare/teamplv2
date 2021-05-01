import React, {useContext} from "react";
import {firebaseAuth} from "../providers/UserProvider";
import {authMethods} from "../firebase/authMethods";
import workplace from "../img/graphics/workplace.jpg";
import {HelpCircle, Key, Mail, User} from "react-feather";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

const SignUp = (props) => {
    let formRef = React.createRef();
    let errorMsg = React.createRef();
    const {handleSignUp, inputs, setInputs, setErrors, setToken, token, errors} = useContext(firebaseAuth);
    const handleSubmit = (e) => {
        e.preventDefault();
        authMethods.signup(inputs.username, inputs.email, inputs.password, inputs.name, setErrors, setToken);
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        setInputs(prev => ({...prev, [name]: value}));
    };
    return(
        <div>
            <img src={workplace} style={{width: "33vh", height: "25vh", overflow: "hidden", objectFit: "cover", imageRendering: "pixelated", display: "block", margin:"auto"}}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className={"p-grid"} style={{marginTop: "10px", marginBottom: "0px"}}>
                    <div className={"p-col-4"}>
                        <p style={{marginTop: "7px", textAlign: "left"}}><b>Step 1</b>
                            &nbsp;&nbsp;&nbsp; ·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp; </p>
                    </div>
                    <div className={"p-col-8"}>
                       <span className={'p-float-label'} style={{width: "100%"}}>
                           <User id={"user-icon"} size={15} strokeWidth={1.2}></User>
                            <InputText onChange={handleChange} name={"username"} value={inputs.username} placeholder="Username" id={"registerUsername"}/>
                       </span>
                    </div>
                </div>
                <div className={"p-grid"} style={{marginTop: "-20px", marginBottom: "0px"}}>
                    <div className={"p-col-4"}>
                        <p style={{marginTop: "7px", textAlign: "left"}}><b>Step 2</b>
                            &nbsp;&nbsp;&nbsp; ·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp; </p>
                    </div>
                    <div className={"p-col-8"}>
                       <span className={'p-float-label'} style={{width: "100%"}}>
                           <Key id={"user-icon"} size={15} strokeWidth={1.2}></Key>
                            <InputText onChange={handleChange} name={"password"} value={inputs.password} placeholder="Password" id={"registerPassword"} type={"password"}/>
                       </span>
                    </div>
                </div>
                <div className={"p-grid"} style={{marginTop: "-20px", marginBottom: "0px"}}>
                    <div className={"p-col-4"}>
                        <p style={{marginTop: "7px", textAlign: "left"}}><b>Step 3</b>
                            &nbsp;&nbsp;&nbsp; ·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp; </p>
                    </div>
                    <div className={"p-col-8"}>
                       <span className={'p-float-label'} style={{width: "100%"}}>
                           <Mail id={"user-icon"} size={15} strokeWidth={1.2}></Mail>
                            <InputText onChange={handleChange} name={"email"} value={inputs.email} placeholder="Email" id={"registerEmail"} type={"email"}/>
                       </span>
                    </div>
                </div>
                <div className={"p-grid"} style={{marginTop: "-20px", marginBottom: "0px"}}>
                    <div className={"p-col-4"}>
                        <p style={{marginTop: "7px", textAlign: "left"}}><i>Optional</i>
                            &nbsp;&nbsp; ·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp; </p>
                    </div>
                    <div className={"p-col-8"}>
                       <span className={'p-float-label'} style={{width: "100%"}}>
                           <HelpCircle id={"user-icon"} size={15} strokeWidth={1.2}></HelpCircle>
                            <InputText onChange={handleChange} name={"name"} value={inputs.name} placeholder="Name" id={"registerName"} type={""}/>
                       </span>
                    </div>
                </div>
                <div id={"errors"} style={{marginBottom: "20px"}}>
                    {!token ?
                        (errors.length > 0 ? errors.map(error =>  <p style={{color: "red", margin: "0 auto"}}>{error}</p>) : null)
                        : <p style={{color: "green", margin: "0 auto"}}>Team+ Registration Successful. Please Login!</p>
                    }

                </div>

                <div className={"p-grid"}>
                    <div className={"p-col-5"} style={{alignSelf: "center"}}>
                        <Button onClick={(e)=>{e.preventDefault()}}
                                icon={"pi pi-google"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon "} style={{margin: "0 !important"}} />
                        <Button onClick={(e)=>{e.preventDefault()}}
                                icon={"pi pi-spin pi-spinner"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon "}/>
                        <Button onClick={(e)=>{e.preventDefault()}}
                                icon={"pi pi-facebook"} className={"p-button-rounded p-button-outlined p-button-secondary social-icon "}/>
                    </div>
                    <div className={"p-col-2"}></div>
                    <div style={{float: "right"}} className={"p-col-5"}>
                        {!token ?
                            <Button style={{float: "right"}} label="가입신청" icon="pi pi-check" type={"submit"}/> :
                            <Button style={{float: "right"}} label="돌아가기" icon="pi pi-check" onClick={(e)=>{e.preventDefault(); props.handler();}}/>}

                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUp;