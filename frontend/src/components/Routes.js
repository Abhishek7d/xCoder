import React from 'react';
import { Redirect } from 'react-router';
import CreateServerScreen from '../screens/CreateServerScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ResetScreen from '../screens/ResetScreen';
import Servers from '../screens/Servers';
import Applications from '../screens/Applications';
import Logout from '../screens/Logout';
import Profile from '../screens/Profile';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

let routes = [
    {
        path: '/',
        component: (obj) =>{

            let cookie = read_cookie("auth")
            if(obj.location.pathname=="/reset"){
                return <ResetScreen />;
            }else if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }
            else{
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
        path: '/applications',
        title: 'Applications',
        component: () => <Applications />
    },
    {
        path: '/logout',
        title: 'Logout',
        component: () => <Logout />
    },
    {
        path: '/profile',
        title: 'Profile',
        component: () => <Profile />
    },
];

export default routes;
//http://localhost:3000/reset?token=c51439fc9ef4032656e421bf1de9756f65567abf84d502ff2f1c2626bc91f0c9&email=dibyendu@ardentcollaborations.com
