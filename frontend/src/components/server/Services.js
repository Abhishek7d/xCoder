import React from 'react';
import ApiHandler from '../../model/ApiHandler';

class Services extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            apache: false,
            nginx: false,
            mysql: false,
            cron: false,
            serviceLoadding: false,
            loadding: false
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.getServices()
    }
    updateService = (service) => {
        this.setState({ serviceLoadding: true });
        this.apiHandler.updateService(this.server.id, service, !this.state[service], () => {
            this.apiHandler.getServicesStatus(this.server.id, (data) => {
                this.setState({
                    apache: (data.apache === "active"),
                    nginx: (data.nginx === "active"),
                    mysql: (data.mysql === "active"),
                    cron: (data.cron === "active"),
                    serviceLoadding: false
                })
            }, (err) => {
                console.log(err);
            })
        })
    }
    getServices = () => {
        this.setState({ serviceLoadding: true })
        this.apiHandler.getServicesStatus(this.server.id, (data) => {
            this.setState({
                apache: (data.apache === "active"),
                nginx: (data.nginx === "active"),
                mysql: (data.mysql === "active"),
                cron: (data.cron === "active"),
                serviceLoadding: false
            })
        }, (err) => {
            console.log(err);
        })
    }
    render() {
        return (
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="heading">Services</h6>
                                <p className="sub-heading">Cureent running services</p>
                            </div>
                            <div onClick={this.getServices} className="col-2 text-right align-self-center cursor-pointer">
                                <svg className={(this.state.serviceLoadding) ? "loading" : ""} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.463 2.43301C5.27756 0.86067 7.59899 -0.00333986 10 9.70266e-06C15.523 9.70266e-06 20 4.47701 20 10C20 12.136 19.33 14.116 18.19 15.74L15 10H18C18.0001 8.43163 17.5392 6.89781 16.6747 5.58927C15.8101 4.28072 14.5799 3.25517 13.1372 2.64013C11.6944 2.0251 10.1027 1.84771 8.55996 2.13003C7.0172 2.41234 5.59145 3.14191 4.46 4.22801L3.463 2.43301ZM16.537 17.567C14.7224 19.1393 12.401 20.0034 10 20C4.477 20 0 15.523 0 10C0 7.86401 0.67 5.88401 1.81 4.26001L5 10H2C1.99987 11.5684 2.46075 13.1022 3.32534 14.4108C4.18992 15.7193 5.42007 16.7449 6.86282 17.3599C8.30557 17.9749 9.89729 18.1523 11.44 17.87C12.9828 17.5877 14.4085 16.8581 15.54 15.772L16.537 17.567Z" fill="#3E3E3E" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="card-body services">
                        {
                            (this.state.serviceLoadding) ?
                                <div className="row" style={{ height: "75%" }}>
                                    <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "50px", margin: "auto" }} className="align-middle" />
                                </div>
                                :
                                <div>
                                    <div className="row">
                                        <div className="col-4">
                                            Apache
                                        </div>
                                        <div className="col-3">
                                            {(this.state.apache) ?
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D" />
                                                </svg>
                                                :
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302" />
                                                </svg>
                                            }
                                        </div>
                                        <div className="col-5" onClick={() => this.updateService("apache")}>
                                            <button type="button" className="btn btn-theme btn-sm pl-4 pr4">
                                                {(this.state.apache) ?
                                                    "Stop"
                                                    :
                                                    "Start"
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-4">
                                            MySQL
                                        </div>
                                        <div className="col-3">
                                            {(this.state.mysql) ?
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D" />
                                                </svg>
                                                :
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302" />
                                                </svg>
                                            }
                                        </div>
                                        <div className="col-5" onClick={() => this.updateService("mysql")} >
                                            <button type="button" className="btn btn-theme btn-sm pl-4 pr4">
                                                {(this.state.mysql) ?
                                                    "Stop"
                                                    :
                                                    "Start"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            Nginx
                                        </div>
                                        <div className="col-3">
                                            {(this.state.nginx) ?
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D" />
                                                </svg>
                                                :
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302" />
                                                </svg>
                                            }
                                        </div>
                                        <div className="col-5" onClick={() => this.updateService("nginx")} >
                                            <button type="button" className="btn btn-theme btn-sm pl-4 pr4">
                                                {(this.state.nginx) ?
                                                    "Stop"
                                                    :
                                                    "Start"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            CRON
                                        </div>
                                        <div className="col-3">
                                            {(this.state.cron) ?
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D" />
                                                </svg>
                                                :
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302" />
                                                </svg>
                                            }
                                        </div>
                                        <div className="col-5" onClick={() => this.updateService("cron")} >
                                            <button type="button" className="btn btn-theme btn-sm pl-4 pr4">
                                                {(this.state.cron) ?
                                                    "Stop"
                                                    :
                                                    "Start"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            // <div className="col-md-4 col-12 server-card">
            //     <div className="server-card-header row">
            //         <div className="col-10 server-card-lebel">
            //             <h6>Services</h6>
            //             <p>Cureent running services</p>
            //         </div>
            //     </div>
            //     {(this.state.serviceLoadding)?
            //         <div className="row" style={{height:"75%"}}>
            //             <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{width: "50px", margin:"auto"}}/>
            //         </div>
            //         :
            //         <div className="col-12 server-card-content service">
            //             <div className="row">
            //                 <div className="col-4">
            //                     Apache
            //                 </div>
            //                 <div className="col-3">
            //                     {(this.state.apache)?
            //                         <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                             <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D"/>
            //                         </svg>
            //                         :
            //                         <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                             <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302"/>
            //                         </svg>
            //                     }
            //                 </div>
            //                 <div className="col-5"  onClick={()=>this.updateService("apache")} >
            //                     <button type="button" className="theme-btn stipe">
            //                         {(this.state.apache)?
            //                             "Stop"
            //                             :
            //                             "Start"
            //                         }
            //                     </button>
            //                 </div>
            //             </div>

            //             <div className="row">
            //                 <div className="col-4">
            //                     MySQL
            //                 </div>
            //                 <div className="col-3">
            //                     {(this.state.mysql)?
            //                         <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                             <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D"/>
            //                         </svg>
            //                         :
            //                         <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                             <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302"/>
            //                         </svg>
            //                     }
            //                 </div>
            //                 <div className="col-5"  onClick={()=>this.updateService("mysql")} >
            //                     <button type="button" className="theme-btn stipe">
            //                         {(this.state.mysql)?
            //                             "Stop"
            //                             :
            //                             "Start"
            //                         }
            //                     </button>
            //                 </div>
            //             </div>

            //         </div>
            //     }
            // </div>
            // <div className="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
            //     <div className="card">
            //         <div className="card-body p-0">
            //         <table className="table">
            //             <thead>
            //                 <tr>
            //                 <th style={{width: "10px"}}></th>
            //                 <th>Service</th>
            //                 <th>Status</th>
            //                 <th >Action</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //                 {(this.state.serviceLoadding)?
            //                 <tr>
            //                 </tr>
            //                 :
            //                 <>
            //                 <tr>
            //                     <td>#</td>
            //                     <td>Apache</td>
            //                     <td>
            //                         <div style={{display:"flex"}}>
            //                             {(this.state.apache)?
            //                             <><div className="dot-green"></div>Running</>
            //                             :
            //                             <><div className="dot-red"></div>Stopped</>
            //                             }
            //                         </div>
            //                     </td>
            //                     <td>
            //                         {(this.state.apache)?
            //                         <div className="btn btn-info white " onClick={()=>this.updateService("apache")}>Stop</div>
            //                         :
            //                         <div className="btn btn-info white" onClick={()=>this.updateService("apache")}>Start</div>
            //                         }
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>#</td>
            //                     <td>MySQL</td>
            //                     <td>
            //                         <div style={{display:"flex"}}>
            //                             {(this.state.mysql)?
            //                             <><div className="dot-green"></div>Running</>
            //                             :
            //                             <><div className="dot-red"></div>Stopped</>
            //                             }
            //                         </div>
            //                     </td>
            //                     <td>
            //                         {(this.state.mysql)?
            //                         <a className="btn btn-info white " onClick={()=>this.updateService("mysql")}>Stop</a>
            //                         :
            //                         <a className="btn btn-info white" onClick={()=>this.updateService("mysql")}>Start</a>
            //                         }
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>#</td>
            //                     <td>Nginx</td>
            //                     <td>
            //                         <div style={{display:"flex"}}>
            //                             {(this.state.nginx)?
            //                             <><div className="dot-green"></div>Running</>
            //                             :
            //                             <><div className="dot-red"></div>Stopped</>
            //                             }
            //                         </div>
            //                     </td>
            //                     <td>
            //                         {(this.state.nginx)?
            //                         <a className="btn btn-info white " onClick={()=>this.updateService("nginx")}>Stop</a>
            //                         :
            //                         <a className="btn btn-info white" onClick={()=>this.updateService("nginx")}>Start</a>
            //                         }
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>#</td>
            //                     <td>CRON</td>
            //                     <td>
            //                         <div style={{display:"flex"}}>
            //                             {(this.state.cron)?
            //                             <><div className="dot-green"></div>Running</>
            //                             :
            //                             <><div className="dot-red"></div>Stopped</>
            //                             }
            //                         </div>
            //                     </td>
            //                     <td>
            //                         {(this.state.cron)?
            //                         <a className="btn btn-info white " onClick={()=>this.updateService("cron")}>Stop</a>
            //                         :
            //                         <a className="btn btn-info white" onClick={()=>this.updateService("cron")}>Start</a>
            //                         }
            //                     </td>
            //                 </tr>
            //                 </>
            //                 }
            //             </tbody>
            //             </table>
            //             {(this.state.serviceLoadding)?
            //                 <div style={{width: "100%",paddingLeft: "40%"}}>
            //                     <img src={require("../../assets/images/loading.gif")} style={{width:"100px"}} className="serviceLoadding"/>
            //                 </div>
            //                 :
            //                 <></>
            //             }
            //         </div>
            //     </div>
            // </div>

        )
    }
}
export default Services;