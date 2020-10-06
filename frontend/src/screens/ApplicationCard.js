import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
        }
    }
    toggleDropdown = () => this.setState(prevState => ({dropdownOpen: !prevState.dropdownOpen}))
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
    render() {
        return (
            <div className="col-12 application_page_cards" id="huddles">
                <div className="card card-outline">
                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-10 application_page_card_info">
                                <a href="application.php">
                                    <div className="row">
                                        <div className="col-1">
                                            <img style={{width:"50%"}} src={require("../assets/images/wordpress.png")} />
                                        </div>
                                        <div className="col-11">
                                            <h6><b>Test</b></h6>
                                            <p className="m-0">Server: Lifehacks Server</p>
                                            <p className="m-0">Project: Lifehacks World Conquering</p>
                                            <p className="mt-3"><small>Created: 12 March, 2020</small></p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-2 text-right application_page_card_actions">
                                <a href="" className="pl-3"><i className="fa fa-external-link-square-alt"></i></a>
                                <a href="" className="pl-3"><i className="fa fa-user"><span className="number_of_users">0</span></i></a>
                                {/* <div className="btn-group pl-3 dropleft">
                                    <i className="fas fa-ellipsis-v" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"></i>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#"><i className="fa fa-trash danger"></i>&nbsp;Delete</a>
                                        <a className="dropdown-item" href="#"><i className="fa fa-clone info"></i>&nbsp;Clone App/Create Staging</a>
                                    </div>
                                </div> */}
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                    <DropdownToggle>
                                        Dropdown
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><a href="#"><i className="fa fa-trash danger"></i>&nbsp;Delete</a></DropdownItem>
                                        <DropdownItem><a href="#" onClick={this.deleteHandle}><i className="fa fa-clone info"></i>&nbsp;Clone App/Create Staging</a></DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ApplicationCard;
