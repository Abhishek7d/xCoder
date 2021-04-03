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
import ChangePassword from '../screens/ChangePassword';
import Projects from '../screens/Projects';
import Notifications from '../screens/Notifications';
import { read_cookie } from 'sfcookies';
import DelegateAccess from '../screens/DelegateAccess';
import Invitation from '../screens/Invitation';
import Invoices from '../screens/Invoices';
import Payment from '../screens/Payment';
import AddPaymentDetails from '../screens/AddPaymentDetails';

let routes = [
    {
        path: '/login',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Redirect to="/servers" />;
            }
            else {
                return <Login />;
            }
        }
    },
    {
        path: '/register',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Redirect to="/servers" />;
            }
            else {
                return <Register />;
            }
        }
    },
    {
        path: '/forgot-password',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Redirect to="/servers" />;
            }
            else {
                return <ForgotPassword />;
            }
        }
    },
    {
        path: '/logout',
        title: 'Logout',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Redirect to="/servers" />;
            }
            else {
                return <Logout />;
            }
        }
    },
    {
        path: '/projects/:projectId',
        title: 'Project',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Projects />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/projects',
        title: 'Project',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Projects />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/delegate-access',
        title: 'Delegate Aceess',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <DelegateAccess />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/invitation/:tokenId',
        title: 'Invitation',
        component: () => {
            return <Invitation />;
        }
    },
    {
        path: '/servers/:serverId',
        title: 'Server',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Servers />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },

    {
        path: '/servers',
        title: 'Dashboard',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Servers />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/server/create',
        title: 'Create Server',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <CreateServerScreen />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/applications/:appId',
        title: 'Applications',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Applications />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/applications',
        title: 'Applications',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Applications />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },

    {
        path: '/change-password',
        title: 'Change Password',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <ChangePassword />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/notifications',
        title: 'Notifications',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Notifications />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/invoices/:uuId',
        title: 'Invoice Details',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Invoices />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/invoices',
        title: 'Invoices',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Invoices />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/payment',
        title: 'Payment Setting',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <Payment />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },
    {
        path: '/payment/add-card',
        title: 'Add Card',
        component: () => {
            let cookie = read_cookie("auth")
            if (typeof cookie !== "object") {
                return <AddPaymentDetails />;
            }
            else {
                return <Redirect to="/login" />;
            }
        }
    },

    {
        path: '/',
        component: (obj) => {
            let cookie = read_cookie("auth")
            if (obj.location.pathname === "/reset") {
                return <ResetScreen />;
            } else if (typeof cookie !== "object") {
                return <Redirect to="/servers" />;
            }
            else {
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
