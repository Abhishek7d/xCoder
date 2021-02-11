import React from "react";
import ApiHandler from '../../model/ApiHandler';
import SemiCircleProgressBar from "react-progressbar-semicircle";

class ServerHealth extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            cpu: 0,
            disk: {
                used: 0,
                available: 10,
                total: 10,
                percentage: 0
            },
            memory: {
                used: 0,
                available: 10,
                total: 10,
                percentage: 0
            },
            loading: false,
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.loadResources();
    }
    loadResources = () => {
        if (this.state.loading) {
            console.log("still loadding")
            return;
        }
        this.setState({ loading: true })

        this.apiHandler.getResources(this.server.id, (msg, data) => {
            this.setState({
                cpu: parseFloat(data.cpu).toFixed(2),
                disk: {
                    used: data.disk.used,
                    available: data.disk.available,
                    total: data.disk.total,
                    percentage: parseFloat(data.disk.usage).toFixed(2)
                },
                memory: {
                    used: ((parseInt(data.memory.total[1]) - parseInt(data.memory.free[1])) / 1024).toFixed(0) + " MB",
                    available: ((parseInt(data.memory.free[1])) / 1024).toFixed(0) + " MB",
                    total: ((parseInt(data.memory.total[1])) / 1024).toFixed(0) + " MB",
                    percentage: ((((parseInt(data.memory.total[1]) - parseInt(data.memory.free[1])) / 1024) / ((parseInt(data.memory.total[1])) / 1024)) * 100).toFixed(0)
                },
            })
            this.setState({ loading: false })
        }, err => {
            // this.setState({loading:false})
        })
    }
    render() {
        return (
            // <div className="tab-pane fade" id={"pills-" + this.props.tabId} role="tabpanel" aria-labelledby={"pills-" + this.props.tabId + "-tab"}>
            //     <div onClick={this.loadResources} className="col-md-12" style={{ display: "flex" }}>
            //         <h5 className="col-sm-2" style={{ minWidth: "max-content" }}>Refresh Data</h5>
            //         <i className={(this.state.loadding) ? "fas fa-sync spin" : "fas fa-sync "} style={{ width: "17px", height: "17px" }}></i>
            //     </div>
            //     <div className="col-sm-12">
            //         <span style={{ fontSize: "12px" }}>CPU Usage - {this.state.cpu}%</span>
            //         <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
            //             <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.cpu + "%", color: "rgb(40 167 69) !important" }} >-</div>
            //         </div>
            //         <span style={{ fontSize: "12px" }}>RAM Usage - {this.state.memory.available}  Free of {this.state.memory.total} (Used: {this.state.memory.used})</span>
            //         <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
            //             <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.memory.percentage + "%", color: "rgb(40 167 69) !important" }} >-</div>
            //         </div>
            //         <span style={{ fontSize: "12px", marginTop: "10px" }}>Disk Usage - {this.state.disk.available} Free of {this.state.disk.total} (Used: {this.state.disk.used})</span>
            //         <div className="progress mt-1 mb-3" style={{ borderRadius: "10px", height: "10px" }}>
            //             <div className="progress-bar bg-success" role="progressbar" style={{ width: this.state.disk.percentage + "%", color: "rgb(40 167 69) !important" }}>-</div>
            //         </div>
            //     </div>
            // </div>

            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
                <div className="card server-health">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="heading">Server Health</h6>
                                <p className="sub-heading">Check Health </p>
                            </div>
                            <div onClick={this.loadResources} className="col-2 text-right align-self-center cursor-pointer">
                                <svg className={(this.state.loading) ? "loading" : ""} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.537 17.567C14.7224 19.1393 12.401 20.0033 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 12.136 19.33 14.116 18.19 15.74L15 10H18C17.9998 8.15621 17.3628 6.36906 16.1967 4.94089C15.0305 3.51272 13.4069 2.53119 11.6003 2.16236C9.79381 1.79352 7.91533 2.06002 6.28268 2.91677C4.65002 3.77351 3.36342 5.16791 2.64052 6.86408C1.91762 8.56025 1.80281 10.4541 2.31549 12.2251C2.82818 13.9962 3.93689 15.5358 5.45408 16.5836C6.97127 17.6313 8.80379 18.1228 10.6416 17.9749C12.4795 17.827 14.2099 17.0488 15.54 15.772L16.537 17.567Z" fill="#3E3E3E" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="progress-container">
                                    <SemiCircleProgressBar className="mt-0" stroke="#FFD302" percentage={parseInt(this.state.memory.percentage)} diameter={130} />
                                    <div className="server-status ram">
                                        {this.state.memory.used}
                                    </div>
                                    <div className="server-status-name">
                                        RAM
                                    </div>
                                    <div className="server-status-subtext">
                                        {this.state.memory.available}  Free of {this.state.memory.total}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="progress-container">
                                    <SemiCircleProgressBar stroke="#FFD302" percentage={parseInt(this.state.cpu)} diameter={130} />
                                    <div className="server-status cpu">
                                        {this.state.cpu} %
                                    </div>
                                    <div className="server-status-name">
                                        CPU
                                    </div>
                                    <div className="server-status-subtext">

                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="progress-container">
                                    <SemiCircleProgressBar stroke="#FFD302" percentage={parseInt(this.state.disk.percentage)} diameter={130} />
                                    <div className="server-status disk">
                                        {this.state.disk.used}
                                    </div>
                                    <div className="server-status-name">
                                        Disk
                                    </div>
                                    <div className="server-status-subtext">
                                        {this.state.disk.available} Free of {this.state.disk.total}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ServerHealth;