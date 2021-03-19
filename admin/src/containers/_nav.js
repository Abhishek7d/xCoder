import React from 'react'
import CIcon from '@coreui/icons-react'
import { useSelector } from 'react-redux'
import { cilMoney, cilUser } from '@coreui/icons'

const MyText = () => {
    const show = useSelector(state => state.userRole)
    return show;
}
const _nav = [
    {
        _tag: 'CSidebarNavTitle',
        _children: ['Dashboard']
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
        badge: {
            color: 'success',
            text: <MyText />,
        }
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Settings',
        to: '/dashboard/settings',
        icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon" />,

    },
    {
        _tag: 'CSidebarNavTitle',
        _children: ['Accounts']
    },
    {
        _tag: 'CSidebarNavDropdown',
        name: 'Accounts',
        route: '/dashboard/accounts',
        icon: <CIcon name="cil-home" customClasses="c-sidebar-nav-icon" />,
        _children: [
            {
                _tag: 'CSidebarNavItem',
                name: 'All Accounts',
                to: '/dashboard/accounts',
                icon: <CIcon content={cilUser} customClasses="c-sidebar-nav-icon" />,
            },
            {
                _tag: 'CSidebarNavItem',
                name: 'Payments',
                to: '/dashboard/accounts/payments',
                icon: <CIcon content={cilMoney} customClasses="c-sidebar-nav-icon" />,
            },
        ]
    },
    {
        _tag: 'CSidebarNavItem',
        name: 'Payments',
        to: '/payments',
        icon: <CIcon content={cilMoney} customClasses="c-sidebar-nav-icon" />,
    },
]

export default _nav
