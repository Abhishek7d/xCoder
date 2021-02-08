import React, { Component } from 'react'
import Summary from "./application/Summary";
import Database from "./application/Database";
import Domain from "./application/Domain";
import SSL from "./application/SSL";
import FTP from "./application/FTP";
import copy from 'copy-to-clipboard';

class ApplicationDetails extends Component {
    constructor(props) {
        super()
        this.props = props;
        this.application = props.application;
        this.server = props.application.server;
        this.state = {
            id: props.id,
            loadding: false
        }
    }
    copyToClipBoard = (event) => {
        let text = event.currentTarget.innerText;
        copy(text);
    }
    setMessage(message) {
        this.props.setMessage(message);
    }
    render() {
        return (
            <>
                <Summary key={this.state.id} copyToClipBoard={this.copyToClipBoard} tabId={"summary-tab"} active={true} server={this.server} application={this.application} />
                <Database key={this.state.id} copyToClipBoard={this.copyToClipBoard} tabId={"database-tab"} active={true} server={this.server} application={this.application} />
                <Domain key={this.state.id} copyToClipBoard={this.copyToClipBoard} setMessage={this.props.setMessage} loadApplications={this.props.loadApplications} tabId={"domain-name-tab"} active={true} server={this.server} application={this.application} />
                <FTP key={this.state.id} copyToClipBoard={this.copyToClipBoard} loadApplications={this.props.loadApplications} tabId={"ftp-tab"} active={true} server={this.server} application={this.application} />
            </>
        )
    }
}
export default ApplicationDetails;
