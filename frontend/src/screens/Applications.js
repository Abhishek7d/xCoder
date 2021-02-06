import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import ApplicationCard from '../screens/ApplicationCard';
import { Modal, Button, Alert } from 'react-bootstrap';
import ApplicationDetails from '../components/ApplicationDetails';
import "../index.css";
import { withRouter, Redirect } from 'react-router';
import { browserHistory } from 'react-router'
import PageHeader from '../components/template/PageHeader';
import Status from '../components/Status';

class Applications extends React.Component {
    constructor(props) {
        super();
        let serverId = new URLSearchParams(props.location.search).get("serverId");
        let appId = props.match.params.appId;
        this.state = {
            applications: [],
            showModal: false,
            loadding: false,
            servers: [],
            error: "",
            success: "",
            rspmsg: "",
            selectedServerId: serverId,
            selectedDomain: "",
            isWordpress: true,
            isApplicationClicked: false,
            selectedApplication: null,
            selectedServerFilter: serverId,
            selectedApplicationFilter: appId,
            appLoadding: true
        }
        this.apiHandler = new ApiHandler();
    }
    showError(err) {
        this.setState({ error: err })

    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    componentDidMount() {
        document.title = "Your Applications";
        this.loadApplications();
        this.apiHandler.getServers((msg, data) => {
            this.setState({ servers: data })
        }, err => {
            this.showError(err);
        })
    }
    setMessage(message) {
        this.setState({ rspmsg: message })
    }
    loadApplications() {
        this.setState({ appLoadding: true });
        this.apiHandler.getApplications((msg, data) => {
            data.forEach((app, index) => {
                if (app.id === parseInt(this.state.selectedApplicationFilter)) {
                    this.setState({ selectedApplication: app });
                }
            })
            this.setState({ applications: data, appLoadding: false })
        }, err => {
            this.showError(err);
        })
    }
    refreshApplications = () => {
        this.setState({ selectedApplication: null, selectedServerFilter: "" })
        this.loadApplications();
    }
    renderServers() {
        let servers = [];
        this.state.servers.forEach((data, index) => {
            if (data.status === "READY") {
                servers.push(<option key={index} value={data.id}>{data.name}</option>);
            }
        })
        return servers;
    }
    renderApplicationsfilter = () => {
        if (this.state.selectedServerFilter !== "") {
            let applications = [];
            this.state.servers.forEach((data) => {
                if (data.id === parseInt(this.state.selectedServerFilter)) {
                    data.applications.forEach((application, index) => {
                        applications.push(<option key={index} value={application.id}>{application.domain}</option>)
                    })
                }
            })
            return applications;
        }
    }
    renderApplications() {
        if (this.state.appLoadding) {
            return <div style={{ width: "100%", paddingLeft: "40%" }}>
                <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
            </div>
        }
        if (this.state.selectedApplication) {
            window.history.replaceState(null, null, "/applications/" + this.state.selectedApplication.id)
            return (<ApplicationDetails setMessage={this.setMessage} id={this.state.selectedApplication.id} key={this.state.selectedApplication.id} loadApplications={this.refreshApplications} applicationClickHandler={this.applicationClickHandler} application={this.state.selectedApplication} />)
        }
        let applications = [];
        if (this.state.selectedServerFilter === "" || this.state.selectedServerFilter === null) {
            this.state.applications.forEach((data, index) => {
                applications.push(<ApplicationCard appsReload={this.loadApplications} key={index} application={data} applicationClickHandler={this.applicationClickHandler} />);
            })
        } else {
            this.state.applications.forEach((data, index) => {
                if (data.server.id === parseInt(this.state.selectedServerFilter)) {
                    applications.push(<ApplicationCard appsReload={this.loadApplications} key={index} application={data} applicationClickHandler={this.applicationClickHandler} />);
                }
            })
        }

        if (applications.length < 1) {
            applications = <p style={{ textAlign: "center", marginTop: "20px", color: "#949292" }}>No Application Created</p>
        }
        return applications;
    }
    handleModalShow = () => {
        this.setState({
            showModal: true,
        })
    }
    handleModalClose = () => {
        this.setState({
            showModal: false,
        })
    }
    handleAddApplication = () => {
        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.createApplication(this.state.selectedServerId, this.state.selectedDomain, this.state.isWordpress, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            this.loadApplications();
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }
    dataChange = (event) => {
        if (event.target.type === 'checkbox') {
            this.setState({ [event.target.name]: event.target.checked })
        }
        else {

            this.setState({ [event.target.name]: event.target.value })
        }
    }
    updateSelectedAplication = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        if (!event.target.value) {
            this.setState({ selectedApplication: null })
        } else {
            let selectedApplication = event.target.value;
            this.state.applications.forEach(data => {
                if (data.id === parseInt(selectedApplication)) {
                    this.setState({ selectedApplication: data })
                }
            })
        }
    }
    updateSelectedServer = (event) => {
        this.setState({ selectedApplication: null, selectedApplicationFilter: "", [event.target.name]: event.target.value })
    }
    applicationClickHandler = (application = null) => {
        if (!application) {
            this.setState({ selectedApplicationFilter: "" })
            window.history.replaceState(null, null, "/applications")
        }
        this.setState({ selectedApplication: application })
    }

    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation />
                <Sidebar />
                <div className="content-wrapper">
                    <div className="section-container">
                        {
                            (!this.state.selectedApplication) ?
                                <PageHeader
                                    heading="My Applications" subHeading={this.state.applications.length + " Applicatinos"}>
                                    <div className="row">
                                        <div className="col-sm-4 col-md-4 mb-2 mb-sm-0  align-self-center">
                                            <select className="custom-select" name="selectedServerFilter" value={this.state.selectedServerFilter} onChange={this.updateSelectedServer} id="selectedServerFilter">
                                                <option value="">All</option>
                                                {
                                                    this.renderServers()
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4 col-md-4 mb-2 mb-sm-0  align-self-center">
                                            <select className="custom-select" name="selectedApplicationFilter" value={this.state.selectedApplicationFilter} onChange={this.updateSelectedAplication} id="selectedApplicationFilter">
                                                <option value="">All</option>
                                                {
                                                    this.renderApplicationsfilter()
                                                }
                                            </select>
                                        </div>
                                        <div className="col-md-4 align-self-center">
                                            <button type="button" onClick={this.handleModalShow} className="btn btn-theme btn-block">
                                                <span>New Application</span> <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </PageHeader>
                                :
                                <PageHeader
                                    heading={this.state.selectedApplication.domain} status={<Status status={this.state.selectedApplication.status} />}>
                                    <div className="row">
                                        <div className="col-sm-4 col-md-4 mb-2 mb-sm-0 align-self-center">
                                            <select className="custom-select" name="selectedServerFilter" value={this.state.selectedServerFilter} onChange={this.updateSelectedServer} id="selectedServerFilter">
                                                <option value="">All</option>
                                                {
                                                    this.renderServers()
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4 col-md-4 mb-2 mb-sm-0 align-self-center">
                                            <select className="custom-select" name="selectedApplicationFilter" value={this.state.selectedApplicationFilter} onChange={this.updateSelectedAplication} id="selectedApplicationFilter">
                                                <option value="">All</option>
                                                {
                                                    this.renderApplicationsfilter()
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-4 col-md-4 align-self-center">
                                            <button type="button" onClick={this.handleModalShow} className="btn btn-theme btn-block">
                                                <span>New Application</span>
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </PageHeader>
                        }

                        <div className="row">
                            {this.renderApplications()}
                        </div>

                        {/* <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                            <p style={{color:"green", textAlign:"center", width:"100%"}} dangerouslySetInnerHTML={{__html: this.state.rspmsg}}></p>
                           
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">


                            <div className="row">
                                <div className="col-12">
                                    <div className="card card-primary card-outline">
                                        <div className="card-header d-flex">
                                            <div className="col-3 float-left">
                                                <a href="#" className="btn btn-info start_new_app" onClick={this.handleModalShow}>New Application</a>
                                            </div>
                                            
                                            <div className="col-md-3">
                                                <select className="form-control" name="selectedServerFilter" value={this.state.selectedServerFilter} onChange={this.updateSelectedServer} id="selectedServerFilter">
                                                    <option value="">All</option>
                                                    {
                                                        this.renderServers()
                                                    }
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <select className="form-control" name="selectedApplicationFilter" value={this.state.selectedApplicationFilter} onChange={this.updateSelectedAplication} id="selectedApplicationFilter">
                                                    <option value="">All</option>
                                                    {
                                                        this.renderApplicationsfilter()
                                                    }
                                                </select>
                                            </div>
                                            
                                        </div>
                                        <div className="card-body">
                                            <div className="col-12 application_page_cards" id="huddles">
                                                {this.renderApplications()}
                                            </div>
                                        </div>
                                        <div className="card-footer"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section> */}

                        <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                            <form action="#" method="post">
                                <Modal.Header closeButton>
                                    <Modal.Title>ADD APPLICATION</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Alert onClose={() => this.setShow()} show={(this.state.error != "") ? true : false} variant="danger" dismissible>
                                        {this.state.error}
                                    </Alert>
                                    <Alert onClose={() => this.setShow()} show={(this.state.success != "") ? true : false} variant="success" dismissible>
                                        {this.state.success}
                                    </Alert> <div class="modal-form">
                                        <label htmlFor="selectedDomain">Enter Domain Name</label>
                                        <div className="input-group">
                                            <input required type="text" className="form-control form-input-field" name="selectedDomain" value={this.state.selectedDomain} onChange={this.dataChange} id="selectedDomain" />
                                            <div class="input-group-append">
                                                <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                    <path d="M23 33C17.477 33 13 28.523 13 23C13 18.522 15.943 14.732 20 13.458V15.582C18.2809 16.28 16.8578 17.5537 15.9741 19.1851C15.0903 20.8165 14.8009 22.7043 15.1553 24.5255C15.5096 26.3468 16.4858 27.9883 17.9168 29.1693C19.3477 30.3503 21.1446 30.9975 23 31C24.5938 31 26.1513 30.524 27.4728 29.6332C28.7944 28.7424 29.82 27.4773 30.418 26H32.542C31.268 30.057 27.478 33 23 33ZM32.95 24H22V13.05C22.329 13.017 22.663 13 23 13C28.523 13 33 17.477 33 23C33 23.337 32.983 23.671 32.95 24ZM24 15.062V22H30.938C30.7154 20.2376 29.9129 18.5993 28.6568 17.3432C27.4007 16.0871 25.7624 15.2846 24 15.062Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-form">
                                        <label htmlFor="select_server">Select server in which you want to Add new application</label>
                                        <div className="input-group">
                                            <select required className="custom-select" name="selectedServerId" value={this.state.selectedServerId} onChange={this.dataChange} id="select_server">
                                                <option value="">Select</option>
                                                {
                                                    this.renderServers()
                                                }
                                            </select>
                                            <div class="input-group-append">
                                                <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                    <path d="M23 33C17.477 33 13 28.523 13 23C13 18.522 15.943 14.732 20 13.458V15.582C18.2809 16.28 16.8578 17.5537 15.9741 19.1851C15.0903 20.8165 14.8009 22.7043 15.1553 24.5255C15.5096 26.3468 16.4858 27.9883 17.9168 29.1693C19.3477 30.3503 21.1446 30.9975 23 31C24.5938 31 26.1513 30.524 27.4728 29.6332C28.7944 28.7424 29.82 27.4773 30.418 26H32.542C31.268 30.057 27.478 33 23 33ZM32.95 24H22V13.05C22.329 13.017 22.663 13 23 13C28.523 13 33 17.477 33 23C33 23.337 32.983 23.671 32.95 24ZM24 15.062V22H30.938C30.7154 20.2376 29.9129 18.5993 28.6568 17.3432C27.4007 16.0871 25.7624 15.2846 24 15.062Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "none !important" }} className="hide">
                                        <label htmlFor="isWordpress">Wordpress</label>
                                        <input className="form-control" type="checkbox" name="isWordpress" checked={this.state.isWordpress} onChange={this.dataChange} style={{ width: "20px", height: "20px" }} />
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>

                                    <Button variant="default" onClick={this.handleModalClose}>
                                        CLOSE
                                      </Button>
                                    <Button className="btn btn-theme" onClick={this.handleAddApplication}>
                                        {
                                            this.state.loadding ?
                                                <img src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                : "ADD APPLICATION"
                                        }
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Applications);
