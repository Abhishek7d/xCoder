import React from 'react'
import ApiHandler from '../model/ApiHandler';
import Status from '../components/Status';
import { Modal, Button, Alert } from 'react-bootstrap';

class ApplicationCard extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.application = props.application;
        this.state = {
            created_at: props.application.created_at,
            id: props.application.id,
            name: props.application.name,
            domain: props.application.domain,
            server_id: props.application.server_id,
            status: props.application.status,
            username: props.application.username,
            password: props.application.password,
            db_name: props.application.db_name,
            db_username: props.application.db_username,
            db_password: props.application.db_password,
            ssl_enabled: props.application.ssl_enabled,
            server: (props.application.server) ? props.application.server : '',
            loading: false,
            error: "",
            success: "",
            dropdownOpen: false,
            isApplicationClicked: false,
            code: ""
        }
        this.apiHandler = new ApiHandler();
    }
    deleteHandle = () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ error: "", success: "", loading: true })
        this.apiHandler.deleteApplication(this.state.id, (message, data) => {
            this.setState({ error: "", success: message, loading: false })
            window.location.href = "/applications";
        }, (message) => {
            this.setState({ error: message, success: "", loading: false })
            console.log(message);
        });
    }
    handleModalClose = () => {
        this.setState({
            code: '',
            showModal: false,
        })
    }
    handleModalShow = () => {
        this.setState({
            showModal: true,
        })
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        return (
            <>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-3">
                    <div className="card">
                        <div className="card-header cursor-pointer" onClick={() => this.props.applicationClickHandler(this.props.application)}>
                            <div className="row no-gutters">
                                <div className="col-2 p-1 align-self-center pl-0">
                                    <img alt="wordpress" style={{ width: "100%" }} src={require("../assets/images/wordpress.png")} />
                                </div>
                                <div className="col-8 p-2 align-self-center">
                                    <h6 className="heading">{this.state.name}</h6>
                                    <p className="sub-heading">
                                        Created: {new Date(this.state.created_at).toDateString()}
                                    </p>
                                </div>
                                <div className="col-2 align-self-center text-right">
                                    <Status status={this.state.status} />
                                </div>
                            </div>
                        </div>
                        <div className="card-body server-details-list">
                            <div className="row">
                                <div className="col-2">
                                    <img src={require("../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                                </div>
                                <div className="col-8"><p>{this.state.domain}</p></div>
                                <div className="col-2 p-0">
                                    <button className="btn btn-danger btn-sm" onClick={this.handleModalShow}>
                                        {this.state.loading ?
                                            <svg className="loading" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.537 17.567C14.7224 19.1393 12.401 20.0033 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 12.136 19.33 14.116 18.19 15.74L15 10H18C17.9998 8.15621 17.3628 6.36906 16.1967 4.94089C15.0305 3.51272 13.4069 2.53119 11.6003 2.16236C9.79381 1.79352 7.91533 2.06002 6.28268 2.91677C4.65002 3.77351 3.36342 5.16791 2.64052 6.86408C1.91762 8.56025 1.80281 10.4541 2.31549 12.2251C2.82818 13.9962 3.93689 15.5358 5.45408 16.5836C6.97127 17.6313 8.80379 18.1228 10.6416 17.9749C12.4795 17.827 14.2099 17.0488 15.54 15.772L16.537 17.567Z" fill="white" />
                                            </svg>
                                            :
                                            <i className="fa fa-trash"></i>
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                                </div>
                                <div className="col-10"><p>{this.state.server.name}</p></div>
                            </div>
                            <div className="text-center mt-4">
                                <a href={((this.state.ssl_enabled === "1") ? "https://" : "http://") + this.state.domain} target="_blank" type="button" rel="noopener noreferrer" className="btn btn-theme btn-sm">
                                    Visit Application
                            </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title><span className="text-danger">Delete {this.application.name}?</span></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                {this.state.error}
                            </Alert>
                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                {this.state.success}
                            </Alert>
                            <p className="m-0 p-0 text-muted">Are you sure, you want to delete this application?
                           All files will be deleted and it can't be restored.</p>
                            <div className="modal-form mt-4">
                                <label htmlFor="code">Enter Application name.</label>
                                <div className="input-group">
                                    <input placeholder={this.application.name} onChange={this.dataChange} onKeyDown={this.onEnterPress} required type="text" className="form-control form-input-field" name="code" value={this.state.code} id="code" />
                                </div>
                            </div>
                            <p></p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose}>
                                GO BACK
                                      </Button>
                            <Button disabled={(this.state.code === this.application.name) ? false : true} className="btn btn-theme" onClick={this.deleteProject}>
                                {
                                    this.state.loading ?
                                        <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "Yes, Delete"
                                }
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        )
    }
}
export default ApplicationCard;
