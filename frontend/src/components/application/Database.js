import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Database extends React.Component{
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
            <div className="tab-pane fade" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
                <div className="row ml-2">
                    <div className="col-md-3 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-info">DB Name :</span>
                        <span className="mt-3 font-weight-bold text-info">DB User Name :</span>
                        <span className="mt-3 font-weight-bold text-info">DB Password :</span>
                        <span className="mt-3 font-weight-bold text-info">Access :</span>
                    </div>
                    <div className="col-md-5 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-primary">{this.application.db_name}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.application.db_username}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.application.db_password}</span>
                        <span className="mt-3 font-weight-bold" style={{textDecoration:"underline"}}><a href={'//'+this.application.domain+"/phpmyadmin"} target="_blank" rel="noopener noreferrer">Access DB</a></span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Database;