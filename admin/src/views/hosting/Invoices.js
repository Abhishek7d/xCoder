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
    CAlert,
    CFormGroup,
    CLabel,
    CInput,
    CForm,
    CLink,
    CCollapse
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilArrowThickBottom, cilArrowThickTop, cilCog, cilFolder, cilFolderOpen, } from '@coreui/icons'
import { usePermission } from 'src/reusable/Permissions';
import { Link, withRouter } from 'react-router-dom';
import { subtract } from 'lodash';

// const selectedRows = [];
const Invoices = (props) => {
    const canViewInvoices = usePermission("droplets.invoices.view")

    // const dispatch = useDispatch()
    // States
    const [loading, isLoading] = useState(false)
    const [projects, setProjects] = useState(null)
    const [selectedRows, setSelectedRow] = useState([])
    const [tab, setTab] = useState('main');
    const [modalInfo, setModalInfo] = useState(false);
    const [formLoading, setFormLoading] = useState({
        form: null,
        loading: false,
    })
    const [request, setRequest] = useState({
        sort: { column: 'invoices.id', asc: false },
        search: null,
        filter: null,
        page: 1,
        perPage: 15,
        raw: true
    });
    const [alert, showAlert] = useState({
        show: false,
        text: null,
        type: 'info'
    });
    const [form, setForm] = useState({
        id: null,
        price_monthly: null,
        price_hourly: '',
        raw: true
    })
    const [details, setDetails] = useState([])
    // const [items, setItems] = useState(usersData)

    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...details, index]
        }
        setDetails(newDetails)
    }
    const fields = [
        {
            key: 'invoices.id',
            label: 'ID',
            _style: { width: '8%' },

        },
        {
            key: 'project',
            label: 'Project',
        },
        {
            key: 'month_year',
            label: 'Month',
        },
        {
            key: 'username',
            label: 'User',
        },
        {
            key: 'amount',
            label: 'Total',
        },
        {
            key: 'status',
            label: 'Total',
        },
        {
            key: 'created_at',
            label: 'Generated',
        },
        // {
        //     key: 'action',
        //     _style: { width: '1%' },
        //     sorter: false,
        //     filter: false
        // },
    ]

    // Load User data
    const getUsersData = () => {
        isLoading(true)
        new Api().get("POST", "/invoices?page=" + request.page, request, true, (data, msg) => {
            console.log(data)
            isLoading(false)
            setProjects(data)
            setSelectedRow([])
        }, (error) => {
            console.log(error)
        })
    }

    const toggleInfo = (row = null) => {
        if (row) {
            setSelectedRow(row)
            setForm({ id: row.id, price_hourly: row.parvaty_price_hourly, price_monthly: row.parvaty_price_monthly })
        } else {
            setSelectedRow(null)
            setForm({ id: null, price_hourly: null, price_monthly: null })
        }
        setModalInfo(!modalInfo);
        dismissAlert()
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


    const dismissAlert = (s = false) => {
        showAlert({ ...alert, show: s, })
    }

    // Set Input
    const setInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // save price
    const savePrice = (event) => {
        event.preventDefault();
        setFormLoading({ form: 'save-price', loading: true })
        new Api().get('POST', '/save-price', form, true, (data, msg) => {
            setFormLoading({ form: 'save-price', loading: false })
            showAlert({ show: true, text: msg, type: 'success' })
            getUsersData()
        }, (error) => {
            setFormLoading({ form: 'save-price', loading: false })
            showAlert({ show: true, text: error, type: 'danger' })
        })
    }
    const pad = (num, size) => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
    const renderSubTable = (items) => {
        let tr = [];
        if (items.length > 0) {
            items.forEach((data, index) => {
                tr.push(<tr key={index}>
                    <td>{data.item}</td>
                    {/* <td className="text-center text-capitalize">{data.cost_type}</td> */}
                    {(data.cost_type === "monthly") ?
                        <td className="text-left">{pad(data.days, 2)} Days</td> :
                        <td className="text-left" title={data.hours + " Hours"}>{data.hours} Hours</td>
                    }
                    <td title={data.cost_type + " rate"}>${data.description + " " + data.cost_type}</td>
                    <td title={"Billed " + data.cost_type}>${data.total}</td>
                </tr>)
            })
        }
        return tr;
    }
    return (
        <>
            <CModal
                size="sm"
                centered
                key={modalInfo + "-info"}
                show={modalInfo}
                onClose={toggleInfo}>
                {
                    (selectedRows) ?
                        <>
                            <CModalHeader closeButton>
                                Change Prices
                            </CModalHeader>
                            <CModalBody className="">
                                <CAlert color={alert.type} show={alert.show} onShowChange={dismissAlert} closeButton>
                                    {alert.text}
                                </CAlert>
                                <CForm onSubmit={savePrice}>
                                    <CFormGroup>
                                        <CLabel>Price Monthly</CLabel>
                                        <CInput defaultValue={selectedRows.parvaty_price_monthly} onChange={setInput} type="text" name="price_monthly" placeholder="Price Monthly" />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel>Price Hourly</CLabel>
                                        <CInput defaultValue={selectedRows.parvaty_price_hourly} onChange={setInput} type="text" name="price_hourly" placeholder="Price Hourly" />
                                    </CFormGroup>
                                    <CButton type="submit" block color="primary">
                                        {
                                            (formLoading.form === 'save-price' && formLoading.loading) ?
                                                <CSpinner className="mt-1" color="light" size="sm" />
                                                : 'Save'
                                        }
                                    </CButton>
                                </CForm>
                            </CModalBody>
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
                                        <CNavLink active={(tab === 'main' ? true : false)} data-tab="users" onClick={() => setTabX('main')}>
                                            Sizes
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
                                sorter
                                onPaginationChange={e => setRequest({ ...request, perPage: e })}
                                onSorterValueChange={e => setRequest({ ...request, sort: e })}
                                onColumnFilterChange={e => setRequest({ ...request, filter: e })}
                                onTableFilterChange={e => setRequest({ ...request, search: e })}
                                onRowClick={(e, index) => toggleDetails(index)}
                                scopedSlots={{
                                    // 'uuid': (item) => (
                                    //     <td>
                                    //         <CLink>
                                    //             {item.uuid}
                                    //         </CLink>
                                    //     </td>
                                    // ),
                                    'price_hourly': (item) => (
                                        <td>
                                            ${item.price_hourly}
                                        </td>
                                    ),
                                    'parvaty_price_monthly': (item) => (
                                        <td>
                                            ${item.parvaty_price_monthly}
                                        </td>
                                    ),
                                    'parvaty_price_hourly': (item) => (
                                        <td>
                                            ${item.parvaty_price_hourly}
                                        </td>
                                    ),
                                    'created_at': (item) => (
                                        <td>
                                            {new Date(item.created_at).toDateString()}
                                        </td>
                                    ),
                                    'action':
                                        (item, index) => {
                                            return (
                                                <td key={(details.includes(index)) ? index + '0' : index + '1'}>
                                                    <CButton onClick={() => toggleInfo(item)} size="sm" color="primary">
                                                        <CIcon content={cilCog} />
                                                    </CButton>
                                                </td>
                                            )
                                        },
                                    'details':
                                        (item, index) => {
                                            return (
                                                <CCollapse show={details.includes(index)}>
                                                    <CCardBody>
                                                        <p>UUID: <b>{item.uuid}</b></p>

                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Item</th>
                                                                    <th>Usage</th>
                                                                    <th>Unit Price</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renderSubTable(item.items)}
                                                            </tbody>
                                                        </table>
                                                    </CCardBody>
                                                </CCollapse>
                                            )
                                        }
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

export default withRouter(Invoices)
