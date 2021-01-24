import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';
import { Link } from 'react-router-dom';

class ServerCard extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            created_at: props.server.created_at,
            disk: props.server.disk,
            id: props.server.id,
            ip_address: props.server.ip_address,
            memory: props.server.memory,
            name: props.server.name,
            password: props.server.password,
            region: props.server.region,
            size: props.server.size,
            status: props.server.status,
            dropButton: false,
            loadding: false,
            error: "",
            success: "",
            dropdownOpen: false,
            isServerClicked: false,

        }
        this.apiHandler = new ApiHandler();
    }
    toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))


    deleteHandle = () => {
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.deleteServer(this.state.id, "destroy", (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            window.location.href = "/servers"
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
    }
    showError(data) {
        // console.log(data)
    }
    

    render() {
        return (
            <div className="col-md-4 col-sm-12 server-card">
                <div className="server-card-header row">
                    <div className="col-sm-2 server-card-image">
                        <img alt="wordpress" style={{ width: "100%" }} src={require('../assets/images/wordpress.png')} />
                    </div>
                    <div className="col-sm-8 server-card-lebel">
                        <h5>Main Server</h5>
                        <p>Created on 12 Jan, 2020</p>
                    </div>
                    <div className="col-sm-2 server-card-status">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D"/>
                    </svg>

                    </div>
                </div>
                <div className="col-sm-12 server-card-content">
                    <div className="col-sm-12">
                        <div className="col-sm-4">Icon</div>
                        <div className="col-sm-8">12.343.23.32</div>
                    </div>
                </div>
            </div>
            /*
            <div className="card card-outline">
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-sm-9 col-md-9 application_page_card_info">
                            <div className="float-left">
                                <span className="p-2 channel_green_dot btn-success"></span>
                            </div>
                            <div className="row" onClick={()=>this.props.serverClickHandler(this.props.server)}>
                                <div className="col-1">
                                    <img alt="wordpress" style={{ width: "100%" }} src={require('../assets/images/wordpress.png')} />
                                </div>
                                <div className="col-5">
                                    <div className="d-flex">
                                        <p className="m-0">{this.state.name}</p>
                                        <span className="badge badge-info ml-4 pt-1">{this.state.status}</span>
                                    </div>
                                    <p className="m-0">{this.state.size.split("-").pop().toUpperCase()} {this.state.ip_address}</p>
                                    <p className="m-0">{this.props.region}</p>
                                    <p className="mt-3"><small>Created: {new Date(this.state.created_at).toDateString()}</small></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 col-md-3 text-right application_page_card_actions d-flex">
                            <Link to={'/applications?serverId='+this.server.id} params={{ testvalue: "hello" }} className="pl-3">
                                Applications <span className="number_of_users"> {(this.server.applications)?this.server.applications.length:0}</span>
                            </Link>
                            
                            <Dropdown direction="left" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                <DropdownToggle className="btn btn-default ml-3">
                                    <i className="fas fa-ellipsis-v"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem key="3"><a className="dropdown-item" href="#" onClick={this.deleteHandle}><i className="fa fa-trash"></i>&nbsp;Delete</a></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            */
        )
    }
}
export default ServerCard;
