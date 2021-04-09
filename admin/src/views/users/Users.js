import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {
    CPagination,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
    CCol,
    CRow,
    CButton,
    CButtonGroup,
    CInputCheckbox,
    CTooltip,
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CFormGroup,
    CFormText,
    CLabel,
    CInput,
    CSelect,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CAlert as Alert,
    CSpinner,
    CContainer
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilUserPlus, cilTrash, cilLockLocked, cilCog, cilInfo, cilLockUnlocked, cilBatteryEmpty, cilCompass, cilUser } from '@coreui/icons'
import { removeElem } from 'src/reusable/Helper';
import { hasElem } from '../../reusable/Helper';
// const selectedRows = [];
const Users = (props) => {
    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [formLoading, isFormLoading] = useState(false)
    const [users, setUsers] = useState(null)
    const [selectedRows, setSelectedItems] = useState([])
    const [tab, setTab] = useState('users');
    const [modalAddUser, setModalAddUser] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roles, setRoles] = useState(null)
    const [selectedRole, setSelectedRole] = useState({
        role: null,
        permission: null
    })
    const [actionLoading, setActionLoading] = useState({
        action: null,
        loading: false,
    })
    const [request, setRequest] = useState({
        sort: null,
        search: null,
        filter: null,
        page: 1,
        perPage: 10,
        raw: true
    });
    const [form, setForm] = useState({
        name: null,
        email: null,
        role: 0,
        password: null,
        confirm_password: null,
        raw: true
    })
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    // End States
    const toggleAddUser = () => {
        setModalAddUser(!modalAddUser);
        dismissAlert()
    }
    const isAllSelected = () => {
        if (users && users.data.length > 0) {
            if (selectedRows.length === users.data.length) {
                return true
            }
        }
        return false
    }
    const confirm = (type, item = null) => {
        let title = (type === 'single' ? 'Delete User ' + item.name : 'Delete Selected Users')
        confirmAlert({
            title: title,
            message: 'What you`d probably have to do is make a custom checkbox-looking image and bind to its various events (click, for example) to store its current "state" in a hidden form field via JavaScript. You may run into a number of issues with this approach, though.',
            buttons: [
                {
                    label: 'Yes',
                    className: 'btn btn-danger',
                    onClick: () => deleteSelected(type, item)
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    const deleteSelected = (type, item) => {
        isLoading(true)
        let data = {
            items: type === 'single' ? [item.id] : selectedRows,
            // Model Name
            table: "users",
            force: (tab === 'trashed') ? 'true' : 'false',
            raw: true
        }
        new Api().get("POST", '/actions/delete', data, true, (data, msg) => {
            console.log(data);
            isLoading(false)
            getUsersData()
        }, (error) => {
            isLoading(false)
        })
    }
    const fields = [
        {
            key: 'check_box',
            label: <CInputCheckbox checked={isAllSelected()} onChange={e => selectAll(e)} className="ml-0" />,
            _style: { width: '1%' },
            sorter: false,
            filter: false
        },
        {
            key: 'id',
            _style: { width: '10%' },
        },
        'name',
        'email',
        'created_at', {
            key: 'action',
            _style: { width: '25%' },
            sorter: false,
            filter: false
        }]

    // Load User data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/users?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setUsers(data)
            setSelectedItems([])
        }, (error) => {
            console.log(error)
        })
    }
    const addToSelectedList = (event, id) => {
        if (!event.target.checked) {
            removeItem(selectedRows, id)
        } else {
            setSelectedItems([...selectedRows, id]);
        }
    }
    const removeItem = (array, item) => {
        if (array.find(i => i === item)) {
            array = removeElem(array, item)
            setSelectedItems(array);
        }
    }
    const selectAll = (event) => {
        if (event.target.checked) {
            let all = []
            users.data.forEach((data) => {
                all.push(data.id)
            })
            setSelectedItems(all);
        } else {
            setSelectedItems([]);
        }
    }
    const isSelected = () => {
        if (selectedRows.length > 0) {
            return false
        }
        return true
    }
    // Load User on filter
    useEffect(() => {
        getUsersData()
    }, [request])

    // Call function on first load
    useEffect(() => {
        getRoles()
    }, [])


    // Set Tab
    const setTabX = (t) => {
        if (t === 'trashed') {

            setRequest({ ...request, trashed: 1 })
        } else {
            setRequest({ ...request, trashed: 0 })
        }
        setTab(t)
    }

    // Set Input
    const setInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Update User Data
    const changeUserData = (key, value, update) => {
        let data = {
            table: 'users',
            key: key,
            value: value,
            update: update,
            raw: true
        }
        new Api().get("POST", "/actions/set-value", data, true, (data, msg) => {
            console.log(data)
            setActionLoading({
                action: null, loading: false
            })
            getUsersData()
        }, (error) => {
            console.log(error);
            setActionLoading({
                action: null, loading: false
            })
        })
    }

    // Lock / Unlock User
    const lockUnlockUser = (action, id) => {
        setActionLoading({
            action: 'lock-' + id, loading: true
        })
        if (action === 0) {
            changeUserData('id', [id], {
                locked: 1
            })
        } else {
            changeUserData('id', [id], {
                locked: 0
            })
        }
    }

    // Lock Selected Users
    // const localSelected = (action) => {
    //     if (action === 0) {
    //         changeUserData('id', selectedRows, {
    //             locked: 1
    //         })
    //     } else {
    //         changeUserData('id', selectedRows, {
    //             locked: 0
    //         })
    //     }
    // }

    // Get Roles
    const getRoles = () => {
        new Api().get("GET", "/roles", null, true, (data, msg) => {
            setRoles(data)
        }, (error) => {
            console.log(error);
        })
    }

    // Render Roles
    const roleSelectOption = () => {
        let option = [];
        if (roles) {
            if (roles.roles) {
                option.push(<option disabled key={'select-role'} value="0">Select Role</option>)
                roles.roles.forEach((role, index) => {
                    option.push(<option key={index} value={role.name}>{String(role.name).toUpperCase()}</option>)
                })
            } else {
                option.push(<option key={0}>Loading..</option>)
            }
        }
        return option
    }

    // 
    const toggleInfo = (user = null) => {
        if (user) {
            setSelectedUser(user)
            setSelectedRole({ role: user.has_roles, permission: user.has_permissions })
        } else {
            setSelectedUser(null)
            setSelectedRole({ role: null, permission: null })
        }
        setModalInfo(!modalInfo);
        dismissAlert()
    }

    // change role
    const changeRoleSelect = (e) => {
        let role = e.target.value;

        if (roles) {
            //roles.forEach((data, index) => {
            let r = roles.roles.find(i => i.name === role)
            if (r) {
                setSelectedRole({
                    role: r.name,
                    permission: r.permissions
                })
            }
            //  })
        }
    }

    // Add Permissions

    const addPermission = (e) => {
        let permission = e.target.value
        let checked = e.target.checked
        if (checked) {
            if (selectedRole.permission) {
                setSelectedRole({ ...selectedRole, permission: [...selectedRole.permission, [permission]] })
            }
        } else {

        }
    }

    // Render Permissions
    const permissionCheckBox = () => {
        let checkbox = []
        if (roles) {
            if (roles.permissions) {
                if (selectedRole.permission) {
                    let sp = selectedRole.permission
                    roles.permissions.forEach((permission, index) => {
                        let selected = false;
                        if (sp.find(i => permission.name === i.name)) {
                            selected = true
                        }
                        checkbox.push(
                            <CCol key={selectedRole.role + "-" + index} md='3'>
                                <div className="ml-2">
                                    <CInputCheckbox value={permission}
                                        key={selectedRole.role + "-" + permission.id}
                                        onChange={addPermission} defaultChecked={selected} id={permission.id} />
                                    <label htmlFor={permission.id}>{permission.name}</label>
                                </div>

                            </CCol>
                        )
                    })
                }
            }
        }
        return checkbox;
    }
    // Add Users
    const addUsers = () => {
        isFormLoading(true)
        new Api().get("POST", '/users/create', form, true, (res, meg) => {
            console.log(res);
            showAlert({ show: true, text: "User Added Successfully", type: 'success' })
            getUsersData()
            isFormLoading(false)
            setForm({
                name: null,
                email: null,
                role: null,
                password: null,
                confirm_password: null,
                raw: true
            })
        }, (error) => {
            console.log(error);
            showAlert({ show: true, text: error, type: 'danger' })
            isFormLoading(false)
        })
    }
    const validateFormAndSubmit = () => {
        if (form.name && form.email && form.password && form.role) {
            addUsers()
        } else {
            showAlert({ show: true, text: "All fields are required", type: 'danger' })
        }
    }
    const dismissAlert = (s = false) => {
        showAlert({ ...alert, show: s, })
    }
    return (
        <>
            {/* Modal Add User */}
            <CModal
                key={modalAddUser}
                centered
                show={modalAddUser}
                onClose={toggleAddUser}>
                <CModalHeader closeButton>Create New User</CModalHeader>
                <CModalBody>
                    <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                        {alert.text}
                    </Alert>
                    <CFormGroup>
                        <CLabel className="ml-1">Name</CLabel>
                        <CInput value={form.name || ''} onChange={setInput} type="text" name="name" placeholder="Enter Name" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Email</CLabel>
                        <CInput value={form.email || ''} onChange={setInput} type="text" name="email" placeholder="Enter Email" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Password</CLabel>
                        <CInput value={form.password || ''} onChange={setInput} type="text" name="password" placeholder="Enter Password" />
                    </CFormGroup>

                    <CFormGroup>
                        <CLabel className="ml-1">Password</CLabel>
                        <CInput value={form.confirm_password || ''} onChange={setInput} type="text" name="confirm_password" placeholder="Enter Password" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Select Role</CLabel>
                        <CSelect defaultValue={form.role} onChange={setInput} name="role">
                            {roleSelectOption()}
                        </CSelect>
                    </CFormGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton onClick={validateFormAndSubmit} color="primary">
                        {(!formLoading) ? 'Add' : <CSpinner className="mt-1" color="light" size="sm" />}
                    </CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={toggleAddUser}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal Info */}
            <CModal
                size="xl"
                key={modalInfo + "-info"}
                show={modalInfo}
                onClose={toggleInfo}>
                {
                    (selectedUser) ?
                        <>
                            <CModalHeader closeButton><CIcon content={cilUser} size="lg" />&nbsp;&nbsp;&nbsp;<b>{selectedUser.name}</b></CModalHeader>
                            <CModalBody>
                                <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                                    {alert.text}
                                </Alert>
                                <CRow>
                                    <CCol xs="12">
                                        <CFormGroup>
                                            <CLabel htmlFor="role" className="ml-1">User Role</CLabel>
                                            <CSelect id="role" defaultValue={(selectedUser.has_roles[0]) ? selectedUser.has_roles[0] : ''} onChange={changeRoleSelect} name="role">
                                                {roleSelectOption()}
                                            </CSelect>
                                        </CFormGroup>
                                    </CCol>
                                    <CCol xs="12">
                                        <CLabel htmlFor="permissions" className="ml-1">Permissions</CLabel>
                                        <CContainer>
                                            <CRow>
                                                {permissionCheckBox()}
                                            </CRow>
                                        </CContainer>
                                    </CCol>
                                </CRow>

                            </CModalBody>
                            <CModalFooter>
                                <CButton onClick={validateFormAndSubmit} color="primary">
                                    {(!formLoading) ? 'Modify' : <CSpinner className="mt-1" color="light" size="sm" />}
                                </CButton>{' '}
                                <CButton
                                    color="secondary"
                                    onClick={toggleInfo}
                                >Cancel</CButton>
                            </CModalFooter>
                        </>
                        : null
                }
            </CModal>
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader className="with-tab">
                            <CTabs activeTab="home">
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink active={(tab === 'users' ? true : false)} data-tab="users" onClick={() => setTabX('users')}>
                                            All Users
                                         </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink active={(tab === 'trashed' ? true : false)} data-tab="trashed" onClick={() => setTabX('trashed')}>
                                            Trashed
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                            </CTabs>
                        </CCardHeader>
                        <CCardBody className="p-0 has-table">
                            <CRow className="mt-1">
                                <CCol md="12">
                                    <CTooltip content="Delete Selected" advancedOptions={{ delay: [1000, 100] }}>
                                        <CButton onClick={() => confirm('multiple')} disabled={isSelected()} size="sm" color="danger">
                                            <CIcon content={cilTrash} />
                                        </CButton>
                                    </CTooltip>
                                    <CTooltip content="Create New User" advancedOptions={{ delay: [1000, 100] }}>
                                        <CButton className="ml-2" onClick={toggleAddUser} size="sm" color="success">
                                            <CIcon content={cilUserPlus} />
                                        </CButton>
                                    </CTooltip>
                                </CCol>
                            </CRow>
                            <CDataTable
                                key={tab}
                                items={(users) ? users.data : []}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot={
                                    <>
                                        <p className="text-center p-0 m-0">
                                            {(loading) ? '' :
                                                <>
                                                    {(users && users.length > 0) ? '' : 'No Data'}
                                                </>
                                            }
                                        </p>
                                    </>}
                                clickableRows
                                columnFilter
                                itemsPerPage={(users) ? users.per_page : 10}
                                hover
                                sorter
                                onPaginationChange={e => setRequest({ ...request, perPage: e })}
                                onSorterValueChange={e => setRequest({ ...request, sort: e })}
                                onColumnFilterChange={e => setRequest({ ...request, filter: e })}
                                onTableFilterChange={e => setRequest({ ...request, search: e })}

                                scopedSlots={{
                                    'check_box': (item) => (
                                        <td>
                                            <CInputCheckbox key={item.id}
                                                checked={hasElem(selectedRows, item.id)}
                                                onChange={(e) => addToSelectedList(e, item.id)} className="ml-0" />
                                        </td>
                                    ),
                                    'created_at': (item) => (
                                        <td>
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                    ),
                                    'action':
                                        (item) => (
                                            <td>
                                                {(tab === 'users') ?
                                                    <>
                                                        <CTooltip content={(item.locked === 1) ? 'Unlock User' : 'Lock User'}
                                                            advancedOptions={{ delay: [1000, 100] }}>
                                                            <CButton onClick={() => lockUnlockUser(item.locked, item.id)} className="ml-2" color={(item.locked === 1) ? 'danger' : 'success'} size="sm">
                                                                {(actionLoading.action === 'lock-' + item.id && actionLoading.loading) ? <CSpinner className="mt-1" color="light" size="sm" /> : <CIcon key={item.id + item.locked} content={(item.locked === 1) ? cilLockLocked : cilLockUnlocked} />}
                                                            </CButton>
                                                        </CTooltip>
                                                    </>
                                                    : null}
                                                <CTooltip content="Delete User" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton onClick={() => confirm('single', item)} className="ml-2" color="danger" size="sm">
                                                        <CIcon content={cilTrash} />
                                                    </CButton>
                                                </CTooltip>
                                                {(tab === 'users') ?
                                                    <CTooltip content="User Details" advancedOptions={{ delay: [1000, 100] }}>
                                                        <CButton onClick={() => toggleInfo(item)} className="ml-2" color="info" size="sm">
                                                            <CIcon content={cilInfo} />
                                                        </CButton>
                                                    </CTooltip>
                                                    : null}
                                            </td>
                                        )
                                }}
                            />
                            {
                                (users && users.next_page_url !== null) ?
                                    <CPagination
                                        className="p-4"
                                        key='p1'
                                        activePage={request.page}
                                        pages={users.last_page}
                                        onActivePageChange={e => setRequest({ ...request, page: e })}
                                    /> : null
                            }
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Users
