import React from 'react';
import './App.css';
import Routes from "./components/Routes";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from './screens/Login';

function App() {
  return (
    <Router>
        {Routes.map((x,i) =>
            <Route key={i} path={x.path} component={x.component} />
        )}
    </Router>
  );
}

export default App;
