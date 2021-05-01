import React, {useContext, useState} from 'react';
import {Editor} from 'primereact/editor';
import {firebaseAuth} from "../providers/UserProvider";

/**
 * @return {string}
 */
const FileUpdater = (props) => {
    const {fileEditTemp, setFileEditTemp} = useContext(firebaseAuth);
    let user = props.username; let fileName = props.fileName;
    let fileCustomName = props.fileCustomName; let data = props.data; let mime = props.mime;
    let file = URL.createObjectURL(Blob(data, {type: mime}));
    let formData = new FormData();
    formData.append('fileUpload', file);
    axios.post(
        `https://api.gbshs.kr/tmpl/updateFile.php?user=${user}&fileName=${fileName}&customFileName=${fileCustomName}`,
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    ).then(()=>{
        console.log('Sent update request to server');
    }).catch(()=>{
        console.log('File update failed');
    })
};

export default FileUpdater;
