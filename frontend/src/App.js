import React from 'react';
import './App.css';
import Routes from "./components/Routes";
import { BrowserRouter as Router, Route, Redirect, IndexRoute } from "react-router-dom";
// import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import Login from './screens/Login';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

function indexComponent() {
  let cookie = read_cookie("auth")
  if (typeof cookie !== "object") {
    return <Redirect to="/projects" />;
  }
  else {
    return <Redirect to="/login" />;
  }
}

function App() {
  return (
    <Router>
      <Route path="/" component={indexComponent}>
        {/* <IndexRoute component = {indexComponent} /> */}
        {Routes.map((x, i) =>
          <Route key={i} path={x.path} component={x.component} />
        )}
      </Route>
    </Router>
  );
}

export default App;
