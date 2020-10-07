import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';

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
            resourses: {
                cpu: "1.11758%",
                disk: {
                    total: "25G",
                    used: "2.5G",
                    available: "22G",
                    usage: "11%"
                },
                memory: {
                    total: [
                        "MemTotal:",
                        "1015896",
                        "kB"
                    ],
                    free: [
                        "MemFree:",
                        "137144",
                        "kB"
                    ],
                    available: [
                        "MemAvailable:",
                        "460400",
                        "kB"
                    ]
                }
            },
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount() {
        this.apiHandler.getResources(this.state.id, (msg, data) => {
            console.log(data, msg);
            this.setState({ resources: data })
        }, err => {
            console.log(err);
            this.showError(err);
        })
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
    render() {
        return (
            <div className="card card-outline">
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-sm-12 col-md-9 application_page_card_info">
                            <div className="float-left">
                                <span className="p-2 channel_green_dot btn-success"></span>
                            </div>
                            <a href="server-details.php">
                                <div className="row">
                                    <div className="col-1">
                                        <img style={{ width: "100%" }} src={require('../assets/images/wordpress.png')} />
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
                                    <div className="col-md-5">
                                        <h6 className="text-info font-weight-bold">Server Health</h6>
                                        <span className="mt-1" style={{ fontSize: "12px" }}>CPU Usage - {this.state.resourses.cpu}</span>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                                        </div>
                                        <span className="mt-3" style={{ fontSize: "12px" }}>Memory Usage - {this.state.resourses.memory.free[1]}&nbsp;{this.state.resourses.memory.free[2]}  Free of {this.state.resourses.memory.total[1]}&nbsp;{this.state.resourses.memory.total[2]}</span>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                                        </div>
                                        <span className="mt-3" style={{ fontSize: "12px" }}>Disk Usage - {this.state.resourses.disk.available}&nbsp;Free of {this.state.resourses.disk.total}&nbsp; Used {this.state.resourses.disk.used}</span>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-12 col-md-3 text-right application_page_card_actions d-flex">
                            <a href="" className="pl-3">www<span className="number_of_users"> 0</span></a>
                            <a href="" className="pl-3"><i className="fa fa-folder-open"><span className="number_of_users">0</span></i></a>
                            <a href="" className="pl-3"><i className="fa fa-user"><span className="number_of_users">0</span></i></a>

                            <Dropdown direction="left" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                <DropdownToggle className="btn btn-default ml-3">
                                    <i className="fas fa-ellipsis-v"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem key="1"><a className="dropdown-item" href="#"><i className="fa fa-stop "></i>&nbsp;Stop</a></DropdownItem>
                                    <DropdownItem key="2"><a className="dropdown-item" href="#"><i className="fa fa-redo" aria-hidden="true"></i>&nbsp;Restart</a></DropdownItem>
                                    <DropdownItem key="3"><a className="dropdown-item" href="#" onClick={this.deleteHandle}><i className="fa fa-trash"></i>&nbsp;Delete</a></DropdownItem>
                                    <DropdownItem key="4"><a className="dropdown-item" href="#"><i className="fa fa-globe"></i>&nbsp;Add Application</a></DropdownItem>
                                    <DropdownItem key="5"><a className="dropdown-item" href="#"><i className="fa fa-server"></i>&nbsp;Transfer Server</a></DropdownItem>
                                    <DropdownItem key="6"><a className="dropdown-item" href="#"><i className="fa fa-clone"></i>&nbsp;Clone Server</a></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ServerCard;
