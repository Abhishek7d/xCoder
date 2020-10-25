import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ApiHandler from '../model/ApiHandler';


class ProjectCard extends Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            dropdownOpen: false,
            loadding: false,
        }
        this.project = props.data;
        this.apiHandler = new ApiHandler();
    }
    toggleDropdown = () => this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }))


    // deleteHandle = () => {
    //     if (this.state.loadding) {
    //         return;
    //     }
    //     this.setState({ error: "", success: "", loadding: true })
    //     this.apiHandler.deleteProject(this.state.id, "destroy", (message, data) => {
    //         this.setState({ error: "", success: message, loadding: false })
    //         window.location.href = "/projects"
    //     }, (message) => {
    //         this.setState({ error: message, success: "", loadding: false })
    //     });
    // }
    showError(data) {
        // console.log(data)
    }

    render() {
        return (
            <div className="card card-outline">
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-sm-9 col-md-9 application_page_card_info">
                            <div className="float-left">
                                <span className="p-2 channel_green_dot btn-success"></span>
                            </div>
                            <a href="#" onClick={() => this.props.projectClickHandler()} >
                                <div className="row">
                                    <div className="col-1">
                                        <img style={{ width: "100%" }} src={require('../assets/images/wordpress.png')} />
                                    </div>
                                    <div className="col-5">
                                        <div className="d-flex">
                                            <p className="m-0">{this.project.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-3 col-md-3 text-right application_page_card_actions d-flex">
                            <a href="" className="px-3">Team Members <span className="number_of_users"></span></a>
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
        )
    }
}
export default ProjectCard;