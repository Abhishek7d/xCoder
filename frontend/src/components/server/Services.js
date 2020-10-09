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
            serviceLoadding:false
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
        this.apiHandler.getServicesStatus(this.server.id, (data)=>{
            this.setState({
                apache:(data.apache==="active"),
                nginx:(data.nginx==="active"),
                mysql:(data.mysql==="active"),
                cron:(data.cron==="active")
            })
        }, (err)=>{
            console.log(err);
        })
    }
    render(){
        return (
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <div class="card">
                    <div class="card-body p-0">
                    <table class="table">
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
                                        <><div class="dot-green"></div>Running</>
                                        :
                                        <><div class="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.apache)?
                                    <a class="btn btn-info white " onClick={()=>this.updateService("apache")}>Stop</a>
                                    :
                                    <a class="btn btn-info white" onClick={()=>this.updateService("apache")}>Start</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>MySQL</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.mysql)?
                                        <><div class="dot-green"></div>Running</>
                                        :
                                        <><div class="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.mysql)?
                                    <a class="btn btn-info white " onClick={()=>this.updateService("mysql")}>Stop</a>
                                    :
                                    <a class="btn btn-info white" onClick={()=>this.updateService("mysql")}>Start</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>Nginx</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.nginx)?
                                        <><div class="dot-green"></div>Running</>
                                        :
                                        <><div class="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.nginx)?
                                    <a class="btn btn-info white " onClick={()=>this.updateService("nginx")}>Stop</a>
                                    :
                                    <a class="btn btn-info white" onClick={()=>this.updateService("nginx")}>Start</a>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>#</td>
                                <td>CRON</td>
                                <td>
                                    <div style={{display:"flex"}}>
                                        {(this.state.cron)?
                                        <><div class="dot-green"></div>Running</>
                                        :
                                        <><div class="dot-red"></div>Stopped</>
                                        }
                                    </div>
                                </td>
                                <td>
                                    {(this.state.cron)?
                                    <a class="btn btn-info white " onClick={()=>this.updateService("cron")}>Stop</a>
                                    :
                                    <a class="btn btn-info white" onClick={()=>this.updateService("cron")}>Start</a>
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