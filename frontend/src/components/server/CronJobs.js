import React from 'react';
import EditCorn from './EditCorn';
import ApiHandler from '../../model/ApiHandler';

class CronJobs extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            crons:{},
            serviceLoadding:false,
            editCorn:null,
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount(){
        this.getCrons();
    }
    getCrons = ()=>{
        this.setState({serviceLoadding:true})
        this.apiHandler.getCronJobs(this.server.id, (data)=>{
            this.setState({crons:data,serviceLoadding:false})
        })
    }
    cronAction = (action, cronId)=>{
        this.setState({serviceLoadding:true})
        this.apiHandler.cronAction(this.server.id, cronId, action, (data)=>{
            this.getCrons();
        })
    }
    cronEdit = (event)=>{
        let tmpJobID = event.target.getAttribute("jobid");
        this.setState({editCorn:this.state.crons[tmpJobID]})
    }
    cancelEdit = ()=>{
        this.setState({editCorn:null})
    }
    renderCrons = ()=>{
        let output = [];
        let tmpout = null;
        let tmpbuffer = null;
        let count = 1;
        Object.keys(this.state.crons).forEach(key=>{
            tmpout = this.state.crons[key];
            tmpbuffer = <tr key={tmpout.JOB}>
                <th>#{tmpout.JOB}</th>
                <th>{tmpout.MIN} {tmpout.HOUR} {tmpout.DAY} {tmpout.MONTH} {tmpout.WDAY}</th>
                <th>{tmpout.CMD}</th>
                <th>
                    <div style={{display:"flex"}}>
                        {(tmpout.SUSPENDED==="no")?
                        <><div class="dot-green"></div>Running</>
                        :
                        <><div class="dot-red"></div>Suspended</>
                        }
                    </div>
                </th>
                <th>
                    <div className="cron-action">
                        <button type="button" class="btn btn-primary" jobid={tmpout.JOB} onClick={this.cronEdit}>Edit</button>
                        {(tmpout.SUSPENDED==="no")?
                        <button type="button" class="btn btn-primary" onClick={()=>this.cronAction("suspend", tmpout.JOB)}>Suspend</button>
                        :
                        <button type="button" class="btn btn-primary" onClick={()=>this.cronAction("unsuspend", tmpout.JOB)}>Unsuspend</button>
                        }
                        <button type="button" class="btn btn-danger" onClick={()=>this.cronAction("delete", tmpout.JOB)}>Delete</button>
                    </div>
                </th>
            </tr>
            output.push(tmpbuffer)
        })
        return output;
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                {(this.state.editCorn===null)?
                    <div class="card">
                        <div class="card-body p-0">
                        <table class="table">
                            <thead>
                                <tr>
                                <th style={{width: "10px"}}>ID</th>
                                <th>Schedule</th>
                                <th>Command</th>
                                <th>Status</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.serviceLoadding)?
                                <tr>
                                </tr>
                                :
                                this.renderCrons()
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
                    :
                <EditCorn cron={this.state.editCorn} serverId={this.server.id} cancel={this.cancelEdit} />
                }
            </div>
        )
    }
}
export default CronJobs;