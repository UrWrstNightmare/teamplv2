import React, {Component} from "react";
import teamplAnimatedFullLogo from '../../src/img/icons/teampl-logo-outline-animated.svg';
import teamplFullLogo from '../../src/img/icons/Teampl-logo-colored-thin.svg';
import teamplSmallLogo from '../../src/img/icons/teampl-logo-small.svg'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import {fadeIn, fadeOut} from 'react-animations';
import {StyleSheet, css} from 'aphrodite';
import '../css/preload.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from "primereact/progressbar";

const preloadSpninnerStyle = {
    display: "block",
    position: 'relative',
    width: '25px', height: '25px',
    animationName: 'ui-progress-spinner-color',
    top: "50%",
    transform: "translateY(-200%)"
};

const styles = StyleSheet.create({
    load: {
        animationName: fadeIn,
        animationDuration: '1s'
    },
    unload: {
        animationName: fadeOut,
        animationDuration: '1s'
    }
});


export class Preload extends React.Component{
    constructor(props={}) {
        super(props);
        props = Object.assign(this, {
            animate: "animated-full",
            animateIn: "float-in",
            animateOut: "float-out",
            backgroundTransparent: false,
            loaderShadow: false,
            loaderType: "spinner",
            backgroundType: "default-gradient",
            progress: 0,
            text: ''
        }, props);
        this.state = {
            "animate": props.animate,
            "animateIn": props.animateIn,
            "animateOut": props.animateOut,
            "loaderShadow": props.loaderShadow,
            "loaderType": props.loaderType,
            "backgroundTransparent": props.backgroundTransparent,
            "backgroundType": props.backgroundType,
            "progressValue": props.progress,
            "text": props.text,
            "animation": props.animation
        };
        if (this.state.backgroundTransparent !== true) {
            if (this.state.backgroundType === "default-gradient") {
                this.backgroundStyle = {
                    background: "linear-gradient(142deg, rgba(247,32,95, 0.9) 0%, rgba(241,90,36,0.7) 84%)"
                }
            }
            if (this.state.backgroundType === "shadow") {
                this.backgroundStyle = {
                    backdropFilter: "brightness(0.7) blur(3px)"
                }
            }
        } else {
            this.backgroundStyle = {}
        }
        if (this.loaderShadow === true) {
            this.backgroundStyle["filter"] = "drop-shadow(2px 4px 5px rgba(0,0,0,0.2))";
        }
        if (this.state.loaderType === "spinner") {
            this.spinner =
                <ProgressSpinner style={preloadSpninnerStyle} className={"preload-progress-spinner"} strokeWidth="4"
                                 animationDuration="1s"/>
        } else if (this.state.loaderType === "infinite-bar") {
            this.spinner =
                <ProgressBar mode="indeterminate" className={"preload-progress-indeterminate-bar"} color={"#"}/>;
        } else if (this.state.loaderType === "progress-bar") {
            this.spinner =
                <ProgressBar mode="indeterminate" className={"preload-progress-indeterminate-bar"} color={"#"}/>;
        }
    }
    animateClass(state) {
        if(state === 'renderIn') return css(styles.load);
        if(state === 'renderOut') return css(styles.unload);
    }
    prepUnload(){
        this.setState({
            animation: 'renderOut'
        })
    }
    updateText(val){
        this.setState({
            text: val
        })
    }
    updateProgress(val){
        this.setState({
            progressValue: val
        })
    }
    componentDidMount() {
        console.log('Loader Mounted')
        this.setState({
           animation: 'renderIn'
        });
    }

    render(){
        if(this.state.loaderType === 'progress-bar'){
            if(this.state.progressValue === 0){
                return(
                    <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                        <object type="image/svg+xml" id={"preload-logo"} className={"center"} data = {teamplAnimatedFullLogo} />
                        {this.spinner}
                        <p id={"preload-text"}>
                            {this.state.text}
                        </p>
                    </div>
                );
            }else{
                return(
                    <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                        <object type="image/svg+xml" id={"preload-logo"} className={"center"} data = {teamplAnimatedFullLogo} />
                        <ProgressBar value={this.state.progressValue}/>
                        <p id={"preload-text"}>
                            {this.state.text}
                        </p>
                    </div>
                );
            }
        }
        if(this.state.animate === "animated-full") return(
            <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                <object type="image/svg+xml" id={"preload-logo"} className={"center"} data = {teamplAnimatedFullLogo} />
                {this.spinner}
                <p id={"preload-text"}>
                    {this.state.text}
                </p>
            </div>);
        else if(this.state.animate === "text-full") return(
            <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                <img type="image/svg+xml" id={"preload-logo"} className={"center"} src = {teamplFullLogo} alt={"teampl-logo"} />
                {this.spinner}
                <p id={"preload-text"}>
                    {this.state.text}
                </p>
            </div>
        );
        else if(this.state.animate === "logo-only") return(
            <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                <img type="image/svg+xml" id={"preload-logo"} className={"center"} src = {teamplSmallLogo} alt={"teampl-logo"} style={{width: "49px", marginBottom: "10px"}}/>
                {this.spinner}
                <p id={"preload-text"}>
                    {this.state.text}
                </p>
            </div>
        );
        else if(this.state.animate === "spinner-only") return(
            <div id={"preload-div"} style={this.backgroundStyle} className={this.animateClass(this.state.animation)}>
                {this.spinner}
                <p id={"preload-text"}>
                    {this.state.text}
                </p>
            </div>
        );
    }


}