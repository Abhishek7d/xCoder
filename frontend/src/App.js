import React from 'react';
// import './App.css';
import Routes from "./components/Routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                {Routes.map((x, i) =>
                    <Route key={i} path={x.path} exact component={x.component} />
                )}
            </Switch>
        </Router>
    );
}

export default App;
