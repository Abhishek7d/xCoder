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
    CAlert as Alert
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilUserPlus, cilTrash, cilLockLocked, cilCog, cilInfo, cilLockUnlocked } from '@coreui/icons'
import { removeElem } from 'src/reusable/Helper';
import { hasElem } from '../../reusable/Helper';
// const selectedRows = [];
const Users = (props) => {
    // const dispatch = useDispatch()
    const [loading, isLoading] = useState(false)
    const [users, setUsers] = useState(null)
    const [selectedRows, setSelectedItems] = useState([])
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
        role: null,
        password: null,
        confirm_password: null,
        raw: true
    })
    const [modal, setModal] = useState(false);
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const toggle = () => {
        setModal(!modal);
    }
    const isAllSelected = () => {
        if (users) {
            if (selectedRows.length === users.data.length) {
                return true
            }
        }
        return false
    }
    const confirm = (type, item = null) => {
        let title = (type === 'single' ? 'Delete User ' + item.name : 'Delete Selected Users')
        confirmAlert({
            title: 'Delete Users',
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
            items: type === 'single' ? [item] : selectedRows,
            // Model Name
            table: "users",
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

    // Load data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/users?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setUsers(data)
        }, (error) => {

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

    useEffect(() => {
        getUsersData()
    }, [request])

    const setInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const addUsers = () => {
        new Api().get("POST", '/users/create', form, true, (res, meg) => {
            console.log(res);
            showAlert({ show: true, text: "User Added Successfully", type: 'success' })
            setModal(false)
            getUsersData()
            dismissAlert(false)
        }, (error) => {
            console.log(error);
            showAlert({ show: true, text: error, type: 'danger' })

        })
    }
    const validateFormAndSubmit = () => {
        if (form.name && form.email && form.password && form.role) {
            addUsers()
        } else {
            showAlert({ show: true, text: "All fields are required", type: 'danger' })
        }
    }
    const dismissAlert = (s) => {
        showAlert({ ...alert, show: s, })
    }
    return (
        <>
            <CModal
                centered
                show={modal}
                onClose={toggle}
            >
                <CModalHeader closeButton>Create New User</CModalHeader>
                <CModalBody>
                    <Alert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                        {alert.text}
                    </Alert>
                    <CFormGroup>
                        <CLabel className="ml-1">Name</CLabel>
                        <CInput onChange={setInput} type="text" name="name" placeholder="Enter Name" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Email</CLabel>
                        <CInput onChange={setInput} type="text" name="email" placeholder="Enter Email" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Password</CLabel>
                        <CInput onChange={setInput} type="text" name="password" placeholder="Enter Password" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Password</CLabel>
                        <CInput onChange={setInput} type="text" name="confirm_password" placeholder="Enter Password" />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel className="ml-1">Select Role</CLabel>
                        <CSelect onChange={setInput} name="role">
                            <option disabled selected value="admin">Select Role</option>
                            <option value="admin">Admin</option>
                        </CSelect>
                    </CFormGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton onClick={validateFormAndSubmit} color="primary">Add</CButton>{' '}
                    <CButton
                        color="secondary"
                        onClick={toggle}
                    >Cancel</CButton>
                </CModalFooter>
            </CModal>
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader className="with-tab">
                            <CTabs activeTab="home">
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink data-tab="home">
                                            All Users
                                         </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink data-tab="profile">
                                            Trashed
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                            </CTabs>
                        </CCardHeader>
                        <CCardBody className="p-0 has-table">
                            <CRow className="mt-1">
                                <CCol md="12">
                                    <CButtonGroup>
                                        <CTooltip content="Delete Selected" advancedOptions={{ delay: [1000, 100] }}>
                                            <CButton onClick={() => confirm('multiple')} disabled={isSelected()} size="sm" color="danger">
                                                <CIcon content={cilTrash} />
                                            </CButton>
                                        </CTooltip>
                                        <CTooltip content="Lock Selected" advancedOptions={{ delay: [1000, 100] }}>
                                            <CButton disabled={isSelected()} size="sm" color="info">
                                                <CIcon content={cilLockLocked} />
                                            </CButton>
                                        </CTooltip>
                                        <CTooltip content="Create New User" advancedOptions={{ delay: [1000, 100] }}>
                                            <CButton onClick={toggle} size="sm" color="success">
                                                <CIcon content={cilUserPlus} />
                                            </CButton>
                                        </CTooltip>
                                    </CButtonGroup>
                                </CCol>
                            </CRow>
                            <CDataTable
                                items={(users) ? users.data : []}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot={<>
                                    {(users === null || users.length === 0) ? 'No Items' : ''}
                                </>
                                }
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
                                                <CTooltip content="Change Password" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton color="primary" size="sm">
                                                        <CIcon content={cilCog} />
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content="Lock User" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton className="ml-2" color="danger" size="sm">
                                                        <CIcon content={cilLockLocked} />
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content="Unlock User" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton disabled className="ml-2" color="success" size="sm">
                                                        <CIcon content={cilLockUnlocked} />
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content="Delete User" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton onClick={() => confirm('single', item)} className="ml-2" color="danger" size="sm">
                                                        <CIcon content={cilTrash} />
                                                    </CButton>
                                                </CTooltip>
                                                <CTooltip content="User Details" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton className="ml-2" color="info" size="sm">
                                                        <CIcon content={cilInfo} />
                                                    </CButton>
                                                </CTooltip>
                                            </td>
                                        )
                                }}
                            />
                            {
                                (users) ?
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
