import React from 'react'
import CIcon from '@coreui/icons-react'
// import { useSelector } from 'react-redux'
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

export default sidebar.sidebarMenu