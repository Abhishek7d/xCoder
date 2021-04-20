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
import { usePermission } from 'src/reusable/Permissions';
import { Link, withRouter } from 'react-router-dom';

// const selectedRows = [];
const Applications = (props) => {
    const canViewApps = usePermission("droplets.servers.view")

    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [applications, setApplications] = useState(null)
    const [selectedRows, setSelectedItems] = useState([])
    const [tab, setTab] = useState('main');
    const [actionLoading, setActionLoading] = useState({
        action: null,
        loading: false,
    })
    const [request, setRequest] = useState({
        sort: { column: "id", asc: false },
        search: null,
        filter: null,
        page: 1,
        perPage: 15,
        userId: props.match.params.userId,
        serverId: props.match.params.serverId,
        raw: true
    });
    // End States
    const confirm = (type, item = null) => {
        let title = (type === 'single' ? 'Delete Droplet ' + item['projects.name'] : 'Delete Selected Droplets')
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
            key: 'id',
            label: 'ID',
            _style: { width: '10%' },
        },
        'domain',
        'name',
        'db_name',
        {
            key: 'ftp_credentials',
            label: 'FTP',
            _style: { width: '10px' }
        },
        'ssl_enabled',
        {
            key: 'created_at',
            label: 'Date'
        }
    ]

    // Load User data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/applications?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setApplications(data)
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
                                            Applications
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
                                items={(applications) ? applications.data : []}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot={
                                    <>
                                        <p className="text-center p-0 m-0">
                                            {(loading) ? '' :
                                                <>
                                                    {(applications && applications.length > 0) ? '' : 'No Data'}
                                                </>
                                            }
                                        </p>
                                    </>}
                                clickableRows
                                columnFilter
                                itemsPerPage={(applications) ? applications.per_page : 10}
                                hover
                                sorter
                                onPaginationChange={e => setRequest({ ...request, perPage: e })}
                                onSorterValueChange={e => setRequest({ ...request, sort: e })}
                                onColumnFilterChange={e => setRequest({ ...request, filter: e })}
                                onTableFilterChange={e => setRequest({ ...request, search: e })}
                                scopedSlots={{
                                    'ftp_credentials': (item) => (
                                        <td>
                                            {console.log(JSON.parse(item.ftp_credentials))}
                                            {(JSON.parse(item.ftp_credentials).length) ?
                                                JSON.parse(item.ftp_credentials).length
                                                : 0}
                                        </td>
                                    ),
                                    'ssl_enabled': (item) => (
                                        <td>
                                            {(item.ssl_enabled === '1') ?
                                                <span className="text-success">
                                                    Enabled
                                            </span> : 'Disabled'}
                                        </td>
                                    ),
                                    'created_at': (item) => (
                                        <td>
                                            {new Date(item.created_at).toDateString()}
                                        </td>
                                    )
                                }}
                            />
                            {
                                (applications && applications.last_page !== 1) ?
                                    <CPagination
                                        className="p-4"
                                        key='p1'
                                        activePage={request.page}
                                        pages={applications.last_page}
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

export default withRouter(Applications)
