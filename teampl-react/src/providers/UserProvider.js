import React,{createContext, useState} from "react";
import {authMethods} from "../firebase/authMethods";

export const firebaseAuth = React.createContext({});
const UserProvider = (props) => {
    const [inputs, setInputs] = useState({email: '', password: '', username: '', name: ''});
    const [errors, setErrors] = useState([]);
    const [token, setToken] = useState(null);
    const [metadata, setMetadata] = useState({
        loading: true,
        data: {}
    });
    const [fileToView, setFileToView] = useState({
       loading: true,
       file: ''
    });
    const [fileEditTemp, setFileEditTemp] = useState({
        needToSave: false,
        data: ''
    });
    const [csvRows, setCsvRows] = useState(['Loading']);
    const [csvCols, setCsvCols] = useState([{name: "Load Error (Xlsx files not supported)", key: "Currently, .xlsx files are not supported."}]);
    const [getCsv, setGetCsv] = useState(false);
    return(
        <firebaseAuth.Provider
            value={{
                handleSignUp,
                inputs, setInputs,
                errors, setErrors,
                setToken, token,
                metadata, setMetadata,
                fileToView, setFileToView,
                fileEditTemp, setFileEditTemp,
                csvRows, setCsvRows,
                csvCols, setCsvCols,
                getCsv, setGetCsv
            }}>
            {props.children}
        </firebaseAuth.Provider>
    );
};



const handleSignUp = () => {
    console.log('handleSignUp');
    return authMethods.signup();
};

export default UserProvider;
