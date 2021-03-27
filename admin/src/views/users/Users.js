import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';

import {
    CPagination,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
    CCol,
    CRow,
    CButton,
    CInputCheckbox,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import Api from '../../Api';

const Users = (props) => {
    // const dispatch = useDispatch()
    const [loading, isLoading] = useState(false)
    const [users, setUsers] = useState(null)
    const [page, setPage] = useState(1)
    const [request, setRequest] = useState({
        sort: null,
        search: null,
        filter: null,
        page: 1,
        perPage: 10,
        raw: true
    });
    const fields = [
        {
            key: 'check_box',
            label: <CInputCheckbox className="ml-0" />,
            _style: { width: '1%' },
            sorter: false,
            filter: false
        },
        {
            key: 'id',
            _style: { width: '5%' },
        },
        'name',
        'email',
        'created_at', {
            key: 'action',
            _style: { width: '20%' },
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
    const makeCheckbox = () => {

    }

    useEffect(() => {
        getUsersData()
    }, [request])

    return (
        <>
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader>
                            Admin Users
                        </CCardHeader>
                        <CCardBody className="p-0 has-table">
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
                                tableFilter
                                itemsPerPageSelect={{ 2: 2 }}
                                itemsPerPage={(users) ? users.per_page : 10}
                                hover
                                sorter
                                onPaginationChange={e => setRequest({ ...request, perPage: e })}
                                onSorterValueChange={e => setRequest({ ...request, sort: e })}
                                onColumnFilterChange={e => setRequest({ ...request, filter: e })}
                                onTableFilterChange={e => setRequest({ ...request, search: e })}
                                onRowClick={e => console.log(e)}
                                scopedSlots={{
                                    'check_box': (item) => (
                                        <td >
                                            <CInputCheckbox className="ml-0" />
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
                                                <CButton color="primary" size="sm">
                                                    Edit
                                                </CButton>
                                                <CButton color="danger" size="sm">
                                                    Delete
                                                </CButton>
                                                <CButton color="info" size="sm">
                                                    Details
                                                </CButton>
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
