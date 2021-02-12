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
            // <div className="tab-pane fade show active" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
            //     <div className="row ml-2">
            //         <div className="col-md-3 d-flex flex-column">
            //             <span className="mt-3 font-weight-bold text-info">Name :</span>
            //             <span className="mt-3 font-weight-bold text-info">Domain Name :</span>
            //             <span className="mt-3 font-weight-bold text-info">Status :</span>
            //             <span className="mt-3 font-weight-bold text-info">IP Address :</span>
            //         </div>
            //         <div className="col-md-5 d-flex flex-column">
            //             <span className="mt-3 font-weight-bold text-primary">{this.application.name}</span>
            //             <span className="mt-3 font-weight-bold text-primary" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{this.application.domain}</span>
            //             <span className="mt-3 font-weight-bold text-primary">{this.application.status}</span>
            //             <span className="mt-3 font-weight-bold text-primary" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{this.application.server.ip_address}</span>
            //         </div>
            //     </div>
            // </div>
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
                    </div>
                </div>
            </div>
        )
    }
}
export default Summary;