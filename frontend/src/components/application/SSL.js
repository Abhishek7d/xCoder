import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class SSL extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            regions:{},
            loadding:false,
            ssl_enabled: props.application.ssl_enabled
        }
        this.apiHandler = new ApiHandler();
    }
    setMessage (message){
        this.props.setMessage(message)
    }
    updateDomainName = ()=>{
        if(this.state.loadding){
            return;
        }
        this.setState({loadding:true});
        this.apiHandler.updateSSL(this.application.id, (!(this.state.ssl_enabled == 1)),(message)=>{
            this.setState({loadding:false, message:message, ssl_enabled: (this.state.ssl_enabled == 1)?0:1});
            
        }, (message)=>{
            this.setState({lodding:false, message:message});
        })
    }
    render(){
        return(
            <div className="tab-pane fade show" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
                <p style={{textAlign:"center"}}>{this.state.message}</p>
                <br/>
                <div className="row" style={{width:"70%"}}>
                    <div className="col-md-4">SSL Status </div>
                    <button className={"btn btn-"+((this.state.ssl_enabled==1)?"danger":"info")} onClick={this.updateDomainName}>
                    {
                        this.state.loadding ?
                            <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                            : ((this.state.ssl_enabled==1)?"Disable":"Enable")
                    }
                    </button>
                </div>
            </div>
        )
    }
}
export default SSL;