import React from 'react'
import {
    CCol,
    CContainer,
    CRow
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

const Page403 = () => {
    return (
        <div className="vh-70 c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="6">
                        <div className="text-center">
                            <h4 className="pt-3">Access Denied</h4>
                            <p className="text-muted">You don't have permission to access this page.</p>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Page403
