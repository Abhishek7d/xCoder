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
                        <h6 className="heading">Summary</h6>
                        <p className="sub-heading">Genral Details</p>
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
                                <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div onClick={this.props.copyToClipBoard} title={"Click to Copy"} className="col-10"><p>{this.application.domain}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div onClick={this.props.copyToClipBoard} title={"Click to Copy"} className="col-10"><p>{this.application.server.ip_address}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Summary;