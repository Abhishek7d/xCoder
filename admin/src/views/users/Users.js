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
    CButtonGroup,
    CInputCheckbox,
} from '@coreui/react'

import Api from '../../Api';
import CIcon from '@coreui/icons-react';
import { cilUserPlus, cilTrash, cilLockLocked } from '@coreui/icons'
import { removeElem } from 'src/reusable/Helper';
import { hasElem } from '../../reusable/Helper';
// const selectedRows = [];
const Users = (props) => {
    // const dispatch = useDispatch()

    const [loading, isLoading] = useState(false)
    const [users, setUsers] = useState(null)
    const [selectedRows, setSelectedItems] = useState([0])
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
            label: <CInputCheckbox onChange={e => selectAll(e)} className="ml-0" />,
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
    const addToSelectedList = (event, id) => {
        if (event.target.checked) {
            let array = addOrRemoveItem(selectedRows, id)
            setSelectedItems({ ...selectedRows, array });
            console.log(selectedRows)
        } else {
            let array = addOrRemoveItem(selectedRows, id)
            setSelectedItems({ ...selectedRows, array });
            console.log(selectedRows)
        }
    }

    const addOrRemoveItem = (array, item) => {
        let arr = Array.from(item)
        if (array.find(i => i === item)) {
            array = removeElem(array, item)
        } else {
            array.push(...arr)
        }
        return array
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

    return (
        <>
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader>
                            Admin Users
                        </CCardHeader>
                        <CCardBody className="p-0 has-table">
                            <CRow className="mt-1">
                                <CCol md="12">
                                    <CButtonGroup>
                                        <CButton disabled={isSelected()} size="sm" color="danger">
                                            <CIcon content={cilTrash} />
                                        </CButton>
                                        <CButton disabled={isSelected()} size="sm" color="info">
                                            <CIcon content={cilLockLocked} />
                                        </CButton>
                                        <CButton size="sm" color="success">
                                            <CIcon content={cilUserPlus} />
                                        </CButton>
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
                                        <td >
                                            <CInputCheckbox key={item.id} checked={hasElem(selectedRows, item.id)}
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
                                                <CButton color="primary" size="sm">
                                                    Edit
                                                </CButton>
                                                <CButton className="ml-2" color="danger" size="sm">
                                                    Delete
                                                </CButton>
                                                <CButton className="ml-2" color="info" size="sm">
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
