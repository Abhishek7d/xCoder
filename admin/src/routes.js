import React from 'react';
import { cilCloudy, cilEnvelopeClosed, cilEnvelopeLetter, cilFolder, cilMoney, cilResizeBoth } from '@coreui/icons'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
// const Home = React.lazy(() => import('./views/dashboard/Home'));

// Users
const AdminUsers = React.lazy(() => import('./views/users/Users'));

// Pages
const Login = React.lazy(() => import('./views/pages/Login'));
const ForgotPassword = React.lazy(() => import('./views/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./views/pages/ResetPassword'));

// Hosting
const Sizes = React.lazy(() => import('./views/hosting/Sizes'));
const Users = React.lazy(() => import('./views/hosting/Users'));
const Projects = React.lazy(() => import('./views/hosting/Projects'));
const Invoices = React.lazy(() => import('./views/hosting/Invoices'));
const Droplets = React.lazy(() => import('./views/hosting/Droplets'));

// Settings
const Settings = React.lazy(() => import('./views/settings/Settings'));
const Notifications = React.lazy(() => import('./views/settings/Notifications'));
const Payment = React.lazy(() => import('./views/settings/Payment'));

const routes = [
    {
        path: '/',
        exact: true,
        name: 'Home',
        permission: 'access-admin-panel'
    },
    {
        path: '/dashboard',
        exact: true,
        name: 'Dashboard',
        routeName: 'dashboard',
        component: Dashboard,
        permission: 'dashboard.view',
        icon: 'cil-speedometer'
    },
    {
        path: '/dashboard/settings',
        name: 'Cloud Settings',
        routeName: 'dashboard.settings',
        component: Settings,
        permission: 'dashboard.settings.view',
        icon: 'cil-settings'
    },
    {
        path: '/dashboard/settings/notifications',
        name: 'Notifications',
        routeName: 'dashboard.notifications',
        component: Notifications,
        permission: 'dashboard.notifications.view',
        icon: cilEnvelopeLetter
    },
    {
        path: '/dashboard/settings/payments',
        name: 'Payments',
        routeName: 'dashboard.payments',
        component: Payment,
        permission: 'dashboard.payments.view',
        icon: cilMoney
    },
    {
        path: '/dashboard/users',
        name: 'Users',
        routeName: 'dashboard.users',
        component: AdminUsers,
        permission: 'dashboard.users.view',
        icon: 'cil-user'

    },
    {
        path: '/dashboard/droplets/servers',
        exact: true,
        name: 'Servers',
        routeName: 'droplets',
        component: Droplets,
        permission: 'droplets.servers.view',
        icon: cilCloudy
    },
    {
        path: '/dashboard/droplets/projects',
        exact: true,
        name: 'Projects',
        routeName: 'droplets.projects',
        component: Projects,
        permission: 'droplets.projects.view',
        icon: cilFolder
    },
    {
        path: '/dashboard/droplets/users',
        name: 'Clients',
        routeName: 'droplets.users',
        component: Users,
        permission: 'droplets.users.view',
        icon: 'cil-user'
    },
    {
        path: '/dashboard/droplets/invoices',
        name: 'Invoices',
        routeName: 'droplets.invoices',
        component: Invoices,
        permission: 'droplets.invoices.view',
        icon: cilEnvelopeClosed
    },
    {
        path: '/dashboard/droplets/sizes',
        name: 'Sizes',
        routeName: 'droplets.sizes',
        component: Sizes,
        icon: cilResizeBoth,
        permission: 'droplets.sizes.view',
    },

    // Login
    { path: '/login/:status?', name: 'Login', component: Login, layout: false },
    { path: '/forgot-password', name: 'Forgot Password', component: ForgotPassword, layout: false },
    { path: '/reset-password/:token/:email', name: 'Reset Password', component: ResetPassword, layout: false },
];

export default routes;
