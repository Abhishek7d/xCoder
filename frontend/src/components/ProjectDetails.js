import React, { Component } from 'react'
import "../index.css"
import { Modal, Button, Alert } from 'react-bootstrap';
import ApiHandler from '../model/ApiHandler';
import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Link } from 'react-router-dom';
import { bake_cookie } from 'sfcookies';

class ProjectDetails extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.project = props.project;
        this.state = {
            loading: false,
            stop: false,
            showModal: false,
            showModal2: false,
            error: "",
            success: "",
            delegate_user_email: '',
            delegateAccess: props.project.delegate_users,
            servers: props.servers,
            selectedServers: null,
            applications: []
        }
        this.apiHandler = new ApiHandler();
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    componentDidMount = () => {
        this.getDelegateAccess()
        this.loadApplications()
    }
    getDelegateAccess = () => {
        this.apiHandler.getDelegateAccess(this.project.id, (msg, data) => {
            this.setState({
                delegateAccess: data,
                loading: false,
            })
        })
    }
    loadApplications(page = 1) {
        this.apiHandler.getApplications(this.project.uuid, 1, page, (msg, data) => {
            this.setState({ applications: data.data, loading: false })
        }, err => {
            this.showError(err);
        })
    }
    showError = (err) => {
        console.log(err)
    }
    renderServers = () => {
        let tr = [];

        if (this.project.servers.length < 1) {
            tr.push(
                <tr key="0">
                    <td className="text-center" colSpan="7">No Servers</td>
                </tr>
            )
        } else {
            this.project.servers.forEach((td, index) => {
                tr.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{td.name}</td>
                        <td>{td.ip_address}</td>
                        <td>{td.memory} MB</td>
                        <td>{td.disk} GB</td>
                        <td>{td.region}</td>
                        <td className='text-center'>
                            <button onClick={() => this.setProject(this.project, 'servers/' + td.uuid)} className="btn btn-theme btn-sm">
                                View
                            </button>
                        </td>

                    </tr>
                )
            });

        }
        return tr;
    }
    renderApps = () => {
        let tr = [];
        if (this.state.applications.length < 1) {
            tr.push(
                <tr key="0">
                    <td className="text-center" colSpan="6">No Applications</td>
                </tr>
            )
        } else {
            this.state.applications.forEach((td, index) => {
                tr.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{td.name}</td>
                        <td>{td.domain}</td>
                        <td>{(td.ssl_enabled === '1') ? 'Yes' : 'No'}</td>
                        <td>{JSON.parse(td.ftp_credentials).length}</td>
                        <td className='text-center'>
                            <button onClick={() => this.setProject(this.project, 'applications/' + td.uuid)} className="btn btn-theme btn-sm">
                                View
                            </button>
                        </td>
                    </tr>
                )
            });

        }
        return tr;
    }
    renderDelegateAccess = () => {
        let tr = [];
        if (this.state.delegateAccess.length < 1) {
            tr.push(
                <tr key="0">
                    <td className="text-center" colSpan="6">No Users Assigned</td>
                </tr>
            )
        } else {
            this.state.delegateAccess.forEach((td, index) => {
                tr.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{(td.details) ? td.details.email : td.email}</td>
                        <td className="text-capitalize">{td.status}</td>
                        <td>{new Date(td.created_at).toDateString()}</td>
                        <td>{td.ago}</td>
                        <td className='text-center'>
                            <div className="">
                                <button type="button" className="btn btn-link pt-0 pb-0 m-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-ellipsis-v"></i>
                                </button>
                                <div className="dropdown-menu">
                                    {(td.status !== 'pending' && td.status !== 'rejected') ?
                                        <>
                                            {(td.status === 'active') ?
                                                <button onClick={() => this.changeUserStatus(td.id, 'disabled')} type="button" className="dropdown-item">Disable User</button>
                                                :
                                                <button onClick={() => this.changeUserStatus(td.id, 'active')} type="button" className="dropdown-item">Activate User</button>
                                            }
                                        </>
                                        : ''}
                                    <button onClick={() => this.deleteDelegateAccess(td.id)} type="button" className="dropdown-item">Delete User</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                )
            });
        }
        return tr;
    }
    setProject = (data, to) => {
        console.log('project set')
        bake_cookie('projectId', data.uuid)
        bake_cookie('projectName', data.name)
        window.location.href = '/' + to
    }
    changeServerStatus = () => {
        this.setState({
            stop: !this.state.stop
        })
    }
    changeUserStatus = (id, status) => {
        const toastId = toast.success("Changing...", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: false,
        });
        this.apiHandler.changeDuStatus(id, status, (message, data) => {
            this.getDelegateAccess()
            toast.update(toastId, {
                render: message,
                autoClose: 3000,
                type: toast.TYPE.SUCCESS
            })
            // toast.success(message, {
            //     position: toast.POSITION.BOTTOM_LEFT
            // });
            //toast.dismiss(toastId.current);
        }, (error) => {
            toast.update(toastId, {
                render: error,
                autoClose: 3000,
                type: toast.TYPE.ERROR
            })
            // toast.error(error, {
            //     position: toast.POSITION.BOTTOM_LEFT
            // });
            // toast.dismiss(toastId.current);
        })
    }
    deleteDelegateAccess = (id) => {
        const toastId = toast.error("Deleting User...", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: false,
        });
        this.apiHandler.deleteDelegateAccess(id, (message, data) => {
            this.getDelegateAccess()
            toast.success(message, {
                position: toast.POSITION.BOTTOM_LEFT
            });
            toast.dismiss(toastId.current);

        }, (error) => {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_LEFT
            });
            toast.dismiss(toastId.current);

        })
    }
    handleModalShow2 = () => {
        this.setState({
            showModal2: true,
        })
    }
    handleModalClose2 = () => {
        this.setState({
            showModal2: false,
        })
    }
    renderServersSelect = () => {
        let select = [];
        this.state.servers.forEach((data, index) => {
            select.push(<option key={index} value={data.id}>{data.name}</option>)
        })
        return select;
    }
    selectChange = (event) => {
        let value = Array.from(event.target.selectedOptions, option => option.value);
        this.setState({ [event.target.name]: value })
    }
    handleModalClose = () => {
        this.setState({
            loading: false,
            showModal: false,
            delegate_user_email: ''
        })
        this.setShow()
    }
    handleModalShow = () => {
        this.setState({
            showModal: true
        })
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleAssignProject = () => {
        this.setState({
            loading: true,
        })
        this.apiHandler.assignServers(this.project.id, this.state.selectedServers, (message, data) => {
            this.setState({ error: "", success: message, loading: false })
            window.location.reload();
        }, (message) => {
            this.setState({ error: message, success: "", loading: false })
            console.log(message);
        })
    }
    addDelegateAccess = () => {
        if (this.state.delegate_user_email !== '') {
            this.setState({ loading: true })
            this.apiHandler.delegateAccess(this.state.delegate_user_email, this.project.id, (message, data) => {
                toast.success(message, {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                this.setState({ loading: false, showModal: false })
                this.getDelegateAccess();
            }, (error) => {
                this.setState({ loading: false, error: error, success: "", showModal: true })
            });
        }
    }
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.addDelegateAccess();
        }
    }
    render() {
        return (
            <><ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                transition={Flip}
                rtl={false}
                limit={1}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
                <Modal centered show={this.state.showModal2} onHide={this.handleModalClose2}>
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title>Assign Servers</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                {this.state.error}
                            </Alert>
                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                {this.state.success}
                            </Alert>
                            {
                                (this.state.servers.length > 0) ?
                                    <div className="modal-form">
                                        <label htmlFor="assignServers">Servers</label>
                                        <div className="input-group">
                                            <select onChange={this.selectChange} name="selectedServers" className="custom-select" size="1" multiple aria-label="multiple select">
                                                {this.renderServersSelect()}
                                            </select>
                                        </div>
                                    </div>
                                    :
                                    ''
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose2}>
                                CLOSE
                            </Button>
                            <Button className="btn btn-theme" onClick={this.handleAssignProject}>
                                {
                                    this.state.loading ?
                                        <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "Assign"
                                }
                            </Button>

                        </Modal.Footer>
                    </form>
                </Modal>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-10">
                                    <h6 className="heading">Servers</h6>
                                    <p className="sub-heading">All Servers</p>
                                </div>
                                <div className="col-2 text-right align-self-center cursor-pointer">
                                    {
                                        (this.state.servers.length > 0) ?
                                            <button onClick={this.handleModalShow2} className="btn btn-theme btn-square btn-35">
                                                <i className="fa fa-plus"></i>
                                            </button> :
                                            ''
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>IP</th>
                                        <th>RAM</th>
                                        <th>Disk Space</th>
                                        <th>Location</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderServers()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-10">
                                    <h6 className="heading">Applications</h6>
                                    <p className="sub-heading">All Applications</p>
                                </div>
                                <div className="col-2 text-right align-self-center cursor-pointer">
                                    {/* <svg className={(this.state.loading) ? "loading" : ""} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.537 17.567C14.7224 19.1393 12.401 20.0033 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 12.136 19.33 14.116 18.19 15.74L15 10H18C17.9998 8.15621 17.3628 6.36906 16.1967 4.94089C15.0305 3.51272 13.4069 2.53119 11.6003 2.16236C9.79381 1.79352 7.91533 2.06002 6.28268 2.91677C4.65002 3.77351 3.36342 5.16791 2.64052 6.86408C1.91762 8.56025 1.80281 10.4541 2.31549 12.2251C2.82818 13.9962 3.93689 15.5358 5.45408 16.5836C6.97127 17.6313 8.80379 18.1228 10.6416 17.9749C12.4795 17.827 14.2099 17.0488 15.54 15.772L16.537 17.567Z" fill="#3E3E3E" />
                                    </svg> */}
                                </div>
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Domain</th>
                                        <th>SSL</th>
                                        <th>FTP</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderApps()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-10">
                                    <h6 className="heading">Delegate Access</h6>
                                    <p className="sub-heading">Users have access to this server</p>
                                </div>
                                <div className="col-2 text-right align-self-center cursor-pointer">
                                    <button onClick={this.handleModalShow} className="btn btn-theme btn-square btn-35">
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Added On</th>
                                        <th>Last Active</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderDelegateAccess()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title>Add User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                {this.state.error}
                            </Alert>
                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                {this.state.success}
                            </Alert>
                            <div className="modal-form">
                                <label htmlFor="selectedDomain">Enter Email</label>
                                <div className="input-group">
                                    <input onKeyDown={this.onEnterPress} placeholder="Email Address" required type="text" className="form-control form-input-field" name="delegate_user_email" value={this.state.delegate_user_email} onChange={this.dataChange} id="delegate_user_email" />
                                    <div className="input-group-append">
                                        <div className="input-group-text theme">
                                            <i className="fa fa-user"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                                      </Button>
                            <Button className="btn btn-theme" onClick={this.addDelegateAccess}>
                                {
                                    this.state.loading ?
                                        <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "Give Access"
                                }
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>

        )
    }
}
export default ProjectDetails;