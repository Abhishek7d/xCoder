import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Domain extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            domainName: this.application.domain,
            ssl_enabled: props.application.ssl_enabled,
            loadding: false,
            message: ""
        }
        this.apiHandler = new ApiHandler();
    }
    setMessage(message) {
        this.props.setMessage(message)
    }
    domainNameChange = (event) => {
        let name = event.currentTarget;
        this.setState({ domainName: name.value })
    }
    updateDomainName = () => {
        if (this.state.loadding) {
            return;
        }
        this.setState({ loadding: true });
        this.apiHandler.updateDomainName(this.state.domainName, this.application.id, (message) => {
            this.setState({ loadding: false, message: message });
            this.props.loadApplications();
        }, (message) => {
            this.setState({ lodding: false, message: message });
        })
    }
    updateDomainSSL = () => {
        if (this.state.loadding) {
            return;
        }
        this.setState({ loadding: true });
        this.apiHandler.updateSSL(this.application.id, (!(this.state.ssl_enabled === "1")), (message) => {
            this.setState({ loadding: false, message: message, ssl_enabled: (this.state.ssl_enabled === "1") ? "0" : "1" });
        }, (message) => {
            this.setState({ lodding: false, message: message });
        })
    }
    render() {
        return (
            <div className="col-md-12 col-lg-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <h6 className="heading">Domain Settings</h6>
                        <p className="sub-heading">Current Domain Name</p>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-8">
                                SSL Status
                            </div>
                            <div className="col-4">
                                <label className="switch" onClick={this.updateDomainSSL}>
                                    {(this.state.ssl_enabled === "1") ?
                                        <input type="checkbox" defaultChecked />
                                        : <input type="checkbox" />
                                    }
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="col-md-12">
                                <p style={{ textAlign: "left", "fontSize": '10px', 'color': '#ccc' }}>{this.state.message}</p>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="">
                                    <div className="input-group">
                                        <input className="form-control form-input-field" type="text" onChange={this.domainNameChange} required value={this.state.domainName} placeholder="example.com" />
                                        <div className="input-group-append">
                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                <path d="M23 33C17.477 33 13 28.523 13 23C13 17.477 17.477 13 23 13C28.523 13 33 17.477 33 23C33 28.523 28.523 33 23 33ZM20.71 30.667C19.7234 28.5743 19.1519 26.3102 19.027 24H15.062C15.2566 25.5389 15.8939 26.9882 16.8966 28.1717C17.8992 29.3552 19.224 30.2221 20.71 30.667ZM21.03 24C21.181 26.439 21.878 28.73 23 30.752C24.1523 28.6766 24.8254 26.3695 24.97 24H21.03ZM30.938 24H26.973C26.8481 26.3102 26.2766 28.5743 25.29 30.667C26.776 30.2221 28.1008 29.3552 29.1034 28.1717C30.1061 26.9882 30.7434 25.5389 30.938 24ZM15.062 22H19.027C19.1519 19.6898 19.7234 17.4257 20.71 15.333C19.224 15.7779 17.8992 16.6448 16.8966 17.8283C15.8939 19.0118 15.2566 20.4611 15.062 22ZM21.031 22H24.969C24.8248 19.6306 24.152 17.3235 23 15.248C21.8477 17.3234 21.1746 19.6305 21.03 22H21.031ZM25.29 15.333C26.2766 17.4257 26.8481 19.6898 26.973 22H30.938C30.7434 20.4611 30.1061 19.0118 29.1034 17.8283C28.1008 16.6448 26.776 15.7779 25.29 15.333Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-3">
                                    <button className="btn btn-theme btn-sm" onClick={this.updateDomainName}>
                                        {
                                            this.state.loadding ?
                                                <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                : "Update"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Domain;