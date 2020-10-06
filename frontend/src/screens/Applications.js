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
            selectedServerId: ""
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }
    componentDidMount() {
        document.title = "Your Applications";
        this.apiHandler.getApplications((msg, data) => {
            this.setState({ applications: data })
        }, err => {
            this.showError(err);
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
        this.apiHandler.createApplication(this.state.selectedServerId, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            console.log(data, message);
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
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
                                <div className="card card-outline w-100">
                                    <div className="card-body">
                                        <span className="float-left" style={{ lineHeight: "35px" }}>Want your team members to receive Server / Application alerts? CloudwaysBot can send it through Channels.</span>
                                        <button className="btn btn-info float-left ml-3 text-uppercase">Add Channel</button>
                                        <a href="" className="float-right" style={{ lineHeight: "35px" }}>Learn More</a>
                                    </div>
                                </div>
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
                                            <div className="float-right">
                                                <i className="fa fa-step-backward"></i>&nbsp;
                                    <i className="fa fa-chevron-left"></i>&nbsp;
                                    <span>1 to 3 of 3 Applications</span>&nbsp;
                                    <i className="fa fa-chevron-right"></i>&nbsp;
                                    <i className="fa fa-step-forward"></i>
                                            </div>
                                            <div className="col-3 float-right pt-1">
                                                <div className="btn-group pl-3 float-right">
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
                                <label htmlFor="select_server">Select server in which you want to Add new application</label>
                                <select name="selectedServerId" value={this.state.selectedServerId} onChange={this.dataChange} id="select_server" className="form-control" >
                                    <option value="">Select</option>
                                    {
                                        this.renderServers()
                                    }
                                </select>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="info" onClick={this.handleAddApplication}>
                                ADD APPLICATION
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
