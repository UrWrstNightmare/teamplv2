//React
import React from 'react';
//Component APIS
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
    useLocation,
    useHistory
} from 'react-router-dom';
//Pages
import {Landing} from "./pages/landing";
import {Login} from './pages/login';
import {UserHome} from './pages/userHome';
import {UserSharedFiles} from "./pages/userSharedFiles";
//Styles
import './css/App.css';

import UserProvider, {firebaseAuth} from "./providers/UserProvider";
import {ProjectViewer} from "./pages/projectViewer";
import {CookiesProvider} from "react-cookie";
import {AiViewer} from "./pages/aiViewer";

function App({location}) {
    return (
        <Router>
            <CookiesProvider>
                <UserProvider>
                    <Switch>
                        <Route exact path='/'>
                            <Landing/>
                        </Route>
                        <Route exact path='/login.js'>
                            <Login/>
                        </Route>
                        <Route exact path='/home.js'>
                         <UserHome/>
                        </Route>
                        <Route exact path ='/shared.js'>
                            <UserSharedFiles/>
                        </Route>
                        <Route exact path ='/project.js'>
                            <ProjectViewer/>
                        </Route>
                        <Route exact path ='/project-ai.js'>
                            <AiViewer/>
                        </Route>
                    </Switch>
                </UserProvider>
            </CookiesProvider>
        </Router>
     );
}

export default App;