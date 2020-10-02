import React from 'react';
import { Redirect } from 'react-router';
import CreateServerScreen from '../screens/CreateServerScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';

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
];

export default routes;