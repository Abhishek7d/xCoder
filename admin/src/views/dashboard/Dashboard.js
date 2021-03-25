import React from 'react'
import { useDispatch } from 'react-redux'
// import Api from '../../Api'
import { usePermission } from '../../reusable/Permissions';
import {
    // CBadge,
    // CButton,
    // CButtonGroup,
    // CCard,
    // CCardBody,
    // CCardFooter,
    // CCardHeader,
    CCol,
    // CProgress,
    CRow,
    // CCallout,
    CWidgetIcon
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFolder } from '@coreui/icons'

const Dashboard = (props) => {
    const can = usePermission
    const dispatch = useDispatch()
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
                <CCol>
                    permission {can('access-admin-panel')}
                    <button onClick={() => { dispatch({ type: "set", userPermissions: [] }) }}>C</button>
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