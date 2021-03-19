import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CCreateElement,
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CSidebarNavDivider,
    CSidebarNavTitle,
    CSidebarMinimizer,
    CSidebarNavDropdown,
    CSidebarNavItem,
    CImg,
} from '@coreui/react'

// import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {
    const dispatch = useDispatch()
    const show = useSelector(state => state.sidebarShow)

    return (
        <CSidebar
            show={show}
            onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
        >
            <CSidebarBrand className="d-md-down-none" to="/">
                <CImg
                    className="mr-0 ml-3 c-sidebar-brand-full"
                    src="/images/brand/logo.webp"
                    height={30}
                />
                <CImg
                    className="mr-2 ml-2 c-sidebar-brand-minimized"
                    src="/images/brand/logo.webp"
                    height={30}
                />
                <h5 style={{ 'whiteSpace': 'nowrap' }} className="ml-2 mt-2 mr-auto c-sidebar-brand-full">Parvaty Cloud Hosting</h5>
            </CSidebarBrand>
            <CSidebarNav>
                <CCreateElement
                    items={navigation}
                    components={{
                        CSidebarNavDivider,
                        CSidebarNavDropdown,
                        CSidebarNavItem,
                        CSidebarNavTitle
                    }}
                />
            </CSidebarNav>
            <CSidebarMinimizer className="c-d-md-down-none" />
        </CSidebar >
    )
}

export default React.memo(TheSidebar)
