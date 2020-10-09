import React from 'react';

class Credentials extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <div className="row ml-2">
                    <div className="col-md-12 d-flex flex-column">
                        <h5>SSH/SFTP Access
                        </h5>
                    </div>
                    <div className="col-sm-6 col-md-2 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-info">Username :</span>
                        <span className="mt-3 font-weight-bold text-info">Password :</span>
                        <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                    </div>
                    <div className="col-sm-6 col-md-2 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-primary">{"admin"}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.password}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.ip_address}</span>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Credentials;