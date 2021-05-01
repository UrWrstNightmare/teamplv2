/*import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import {AutoComplete} from "primereact/autocomplete";
import React, {Component} from 'react';
import {AutoCompleteDemoService} from '../../services/AutoCompleteDemoService';

export class AutoCompleteDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            demoData : [],
            selectedData1: null,
            selectedData2: null,
            selectedDatas: null,
            filteredDatas: null,
        };
        this.searchData = this.searchData.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.dataService = new AutoCompleteDemoService();
    }

    componentDidMount() {
        this.dataService.getNames().then(data => this.setState({demoData: data}));
    }

    searchCountry(event){
        setTimeout(()=>{
            let filteredDatas;
            if(!event.query.trim().length){
                filteredDatas = [...this.state.demoData];
            }
            else{
                filteredDatas = this.state.demoData.filter(())
            }

        })
    }
}*/