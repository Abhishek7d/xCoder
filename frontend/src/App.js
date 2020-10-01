import React from 'react';
import './App.css';
import Routes from "./components/Routes";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from './screens/Login';

function App() {
  return (
    <Router>
        {localStorage.getItem("validation") === "true" ? (
        <div className="wrapper">
            {Routes.map((x,i) =>
            <Route key={i} path={x.path} component={x.component} />
            )}
            {/* <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/employees" component={Employee} /> */}
        </div>
        ) : (
        <div className="hold-transition login-page">
            {/* <Redirect path="/" /> */}
            <Route exact path="/" component={Login} />
        </div>
        )}
    </Router>
  );
}

export default App;
