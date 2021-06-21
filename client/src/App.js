import React from 'react';
import {Container} from '@material-ui/core';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import './index.css'


import Home from './components/Home/Home';
import Auth from './components/Auth/Auth.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import Login from './components/LoginPage/Login.js';





function App(){
    
    return(
        <Router>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/auth" exact component={Auth} />
                        <Route path="/dashboard" exact component={Dashboard} />
                    </Switch>
        </Router>
    );
}


export default App;