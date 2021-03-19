import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Home = React.lazy(() => import('./views/dashboard/Home'));
// const Register = React.lazy(() => import('./views/pages/Register'));
const Login = React.lazy(() => import('./views/pages/Login'));
const ForgotPassword = React.lazy(() => import('./views/pages/ForgotPassword'));

const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/dashboard/settings', name: 'Settings', component: Home },
    { path: '/dashboard/accounts', exact: true, name: 'Accounts', component: Home },
    { path: '/dashboard/accounts/home', name: 'Home', component: Home },
    { path: '/dashboard/accounts/payments', name: 'Payments', component: Home },

    // Login
    { path: '/login', exact: true, name: 'Login', component: Login },
    { path: '/forgot-password', name: 'Forgot Password', component: ForgotPassword, layout: false },
];

export default routes;
