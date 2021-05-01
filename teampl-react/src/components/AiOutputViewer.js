import React from 'react';
import axios from 'axios';
import {Card} from "primereact/card";
import {Button} from "primereact/button";

export const AiOutputLoad  = (props)=> {
    props.onload();
       let index = props.el;
       let input = '';
       let output = '';
       axios({
           url:  'https://api.gbshs.kr/tmpl/ai/requestInput.php?fileId='+index,
           method: 'GET'
       }).then(response=>{
           input = response.data;
           axios({
               url: `https://api.gbshs.kr/tmpl/ai/requestOutput.php?fileId=${index}`,
               method: 'GET'
           }).then(response=>{
               output = response.data;
               let outputArr = output.split("<|endoftext|>");
               console.log(outputArr);
               let suggested = [];
               for(let i = 1; i < outputArr.length; i++){
                   suggested.push(
                       <div id={`suggested-${i}`} style={{width: "100%", margin: "10px 0px"}}>
                           <b>A.I. generated subject recommendation #{i}</b>
                           <div className={"p-text-justify"} style={{border: "black solid 1px"}}>
                               {outputArr[i]}
                           </div>

                       </div>
                   )
               }
               props.outPut(
                   <div style={{width: "100%"}}>
                       <b>User Input: </b>
                       <div id={"input"} style={{width: "100%"}}>
                           <div className={"p-text-justify"} style={{border: "black solid 1px"}}>{input}</div>
                       </div>
                       <b>A.I Generated Output: </b>
                       <div id={"output"} style={{width: "100%"}}>
                           <div className={"p-text-justify"} style={{border: "black solid 1px"}}>{outputArr[0]}</div>
                       </div>
                       {suggested}
                   </div>
               )
           })
       }).catch(error=>{
           alert('Unable to load!'+error);
        });
    return null;
};

export default AiOutputLoad;