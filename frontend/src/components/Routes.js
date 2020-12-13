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
import Projects from '../screens/Projects';

import { read_cookie } from 'sfcookies';

let routes = [
    {
        path: '/login',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }
            else{
                return <Login />;
            }
        }
    },
    {
        path: '/register',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }
            else{
                return <Register />;
            }
        }
    },
    {
        path: '/forgot-password',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }
            else{
                return <ForgotPassword/>;
            }
        }
    },
    {
        path: '/logout',
        title: 'Logout',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Redirect to="/servers" />;
            }
            else{
                return <Logout/>;
            }
        }
    },
    {
        path: '/projects',
        title: 'Project',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Projects />;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/servers',
        title: 'Dashboard',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Servers/>;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/server/create',
        title: 'Create Server',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <CreateServerScreen/>;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/applications/:appId',
        title: 'Applications',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Applications/>;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/applications',
        title: 'Applications',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Applications/>;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/profile',
        title: 'Profile',
        component: () => {
            let cookie = read_cookie("auth")
            if(typeof cookie !== "object"){
                return <Profile/>;
            }
            else{
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/',
        component: (obj) =>{
            let cookie = read_cookie("auth")
            if(obj.location.pathname==="/reset"){
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
        path: '/projects',
        title: 'Projects',
        component: () => <Projects />
    },
];

export default routes;
//http://localhost:3000/reset?token=c51439fc9ef4032656e421bf1de9756f65567abf84d502ff2f1c2626bc91f0c9&email=dibyendu@ardentcollaborations.com
