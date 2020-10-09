import React from 'react';

class CronJobs extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.state = {
            serviceLoadding:false
        }
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <div class="card">
                    <div class="card-body p-0">
                    <table class="table">
                        <thead>
                            <tr>
                            <th style={{width: "10px"}}>#</th>
                            <th>Schedule</th>
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
export default CronJobs;