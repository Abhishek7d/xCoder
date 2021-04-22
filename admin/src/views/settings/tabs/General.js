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

const General = (props) => {
    // const dispatch = useDispatch()

    return (
        <>
            <CCard>
                <CCardHeader>General Settings</CCardHeader>
                <CCardBody>
                    <p className="text-muted">Details below will show on invoices and email communications.</p>
                    <CForm>
                        <CFormGroup>
                            <CLabel>
                                Company Name
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Address
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                City
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                State
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Country
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Postal Code
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Sales Email Address
                            </CLabel>
                            <CInput />
                        </CFormGroup>
                        <hr />
                        <CButton color="primary">Save</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    )
}

export default General
