// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import { useSelector } from 'react-redux'
// import { cilCloudy, cilEnvelopeClosed, cilEnvelopeLetter, cilFolder, cilMoney, cilResizeBoth, cilUser } from '@coreui/icons'
import sidebarMenu from 'src/reusable/Sidebar'

// const MyText = () => {
//     const show = useSelector(state => state.userRole)
//     return show;
// }

const sidebar = new sidebarMenu();
// Dashboard
sidebar.header("Dashboard")
sidebar.menu('dashboard')
sidebar.menu('dashboard.users')

// Droplets
sidebar.header("Droplets")
sidebar.menu('droplets.users')
sidebar.menu('droplets.projects')
sidebar.menu('droplets')
sidebar.menu('droplets.invoices',)

// Settings
sidebar.header("Settings")
sidebar.menu('dashboard.settings')
sidebar.menu('dashboard.payments')
sidebar.menu('dashboard.notifications')

// const _nav = [
//     {
//         _tag: 'CSidebarNavTitle',
//         _children: ['Dashboard']
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Dashboard',
//         to: '/dashboard',
//         permission: 'dashboard.view',
//         icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Users',
//         to: '/dashboard/users',
//         permission: 'dashboard.users.view',
//         icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
//     },
//     {
//         _tag: 'CSidebarNavTitle',
//         _children: ['Droplets']
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Users',
//         to: '/dashboard/droplets/users',
//         permission: 'droplets.user.view',
//         icon: <CIcon content={cilUser} customClasses="c-sidebar-nav-icon" />,

//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Projects',
//         to: '/dashboard/droplets/projects',
//         permission: 'droplets.projects.view',
//         icon: <CIcon content={cilFolder} customClasses="c-sidebar-nav-icon" />,
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Servers',
//         to: '/dashboard/droplets/servers',
//         permission: 'droplets.servers.view',
//         icon: <CIcon content={cilCloudy} customClasses="c-sidebar-nav-icon" />,

//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Sizes',
//         to: '/dashboard/droplets/sizes',
//         permission: 'droplets.sizes.view',
//         icon: <CIcon content={cilResizeBoth} customClasses="c-sidebar-nav-icon" />,

//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Invoices',
//         to: '/dashboard/droplets/invoices',
//         permission: 'droplets.invoices.view',
//         icon: <CIcon content={cilEnvelopeClosed} customClasses="c-sidebar-nav-icon" />,
//         badge: {
//             color: 'dark',
//             text: '0',
//         }
//     },
//     {
//         _tag: 'CSidebarNavTitle',
//         _children: ['Settings']
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Cloud Settings',
//         to: '/dashboard/settings',
//         permission: 'dashboard.settings.view',
//         icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon" />,
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Payment Getaways',
//         to: '/dashboard/settings/payments',
//         permission: 'dashboard.settings.view',
//         icon: <CIcon content={cilMoney} customClasses="c-sidebar-nav-icon" />,
//     },
//     {
//         _tag: 'CSidebarNavItem',
//         name: 'Email & Notifications',
//         to: '/dashboard/settings/notifications',
//         permission: 'dashboard.settings.view',
//         icon: <CIcon content={cilEnvelopeLetter} customClasses="c-sidebar-nav-icon" />,
//     },

//     // with sub menu
//     // {
//     //     _tag: 'CSidebarNavDropdown',
//     //     name: 'Base',
//     //     route: '/base',
//     //     icon: 'cil-puzzle',
//     //     _children: [
//     //         {
//     //             _tag: 'CSidebarNavItem',
//     //             name: 'Breadcrumb',
//     //             to: '/base/breadcrumbs',
//     //         },
//     //     ]
//     // }
// ]
// console.log(_nav)
export default sidebar.sidebarMenu