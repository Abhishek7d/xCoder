import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import Api from '../../Api';
import {
    Redirect
} from 'react-router-dom'
import {
    CButton,
    CSpinner,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CAlert as Alert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const ForgotPassword = () => {
    // const dispatch = useDispatch()
    // const history = useHistory();
    const token = Cookies.get('authToken');
    const [loading, isLoading] = useState(false)
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const [form, setForm] = useState({
        email: null,
    })

    const setInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const dismissAlert = (s) => {
        showAlert({ ...alert, show: s, })
    }
    const removeCookie = () => {
        Cookies.remove("authToken")
    }
    const resetPassword = (event) => {
        event.preventDefault();
        sendVerification();
    }
    const sendVerification = () => {
        isLoading(true)
        new Api().get("POST", "/reset", form, false, (data, msg) => {
            isLoading(false)
            showAlert({ show: true, text: msg, type: 'success' })
        }, (error) => {
            isLoading(false)
            showAlert({ show: true, text: error, type: 'danger' })
        })
    }
    return (
        <div className="c-app c-default-layout flex-row align-items-center">
            {(token === 'undefined' || token === undefined || token === '' || token === null) ? removeCookie()
                : <Redirect to="/dashboard" />}
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md="5">
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <h1>Forgot Password</h1>
                                    <p className="text-muted">Enter your email to reset your account</p>
                                    <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                                        {alert.text}
                                    </Alert>
                                    <CForm onSubmit={resetPassword}>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-user" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput name="email" type="text" placeholder="Email" onChange={setInput} />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs="6" className="text-left">
                                                <CButton to="/login" color="link" className="">Login</CButton>
                                            </CCol>
                                            <CCol xs="6" className="text-right">
                                                <CButton color="primary" type="submit" className="px-4">
                                                    {(!loading) ? 'Reset' : <CSpinner className="mt-1" color="light" size="sm" />}
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>

                                </CCardBody>
                            </CCard>

                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div >
    )
}

export default ForgotPassword
