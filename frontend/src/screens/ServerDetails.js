import React, { Component } from 'react'
import ApiHandler from '../model/ApiHandler';


class ServerDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resourses: {
                cpu: "1.11758%",
                disk: {
                    total: "25G",
                    used: "2.5G",
                    available: "22G",
                    usage: "11%"
                },
                memory: {
                    total: [
                        "MemTotal:",
                        "1015896",
                        "kB"
                    ],
                    free: [
                        "MemFree:",
                        "137144",
                        "kB"
                    ],
                    available: [
                        "MemAvailable:",
                        "460400",
                        "kB"
                    ]
                }
            },
        }
        this.apiHandler = new ApiHandler();
    }

    componentDidMount() {
        this.apiHandler.getResources(this.state.id, (msg, data) => {
            console.log(data, msg);
            let temp = Object.assign({}, data)
            this.setState({ resources: temp })
        }, err => {
            this.showError(err);
        })
    }

    render() {
        let cpu_percentage = Math.round(this.state.resourses.cpu.slice(0, -1));
        let ram_percentage = Math.round(((this.state.resourses.memory.total[1] - this.state.resourses.memory.free[1]) * 100) / this.state.resourses.memory.total[1]);
        let disk_percentage = Math.round(this.state.resourses.disk.usage.slice(0, -1))
        return (
            <>
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <div className="col-3 float-left">
                            <h5 className="font-weight-bold text-secondary">Server Name</h5>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="col-12 application_page_cards" id="huddles">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Summery</a>
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
                                    <div className="row ml-2">
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">Size :</span>
                                            <span className="mt-3 font-weight-bold text-info">Memory :</span>
                                            <span className="mt-3 font-weight-bold text-info">Disk :</span>
                                            <span className="mt-3 font-weight-bold text-info">Vcpus :</span>
                                            <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                                            <span className="mt-3 font-weight-bold text-info">Password :</span>
                                            <span className="mt-3 font-weight-bold text-info">Region :</span>
                                        </div>
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.size}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.memory}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.disk}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.vcpus}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.ip_address}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.password}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.props.server.region}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className="col-md-5">
                                        <span style={{ fontSize: "12px" }}>CPU Usage - {this.state.resourses.cpu}</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: cpu_percentage + "%" }} aria-valuenow={`"${cpu_percentage}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <span style={{ fontSize: "12px" }}>RAM Usage - {this.state.resourses.memory.free[1]}&nbsp;{this.state.resourses.memory.free[2]}  Free of {this.state.resourses.memory.total[1]}&nbsp;{this.state.resourses.memory.total[2]}</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: ram_percentage + "%" }} aria-valuenow={`"${ram_percentage}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <span style={{ fontSize: "12px", marginTop: "10px" }}>Disk Usage - {this.state.resourses.disk.available}&nbsp;Free of {this.state.resourses.disk.total}&nbsp; Used {this.state.resourses.disk.used}</span>
                                        <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
                                            <div className="progress-bar bg-success" role="progressbar" style={{ width: disk_percentage + "%" }} aria-valuenow={`"${disk_percentage}"`} aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">...</div>
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
