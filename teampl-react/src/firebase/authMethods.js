import firebaseConfig from '../firebase';
import firebase from 'firebase';


export const authMethods = {
    signup: (username, email, password, actualName, setErrors, setToken) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async res => {
                const token = await Object.entries(res.user)[5][1].b;
                console.log(res);
                //setup details for user in firestore
                let user = firebase.auth().currentUser;
                firebase.database().ref('users/' + user.uid).set({
                    username: username,
                    name: actualName,
                    userLv: 1,
                    createdDate: Date()
                })
                    .then(async res => {
                        console.log(res);
                        firebase.database().ref('usernames/' + username).set({
                            token : token,
                            email: email
                        });
                        await localStorage.setItem('token', token);
                        setToken(window.localStorage.token);
                    })
                    .catch(err => {
                        console.log(err);
                        setErrors(prev=>(["This Username is already in use."]));
                        user.delete().then(()=>{
                            console.log("[Duplicate Username] Registration Rolled back.");
                            window.localStorage.removeItem('token');
                            setToken(null);
                        }).catch(()=>{
                            console.log("[ERROR] Rollback failed!");
                            setErrors(prev=>(["An Unrecoverable Error Occured. Please contact admin."]));
                            window.localStorage.removeItem('token');
                            setToken(null);
                        })
                    })
            })
            .catch(err => {
               console.log(err);
               setErrors(prev=>([err.message]));
            });
    },
    signin: (username, email,  password, setErrors, setToken) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async res => {
                const token = await Object.entries(res.user)[5][1].b;
                await window.localStorage.setItem('token', token);
                setToken(window.localStorage.token);
            })
            .catch(err => {
                console.log(err);
                setErrors(prev=>([err.message]));
            });
    },
    signout: (setErrors, setToken) => {
        firebase.auth().signOut()
            .then(res => {
            console.log("User Logout");
            window.localStorage.removeItem('token');
            setToken(null);
            alert('[Team+] 로그아웃 성공! 새로고침이 필요합니다.');
        })
            .catch(err => {
               alert("[Team+ Root] An unknown error occurred while signing out... --unexpected");
               setErrors(prev => ([err.message]));
                window.localStorage.removeItem('token');
                setToken(null);
            });
    }

};