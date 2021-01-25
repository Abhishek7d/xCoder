import React, { Component } from 'react'
import "../index.css"
import Services from "./server/Services";
import CronJobs from "./server/CronJobs";
import Resources from "./server/Resouces";
import Credentials from "./server/Credentials";
import Summery from "./server/Summery";
import BlockStorage from "./server/BlockStorage";
import copy from 'copy-to-clipboard';
import Status from '../components/Status';
// import UpgradeServer from "./server/UpgradeServer";

class ServerDetails extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
    }
    copyToClipBoard = (event) =>{
        let text = event.currentTarget.innerText;
        copy(text);
    }
    handleModalShow = ()=>{

    }
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-6 screen-title row">
                        <a className="col-1" onClick={this.props.serverClickHandler}><i className="fas fa-arrow-left"></i></a>
                        <div className="col-11 row">
                            <div className="col-1 server-card-status" title={this.server.status}>
                                <Status status={this.server.status}/>
                            </div>
                            <h5 className="col-8">{this.server.name}</h5>
                        </div>
                    </div>
                    <div className="col-7 col-md-6">
                        <button type="button" onClick={this.handleModalShow} className="theme-btn float-right">
                            Add Storage
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="row servers-container">
                    <Summery copyToClipBoard={this.copyToClipBoard} tabId={"summery"} active={true} server={this.server} />
                    <Credentials copyToClipBoard={this.copyToClipBoard} tabId={"credentials"} server={this.server} />
                    <Services copyToClipBoard={this.copyToClipBoard} tabId={"services"} server={this.server} />
                </div>
            </>
            // <div className="card card-primary card-outline">
            //     <div className="card-header">
            //         <div className="col-3 float-left" style={{display: "flex"}}>
            //             <div className="nav-link" href="#" onClick={this.props.serverClickHandler}><i className="fas fa-arrow-left"></i></div>
            //             <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{this.server.name}</h5>
            //             <span className="badge badge-info ml-4 pt-1" style={{height:"20px",margin:"auto"}}>{this.server.status}</span>
            //         </div>
            //     </div>
            //     <div className="card-body">
            //         <div className="col-12 application_page_cards" id="huddles">
            //             <ul className="nav nav-pills mb-3" id="server-details-tab-header" role="tablist">
            //                 <li className="nav-item">
            //                     <a className="nav-link active" id="pills-summery-tab" data-toggle="pill" href="#pills-summery" role="tab" aria-controls="pills-summery" aria-selected="true">Summery</a>
            //                 </li>
            //                 <li className="nav-item">
            //                     <a className="nav-link" id="pills-credentials-tab" data-toggle="pill" href="#pills-credentials" role="tab" aria-controls="pills-credentials" aria-selected="true">Credentials</a>
            //                 </li>
            //                 <li className="nav-item">
            //                     <a className="nav-link" id="pills-resouces-tab" data-toggle="pill" href="#pills-resouces" role="tab" aria-controls="pills-resouces" aria-selected="false">Server Health</a>
            //                 </li>
            //                 <li className="nav-item">
            //                     <a className="nav-link" id="pills-services-tab" data-toggle="pill" href="#pills-services" role="tab" aria-controls="pills-services" aria-selected="false">Services</a>
            //                 </li>
            //                 <li className="nav-item">
            //                     <a className="nav-link" id="pills-cron-tab" data-toggle="pill" href="#pills-cron" role="tab" aria-controls="pills-cron" aria-selected="false">Cron Jobs</a>
            //                 </li>
            //                 <li className="nav-item">
            //                     <a className="nav-link" id="pills-storage-tab" data-toggle="pill" href="#pills-storage" role="tab" aria-controls="pills-storage" aria-selected="false">Block Storage</a>
            //                 </li>
            //                 {/* <li className="nav-item">
            //                     <a className="nav-link" id="pills-upgrade-tab" data-toggle="pill" href="#pills-upgrade" role="tab" aria-controls="pills-upgrade" aria-selected="false">Upgrade Server</a>
            //                 </li> */}
            //             </ul>
            //             <div className="tab-content" id="pills-tabContent">
            //                 <Summery copyToClipBoard={this.copyToClipBoard} tabId={"summery"} active={true} server={this.server} />
            //                 <Credentials copyToClipBoard={this.copyToClipBoard} tabId={"credentials"} server={this.server} />
            //                 <Resources copyToClipBoard={this.copyToClipBoard} tabId={"resouces"} server={this.server} />
            //                 <Services copyToClipBoard={this.copyToClipBoard} tabId={"services"} server={this.server} />
            //                 <CronJobs copyToClipBoard={this.copyToClipBoard} tabId={"cron"} server={this.server}/>
            //                 <BlockStorage copyToClipBoard={this.copyToClipBoard} tabId={"storage"} server={this.server}/>
            //                 {/* <UpgradeServer tabId={"upgrade"} server={this.server}/> */}
            //             </div>
            //         </div>
            //     </div>
            //     {/* <div className="card-footer"></div> */}
            // </div>
        )
    }
}
export default ServerDetails;
