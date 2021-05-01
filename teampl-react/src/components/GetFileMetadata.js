import React, {useContext, useState} from 'react';
import axios from 'axios';
import {firebaseAuth} from "../providers/UserProvider";

export const GetFileMetadata = (props) => {
    props.onLoad();
    console.log('Run!');
    const {metadata, setMetadata} = useContext(firebaseAuth);
    axios({
        url: 'https://api.gbshs.kr/tmpl/getFileMetadata.php?user='+props.username,
        method: 'GET'
    }).then(response=>{
        console.log(response.data);
        setMetadata({
            loading: false,
            data: response.data
        });
        if(props.returnLog !== null){
            console.log(response.data.log);
            let log = response.data.log[response.data.log.length-1];
            props.returnLog({severity: log.type, summary: log.desc, detail: log.time});
        }

    }).catch(error=>{
        console.log(error);
        return null;
    });
    return null;
};

export default GetFileMetadata;