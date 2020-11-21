import React, { Component } from 'react'
import Summary from "./application/Summary";
import Database from "./application/Database";
import Domain from "./application/Domain";
import SSL from "./application/SSL";

class ApplicationDetails extends Component {
    constructor(props) {
        super()
        this.props = props;
        this.application = props.application;
        this.server = props.application.server;
    }

    render() {
        return (
            <div className="card card-primary card-outline">
                <div className="card-header">
                    <div className="col-3 float-left" style={{display: "flex"}}>
                        <div className="nav-link" type="button" onClick={()=>this.props.applicationClickHandler()}><i className="fas fa-arrow-left"></i></div>
                        <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{this.application.domain}</h5>
                        <span className="badge badge-info ml-4 pt-1" style={{height:"20px",margin:"auto"}}>{this.application.status}</span>
                    </div>

                </div>
                <div className="card-body">
                    <div className="col-12 application_page_cards" id="huddles">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">  
                            <li className="nav-item">
                                <a className="nav-link active" id="app-summary-tab" data-toggle="pill" href="#summary-tab" role="tab" aria-controls="pills-home" aria-selected="true">Summary</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="app-database-tab" data-toggle="pill" href="#database-tab" role="tab" aria-controls="app-database-tab" aria-selected="false">DB Credentials</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="app-domain-name-tab" data-toggle="pill" href="#domain-name-tab" role="tab" aria-controls="app-domain-name-tab" aria-selected="false">Domain Name</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="app-SSL-tab" data-toggle="pill" href="#ssl-tab" role="tab" aria-controls="app-ssl-tab" aria-selected="false">SSL Settings</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" id="app-ftp-tab" data-toggle="pill" href="#ftp-tab" role="tab" aria-controls="app-ftp-tab" aria-selected="false">FTP Settings</a>
                            </li>

                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <Summary tabId={"summary-tab"} active={true} server={this.server} application={this.application} />
                            <Database tabId={"database-tab"} active={true} server={this.server} application={this.application} />
                            <Domain loadApplications={this.props.loadApplications} tabId={"domain-name-tab"} active={true} server={this.server} application={this.application} />
                            <SSL loadApplications={this.props.loadApplications} tabId={"ssl-tab"} active={true} server={this.server} application={this.application} />
                        </div>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }
}
export default ApplicationDetails;
