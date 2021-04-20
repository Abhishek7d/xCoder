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
    CModal,
    CModalBody,
    CModalHeader,
    CModalFooter,
    CTabContent,
    CTabPane,
    CProgress,
    CProgressBar,
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilCog } from '@coreui/icons'
import { usePermission } from 'src/reusable/Permissions';
import { Link, withRouter } from 'react-router-dom';
let interval = null

// const selectedRows = [];
const Droplets = (props) => {
    const canViewApps = usePermission("droplets.servers.view")
    const hasParam = (props.match.params.id) ? true : false
    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [loadingServices, isLoadingServices] = useState(false)
    const [loadingCrons, isLoadingCrons] = useState(false)
    const [loadingResource, isLoadingResource] = useState(false)
    const [droplets, setDroplets] = useState(null)
    const [selectedRows, setSelectedRow] = useState(null)
    const [services, setServices] = useState(null)
    const [resources, setResources] = useState(null)
    const [crons, setCrons] = useState(null)
    const [modalInfo, setModalInfo] = useState(false);
    const [tab, setTab] = useState('main');
    const [nav, setNav] = useState('resource');
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
        id: props.match.params.id,
        raw: true
    });
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
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
        'ip_address',
        {
            key: 'size',
            label: 'Size'
        },
        'region',
        {
            key: 'price_monthly',
            label: 'Monthly'
        },
        {
            key: 'price_hourly',
            label: 'Hourly'
        },
        {
            key: 'disk',
            label: 'Disk'
        },
        {
            key: 'applications_count',
            filter: false,
            label: 'Apps'
        },
        {
            key: 'created_at',
            label: 'Date'
        },
        {
            key: 'action',
            _style: { width: '1%' },
            sorter: false,
            filter: false
        }
    ]
    if (!hasParam) {
        fields.splice(2, 0, {
            key: 'username',
            label: 'User'
        });
    }
    // Load User data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/droplets?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setDroplets(data)
            setSelectedRow(null)
        }, (error) => {
            console.log(error)
        })
    }
    const toggleInfo = (row = null) => {
        if (row) {
            setSelectedRow(row)
            getServices(row.id);
            getResources(row.id);
            getCrons(row.id);
            interval = setInterval(() => {
                getResources(row.id, false);
            }, 10000);
        } else {
            setSelectedRow(null)
            clearInterval(interval);
            setResources(null)
        }
        setModalInfo(!modalInfo);
        dismissAlert()
    }
    const dismissAlert = (s = false) => {
        showAlert({ ...alert, show: s, })
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
    const getCrons = (id) => {
        isLoadingCrons(true)
        new Api().get("GET", '/droplets/cron-jobs/' + id, null, true, (data, msg) => {
            isLoadingCrons(false)
            setCrons(data)
        }, (error) => {
            isLoadingCrons(false)
            console.log(error);
        })
    }
    const getServices = (id, service = null, loading = true) => {
        if (loading) {
            isLoadingServices(true)
        }
        setActionLoading({
            action: service,
            loading: true
        })
        new Api().get("GET", '/droplets/services/' + id, null, true, (data, msg) => {
            setActionLoading({
                action: null,
                loading: false
            })
            isLoadingServices(false)
            setServices(data)
        }, (error) => {
            setActionLoading({
                action: null,
                loading: false
            })
            isLoadingServices(false)
            console.log(error);
        })
    }
    const changeServices = (service, status, loading = true) => {
        if (loading) {
            isLoadingServices(true)
        }
        setActionLoading({
            action: service,
            loading: true
        })
        let s = (status === 'active') ? 'stop' : 'start'
        let data = {
            'service': service,
            'action': s
        }
        new Api().get("POST", '/droplets/services/' + selectedRows.id, data, true, (data, msg) => {
            console.log(data);
            getServices(selectedRows.id, service, false)
            isLoadingServices(false)
        }, (error) => {
            console.log(error);
            setActionLoading({
                action: null,
                loading: false
            })
            isLoadingServices(false)
        })
    }
    const getResources = (id, loader = true) => {
        if (loader) {
            isLoadingResource(true)
        }
        new Api().get("GET", '/droplets/resources/' + id, null, true, (data, msg) => {
            isLoadingResource(false)
            setResources(data)
        }, (error) => {
            isLoadingResource(false)
            console.log(error);
        })
    }
    const renderServices = () => {
        let tr = [];
        if (services) {
            for (const [key, value] of Object.entries(services)) {
                tr.push(
                    <tr key={key}>
                        <td className="text-capitalize">
                            {key}
                        </td>
                        <td className={(value === 'active') ? 'text-success' : 'text-danger'}>
                            {value}
                        </td>
                        <td>
                            <CButton block onClick={() => changeServices(key, value, false)} size="sm" color={(value === 'active') ? 'danger' : 'success'}>
                                {
                                    (actionLoading.action === key && actionLoading.loading) ?
                                        <CSpinner size="sm" color="light" />
                                        : (value === 'active') ? 'Stop' : 'Start'
                                }
                            </CButton>
                        </td>
                    </tr>
                )
            }
        }
        return tr;
    }
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    const renderResources = () => {
        let tr = [];
        if (resources) {
            let memPercentage = resources.memory.available[1] / resources.memory.total[1] * 100
            let memByteAv = (resources.memory.available[2] === 'kB') ? (resources.memory.available[1] * 1024) : resources.memory.available[1]
            let memByteTo = (resources.memory.total[2] === 'kB') ? (resources.memory.total[1] * 1024) : resources.memory.total[1]
            tr.push(
                <>
                    <h5>Resources</h5>
                    <hr />
                    {/* Memory */}
                    <CRow className="mt-4">
                        <CCol>
                            Memory
                        </CCol>
                        <CCol className="text-right">
                            {formatBytes(memByteAv)} Free
                        </CCol>
                    </CRow>
                    <CProgress className=" bg-white" style={{ height: '25px' }}>
                        <CProgressBar
                            showPercentage
                            value={memPercentage}
                            color="danger"

                        />
                        <CProgressBar
                            value={100 - memPercentage}
                            color="dark"
                        />
                    </CProgress>
                    <CRow>
                        <CCol>
                            {formatBytes((memByteTo - memByteAv))} Used
                        </CCol>
                        <CCol className="text-right">
                            {formatBytes(memByteTo)} Total
                        </CCol>
                    </CRow>
                    {/* Disk Space */}
                    <hr />
                    <CRow className="mt-4">
                        <CCol>
                            DIsk Space
                        </CCol>
                        <CCol className="text-right">
                            {resources.disk.available}  Free
                        </CCol>
                    </CRow>
                    <CProgress className=" bg-white" style={{ height: '25px' }}>
                        <CProgressBar
                            showPercentage
                            value={resources.disk.usage.replace('%', '')}
                            color="danger"
                        />
                        <CProgressBar
                            value={100 - resources.disk.usage.replace('%', '')}
                            color="dark"
                        />
                    </CProgress>
                    <CRow>
                        <CCol>
                            {resources.disk.used}  Used
                        </CCol>
                        <CCol className="text-right">
                            {resources.disk.total} Total
                        </CCol>
                    </CRow>
                    {/* CPU */}
                    <hr />
                    <CRow className="mt-4">
                        <CCol>
                            CPU
                       </CCol>
                    </CRow>
                    <CProgress className=" bg-white" style={{ height: '25px' }}>
                        <CProgressBar
                            showPercentage
                            value={resources.cpu}
                            color="danger"
                        />
                        <CProgressBar
                            value={100 - resources.cpu}
                            color="dark"
                        />
                    </CProgress>
                    <CRow className="">
                        <CCol className="text-right">
                            {selectedRows.vcpus} vCPU
                        </CCol>
                    </CRow>
                    <hr />
                </>)
        }
        return tr;
    }
    const renderCrons = () => {
        let tr = [];
        if (crons) {
            if (crons.hasOwnProperty('1')) {
                tr.push(<tr key={"cron"}>
                    {renderThs(crons[1])}
                </tr>)
            }
            for (const [index, data] of Object.entries(crons)) {
                tr.push(<tr key={"cron-" + index}>
                    {renderTds(data)}
                </tr>)
            }
        }
        return tr;
    }
    const renderThs = (data) => {
        let td = [];
        let i = 0;
        for (const [key, value] of Object.entries(data)) {
            td.push(
                <th>
                    {key}
                </th>
            )
        }
        return td;
    }
    const renderTds = (data) => {
        let td = [];
        for (const [key, value] of Object.entries(data)) {
            td.push(
                <td>
                    {value}
                </td>
            )
        }
        return td;
    }
    return (
        <>
            <CModal
                size="xl"
                centered
                key={modalInfo + "-info"}
                show={modalInfo}
                onClose={toggleInfo}>
                {
                    (selectedRows) ?
                        <>
                            <CModalHeader className="has-tab" closeButton>
                                <CTabs activeTab={nav}>
                                    <CNav variant="tabs">
                                        <CNavItem>
                                            <CNavLink onClick={() => setNav('resource')} data-tab="resource">
                                                Resources
                                             </CNavLink>
                                        </CNavItem>
                                        <CNavItem>
                                            <CNavLink onClick={() => setNav('cron')} data-tab="cron">
                                                Cron Jobs
                                             </CNavLink>
                                        </CNavItem>
                                    </CNav>
                                </CTabs>
                            </CModalHeader>
                            <CModalBody className="fixed-modal">
                                <CTabs activeTab={nav}>
                                    <CTabContent>
                                        <CTabPane data-tab="resource">
                                            <CRow>
                                                <CCol md="8">
                                                    {
                                                        (loadingResource) ?
                                                            <div className="p-4" style={{ textAlign: 'center' }}>
                                                                <CSpinner color="primary" />
                                                            </div>
                                                            :
                                                            <>
                                                                {renderResources()}
                                                            </>
                                                    }
                                                </CCol>
                                                <CCol md="4">
                                                    {
                                                        (loadingServices) ?
                                                            <div className="p-4" style={{ textAlign: 'center' }}>
                                                                <CSpinner color="primary" />
                                                            </div>
                                                            : <>
                                                                <h5>Services</h5>
                                                                <hr />
                                                                <table className="table">
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Status</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                    {renderServices()}
                                                                </table>
                                                            </>
                                                    }
                                                </CCol>
                                            </CRow>
                                        </CTabPane>
                                        <CTabPane data-tab="cron">
                                            {
                                                (loadingCrons) ?
                                                    <div className="p-4" style={{ textAlign: 'center' }}>
                                                        <CSpinner color="primary" />
                                                    </div> :
                                                    <>
                                                        <table className="table">
                                                            {renderCrons()}
                                                        </table>
                                                    </>

                                            }
                                        </CTabPane>
                                    </CTabContent>
                                </CTabs>
                            </CModalBody >
                        </>
                        : null
                }
            </CModal >
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader className="with-tab">
                            <CTabs activeTab="main">
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink active={(tab === 'main' ? true : false)} data-tab="users" onClick={() => setTabX('main')}>
                                            Droplets
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
                                items={(droplets) ? droplets.data : []}
                                fields={fields}
                                loading={loading}
                                noItemsViewSlot={
                                    <>
                                        <p className="text-center p-0 m-0">
                                            {(loading) ? '' :
                                                <>
                                                    {(droplets && droplets.length > 0) ? '' : 'No Data'}
                                                </>
                                            }
                                        </p>
                                    </>}
                                clickableRows
                                columnFilter
                                itemsPerPage={(droplets) ? droplets.per_page : 10}
                                hover
                                sorter
                                onPaginationChange={e => setRequest({ ...request, perPage: e })}
                                onSorterValueChange={e => setRequest({ ...request, sort: e })}
                                onColumnFilterChange={e => setRequest({ ...request, filter: e })}
                                onTableFilterChange={e => setRequest({ ...request, search: e })}
                                scopedSlots={{
                                    'username': (item) => (
                                        <td>
                                            {
                                                <Link to={"/dashboard/droplets/users/" + item.user_id + "/servers"} class="">{item['username']}</Link>
                                            }
                                        </td>
                                    ),
                                    'ip_address': (item) => (
                                        <td>
                                            {
                                                (canViewApps && item.applications_count > 0) ? <Link to={"/dashboard/droplets/users/" + item.user_id + "/servers/" + item.id + "/applications"} class="">{item['ip_address']}</Link> : item.ip_address
                                            }
                                        </td>
                                    ),
                                    'price_monthly': (item) => (
                                        <td>
                                            ${item.price_monthly}
                                        </td>
                                    ),
                                    'price_hourly': (item) => (
                                        <td>
                                            ${item.price_hourly}
                                        </td>
                                    ),
                                    'disk': (item) => (
                                        <td>
                                            {item.disk} GB
                                        </td>
                                    ),
                                    'applications_count': (item) => (
                                        <td>
                                            {item.applications_count}
                                        </td>
                                    ),
                                    'created_at': (item) => (
                                        <td>
                                            {new Date(item.created_at).toDateString()}
                                        </td>
                                    ),
                                    'action': (item) => (
                                        <td>
                                            {(tab === 'main') ?
                                                <>
                                                    <CButton onClick={() => toggleInfo(item)} size="sm" color="primary">
                                                        <CIcon content={cilCog} />
                                                    </CButton>
                                                </>
                                                : null}
                                        </td>
                                    )
                                }}
                            />
                            {
                                (droplets && droplets.last_page !== 1) ?
                                    <CPagination
                                        className="p-4"
                                        key='p1'
                                        activePage={request.page}
                                        pages={droplets.last_page}
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

export default withRouter(Droplets)
