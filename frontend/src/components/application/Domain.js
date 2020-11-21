import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Domain extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            domainName : this.application.domain,
            loadding:false,
            message:""
        }
        this.apiHandler = new ApiHandler();
    }
    domainNameChange = (event)=>{
        let name = event.currentTarget;
        this.setState({domainName:name.value})
    }
    updateDomainName = ()=>{
        if(this.state.loadding){
            return;
        }
        this.setState({loadding:true});
        this.apiHandler.updateDomainName(this.state.domainName, this.application.id, (message)=>{
         this.setState({loadding:false, message:message});
         this.props.loadApplications();
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
                    <div className="col-md-4">Domain Name</div>
                    <input className="col-md-6" type="text" onChange={this.domainNameChange} required value={this.state.domainName} placeholder="example.com"/>
                    <button className="btn btn-info" onClick={this.updateDomainName}>
                    {
                        this.state.loadding ?
                            <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                            : "Update"
                    }
                    </button>
                </div>
            </div>
        )
    }
}
export default Domain;