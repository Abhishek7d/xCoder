import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';

import {
    CBadge,
    //   CButton,
    //   CButtonGroup,
    CCard,
    CCardBody,
    //   CCardFooter,
    CCardHeader,
    CDataTable,
    CCol,
    //   CProgress,
    CRow,
    //   CCallout
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import usersData from '../users/UsersData'

const getBadge = status => {
    switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: return 'primary'
    }
}
const fields = ['name', 'registered', 'role', 'status']
const Users = (props) => {

    // const dispatch = useDispatch()

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
                                items={usersData}
                                fields={fields}
                                columnFilter
                                tableFilter
                                footer
                                itemsPerPageSelect
                                itemsPerPage={5}
                                hover
                                sorter
                                pagination={false}
                                scopedSlots={{
                                    'status':
                                        (item) => (
                                            <td>
                                                <CBadge color={getBadge(item.status)}>
                                                    {item.status}
                                                </CBadge>
                                            </td>
                                        )

                                }}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Users
