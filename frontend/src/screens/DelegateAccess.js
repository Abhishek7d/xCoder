import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import PageHeader from '../components/template/PageHeader';
//import Pagination from '../components/template/Pagination';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Button, Alert } from 'react-bootstrap';
import Loader from '../components/template/Loader';

class DelegateAccess extends React.Component {
    constructor(props) {
        super()
        this.state = {
            loading: true,
            delegateAccess: []
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.getDelegateAccess()
    }
    getDelegateAccess = () => {
        this.apiHandler.getDelegateAccount((msg, data) => {
            this.setState({
                delegateAccess: data,
                loading: false
            })
        })
    }
    renderDelegateAccess = () => {
        let tr = [];
        if (this.state.delegateAccess.length < 1) {
            tr.push(
                <tr key="0">
                    <td className="text-center" colSpan="6">No Projects Assigned</td>
                </tr>
            )
        } else {
            this.state.delegateAccess.forEach((td, index) => {
                tr.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{(td.project) ? td.project.name : ''}</td>
                        <td className="text-capitalize">{td.status}</td>
                        <td>{new Date(td.created_at).toDateString()}</td>
                        <td>{td.ago}</td>
                        <td className='text-center'>
                            {(td.status === 'pending') ?
                                <>
                                    <button onClick={() => this.changeDaStatus(td.id, 'active')} type="button" className="btn btn-theme btn-sm">Accespt</button>
                                </>
                                : ''}
                        </td>
                    </tr>
                )
            });
        }
        return tr;
    }
    changeDaStatus = (id, status) => {
        this.apiHandler.changeDuStatus(id, status, (message, data) => {
            this.getDelegateAccess()
            toast.success(message, {
                position: toast.POSITION.BOTTOM_LEFT
            });
            window.location.reload()
        }, (error) => {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_LEFT
            });
        })
    }
    render() {
        return (
            <><ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
                <div className="container-fluid p-0">
                    <Navigation name="Delegate Access" />
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="section-container">
                            <PageHeader
                                heading="Delegate Access" subHeading="All Access">
                            </PageHeader>
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="row">
                                                    <div className="col-10">
                                                        <h6 className="heading">Delegate Access</h6>
                                                        <p className="sub-heading">Users have access to this server</p>
                                                    </div>
                                                    {/* <div className="col-2 text-right align-self-center cursor-pointer">
                                                        <button onClick={this.handleModalShow} className="btn btn-theme btn-square btn-35">
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Project</th>
                                                            <th>Status</th>
                                                            <th>Invited on</th>
                                                            <th>Last Active</th>
                                                            <th className="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(this.state.loading) ?
                                                            <tr>
                                                                <td colSpan="6" className="text-center">
                                                                    <Loader type="card" />
                                                                </td>
                                                            </tr>
                                                            :
                                                            this.renderDelegateAccess()
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </>
        )
    }
}
export default DelegateAccess;
