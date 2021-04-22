import React, { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CInputRadio,
    CInputCheckbox
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

const Payment = (props) => {
    // const dispatch = useDispatch()

    return (
        <>
            <CCard>
                <CCardHeader>Payment Settings</CCardHeader>
                <CCardBody>
                    <CForm>
                        <CRow>
                            <CCol>
                                <CFormGroup className="ml-4">
                                    <CInputRadio id="card-enable" name="enableCard" />
                                    <CLabel htmlFor="card-enable">
                                        Use this settings
                                                        </CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup check className="ml-4">
                                    <CInputRadio checked id="card-disabled" name="enableCard" />
                                    <CLabel htmlFor="card-disabled">
                                        Use env settings
                                                        </CLabel>
                                </CFormGroup>
                            </CCol>
                        </CRow>

                        <CFormGroup>
                            <CLabel>
                                Username
                                                 </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Password
                                                </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Terminal Number
                                                </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Auto Debit Date
                                                </CLabel>
                            <CInput type="date" />
                        </CFormGroup>
                        <hr className="mt-4" />
                        <CFormGroup className="ml-4">
                            <CInputCheckbox id="tax" name="tax-enabled" />
                            <CLabel htmlFor="tax">
                                Enable Tax
                                                </CLabel>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Tax Amount (%)
                                                </CLabel>
                            <CInput />
                        </CFormGroup>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Payment
