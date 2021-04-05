import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Summary extends React.Component {
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
            <div className="col-sm-6 col-md-6 col-lg-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <h6 className="heading">Admin Credentials</h6>
                        <p className="sub-heading">WordPress Details</p>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.application.name}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/domain.svg")} alt="" srcSet="" />
                            </div>
                            <div onClick={this.props.copyToClipBoard} title={"Click to Copy"} className="col-10"><p>{this.application.domain}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div onClick={this.props.copyToClipBoard} title={"Click to Copy"} className="col-10"><p>{this.application.server.ip_address}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-user.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Database Name - Click to Copy"} >
                                <p>
                                    {(this.application.username) ? this.application.username : 'Unknown'}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-password.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Database Password - Click to Copy"} >
                                <p>
                                    {(this.application.password) ? this.application.password : 'Unknown'}
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <a rel="noopener noreferrer" href={((this.application.ssl_enabled === "1") ? "https://" : 'http://') + this.application.domain + "/wp-login.php"} target="_blank" className="btn btn-theme btn-sm">
                                Login to Wordpress
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Summary;