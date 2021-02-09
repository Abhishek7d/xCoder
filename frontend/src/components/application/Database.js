import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Database extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            regions: {},
            loadding: false
        }
        this.apiHandler = new ApiHandler();
    }
    render() {
        return (
            // <div className="tab-pane fade" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
            //     <div className="row ml-2">
            //         <div className="col-md-3 d-flex flex-column">
            //             <span className="mt-3 font-weight-bold text-info">DB Name :</span>
            //             <span className="mt-3 font-weight-bold text-info">DB User Name :</span>
            //             <span className="mt-3 font-weight-bold text-info">DB Password :</span>
            //             <span className="mt-3 font-weight-bold text-info">Access :</span>
            //         </div>
            //         <div className="col-md-5 d-flex flex-column">
            //             <span className="mt-3 font-weight-bold text-primary" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{this.application.db_name}</span>
            //             <span className="mt-3 font-weight-bold text-primary" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{this.application.db_username}</span>
            //             <span className="mt-3 font-weight-bold text-primary" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{this.application.db_password}</span>
            //             <span className="mt-3 font-weight-bold" style={{textDecoration:"underline"}}><a href={'//'+this.application.domain+"/phpmyadmin"} target="_blank" rel="noopener noreferrer">Access DB</a></span>
            //         </div>
            //     </div>
            // </div>
            <div className="col-sm-6 col-md-6 col-lg-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <h6 className="heading">Credentials</h6>
                        <p className="sub-heading">SSH/SFTP Access</p>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-apps.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Database Username - Click to Copy"} >
                                <p>
                                    {this.application.db_username}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-user.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Database Name - Click to Copy"} >
                                <p>
                                    {this.application.db_name}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-password.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Database Password - Click to Copy"} >
                                <p>
                                    {this.application.db_password}
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <a rel="noopener noreferrer" href={((this.application.ssl_enabled === "1") ? "https://" : 'http://') + this.application.domain + "/phpmyadmin"} target="_blank" className="btn btn-theme btn-sm">
                                Launch Database
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
export default Database;