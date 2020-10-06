import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import ApplicationCard from '../screens/ApplicationCard';
import { Modal, Button } from 'react-bootstrap';

class Applications extends React.Component {
    constructor(props) {
        super();
        this.state = {
            applications: [],
            showModal: false,
            loadding: false,
            servers: [],
            error: "",
            success: "",
            selectedServerId: "",
            selectedDomain: "",
            isWordpress: false,
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }
    componentDidMount() {
        document.title = "Your Applications";
        this.apiHandler.getApplications((msg, data) => {
            this.setState({ applications: data })
            console.log(data+", "+msg);
        }, err => {
            this.showError(err);
            console.log(err);
        })
        this.apiHandler.getServers((msg, data) => {
            this.setState({ servers: data })
        }, err => {
            this.showError(err);
        })
    }
    renderServers() {
        let servers = [];
        this.state.servers.forEach((data, index) => {
            servers.push(<option key={index} value={data.id}>{data.name}</option>);
        })
        return servers;
    }
    renderApplications() {
        let applications = [];
        this.state.applications.forEach((data, index) => {
            applications.push(<ApplicationCard key={index} application={data} />);
        })
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
            console.log(data, message);
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
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Applications</h1>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">


                            <div className="row">
                                <div className="col-12">
                                    <div className="card card-primary card-outline">
                                        <div className="card-header">
                                            <div className="col-3 float-left">
                                                <a href="#" className="btn btn-primary start_new_app" onClick={this.handleModalShow}>START A NEW APPLICATION</a>
                                            </div>
                                            <div className="col-3 float-right pt-1">
                                                <div className="btn-group pl-3 float-right dropleft">
                                                    <i className="fas fa-bars" data-toggle="dropdown"
                                                        aria-haspopup="true" aria-expanded="false"></i>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="#">Name</a>
                                                        <a className="dropdown-item" href="#">Created Date</a>
                                                        <a className="dropdown-item" href="#">Projects</a>
                                                        <a className="dropdown-item" href="#">Servers</a>
                                                        <a className="dropdown-item" href="#">Staging</a>
                                                    </div>
                                                </div>
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
                    </section>
                </div>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>ADD APPLICATION</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="selectedDomain">Select Domain</label>
                                <select className="form-control" name="selectedDomain" value={this.state.selectedDomain} onChange={this.dataChange} id="selectedDomain">
                                    <option >Select</option>
                                    <option value="dibs.com">dibs.com</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="select_server">Select server in which you want to Add new application</label>
                                <select className="form-control" name="selectedServerId" value={this.state.selectedServerId} onChange={this.dataChange} id="select_server" className="form-control" >
                                    <option value="">Select</option>
                                    {
                                        this.renderServers()
                                    }
                                </select>
                            </div>
                            <div className="form-group d-flex flex-column justify-content-center align-items-center">
                                <label htmlFor="isWordpress">Wordpress</label>
                                <input className="form-control" type="checkbox" name="isWordpress" checked={this.state.isWordpress} onChange={this.dataChange} style={{ width: "20px", height: "20px" }} />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="info" onClick={this.handleAddApplication}>
                                {
                                    this.state.loadding?
                                    <img src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                    :"ADD APPLICATION"
                                }
                            </Button>
                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                        </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        )
    }
}
export default Applications;
