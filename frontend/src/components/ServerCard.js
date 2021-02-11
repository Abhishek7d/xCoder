import React from "react";
import ApiHandler from '../model/ApiHandler';
import { Link } from 'react-router-dom';
import Status from '../components/Status';

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
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-3">
                <div className="card cursor-pointer">
                    <div className="card-header" onClick={() => this.props.serverClickHandler(this.props.server)}>
                        <div className="row no-gutters">
                            <div className="col-2 p-1 align-self-center pl-0">
                                <img alt="wordpress" style={{ width: "100%" }} src={require("../assets/images/wordpress.png")} />
                            </div>
                            <div className="col-8 p-2 align-self-center">
                                <h6 className="heading">{this.server.name}</h6>
                                <p className="sub-heading">
                                    Created: {new Date(this.state.created_at).toDateString()}
                                </p>
                            </div>
                            <div className="col-2 align-self-center text-right">
                                <Status status={this.server.status} />
                            </div>
                        </div>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row" onClick={() => this.props.serverClickHandler(this.props.server)}>
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.state.ip_address}</p></div>
                        </div>
                        <div className="row" onClick={() => this.props.serverClickHandler(this.props.server)}>
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.state.size.split("-").pop().toUpperCase()}</p></div>
                        </div>
                        <div className="row" onClick={() => this.props.serverClickHandler(this.props.server)}>
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-location.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.props.region}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-apps.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10">
                                <p>
                                    <Link to={'/applications?serverId=' + this.server.id} style={{ color: "inherit" }}>
                                        {(this.server.applications) ? this.server.applications.length : 0} Applications
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className="col-md-4 col-12 server-card" onClick={() => this.props.serverClickHandler(this.props.server)}>
            //     <div className="server-card-header row">
            //         <div className="col-2 server-card-image">
            //             <img alt="wordpress" style={{ width: "35px" }} src={require('../assets/images/wordpress.png')} />
            //         </div>
            //         <div className="col-8 server-card-lebel">
            //             <h6>{this.server.name}</h6>
            //             <p>{new Date(this.state.created_at).toDateString()}</p>
            //         </div>
            //         <div className="col-2 server-card-status" title={this.server.status}>
            //             <Status status={this.server.status} />
            //         </div>
            //     </div>
            //     <div className="col-12 server-card-content">
            //         <div className="col-12 row">
            //             <div className="col-3">
            //                 <img src={require("../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
            //             </div>
            //             <div className="col-9">{this.state.ip_address}</div>
            //         </div>
            //         <div className="col-12 row">
            //             <div className="col-3">
            //                 <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
            //             </div>
            //             <div className="col-9">{this.state.size.split("-").pop().toUpperCase()}</div>
            //         </div>
            //         <div className="col-12 row">
            //             <div className="col-3">
            //                 <img src={require("../assets/images/icons/server-location.svg")} alt="" srcSet="" />
            //             </div>
            //             <div className="col-9">{this.props.region}</div>
            //         </div>
            //         <div className="col-12 row">
            //             <div className="col-3">
            //                 <img src={require("../assets/images/icons/server-apps.svg")} alt="" srcSet="" />
            //             </div>
            //             <div className="col-9">
            //                 <Link to={'/applications?serverId=' + this.server.id} style={{ color: "inherit" }}>
            //                     {(this.server.applications) ? this.server.applications.length : 0} Applications
            //                 </Link>
            //             </div>
            //         </div>
            //     </div>
            // </div>
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
