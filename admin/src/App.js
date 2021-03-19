import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import routes from './routes';

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
)


// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/Login'));
// const Register = React.lazy(() => import('./views/pages/Register'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));
const Page500 = React.lazy(() => import('./views/pages/Page500'));

class App extends Component {
    getRoutes = () => {
        let route = [];
        routes.forEach((data, index) => {
            if (data.layout === false) {
                const DynamicComponent = data.component;
                route.push(
                    <Route exact path={data.path} name={data.name} render={props => <DynamicComponent {...props} />} />
                )
            } else {
                route.push(
                    <Route exact path={data.path} name={data.name} render={props => <TheLayout {...props} />} />
                )
            }

        })
        return route
    }
    render() {
        return (
            <BrowserRouter>
                <React.Suspense fallback={loading}>
                    <Switch>

                        <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
                        {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} /> */}
                        <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
                        <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
                        <Route exact path="/dashboard" name="Home" render={props => <TheLayout {...props} />} />
                        {/* <Route exact path="/" name="Home" render={props => <TheLayout {...props} />} /> */}
                        {this.getRoutes()}
                        <Route path="*" name="Page 404" render={props => <Page404 {...props} />} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
        );
    }
}

export default App;
