import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApplicationDetails from '../screens/ApplicationDetails'

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
            loadding: false,
            error: "",
            success: "",
            dropdownOpen: false,
            isApplicationClicked: false,
        }
    }
    deleteHandle = () => {
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.deleteApplication(this.state.id, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            console.log(data, message);
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }
    applicationClickHandler = () => {
        this.setState(prevState => ({
            isApplicationClicked: !prevState.isApplicationClicked
        }))
        this.props.applicationClick
    }

    render() {
        if (this.state.isApplicationClicked) {
            return (<ApplicationDetails application={this.props.application} />)
        }
        else {
            return (
                <div className="col-12 application_page_cards" id="huddles">
                    <div className="card card-outline">
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col-10 application_page_card_info">
                                    <a href="#" onClick={this.applicationClickHandler} >
                                        <div className="row">
                                            <div className="col-1">
                                                <img style={{ width: "50%" }} src={require("../assets/images/wordpress.png")} />
                                            </div>
                                            <div className="col-4">
                                                <h6 className="text-info font-weight-bold">Domain Name : <span className="bg-primary px-2 pb-1 rounded">{this.state.domain}</span></h6>
                                                <span className="text-info d-flex font-weight-bold">Server : &nbsp;<p className="m-0 text-primary">Lifehacks Server</p></span>
                                                <span className="text-info d-flex font-weight-bold">Status : &nbsp;<span className="text-primary">{this.state.status}</span></span>
                                                <p className="mt-3"><small>Created : {this.state.created_at}</small></p>

                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div className="col-2 text-right application_page_card_actions">
                                    <a href="" className="pl-3"><i className="fa fa-external-link-square-alt"></i></a>
                                    <a href="" className="pl-3"><i className="fa fa-user"><span className="number_of_users">0</span></i></a>
                                    <div className="btn-group pl-4 px-1 dropleft" style={{ cursor: "pointer" }}>
                                        <i className="fas fa-ellipsis-v" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false"></i>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="#" onClick={this.deleteHandle}><i className="fa fa-trash danger"></i>&nbsp;Delete</a>
                                            <a className="dropdown-item" href="#"><i className="fa fa-clone info"></i>&nbsp;Clone App/Create Staging</a>
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
}
export default ApplicationCard;
