import React from 'react';
import {useCookies, Cookies, withCookies} from "react-cookie";

class LoadCookieHomeSettings extends React.Component {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const [cookies, setCookie] = useCookies(['displayWidth','displayClose']);
        console.log(cookies.get('displayWidth'));
        props.returnCookies({displayWidth: cookies.get('displayWidth'), displayClose: cookies.get('displayClose')});
    }
    render(){
        return null;
    }

};

export {LoadCookieHomeSettings};