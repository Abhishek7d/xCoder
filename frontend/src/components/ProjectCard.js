import React, { Component } from 'react'
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';
import { bake_cookie } from 'sfcookies';
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
        }
        this.project = props.data;
        this.apiHandler = new ApiHandler();
    }
    toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))


    // deleteHandle = () => {
    //     if (this.state.loadding) {
    //         return;
    //     }
    //     this.setState({ error: "", success: "", loadding: true })
    //     this.apiHandler.deleteProject(this.state.id, "destroy", (message, data) => {
    //         this.setState({ error: "", success: message, loadding: false })
    //         window.location.href = "/projects"
    //     }, (message) => {
    //         this.setState({ error: message, success: "", loadding: false })
    //     });
    // }
    showError(data) {
        // console.log(data)
    }
    deleteProject = () => {
        this.apiHandler.deleteProject(this.project.id, (msg, data) => {
            window.location.reload()
        }, (error) => {
            this.setState({ error: error, success: "", })
        })
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
            showModal: true
        })
    }
    setShow() {
        this.setState({ error: "", success: "", })
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
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title><span className="text-danger">Delete Project?</span></Modal.Title>
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose}>
                                GO BACK
                                      </Button>
                            <Button className="btn btn-theme" onClick={this.deleteProject}>
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