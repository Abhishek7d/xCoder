import React from 'react'
// import { useDispatch } from 'react-redux'
// import Api from '../../Api'
// import { usePermission } from '../../reusable/Permissions';
import {
    // CBadge,
    // CButton,
    // CButton,
    // CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CDataTable,
    // CInput,
    // CProgress,
    CRow,
    // CCallout,
    CWidgetIcon
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFolder } from '@coreui/icons'

const usersData = [
    { id: 0, name: 'John Doe', registered: '2018/01/01', droplets: '1', applications: '3' },
    { id: 1, name: 'Samppa Nori', registered: '2018/01/01', droplets: '1', applications: '2' },
    { id: 2, name: 'Estavan Lykos', registered: '2018/02/01', droplets: '0', applications: '0' },
    { id: 3, name: 'Chetan Mohamed', registered: '2018/02/01', droplets: '1', applications: '2' },
    { id: 4, name: 'Derick Maximinus', registered: '2018/03/01', droplets: '2', applications: '2' },
    { id: 5, name: 'Friderik Dávid', registered: '2018/01/21', droplets: '0', applications: '0' },
    { id: 6, name: 'Yiorgos Avraamu', registered: '2018/01/01', droplets: '1', applications: '8' },
    { id: 7, name: 'Avram Tarasios', registered: '2018/02/01', droplets: '2', applications: '6' },
    { id: 8, name: 'Quintin Ed', registered: '2018/02/01', droplets: '0', applications: '0' },
    { id: 9, name: 'Enéas Kwadwo', registered: '2018/03/01', droplets: '0', applications: '0' },
    { id: 10, name: 'Agapetus Tadeáš', registered: '2018/01/21', droplets: '1', applications: '0' },
]

const fields = ['id', 'name', 'droplets', 'applications', 'registered', 'action']
// const fields2 = ['name', 'registered', 'domain', 'status']
const Dashboard = (props) => {
    // const can = usePermission
    // const dispatch = useDispatch()
    // const show = useSelector(state => state.userPermissions)
    //   const show2 = useSelector(state => state.userRole)

    return (
        <>
            <CRow>
                <CCol xs='12' sm='4' md='4' lg="4">
                    <CWidgetIcon className="widget-custom" text="projects" header="100,000" color="primary">
                        <CIcon content={cilFolder} size={'xl'} />

                    </CWidgetIcon>
                </CCol>
                <CCol xs='12' sm='4' md='4' lg="4">
                    <CWidgetIcon className="widget-custom" text="droplets" header="150,000" color="info">
                        <CIcon name={'cilSettings'} size={'xl'} />
                    </CWidgetIcon>
                </CCol>
                <CCol xs='12' sm='4' md='4' lg="4">
                    <CWidgetIcon className="widget-custom" text="income" header="$154,4514,45" color="success">
                        <CIcon name={'cilSettings'} size={'xl'} />
                    </CWidgetIcon>
                </CCol>
            </CRow>
            <CRow>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader>
                            New Users - Demo Data
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
                            />
                        </CCardBody>
                        <CCardFooter>
                            hi
                        </CCardFooter>
                    </CCard>
                </CCol>
                <CCol xs='12' sm='12' md='12' lg="12">
                    <CCard>
                        <CCardHeader>
                            New Droplets
                        </CCardHeader>
                        <CCardBody className="p-0">
                            <CDataTable
                                items={usersData}
                                fields={fields}
                                itemsPerPage={5}
                                pagination={false}
                                scopedSlots={{
                                    'action':
                                        (item) => (
                                            <td>
                                                a
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
// const mapStateToProps = state => ({
//     //blabla: state.authToken,
// });

// const mapDispatchToProps = dispatch => ({
//     // fnBlaBla: () => dispatch(action.name()),
// });

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(Dashboard);

export default Dashboard