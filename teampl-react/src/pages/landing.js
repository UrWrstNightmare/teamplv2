import React from "react";
import {Preload} from "./preload";
import {Redirect} from 'react-router-dom';

export class Landing extends React.Component {
    constructor(props) {
        super(props);
        let no = 0;
        this.state ={
            "loadingComplete" : 'false'
        };
        this.loader = React.createRef();
    }
    prepareLoaderTransition(){
        this.setState({
           animation: 'fadeOut'
        });
    }
    componentDidMount() {
        setTimeout(() => {
            let preloadProgress = 0;
            let preloadTask = '';
            let demo = setInterval(() => {
                preloadProgress += Math.floor(Math.random()*10);
                if (preloadProgress >= 100) preloadProgress = 100;
                preloadTask = `Downloading Asset \n(${preloadProgress}/100)`;
                this.loader.current.updateText(preloadTask);
                this.loader.current.updateProgress(preloadProgress);
                if (preloadProgress >= 100) {
                    clearTimeout(demo);
                    this.loader.current.prepUnload();
                    setTimeout(()=>{
                        this.setState({
                            loadingComplete: 'true'
                        });
                    }, 1000);
                }
            }, 500)
        }, 1500);
    }
    render() {
        if (this.state.loadingComplete === 'false') {
            return (
                <div id={"main"}>
                    <Preload animate={"animated-full"}
                             backgroundTransparent={true} backgroundType={"default-gradient"}
                             loaderShadow={true} loaderType={"progress-bar"}
                             ref={this.loader}
                    />
                </div>
            );
        }
        else {
            return (<Redirect to='/login.js'/>);
        }
    }
}
