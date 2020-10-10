import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';

class ApplicationCard extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.application = props.application;
        this.state = {
            created_at: props.application.created_at,
            id: props.application.id,
            domain: props.application.domain,
            server_id: props.application.server_id,
            status: props.application.status,
            username: props.application.username,
            password: props.application.password,
            db_name: props.application.db_name,
            db_username: props.application.db_username,
            db_password: props.application.db_password,
            ssl_enabled: props.application.ssl_enabled,
            server: props.application.server,
            loadding: false,
            error: "",
            success: "",
            dropdownOpen: false,
            isApplicationClicked: false,
        }
        this.apiHandler = new ApiHandler();
    }
    deleteHandle = () => {
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.deleteApplication(this.state.id, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            window.location.href = "/servers";
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }

    render() {
        return (
            <div className="col-12 application_page_cards" id="huddles">
                <div className="card card-outline">
                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-10 application_page_card_info">
                            {this.state.loadding?
                                <img src={require("../assets/images/loading.gif")} style={{ width: "45px" }} />
                                :
                                <a href="#" onClick={() => this.props.applicationClickHandler(this.props.application)} >
                                    <div className="row">
                                        <div className="col-1">
                                            <img style={{ width: "100%" }} src={require("../assets/images/wordpress.png")} />
                                        </div>
                                        <div className="col-11">
                                            <span className="text-info d-flex font-weight-bold">Domain Name : &nbsp;<p className="m-0 text-primary">{this.state.domain}</p></span>
                                            <span className="text-info d-flex font-weight-bold">Server : &nbsp;<p className="m-0 text-primary">{this.state.server.name}</p></span>
                                            <span className="text-info d-flex font-weight-bold">Status : &nbsp;<span className="text-primary">{this.state.status}</span></span>
                                            <p className="mt-3"><small>Created : {new Date(this.state.created_at).toDateString()}</small></p>
                                        </div>
                                    </div>
                                </a>
                            }
                            </div>
                            <div className="col-2 text-right application_page_card_actions">
                                <a href={"http://"+this.state.domain} target="_blank" className="pl-3"><i className="fa fa-external-link-square-alt"></i></a>
                                <div className="btn-group pl-4 px-1 dropleft" style={{ cursor: "pointer" }}>
                                    <i className="fas fa-ellipsis-v" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"></i>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#" onClick={this.deleteHandle}><i className="fa fa-trash danger"></i>&nbsp;Delete</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ApplicationCard;
