import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';

import Api from '../Api';
import {
    CBadge,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'

const TheHeaderDropdown = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const role = useSelector(state => state.userRole)

    const logoutUser = () => {
        new Api().get("POST", "/logout", null, true, (data, msg) => {
            dispatch({ type: "set", userRole: null })
            Cookies.remove("authToken");
            localStorage.removeItem('authUserRole');
            history.push("/login");
        }, (error) => {

        })
    }
    return (
        <CDropdown
            inNav
            className="c-header-nav-items mx-2"
            direction="down"
        >
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
                    className="text-center"
                >
                    <strong>{role}'s Account</strong>
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
                <CDropdownItem>
                    <CIcon name="cil-user" className="mfe-2" />Profile
        </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-credit-card" className="mfe-2" />
          Payments
          <CBadge color="secondary" className="mfs-auto">0</CBadge>
                </CDropdownItem>
                <CDropdownItem>
                    <CIcon name="cil-file" className="mfe-2" />
          Projects
          <CBadge color="primary" className="mfs-auto">0</CBadge>
                </CDropdownItem>
                <CDropdownItem divider />
                <CDropdownItem onClick={logoutUser}>
                    <CIcon content={cilAccountLogout} className="mfe-2" />
          Logout
        </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default TheHeaderDropdown
