import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';

import Api from '../Api';
import {
    CSpinner,
    CRow,
    CCol,
    CBadge,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CModal,
    CModalHeader,
    CModalBody,
    // CModalFooter,
    CButton,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CAlert as Alert,
    CInputGroupText,
    CLabel
    // CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'

const TheHeaderDropdown = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const user = useSelector(state => state.authUser)
    const [modalChangePass, setModalChangePass] = useState(false);
    const [loading, isLoading] = useState(false)
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const [form, setForm] = useState({
        current_password: null,
        password: null,
        password_confirmation: null
    })

    const toggle = () => {
        setModalChangePass(!modalChangePass);
        setForm({
            current_password: null,
            password: null,
            password_confirmation: null
        })
        showAlert({
            show: false,
            text: null,
            type: 'info'
        })
    }

    const setInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const dismissAlert = (s) => {
        showAlert({ ...alert, show: s, })
    }
    const resetPassword = (event) => {
        event.preventDefault();
        changePassword();
    }
    const changePassword = () => {
        isLoading(true)
        new Api().get("POST", "/change/password", form, true, (data, msg) => {
            isLoading(false)
            showAlert({ show: true, text: msg, type: 'success' })
        }, (error) => {
            isLoading(false)
            showAlert({ show: true, text: error, type: 'danger' })
        })
    }
    const logoutUser = () => {
        new Api().get("POST", "/logout", null, true, (data, msg) => {
            dispatch({ type: "set", userRole: null })
            Cookies.remove("authToken");
            localStorage.removeItem('authUserRole');
            localStorage.removeItem('userPermissions');
            history.push("/login");
        }, (error) => {

        })
    }

    return (
        <>
            <CDropdown
                inNav
                className="c-header-nav-items mx-2"
                direction="down">
                <CDropdownToggle className="c-header-nav-link" caret={false}>
                    <div className="c-avatar">
                        <CIcon
                            name="cil-user"
                            size="lg"
                            className="c-avatar-img"
                            alt="admin"
                        />
                    </div>
                </CDropdownToggle>
                <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem
                        header
                        tag="div"
                        color="light"
                        className="text-center">
                        <strong>{(user) ? user.name : 'User'}'s Account</strong>
                    </CDropdownItem>
                    <CDropdownItem>
                        <CIcon name="cil-bell" className="mfe-2" />
                        Updates
                        <CBadge color="info" className="mfs-auto">0</CBadge>
                    </CDropdownItem>
                    <CDropdownItem>
                        <CIcon name="cil-envelope-open" className="mfe-2" />
                         Messages
                        <CBadge color="success" className="mfs-auto">0</CBadge>
                    </CDropdownItem>
                    <CDropdownItem onClick={toggle}>
                        <CIcon name="cil-lock-locked" className="mfe-2" />Change Password
                    </CDropdownItem>
                    <CDropdownItem>
                        <CIcon name="cil-settings" className="mfe-2" />
                         Settings
                    </CDropdownItem>
                    <CDropdownItem divider />
                    <CDropdownItem onClick={logoutUser}>
                        <CIcon content={cilAccountLogout} className="mfe-2" />
                            Logout
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
            <CModal centered size='sm'
                show={modalChangePass}
                onClose={toggle}>
                <CModalHeader closeButton>Change Login Password</CModalHeader>
                <CModalBody>
                    <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                        {alert.text}
                    </Alert>
                    <CForm onSubmit={resetPassword}>
                        <CLabel htmlFor="oldPassword">Current Password</CLabel>
                        <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput id="oldPassword" autoComplete="true" name="current_password" type="password" placeholder="Current Password" onChange={setInput} />
                        </CInputGroup>
                        <CLabel htmlFor="newPassword">New Password</CLabel>
                        <CInputGroup className="mb-1">
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput id="newPassword" autoComplete="true" name="password" type="password" placeholder="New Password" onChange={setInput} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                    <CIcon name="cil-lock-locked" />
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput id="newCPassword" autoComplete="true" name="password_confirmation" type="password" placeholder="Confirm New Password" onChange={setInput} />
                        </CInputGroup>
                        <CRow>
                            <CCol xs="12" className="text-right">
                                <CButton block color="primary" type="submit" className="px-4">
                                    {(!loading) ? 'Change Password' : <CSpinner className="mt-1" color="light" size="sm" />}
                                </CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                {/* <CModalFooter>
                    <CButton color="primary">Change</CButton>{' '}
                </CModalFooter> */}
            </CModal>
        </>
    )
}

export default TheHeaderDropdown
