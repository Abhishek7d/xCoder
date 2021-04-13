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
const Projects = (props) => {
    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [projects, setProjects] = useState(null)
    const [selectedRows, setSelectedItems] = useState([])
    const [tab, setTab] = useState('main');
    const [actionLoading, setActionLoading] = useState({
        action: null,
        loading: false,
    })
    const [request, setRequest] = useState({
        sort: null,
        search: null,
        filter: null,
        page: 1,
        perPage: 5,
        raw: true
    });
    // End States
    const confirm = (type, item = null) => {
        let title = (type === 'single' ? 'Delete Project ' + item['projects.name'] : 'Delete Selected Project')
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
            table: "projects",
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
            key: 'projects.id',
            label: 'ID',
            _style: { width: '10%' },
        },
        {
            key: 'users.name',
            label: 'User'
        },
        {
            key: 'projects.name',
            label: 'Project'
        },
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
        {
            key: 'projects.created_at',
            label: 'Date'
        },
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
        new Api().get("POST", "/projects?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setProjects(data)
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
    const changeProjectData = (key, value, update) => {
        let data = {
            table: 'projects',
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

    const restoreUser = (item) => {
        changeProjectData('id', [item.id], {
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
                                        <CNavLink active={(tab === 'main' ? true : false)} data-tab="users" onClick={() => setTabX('main')}>
                                            Projects
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
                                items={(projects) ? projects.data : []}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot={
                                    <>
                                        <p className="text-center p-0 m-0">
                                            {(loading) ? '' :
                                                <>
                                                    {(projects && projects.length > 0) ? '' : 'No Data'}
                                                </>
                                            }
                                        </p>
                                    </>}
                                clickableRows
                                columnFilter
                                itemsPerPage={(projects) ? projects.per_page : 10}
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
                                                <CTooltip content="Delete Project" advancedOptions={{ delay: [1000, 100] }}>
                                                    <CButton onClick={() => confirm('single', item)} className="ml-2" color="danger" size="sm">
                                                        <CIcon content={cilTrash} />
                                                    </CButton>
                                                </CTooltip>
                                                {(tab === 'main') ?
                                                    null
                                                    :
                                                    <CTooltip content="Restore Project" advancedOptions={{ delay: [1000, 100] }}>
                                                        <CButton onClick={() => restoreUser(item)} className="ml-2" color="info" size="sm">
                                                            <CIcon content={cilArrowCircleLeft} />
                                                        </CButton>
                                                    </CTooltip>
                                                }
                                            </td>
                                        )
                                }}
                            />
                            {
                                (projects && projects.last_page !== 1) ?
                                    <CPagination
                                        className="p-4"
                                        key='p1'
                                        activePage={request.page}
                                        pages={projects.last_page}
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

export default Projects
