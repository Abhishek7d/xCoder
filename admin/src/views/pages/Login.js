import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
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

const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const token = Cookies.get('authToken');
    const [loading, isLoading] = useState(false)
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const [form, setForm] = useState({
        email: null,
        password: null
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
    const checkLogin = (event) => {
        event.preventDefault();
        verifyLogin();
    }
    const verifyLogin = () => {
        isLoading(true)
        new Api().get("POST", "/login", form, false, (data, msg) => {
            isLoading(false)
            showAlert({ show: true, text: "Login Successful", type: 'success' })
            dispatch({ type: "set", authToken: data.access_tokens[data.access_tokens.length - 1] })
            dispatch({ type: "set", userRole: data.name })
            Cookies.set("authToken", data.access_tokens[data.access_tokens.length - 1])
            localStorage.setItem('authUserRole', data.name);
            history.push("/dashboard");
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
                                    <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                                        {alert.text} {(alert.type === "success") ? <> Redirecting <CSpinner className="mt-1" color="success" size="sm" /></> : null}
                                    </Alert>
                                    <CForm onSubmit={checkLogin}>
                                        <h1>Login</h1>
                                        <p className="text-muted">Sign In to your account</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-user" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput name="email" type="text" placeholder="Username" onChange={setInput} />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-lock-locked" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput name="password" type="password" placeholder="Password" onChange={setInput} />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs="6" className="text-left">
                                                <CButton to="/forgot-password" color="link" className="px-0">Forgot password?</CButton>
                                            </CCol>
                                            <CCol xs="6" className="text-right">
                                                <CButton color="primary" type="submit" className="px-4">
                                                    {(!loading) ? 'Login' : <CSpinner className="mt-1" color="light" size="sm" />}
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

export default Login
