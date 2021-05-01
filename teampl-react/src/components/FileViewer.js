import React, {useContext, useState} from 'react';
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
const FileViewer = (props) => {
    const {csvRows, setCsvRows} = useContext(firebaseAuth);
    const {csvCols, setCsvCols} = useContext(firebaseAuth);
    const {getCsv, setGetCsv}   = useContext(firebaseAuth);
    switch(props.type){
        case 'png': case 'jpg': case 'jpeg': case 'bmp': case 'webp': case 'gif':
            return(<img src={props.data} width={"800px"}/>);
        case 'log': case 'txt': case 'rtf':  case 'js': case 'html': case 'tfc': case 'css': case 'hwp': case 'cpp' : case 'tdocx':
            //setFileEditTemp({data: props.blob, needToSave: true});
            return(
                <div>
                    <Editor style={{height:'400px'}} value={props.blob} onTextChange={(e) => {props.saveData(e)}}/>
                </div>
            );
        case 'pdf':
            return(
                <div>
                    <PDFviewer
                        document={{
                            url: props.data
                        }}
                        css="pdf-div"
                        canvasCss="pdf-page"
                        navigation={{css:{
                            navbarWrapper: 'pdf-navBarWrapper',
                                zoomOutBtn: "pdf-button",
                                resetZoomBtn: "pdf-button",
                                zoomInBtn: "pdf-button",
                                previousPageBtn: "pdf-button",
                                nextPageBtn: "pdf-button",
                                rotateLeftBtn: "pdf-button", // CSS Class for the RotateLeft button
                                resetRotationBtn:  "pdf-button", // CSS Class for the Reset Rotation button
                                rotateRightBtn: "pdf-button",
                                pageIndicator:  "pdf-ind" // CSS Class for the Page Indicator
                        }}}
                    >
                    </PDFviewer>
                </div>
            );
        case 'xlsx': case 'csv': case 'tcsv':
            if(getCsv){
                setGetCsv(false);
                let fileFormat = new File( [ props.blob], "test.csv", {type: "text/csv"});
                console.log(fileFormat);
                console.log(props.blob);
                ExcelRenderer(fileFormat, (err, response)=>{
                    if(err){
                        console.log(err);
                        return(<div>An error occured while opening sheet: {err}</div>)
                    }
                    else{
                        console.log(response);
                        if(getCsv)setCsvCols(response.cols);
                        if(csvRows!==response.rows)setCsvRows(response.rows);
                    }
                });
            }
            return(<div><OutTable data={csvRows} columns={csvCols} tableClassName="ExcelViewer" tableHeaderRowClass="ExcelHeading"/></div>);
        default:  return (<div><b>Unsupported File Type of .{props.type}</b><br/>But you can download. <br/><br/> {props.data}</div>);

    }
};

export default FileViewer;
