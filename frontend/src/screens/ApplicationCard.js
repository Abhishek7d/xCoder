import React from 'react'
import ApiHandler from '../model/ApiHandler';
import Status from '../components/Status';

class ApplicationCard extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.application = props.application;
        this.state = {
            created_at: props.application.created_at,
            id: props.application.id,
            name: props.application.name,
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
            window.location.href = "/applications";
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }

    render() {
        return (
            // <div className="col-12 application_page_cards" id="huddles">
            //     <div className="card card-outline">
            //         <div className="card-body">
            //             <div className="row mb-2">
            //                 <div className="col-10 application_page_card_info">
            //                 {this.state.loadding?
            //                     <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "45px" }} />
            //                     :
            //                     <div onClick={() => this.props.applicationClickHandler(this.props.application)} >
            //                         <div className="row">
            //                             <div className="col-1">
            //                                 <img  alt="wordpress" style={{ width: "100%" }} src={require("../assets/images/wordpress.png")} />
            //                             </div>
            //                             <div className="col-11">
            //                                 <span className="text-info d-flex font-weight-bold">App Name : &nbsp;<p className="m-0 text-primary">{this.state.name}</p></span>
            //                                 <span className="text-info d-flex font-weight-bold">Domain Name : &nbsp;<p className="m-0 text-primary">{this.state.domain}</p></span>
            //                                 <span className="text-info d-flex font-weight-bold">Server : &nbsp;<p className="m-0 text-primary">{this.state.server.name}</p></span>
            //                                 <span className="text-info d-flex font-weight-bold">Status : &nbsp;<span className="text-primary">{this.state.status}</span></span>
            //                                 <p className="mt-3"><small>Created : {new Date(this.state.created_at).toDateString()}</small></p>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 }
            //                 </div>
            //                 <div className="col-2 text-right application_page_card_actions">
            //                     <a rel="noopener noreferrer" href={((this.application.ssl_enabled=='1')?"https://":"http://")+this.state.domain} target="_blank" className="pl-3"><i className="fa fa-external-link-square-alt"></i></a>
            //                     <div className="btn-group pl-4 px-1 dropleft" style={{ cursor: "pointer" }}>
            //                         <i className="fas fa-ellipsis-v" data-toggle="dropdown"
            //                             aria-haspopup="true" aria-expanded="false"></i>
            //                         <div className="dropdown-menu">
            //                             <div className="dropdown-item" href="#" onClick={this.deleteHandle}><i className="fa fa-trash danger"></i>&nbsp;Delete</div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-3">
                <div className="card">
                    <div className="card-header  cursor-pointer" onClick={() => this.props.applicationClickHandler(this.props.application)}>
                        <div className="row no-gutters">
                            <div className="col-2 p-1 align-self-center pl-0">
                                <img alt="wordpress" style={{ width: "100%" }} src={require("../assets/images/wordpress.png")} />
                            </div>
                            <div className="col-8 p-2 align-self-center">
                                <h6 className="heading">{this.state.name}</h6>
                                <p className="sub-heading">
                                    Created: {new Date(this.state.created_at).toDateString()}
                                </p>
                            </div>
                            <div className="col-2 align-self-center text-right">
                                <Status status={this.state.status} />
                            </div>
                        </div>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-8"><p>{this.state.domain}</p></div>
                            <div className="col-2 p-0">
                                <button className="btn btn-danger btn-sm" onClick={this.deleteHandle}>
                                    {this.state.loadding ?
                                        <svg className="loading" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.537 17.567C14.7224 19.1393 12.401 20.0033 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 12.136 19.33 14.116 18.19 15.74L15 10H18C17.9998 8.15621 17.3628 6.36906 16.1967 4.94089C15.0305 3.51272 13.4069 2.53119 11.6003 2.16236C9.79381 1.79352 7.91533 2.06002 6.28268 2.91677C4.65002 3.77351 3.36342 5.16791 2.64052 6.86408C1.91762 8.56025 1.80281 10.4541 2.31549 12.2251C2.82818 13.9962 3.93689 15.5358 5.45408 16.5836C6.97127 17.6313 8.80379 18.1228 10.6416 17.9749C12.4795 17.827 14.2099 17.0488 15.54 15.772L16.537 17.567Z" fill="white" />
                                        </svg>
                                        :
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 2V0H15V2H20V4H18V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19V4H0V2H5ZM4 4V18H16V4H4ZM7 7H9V15H7V7ZM11 7H13V15H11V7Z" fill="white" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.state.server.name}</p></div>
                        </div>
                        <div className="text-center mt-4">
                            <a href={((this.state.ssl_enabled === "1") ? "https://" : "http://") + this.state.domain} target="_blank" type="button" rel="noopener noreferrer" className="btn btn-theme btn-sm">
                                Visit Application
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ApplicationCard;
