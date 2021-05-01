import React from 'react';
import axios from 'axios';
import {Editor} from 'primereact/editor';
import PDFviewer from 'pdf-viewer-reactjs';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { AccessAlarm, ThreeDRotation } from 'material-design-icons';

import '../css/pdfViewer.css';
import {firebaseAuth} from "../providers/UserProvider";
import PropTypes from "prop-types";

/**
 * @return {string}
 */
export class SharedFileMetadata extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : null,
            username: props.username,
            filename: props.fileName,
            filepath: props.filePath,
            fileOwner: 'loading...',
            permissions: 'loading...',
            sharedDate: 'loading...',
            fileSize: 0,
            sharedTo: 'loading...'
        }
    }
    componentDidMount(){
        axios({
            url:  'https://api.gbshs.kr/tmpl/getSharedFileMeta.php?user='+this.state.username+'&fileName='+this.state.filepath,
            method: 'GET'
        }).then(response=>{
            console.log(response.data);
            this.setState({
                fileOwner: response.data.fileOwner,
                permissions: response.data.permissions,
                sharedDate: response.data.sharedDate,
                fileSize: response.data.fileSize,
                sharedTo: response.data.sharedTo
            })
        })
    }
    render(){
        return(<div>
            <div><b>Filename: </b> {this.state.filename}</div>
            <div><b>FilesymbolicLink(.tfc): </b> {this.state.filepath}</div>
            <div><b>File Owner: </b> {this.state.fileOwner}</div>
            <div><b>File Permissions: </b> {this.state.permissions}</div>
            <div><b>File Shared Date: </b> {this.state.sharedDate}</div>
            <div><b>File Size (on disk): </b> {this.state.filesize}B</div>
            <div><b>File Shared to : </b> {this.state.sharedTo}</div>
        </div>)
    }

}

