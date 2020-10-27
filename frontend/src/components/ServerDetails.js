import React, { Component } from 'react'
import "../index.css"
import Services from "./server/Services";
import CronJobs from "./server/CronJobs";
import Resources from "./server/Resouces";
import Credentials from "./server/Credentials";
import Summery from "./server/Summery";
import BlockStorage from "./server/BlockStorage";
// import UpgradeServer from "./server/UpgradeServer";

class ServerDetails extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
    }
    render() {
        return (
            <div className="card card-primary card-outline">
                <div className="card-header">
                    <div className="col-3 float-left" style={{display: "flex"}}>
                        <div className="nav-link" href="#" onClick={this.props.serverClickHandler}><i className="fas fa-arrow-left"></i></div>
                        <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{this.server.name}</h5>
                        <span className="badge badge-info ml-4 pt-1" style={{height:"20px",margin:"auto"}}>{this.server.status}</span>
                    </div>
                </div>
                <div className="card-body">
                    <div className="col-12 application_page_cards" id="huddles">
                        <ul className="nav nav-pills mb-3" id="server-details-tab-header" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="pills-summery-tab" data-toggle="pill" href="#pills-summery" role="tab" aria-controls="pills-summery" aria-selected="true">Summery</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-credentials-tab" data-toggle="pill" href="#pills-credentials" role="tab" aria-controls="pills-credentials" aria-selected="true">Credentials</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-resouces-tab" data-toggle="pill" href="#pills-resouces" role="tab" aria-controls="pills-resouces" aria-selected="false">Server Health</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-services-tab" data-toggle="pill" href="#pills-services" role="tab" aria-controls="pills-services" aria-selected="false">Services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-cron-tab" data-toggle="pill" href="#pills-cron" role="tab" aria-controls="pills-cron" aria-selected="false">Cron Jobs</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="pills-storage-tab" data-toggle="pill" href="#pills-storage" role="tab" aria-controls="pills-storage" aria-selected="false">Block Storage</a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link" id="pills-upgrade-tab" data-toggle="pill" href="#pills-upgrade" role="tab" aria-controls="pills-upgrade" aria-selected="false">Upgrade Server</a>
                            </li> */}
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <Summery tabId={"summery"} active={true} server={this.server} />
                            <Credentials tabId={"credentials"} server={this.server} />
                            <Resources tabId={"resouces"} server={this.server} />
                            <Services tabId={"services"} server={this.server} />
                            <CronJobs tabId={"cron"} server={this.server}/>
                            <BlockStorage tabId={"storage"} server={this.server}/>
                            {/* <UpgradeServer tabId={"upgrade"} server={this.server}/> */}
                        </div>
                    </div>
                </div>
                {/* <div className="card-footer"></div> */}
            </div>
        )
    }
}
export default ServerDetails;
