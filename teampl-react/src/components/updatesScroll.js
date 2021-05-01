import React from 'react';
import axios from 'axios';

import {Fieldset} from "primereact/fieldset";
import {DataScroller} from "primereact/datascroller";
import {Button} from "primereact/button";

import '../css/updatesScroll.css';
import 'primeflex/primeflex.css';
import {AlertCircle} from 'react-feather';

export class UpdatesScroll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            panelCollapsed: true,
            title: props.title,
            dataUrl: props.url,
            topMargin: props.topMargin
        };
        this.itemTemplate.bind(this);
    }

    componentDidMount() {
        this.getUpdates();

    }

    getUpdates(){
        console.log('getting Updates...');
        axios.get(this.state.dataUrl).then(res => this.setState({products: res.data.data}), err=>console.log(err));
    }

    itemTemplate(data){
        if(data.type === "alert"){
            return(
                <div >
                    <Fieldset  legend={data.title} toggleable collapsed={true}>
                        <p>
                            {data.content}
                        </p>
                    </Fieldset>
                </div>
            );
        }

    }

    render(){
        const footer = <Button ref={(el) => this.loadButton = el} type="text" icon="pi pi-plus" label="Load" />;
        if(this.state.products.length === 0)
            return (<div>Loading...</div>);
        else if(this.state.products[this.state.products.length - 1].type !=='end')
            return (<div>Almost There...</div>)
        else
            return (
            <div className="datascroller-demo" style={{marginTop: this.state.topMargin}}>
                <div className="card p-shadow-3" >
                    <DataScroller value={this.state.products} itemTemplate={this.itemTemplate} rows={5} inline
                                  header={this.state.title} scrollHeight={"25vh"}/>
                </div>
            </div>
        );
    }
}