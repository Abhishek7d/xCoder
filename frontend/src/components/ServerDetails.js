import React, { Component } from 'react'
import ApiHandler from '../model/ApiHandler';
import "../index.css"

class ServerDetails extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            cpu:90,
            disk:{
                used:0,
                available:10,
                total:10,
                percentage:20
            },
            memory:{
                used:0,
                available:10,
                total:10,
                percentage:20
            },
            regions:{},
            loadding:false,
            nginx: "",
            apache: "",
            mysql: "",
            cron: "",
        }
        this.apiHandler = new ApiHandler();
    }
    showError(err){
        console.log(err)
    }
    componentDidMount() {
        this.apiHandler.getRegions((regions)=>{
            let tmp_regions = this.state.regions;
            regions.forEach(region=>{
                tmp_regions[region.slug] = region.name
            })
            this.setState({regions:tmp_regions})
        }, (err)=>{
            console.log(err)
        })
        this.loadResources()
        this.loadServices()
    }
    loadResources = ()=>{
        if(this.state.loadding){
            console.log("still loadding")
            return;
        }
        this.setState({loadding:true})

        this.apiHandler.getResources(this.server.id, (msg, data) => {
            this.setState({
                cpu: parseFloat(data.cpu).toFixed(2),
                disk:{
                    used:data.disk.used,
                    available:data.disk.available,
                    total:data.disk.total,
                    percentage:parseFloat(data.disk.usage).toFixed(2)
                },
                memory:{
                    used:((parseInt(data.memory.total[1])-parseInt(data.memory.free[1]))/1024).toFixed(0)+" MB",
                    available:((parseInt(data.memory.free[1]))/1024).toFixed(0)+" MB",
                    total:((parseInt(data.memory.total[1]))/1024).toFixed(0)+" MB",
                    percentage:20
                },
            })
            this.setState({loadding:false})
        }, err => {
            // this.setState({loadding:false})
        })
    }
    loadServices = () => {
        if(this.state.loadding){
            console.log("still loading");
            return
        }
        this.setState({loadding: true})
        this.apiHandler.getServices(this.server.id, (msg, data) => {
            console.log(msg);
            this.setState({
                nginx: data.nginx,
                apache: data.apache,
                mysql: data.mysql,
                cron: data.cron
            })
            this.setState({loadding: false})
        }, err => {
            console.log(err);
        })

    }
    renderControls = () => {
        if(this.state.nginx == 'active'){
            return(<span>Stop</span>)
        }
    }

    render() {
        return (
            <>
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <div className="col-3 float-left" style={{display: "flex"}}>
                            <a className="nav-link" href="#" onClick={this.props.serverClickHandler}><i className="fas fa-arrow-left"></i></a>
                            <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{this.server.name}</h5>
                            <span className="badge badge-info ml-4 pt-1" style={{height:"20px",margin:"auto"}}>{this.server.status}</span>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="col-12 application_page_cards" id="huddles">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Summery</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-credentials-tab" data-toggle="pill" href="#pills-credentials" role="tab" aria-controls="pills-credentials" aria-selected="true">Credentials</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Server Health</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Services</a>
                                </li>
                            </ul>
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="row col-md-12">
                                        <div className="col-sm-6 col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">Size :</span>
                                            <span className="mt-3 font-weight-bold text-info">Memory :</span>
                                            <span className="mt-3 font-weight-bold text-info">Disk :</span>
                                            <span className="mt-3 font-weight-bold text-info">vCPUs :</span>
                                            <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                                            <span className="mt-3 font-weight-bold text-info">Region :</span>
                                        </div>
                                        <div className="col-sm-6 col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">{this.server.size}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.memory} MB</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.disk} GB</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.vcpus}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.ip_address}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.state.regions[this.props.server.region]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade show" id="pills-credentials" role="tabpanel" aria-labelledby="pills-credentials-tab">
                                    <div className="row ml-2">
                                        <div className="col-md-12 d-flex flex-column">
                                            <h5>SSH/SFTP Access
                                            </h5>
                                        </div>
                                        <div className="col-sm-6 col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">Username :</span>
                                            <span className="mt-3 font-weight-bold text-info">Password :</span>
                                            <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                                        </div>
                                        <div className="col-sm-6 col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">{"admin"}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.password}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.ip_address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div onClick={this.loadResources} className="col-md-12" style={{ display: "flex"}}>
                                        <h5 class="col-sm-2" style={{minWidth: "max-content"}}>Refresh Data</h5>
                                        <i className={(this.state.loadding)?"fas fa-sync spin":"fas fa-sync "} style={{width: "17px", height: "17px"}}></i>
                                    </div>
                                    <div className="col-sm-12">
                                        <span style={{ fontSize: "12px" }}>CPU Usage - {this.state.cpu}%</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.cpu+"%" }} aria-valuenow={`"${this.state.cpu}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <span style={{ fontSize: "12px" }}>RAM Usage - {this.state.memory.available}  Free of {this.state.memory.total} (Used: {this.state.memory.used})</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.memory.percentage + "%" }} aria-valuenow={`"${this.state.memory.percentage}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <span style={{ fontSize: "12px", marginTop: "10px" }}>Disk Usage - {this.state.disk.available} Free of {this.state.disk.total} (Used: {this.state.disk.used})</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.disk.percentage + "%" }} aria-valuenow={`"${this.state.disk.percentage}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                                    <div className="row" style={{color: "grey"}}>
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                Service
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                Status
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                Control
                                            </span>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                nginx
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                {
                                                    this.state.nginx
                                                }
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="font-weight-bold">
                                                {this.renderControls}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer"></div>
                </div>
            </>

        )
    }
}
export default ServerDetails;
