import React, { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';

import {
    CCard,
    CCol,
    CRow,
    CNav,
    CNavItem,
    CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Settings = (props) => {
    const [nav, setNav] = useState('Payment.js')
    const DynamicComponent = React.lazy(() => import('./tabs/' + nav));
    // const dispatch = useDispatch()
    return (
        <>
            <CRow >
                <CCol md="9">
                    {/* <CFade> */}
                    <DynamicComponent />
                    {/* </CFade> */}
                </CCol>
                <CCol md="3">
                    <CCard className="p-2">
                        <CNav variant="pills" vertical>
                            <CNavItem>
                                <CNavLink
                                    href="#"
                                    active={nav === 'General.js'}
                                    onClick={() => setNav('General.js')}>
                                    General Settings
                            </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    href="#"
                                    active={nav === 'Payment.js'}
                                    onClick={() => setNav('Payment.js')}>
                                    Payment Settings
                            </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink
                                    href="#"
                                    active={nav === 'Invoice.js'}
                                    onClick={() => setNav('Invoice.js')}>
                                    Invoice Settings
                                  </CNavLink>
                            </CNavItem>
                        </CNav>
                    </CCard>

                </CCol >
            </CRow >

        </>
    )
}

export default Settings
