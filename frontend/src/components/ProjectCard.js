import React, { Component } from 'react'
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';
import { bake_cookie, delete_cookie } from 'sfcookies';
import { Modal, Button, Alert } from 'react-bootstrap';

class ProjectCard extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            dropdownOpen: false,
            loading: false,
            error: "",
            success: "",
            sending: true,
            message: null,
            codeSent: false,
            servers: props.servers,
            code: null,
        }
        this.project = props.data;
        this.apiHandler = new ApiHandler();
    }
    toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))

    showError(data) {
        // console.log(data)
    }
    deleteProject = () => {
        this.setState({ loading: SVGComponentTransferFunctionElement })

        this.apiHandler.deleteProject(this.project.id, this.state.code, (msg, data) => {
            this.setState({ error: "", success: msg, loading: false })
            delete_cookie('projectId')
            delete_cookie('projectName')
            window.location.reload()
        }, (error) => {
            this.setState({ error: error, success: "", loading: false })
        })
    }
    sendVerificationCode = () => {
        this.setState({ sending: true, code: "", error: '', success: '' })
        this.apiHandler.sendVerificationCode(this.project.id, 'project', (message, data) => {
            this.setState({
                sending: false,
                message: message,
                codeSent: true
            })
        }, (error) => { });
    }
    setProject = (data, to) => {
        console.log('project set')
        bake_cookie('projectId', data.uuid)
        bake_cookie('projectName', data.name)
        window.location.href = '/' + to
    }
    handleModalClose = () => {
        this.setState({
            loading: false,
            showModal: false,
        })
        this.setShow()
    }
    handleModalShow = () => {
        this.setState({
            showModal: true,
            sending: true
        })
        this.sendVerificationCode();
    }
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.deleteHandle();
        }
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        return (
            <>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-3">
                    <div className="card ">
                        <div className="card-header cursor-pointer" onClick={() => this.props.projectClickHandler(this.project)}>
                            <div className="row no-gutters">
                                <div className="col-2 p-1 align-self-center pl-0">
                                    <i className="fa fa-desktop fa-2x"></i>
                                </div>
                                <div className="col-8 p-2 align-self-center">
                                    <h6 className="heading">{this.project.name}</h6>
                                    <p className="sub-heading">
                                        Created: {new Date(this.project.created_at).toDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="card-body server-details-list">
                            <div className="row">
                                <div className="col-2">
                                    <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                                </div>
                                <div className="col-8 cursor-pointer" onClick={() => this.setProject(this.project, 'servers')}>
                                    <p>{this.project.servers.length} Servers</p>
                                </div>
                                <div className="col-2">
                                    <button onClick={this.handleModalShow} className="btn btn-danger btn-sm">
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <img src={require("../assets/images/icons/server-user.svg")} alt="" srcSet="" />
                                </div>
                                <div className="col-10"><p>{this.project.delegate_users.length} Delegate Users</p></div>
                            </div>
                            <div className="row cursor-pointer" onClick={() => this.setProject(this.project, 'applications')}>
                                <div className="col-2">
                                    <img src={require("../assets/images/icons/server-apps.svg")} alt="" srcSet="" />
                                </div>
                                <div className="col-10"><p>{this.project.applications.length} Applications</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form>
                        <Modal.Header closeButton>
                            <Modal.Title><span className="text-danger">Delete {this.project.name}?</span></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                {this.state.error}
                            </Alert>
                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                {this.state.success}
                            </Alert>
                            <p className="m-0 p-0 text-muted">Are you sure, you want to delete this project?
                           All Servers and Applications will be deleted and it can't be restored.</p>
                            <div className="modal-form mt-4">
                                <label htmlFor="code">Verification Code</label>
                                <div className="input-group">
                                    <input onChange={this.dataChange} onKeyDown={this.onEnterPress} required type="text" className="form-control form-input-field" name="code" value={this.state.code} id="code" />
                                </div>
                            </div>
                            {
                                (!this.state.sending) ?
                                    <>
                                        <p className="text-small">{this.state.message} </p>
                                    </>
                                    :
                                    <div style={{ textAlign: 'center' }}>
                                        <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px" }} />
                                    </div>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.sendVerificationCode} variant="default" size="small" style={{ marginRight: "auto" }}>
                                Resend Code
                            </Button>
                            <Button variant="default" onClick={this.handleModalClose}>
                                GO BACK
                                      </Button>
                            <Button disabled={(this.state.codeSent && this.state.code) ? false : true} className="btn btn-theme" onClick={this.deleteProject}>
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
export default ProjectCard;