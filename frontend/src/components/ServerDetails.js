import React, { Component } from 'react'
import "../index.css"
import Services from "./server/Services";
import CronJobs from "./server/CronJobs";
import Resources from "./server/Resouces";
import Credentials from "./server/Credentials";
import Summery from "./server/Summery";
import ServerHealth from "./server/ServerHealth"
import BlockStorage from "./server/BlockStorage";
import copy from 'copy-to-clipboard';
import Status from '../components/Status';
// import UpgradeServer from "./server/UpgradeServer";
import PageHeader from '../components/template/PageHeader';
import CronJobsCard from './server/CronJobsCard';
import { Modal, Button, Alert } from 'react-bootstrap';
import ApiHandler from '../model/ApiHandler';

class ServerDetails extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            showModal: false,
            error: "",
            success: "",
            options: [],
            value: 1,
            min: 1,
            loadding: false
        }
        if (this.server.storage) {
            this.state.min = this.server.storage.size
            this.state.value = this.server.storage.size
        }
        this.apiHandler = new ApiHandler();
    }
    copyToClipBoard = (event) => {
        let text = event.currentTarget.innerText;
        copy(text);
    }
    renderOptions() {
        let tmp_data = [<option value="" >Available Sizes</option>];
        let tmp_list = [];
        this.state.options.forEach(data => {
            let tmp = data.split("-");
            if (tmp.length === 3) {
                tmp_list.push(data);
            }
        })
        tmp_list.sort();
        tmp_list.forEach(data => {
            let tmp = data.split("-");
            tmp_data.push(<option value={data}>{tmp[1].toUpperCase() + " + " + tmp[2].toUpperCase()}</option>);
        })
        return tmp_data;
    }
    componentDidMount() {
        this.apiHandler.getServerSizes((data) => {
            let tmp_sizes = [];
            data.forEach(size => {
                tmp_sizes.push(size.slug)
            })
            this.setState({ sizes: data, options: tmp_sizes })
        }, (err) => {
            console.log(err)
        })
    }
    handleChange = (value) => {
        let newSize = value.target.value;
        if (this.server.storage) {
            if (this.server.storage.size > newSize) {
                return;
            }
        }
        this.setState({ value: newSize })
    }
    formAction = () => {
        console.log(this.state.value)
        if (!this.state.value) {
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        let action = (this.server.storage) ? "resize" : "attach"
        this.apiHandler.addStorage(this.server.id, this.state.value, action, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            setTimeout(() => {
                window.location.href = "/servers";
            }, 1000)
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
    }
    deleteStorage = () => {
        this.apiHandler.deleteStorage(this.server.id, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            setTimeout(() => {
                window.location.href = "/servers";
            }, 1000)
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
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
    render() {
        return (
            <>
                <PageHeader status={<Status status={this.server.status} />}
                    heading={this.server.name} subHeading="">
                    <button type="button" onClick={this.handleModalShow} className="theme-btn float-right">
                        Add Storage
                            <i class="fa fa-plus"></i>
                    </button>
                </PageHeader>
                <div className="row servers-details-container">
                    <Summery copyToClipBoard={this.copyToClipBoard} tabId={"summery"} active={true} server={this.server} />
                    <Credentials copyToClipBoard={this.copyToClipBoard} tabId={"credentials"} server={this.server} />
                    <Services copyToClipBoard={this.copyToClipBoard} tabId={"services"} server={this.server} />
                </div>
                <div className="row server-health-container">
                    <ServerHealth copyToClipBoard={this.copyToClipBoard} tabId={"resources"} server={this.server} />
                    <CronJobsCard copyToClipBoard={this.copyToClipBoard} tabId={"cornjobs"} server={this.server} />
                </div>
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>ADD STORAGE</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                        </Modal.Body>
                        <Modal.Footer>

                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                        </Button>
                            <button type="button" onClick={this.formAction} className="btn btn-theme" >
                                {this.state.loadding ?
                                    <img src={require("../assets/images/loading.gif")} alt="loadding" style={{ width: "25px", filter: "brightness(20)" }} />
                                    : ((this.server.storage) ? "Resize" : "Attach Now")
                                }
                            </button>
                            {this.server.storage ?
                                <button type="button" onClick={this.deleteStorage} className="btn btn-danger">
                                    {this.state.loadding ?
                                        <img src={require("../assets/images/loading.gif")} alt="loadding" style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "DELETE"
                                    }
                                </button>
                                :
                                <div></div>
                            }
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
            // <div className="card card-primary card-outline">h
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
