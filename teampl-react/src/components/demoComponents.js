import React from "react";

export class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date(), counter: props.startCounter};
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick(){
        this.setState((state, props) => ({
            counter: state.counter+1,
            date: new Date()
        }));
    }
    render(){
        return(
            <div>
                <code>
                    <p style={{marginTop: "10px", marginBottom: "10px"}}>
                        Current Time: {this.state.date.toLocaleTimeString()},
                        Update #{this.state.counter}</p>

                </code>
            </div>
        )
    }
}