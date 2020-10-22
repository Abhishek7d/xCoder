import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import ApplicationCard from '../screens/ApplicationCard';
import { Modal, Button } from 'react-bootstrap';
import ApplicationDetails from '../components/ApplicationDetails';
import "../index.css";

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
            isWordpress: true,
            isApplicationClicked: false,
            selectedApplication: null,
            selectedServerFilter: "",
            selectedApplicationFilter: "",
            appLoadding:true
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

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
    loadApplications(){
        this.setState({appLoadding:true});
        this.apiHandler.getApplications((msg, data) => {
            this.setState({ applications: data, appLoadding: false})
        }, err => {
            this.showError(err);
        })
        
    }
    renderServers() {
        let servers = [];
        this.state.servers.forEach((data, index) => {
            if(data.status==="READY"){
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
        if(this.state.appLoadding){
            return <div style={{width: "100%",paddingLeft: "40%"}}>
                    <img alt="loadding" src={require("../assets/images/loading.gif")} style={{width:"100px"}} className="serviceLoadding"/>
                </div>        
        }
        if (this.state.selectedApplication) {
            return (<ApplicationDetails applicationClickHandler={this.applicationClickHandler} application={this.state.selectedApplication} />)
        }
        let applications = [];
        if(this.state.selectedServerFilter === ""){
            this.state.applications.forEach((data, index) => {
                applications.push(<ApplicationCard appsReload={this.loadApplications} key={index} application={data} applicationClickHandler={this.applicationClickHandler} />);
            })
        }else{
            this.state.applications.forEach((data, index) => {
                if(data.server.id===parseInt(this.state.selectedServerFilter)){
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
    updateSelectedAplication  = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        if(!event.target.value){
            this.setState({selectedApplication:null})
        }else{
            let selectedApplication = event.target.value;
            this.state.applications.forEach(data=>{
                if(data.id === selectedApplication){
                    this.setState({selectedApplication:data})
                }
            }) 
        }
    }
    updateSelectedServer = (event)=>{
        this.setState({selectedApplication:null, selectedApplicationFilter:"", [event.target.name]: event.target.value })
    }
    applicationClickHandler = (application = null) => {
        if(!application){
            this.setState({selectedApplicationFilter:""})
        }
        this.setState({ selectedApplication: application })
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
                    </section>
                </div>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>ADD APPLICATION</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{color:"red"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
                            <p style={{color:"green"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>
                            
                            <div className="form-group">
                                <label htmlFor="selectedDomain">Enter Domain Name</label>
                                <input required type="text" className="form-control" name="selectedDomain" value={this.state.selectedDomain} onChange={this.dataChange} id="selectedDomain" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="select_server">Select server in which you want to Add new application</label>
                                <select required className="form-control" name="selectedServerId" value={this.state.selectedServerId} onChange={this.dataChange} id="select_server" className="form-control" >
                                    <option value="">Select</option>
                                    {
                                        this.renderServers()
                                    }
                                </select>
                            </div>
                            <div style={{display:"none !important"}} className="hide">
                                <label htmlFor="isWordpress">Wordpress</label>
                                <input className="form-control" type="checkbox" name="isWordpress" checked={this.state.isWordpress} onChange={this.dataChange} style={{ width: "20px", height: "20px" }} />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="info" onClick={this.handleAddApplication}>
                                {
                                    this.state.loadding ?
                                        <img src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "ADD APPLICATION"
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
