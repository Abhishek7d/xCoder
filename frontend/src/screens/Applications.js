import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import ApplicationCard from '../screens/ApplicationCard';
import { Modal, Button, Alert } from 'react-bootstrap';
import ApplicationDetails from '../components/ApplicationDetails';
import "../index.css";
import { withRouter, } from 'react-router';
// import { browserHistory } from 'react-router'
import PageHeader from '../components/template/PageHeader';
import Status from '../components/Status';
import Pagination from '../components/template/Pagination';
import { read_cookie } from 'sfcookies';

class Applications extends React.Component {
    constructor(props) {
        super();
        let serverId = new URLSearchParams(props.location.search).get("serverId");
        let appId = props.match.params.appId;
        this.state = {
            applications: [],
            applicationData: {},
            showModal: false,
            loadding: false,
            projectName: read_cookie('projectName'),
            projectId: read_cookie('projectId'),
            servers: [],
            error: "",
            success: "",
            rspmsg: "",
            selectedServerId: (serverId) ? serverId : '',
            selectedDomain: "",
            isWordpress: true,
            isApplicationClicked: false,
            selectedApplication: null,
            selectedServerFilter: (serverId) ? serverId : '',
            selectedApplicationFilter: appId,
            appLoadding: true,
            screenName: "Applications",
            serverPage: 1,
            applicationPage: 1,
            accessStatus: null,

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
        this.apiHandler.getServers(this.state.serverPage, (msg, data) => {
            this.setState({ servers: data.data })
        }, err => {
            this.showError(err);
        })
    }
    setMessage(message) {
        this.setState({ rspmsg: message })
    }
    loadApplications(page = 1) {
        this.setState({ appLoadding: true })

        this.apiHandler.getApplications(null, 0, page, (msg, data) => {
            data.data.forEach((app, index) => {
                if (app.uuid === this.state.selectedApplicationFilter) {
                    this.setState({ selectedApplication: app });
                }
            })
            this.setState({ accessStatus: msg, applications: data.data, appLoadding: false, applicationData: data })
        }, err => {
            this.showError(err);
            this.setState({ appLoadding: false, accessStatus: err, })

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
                servers.push(<option key={index} value={data.uuid}>{data.name}</option>);
            }
        })
        return servers;
    }
    renderApplicationsfilter = () => {
        if (this.state.selectedServerFilter !== "") {
            let applications = [];
            this.state.servers.forEach((data) => {
                if (data.uuid === this.state.selectedServerFilter) {
                    data.applications.forEach((application, index) => {
                        applications.push(<option key={index} value={application.uuid}>{application.domain}</option>)
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
            window.history.replaceState(null, null, "/applications/" + this.state.selectedApplication.uuid)
            return (<ApplicationDetails setMessage={this.setMessage} id={this.state.selectedApplication.uuid} key={this.state.selectedApplication.uuid} loadApplications={this.refreshApplications} applicationClickHandler={this.applicationClickHandler} application={this.state.selectedApplication} />)
        }
        let applications = [];
        if (this.state.selectedServerFilter === "" || this.state.selectedServerFilter === null) {
            this.state.applications.forEach((data, index) => {
                applications.push(<ApplicationCard appsReload={this.loadApplications} key={data.id} application={data} applicationClickHandler={this.applicationClickHandler} />);
            })
        } else {
            this.state.applications.forEach((data, index) => {
                if (data.server.uuid === this.state.selectedServerFilter) {
                    applications.push(<ApplicationCard appsReload={this.loadApplications} key={data.id} application={data} applicationClickHandler={this.applicationClickHandler} />);
                }
            })
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
            this.loadApplications();
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
            this.setState({ selectedApplication: null, screenName: 'Applications' })
        } else {
            let selectedApplication = event.target.value;
            this.state.applications.forEach(data => {
                if (data.uuid === selectedApplication) {
                    this.setState({ selectedApplication: data, isApplicationClicked: true, screenName: data.name })
                }
            })
        }
    }
    updateSelectedServer = (event) => {
        var index = event.nativeEvent.target.selectedIndex;

        this.setState({ selectedApplication: null, selectedApplicationFilter: "", [event.target.name]: event.target.value, screenName: event.nativeEvent.target[index].text })
    }
    applicationClickHandler = (application = null) => {
        if (!application) {
            this.setState({
                selectedApplicationFilter: ""
            })
            window.history.replaceState(null, null, "/applications")
        }
        this.setState({
            selectedApplication: application,
            isApplicationClicked: true,
            screenName: application.name
        })
    }
    goBack = () => {
        if (this.state.isApplicationClicked) {
            window.history.replaceState(null, null, "/applications")
        }
        this.setState({
            isApplicationClicked: !this.state.isApplicationClicked,
            //selectedApplicationFilter: undefined,
            selectedServerFilter: null,
            selectedApplication: null,
        })
        this.changeSelectServer(0)
    }
    changeSelectServer(index) {
        let serverSelect = document.getElementById("selectedServerFilter");
        serverSelect.selectedIndex = index
    }
    handlePageChange = (data) => {
        this.loadApplications(data)
    }
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.handleAddApplication();
        }
    }
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation name={this.state.screenName} />
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
                                                <span>New Application</span> <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </PageHeader>
                                :
                                <PageHeader back={<i onClick={this.goBack} className="fas fa-arrow-left"></i>}
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
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </PageHeader>
                        }

                        <div className="row">
                            <div className="col-12">
                                <Alert show={(this.state.accessStatus !== null && this.state.accessStatus !== "Your applications") ? true : false} variant="info">
                                    {this.state.accessStatus}
                                </Alert>
                            </div>
                            {this.renderApplications()}
                        </div>
                        <Pagination onPageChange={this.handlePageChange} key={this.state.applicationData.current_page} data={this.state.applicationData}></Pagination>
                        <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                            <form>
                                <Modal.Header closeButton>
                                    <Modal.Title>ADD APPLICATION</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                        {this.state.error}
                                    </Alert>
                                    <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                        {this.state.success}
                                    </Alert>
                                    <div className="modal-form">
                                        <label htmlFor="selectedDomain">Enter Domain Name</label>
                                        <div className="input-group">
                                            <input onKeyDown={this.onEnterPress} required type="text" className="form-control form-input-field" name="selectedDomain" value={this.state.selectedDomain} onChange={this.dataChange} id="selectedDomain" />
                                            <div className="input-group-append">
                                                <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                    <path d="M23 33C17.477 33 13 28.523 13 23C13 17.477 17.477 13 23 13C28.523 13 33 17.477 33 23C33 28.523 28.523 33 23 33ZM20.71 30.667C19.7234 28.5743 19.1519 26.3102 19.027 24H15.062C15.2566 25.5389 15.8939 26.9882 16.8966 28.1717C17.8992 29.3552 19.224 30.2221 20.71 30.667ZM21.03 24C21.181 26.439 21.878 28.73 23 30.752C24.1523 28.6766 24.8254 26.3695 24.97 24H21.03ZM30.938 24H26.973C26.8481 26.3102 26.2766 28.5743 25.29 30.667C26.776 30.2221 28.1008 29.3552 29.1034 28.1717C30.1061 26.9882 30.7434 25.5389 30.938 24ZM15.062 22H19.027C19.1519 19.6898 19.7234 17.4257 20.71 15.333C19.224 15.7779 17.8992 16.6448 16.8966 17.8283C15.8939 19.0118 15.2566 20.4611 15.062 22ZM21.031 22H24.969C24.8248 19.6306 24.152 17.3235 23 15.248C21.8477 17.3234 21.1746 19.6305 21.03 22H21.031ZM25.29 15.333C26.2766 17.4257 26.8481 19.6898 26.973 22H30.938C30.7434 20.4611 30.1061 19.0118 29.1034 17.8283C28.1008 16.6448 26.776 15.7779 25.29 15.333Z" fill="white" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-form">
                                        <label htmlFor="select_server">Select server in which you want to Add new application</label>
                                        <div className="input-group">
                                            <select required className="custom-select" name="selectedServerId" value={this.state.selectedServerId} onChange={this.dataChange} id="select_server">
                                                <option value="">Select</option>
                                                {
                                                    this.renderServers()
                                                }
                                            </select>
                                            <div className="input-group-append">
                                                <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                    <path d="M15 22H29V16H15V22ZM31 15V31C31 31.2652 30.8946 31.5196 30.7071 31.7071C30.5196 31.8946 30.2652 32 30 32H14C13.7348 32 13.4804 31.8946 13.2929 31.7071C13.1054 31.5196 13 31.2652 13 31V15C13 14.7348 13.1054 14.4804 13.2929 14.2929C13.4804 14.1054 13.7348 14 14 14H30C30.2652 14 30.5196 14.1054 30.7071 14.2929C30.8946 14.4804 31 14.7348 31 15ZM29 24H15V30H29V24ZM17 26H20V28H17V26ZM17 18H20V20H17V18Z" fill="white" />
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
                                                <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
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
