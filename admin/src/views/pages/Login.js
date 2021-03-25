import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import Api from '../../Api';
import {
    Redirect
} from 'react-router-dom'
import {
    CButton,
    CSpinner,
    CCard,
    CLink,
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

const Login = (props) => {
    const dispatch = useDispatch()
    const history = useHistory();
    const params = useParams();
    const token = Cookies.get('authToken');
    const [loading, isLoading] = useState(false)
    const [sending, isSending] = useState(false)
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const [form, setForm] = useState({
        email: null,
        password: null
    })
    useEffect(() => {
        if (params.status) {
            let msg = ''
            let type = ''
            if (params.status === 'verified') {
                msg = "Email Verified Successfully."
                type = 'success'
            } else if (params.status === 'already-verified') {
                msg = "Email Verified Successfully."
                type = 'success'
            }
            else if (params.status === 'invalid-user') {
                msg = "Invalid Email Address"
                type = 'danger'
            }
            showAlert({
                show: true,
                text: msg,
                type: type
            })
            window.history.replaceState(null, null, "/admin/login")
        }
    }, [params]);
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
            dispatch({ type: "set", authUser: data })
            Cookies.set("authToken", data.access_tokens[data.access_tokens.length - 1])
            localStorage.setItem('authUser', JSON.stringify(data));
            new Api().checkUser();
            history.push("/dashboard");
        }, (error) => {
            isLoading(false)
            showAlert({ show: true, text: error, type: 'danger' })
        })
    }

    const resendActivation = () => {
        isSending(true)
        new Api().get("POST", "/resend", form, false, (data, msg) => {
            isSending(false)
            showAlert({ show: true, text: msg, type: 'success' })
        }, (error) => {
            isSending(false)
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
                                    <h1>Login</h1>
                                    <p className="text-muted">Sign In to your account</p>

                                    {
                                        (alert.text === 'Email Not Verified') ?
                                            <Alert color={'warning'} show={true}>
                                                {
                                                    (sending) ? 'Sending Mail..' : <>Your email is not verified, please verify your email to access your account. <CLink onClick={resendActivation}>Click Here</CLink> to resend verification mail.</>
                                                }

                                            </Alert>
                                            :
                                            <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                                                {alert.text}
                                                {/* {(alert.type === "success") ? <> Redirecting <CSpinner className="mt-1" color="success" size="sm" /></> : null} */}
                                            </Alert>
                                    }
                                    <CForm onSubmit={checkLogin}>

                                        <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-user" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput name="email" type="text" value={form.email || ''} placeholder="Username" onChange={setInput} />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupPrepend>
                                                <CInputGroupText>
                                                    <CIcon name="cil-lock-locked" />
                                                </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput name="password" value={form.password || ''} type="password" placeholder="Password" onChange={setInput} />
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
