import React, {useContext, useState} from 'react';
import axios from 'axios';
import {firebaseAuth} from "../providers/UserProvider";

export const GetFileToView = (props) => {
    const {getCsv, setGetCsv} = useContext(firebaseAuth);
    setGetCsv(true);
  props.onLoad(); //to STOP CALLING the script
  console.log('Downloading file for preview, will return as fileToView.file state');
  const {fileToView, setFileToView} = useContext(firebaseAuth);
  let url = 'https://api.gbshs.kr/tmpl/getFile.php?user='+props.username+"&fileName="+props.fileName;
  if(props.shared) url += "&shared=true";
  axios({
      url: url,
      method: "GET",
      responseType: 'blob'
  }).then(response=>{
      props.filePath(URL.createObjectURL(response.data), response.data);
      axios({
          url: url,
          method: "GET"
      }).then(response=>{
          props.dataPath(response.data);
      })
  }).catch(error=>{
      console.log(error);
      return null;
  });
  return null;
};

export default GetFileToView;