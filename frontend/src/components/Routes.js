import React from 'react';
import { Redirect } from 'react-router';
import CreateServerScreen from '../screens/CreateServerScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ResetScreen from '../screens/ResetScreen';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import Servers from '../screens/Servers';
import Applications from '../screens/Applications';

//let routes = [
    // {
    //     path: '/',
    //     component: () =>{
    //         console.log(localStorage.getItem("validation")===true)
    //         if(localStorage.getItem("access_token") === "true"){
    //             return <Redirect to="/servers" />;
    //         }else{
    //             return <Redirect to="/login" />;
    //         }
    //     }
    // },

let routes = [
    {
        path: '/',
        component: () =>{
            let cookie = read_cookie("auth")
            console.log(cookie);
            if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/login',
        component: () => <Login/>
    },
    {
        path: '/register',
        component: () => <Register/>
    },
    {
        path: '/forgot-password',
        component: () => <ForgotPassword/>
    },
    {
        path: '/servers',
        title: 'Dashboard',
        component: () => <Servers />
    },
    {
        path: '/server/create',
        title: 'Create Server',
        component: () => <CreateServerScreen />
    },
    {
        path: '/reset',
        title: 'Reset',
        component: () => <ResetScreen />
    },
    {
        path: '/applications',
        title: 'Applications',
        component: () => <Applications />
    },
];

export default routes;
