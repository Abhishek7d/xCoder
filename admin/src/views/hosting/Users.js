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
    CTooltip,
    CTabs,
    CNav,
    CNavItem,
    CNavLink,
    CSpinner,
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilUserPlus, cilTrash, cilLockLocked, cilCog, cilInfo, cilLockUnlocked, cilBatteryEmpty, cilCompass, cilUser, cilSettings, cilArrowCircleLeft, cilReload } from '@coreui/icons'

// const selectedRows = [];
const Users = (props) => {
    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [users, setUsers] = useState(null)
    const [selectedRows, setSelectedItems] = useState([])
    const [tab, setTab] = useState('users');
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
    const confirm = (type, item = null) => {
        let title = (type === 'single' ? 'Delete Client ' + item.name : 'Delete Selected Client')
        confirmAlert({
            title: title,
            message: 'Are you sure? You want to delete this client?',
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
            key: 'id',
            _style: { width: '10%' },
        },
        'email',
        'name',
        {
            key: 'droplets_count',
            filter: false,
            label: 'Droplets'
        },
        {
            key: 'applications_count',
            filter: false,
            label: 'Applications'
        },
        'created_at',
        {
            key: 'action',
            _style: { width: '20%' },
            sorter: false,
            filter: false
        }
    ]

    // Load User data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/clients?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setUsers(data)
            setSelectedItems([])
        }, (error) => {
            console.log(error)
        })
    }

    // Load User on filter
    useEffect(() => {
        getUsersData()
    }, [request])

    // Set Tab
    const setTabX = (t) => {
        if (t === 'trashed') {
            setRequest({ ...request, trashed: 1 })
        } else {
            setRequest({ ...request, trashed: 0 })
        }
        setTab(t)
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
                locked: true
            })
        } else {
            changeUserData('id', [id], {
                locked: false
            })
        }
    }

    const restoreUser = (item) => {
        changeUserData('id', [item.id], {
            deleted_at: null
        })
    }

    return (
        <>

            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader className="with-tab">
                            <CTabs activeTab="home">
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink active={(tab === 'users' ? true : false)} data-tab="users" onClick={() => setTabX('users')}>
                                            Clients
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
                        <CCardBody className="p-0 has-table pt-4">
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
                                    'droplets_count': (item) => (
                                        <td>
                                            {item.droplets_count}
                                        </td>
                                    ),
                                    'applications_count': (item) => (
                                        <td>
                                            {item.applications_count}
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
                                                        <CTooltip content={(item.locked === 1) ? 'Unlock Client' : 'Lock Client'}
                                                            advancedOptions={{ delay: [1000, 100] }}>
                                                            <CButton onClick={() => lockUnlockUser(item.locked, item.id)} className="ml-2" color={(item.locked === 1) ? 'danger' : 'success'} size="sm">
                                                                {(actionLoading.action === 'lock-' + item.id && actionLoading.loading) ? <CSpinner className="mt-1" color="light" size="sm" /> : <CIcon key={item.id + item.locked} content={(item.locked === 1) ? cilLockLocked : cilLockUnlocked} />}
                                                            </CButton>
                                                        </CTooltip>
                                                    </>
                                                    : null}
                                                <CTooltip content="Delete Client" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton onClick={() => confirm('single', item)} className="ml-2" color="danger" size="sm">
                                                        <CIcon content={cilTrash} />
                                                    </CButton>
                                                </CTooltip>
                                                {(tab === 'users') ?
                                                    null
                                                    :
                                                    <CTooltip content="Restore Client" advancedOptions={{ delay: [1000, 100] }}>
                                                        <CButton onClick={() => restoreUser(item)} className="ml-2" color="info" size="sm">
                                                            <CIcon content={cilUserPlus} />
                                                        </CButton>
                                                    </CTooltip>
                                                }
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
