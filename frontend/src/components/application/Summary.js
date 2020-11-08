import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Summary extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            regions:{},
            loadding:false
        }
        this.apiHandler = new ApiHandler();
    }
    render(){
        return(
            <div className="tab-pane fade show active" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
                <div className="row ml-2">
                    <div className="col-md-3 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-info">Name :</span>
                        <span className="mt-3 font-weight-bold text-info">Domain Name :</span>
                        <span className="mt-3 font-weight-bold text-info">Status :</span>
                        <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                    </div>
                    <div className="col-md-5 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-primary">{this.application.name}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.application.domain}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.application.status}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.application.server.ip_address}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Summary;