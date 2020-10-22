import React from 'react';
import ApiHandler from '../../model/ApiHandler';

class Services extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            apache:false,
            nginx:false,
            mysql:false,
            cron:false,
            serviceLoadding:false,
            loadding:false
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount=()=>{
        this.getServices()
    }
    updateService = (service)=>{
        this.setState({serviceLoadding:true});
        this.apiHandler.updateService(this.server.id, service, !this.state[service],()=>{
            this.apiHandler.getServicesStatus(this.server.id, (data)=>{
                this.setState({
                    apache:(data.apache==="active"),
                    nginx:(data.nginx==="active"),
                    mysql:(data.mysql==="active"),
                    cron:(data.cron==="active"),
                    serviceLoadding:false
                })
            }, (err)=>{
                console.log(err);
            })
        })
    }
    getServices = () =>{
        this.setState({serviceLoadding:true})
        this.apiHandler.getServicesStatus(this.server.id, (data)=>{
            this.setState({
                apache:(data.apache==="active"),
                nginx:(data.nginx==="active"),
                mysql:(data.mysql==="active"),
                cron:(data.cron==="active"),
                serviceLoadding:false
            })
        }, (err)=>{
            console.log(err);
        })
    }
    render(){
        return (
            <div className="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <div className="card">
                    <div className="card-body p-0">
                    <table className="table">
                        <thead>
                            <tr>
                            <th style={{width: "10px"}}></th>
                            <th>Service</th>
                            <th>Status</th>
                            <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(this.state.serviceLoadding)?
                            <tr>
                            </tr>
                            :
                            <>
                            <tr>
                                <td>#</td>
                                <td>Apache</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.apache)?
                                        <><div className="dot-green"></div>Running</>
                                        :
                                        <><div className="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.apache)?
                                    <div className="btn btn-info white " onClick={()=>this.updateService("apache")}>Stop</div>
                                    :
                                    <div className="btn btn-info white" onClick={()=>this.updateService("apache")}>Start</div>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>MySQL</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.mysql)?
                                        <><div className="dot-green"></div>Running</>
                                        :
                                        <><div className="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.mysql)?
                                    <a className="btn btn-info white " onClick={()=>this.updateService("mysql")}>Stop</a>
                                    :
                                    <a className="btn btn-info white" onClick={()=>this.updateService("mysql")}>Start</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>Nginx</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.nginx)?
                                        <><div className="dot-green"></div>Running</>
                                        :
                                        <><div className="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.nginx)?
                                    <a className="btn btn-info white " onClick={()=>this.updateService("nginx")}>Stop</a>
                                    :
                                    <a className="btn btn-info white" onClick={()=>this.updateService("nginx")}>Start</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>CRON</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.cron)?
                                        <><div className="dot-green"></div>Running</>
                                        :
                                        <><div className="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.cron)?
                                    <a className="btn btn-info white " onClick={()=>this.updateService("cron")}>Stop</a>
                                    :
                                    <a className="btn btn-info white" onClick={()=>this.updateService("cron")}>Start</a>
                                    }
                                </td>
                            </tr>
                            </>
                            }
                        </tbody>
                        </table>
                        {(this.state.serviceLoadding)?
                            <div style={{width: "100%",paddingLeft: "40%"}}>
                                <img src={require("../../assets/images/loading.gif")} style={{width:"100px"}} className="serviceLoadding"/>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
            
        )
    }
}
export default Services;