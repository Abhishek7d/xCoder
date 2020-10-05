import React from 'react';
import { Redirect } from 'react-router';
import CreateServerScreen from '../screens/CreateServerScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
<<<<<<< HEAD
import ResetScreen from '../screens/ResetScreen';

import Servers from '../screens/Servers';

let routes = [
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
=======
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import Servers from '../screens/Servers';

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
>>>>>>> 0ee2bc1fb1b49f0d61dc03f65c6bfe52d2728f4a
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
];

export default routes;
