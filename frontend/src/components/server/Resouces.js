import React from "react";
import "../../index.css"
import ApiHandler from '../../model/ApiHandler';

class Resources extends React.Component{
    constructor(props){
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
            loadding:false,
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = ()=>{
        this.loadResources();
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
                    percentage:((((parseInt(data.memory.total[1])-parseInt(data.memory.free[1]))/1024)/((parseInt(data.memory.total[1]))/1024))*100).toFixed(0)
                },
            })
            this.setState({loadding:false})
        }, err => {
            // this.setState({loadding:false})
        })
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
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
        )
    }
}

export default Resources;