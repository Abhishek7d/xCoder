import React from 'react';
import ApiHandler from "../../model/ApiHandler";
import { Modal, Button } from 'react-bootstrap';

class FTP extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            regions: {},
            loadding: false,
            deleting: false,
            showModal: false,
            error: "",
            success: "",
            username: "",
            password: "",
            ftps: JSON.parse(this.application.ftp_credentials)
        }
        this.apiHandler = new ApiHandler();
    }
    handleModalClose = () => {
        this.setState({
            showModal: false,
        })
    }
    dataChange = (event) => {
        let value = event.target.value;
        value = value.replace(/[^A-Za-z]/ig, '')

        this.setState({ [event.target.name]: value })
    }
    addFtpAccount = () => {
        if (this.loadding || this.deleting) {
            return;
        }
        this.setState({ loadding: true })
        this.apiHandler.addFtpAccount(this.application.id, this.state.username, this.state.password, (message) => {
            this.setState({ loadding: false })
            this.props.loadApplications();
        }, (error) => {
            this.setState({ loadding: false, message: error })
        })
    }
    deleteFtp = (username) => {
        if (this.loadding || this.deleting) {
            return;
        }
        this.setState({ deleting: true })
        this.apiHandler.deleteFtpAccount(this.application.id, username, (message) => {
            this.setState({ deleting: false })
            this.props.loadApplications();
        }, (error) => {
            this.setState({ deleting: false, error: error })
        })
    }
    renderFtpAccounts = () => {
        let list = [];
        this.state.ftps.forEach((data, index) => {
            list.push(
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td className="text-middle" onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{data.host}</td>
                    <td onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{data.username}</td>
                    <td onClick={this.props.copyToClipBoard} title={"Click to Copy"}>{data.password}</td>
                    <td>
                        <button className={"btn btn-danger"} onClick={() => this.deleteFtp(data.username)} style={{ marginLeft: '10px' }}>
                            {
                                this.state.deleting ?
                                    <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                    : <i className="fa fa-trash"></i>
                            }
                        </button>
                    </td>
                </tr>
            )
        })
        return list;
    }
    render() {
        return (
            <>
                {/* <div className="tab-pane fade show" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
                <p style={{textAlign:"center"}}>{this.state.message}</p>
                <br/>
                
                <div className="row" style={{width:"100%"}}>
                    <div className="col-md-12">FTP Settings
                    <button className={"btn btn-info"} onClick={()=>this.setState({showModal:true})} style={{marginLeft:'10px'}}>
                    {
                        this.state.loadding ?
                            <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                            : "Add FTP"
                    }
                    </button>
                    </div>
                    <br/>
                    <br/>
                    {(this.state.deleting)?
                    <div style={{width: "100%",paddingLeft: "40%"}}>
                        <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{width:"100px"}} className="serviceLoadding"/>
                    </div>        
                    :
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Sl</th>
                                    <th scope="col">Host</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Password</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderFtpAccounts()}
                            </tbody>
                        </table>
                    </div>
                    }
                    
                </div>
            </div> */}
                <div className="col-md-12 full-height">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-8 align-self-center">
                                    <h6 className="heading">FTP Settings</h6>
                                    <p className="sub-heading">FTP Details</p>
                                </div>
                                <div className="col-4 align-self-center text-right">
                                    <button className={"btn btn-theme btn-square btn-35"} onClick={() => this.setState({ showModal: true })} style={{ marginLeft: '10px' }}>
                                        {
                                            this.state.loadding ?
                                                <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                : <i className="fa fa-plus"></i>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Host</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(this.state.deleting) ?
                                        <tr>
                                            <td colSpan="5" className='text-center'>
                                                <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
                                            </td>
                                        </tr>
                                        :
                                        <>
                                            {this.renderFtpAccounts()}
                                        </>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>New FTP Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: this.state.error }}></p>
                            <p style={{ color: "green" }} dangerouslySetInnerHTML={{ __html: this.state.success }}></p>
                            <p style={{ color: "red", 'textAlign': 'center' }} dangerouslySetInnerHTML={{ __html: this.state.message }}></p>

                            <div class="modal-form">
                                <label htmlFor="username">Username</label>

                                <div className="input-group">
                                    <input required type="text" className="form-control form-input-field" minLength="4" maxLength="12" attern="[a-zA-Z0-9-]+" name="username" value={this.state.username} onChange={this.dataChange} id="username" />
                                    <div class="input-group-append">
                                        <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M15 33C15 30.8783 15.8429 28.8434 17.3431 27.3431C18.8434 25.8429 20.8783 25 23 25C25.1217 25 27.1566 25.8429 28.6569 27.3431C30.1571 28.8434 31 30.8783 31 33H29C29 31.4087 28.3679 29.8826 27.2426 28.7574C26.1174 27.6321 24.5913 27 23 27C21.4087 27 19.8826 27.6321 18.7574 28.7574C17.6321 29.8826 17 31.4087 17 33H15ZM23 24C19.685 24 17 21.315 17 18C17 14.685 19.685 12 23 12C26.315 12 29 14.685 29 18C29 21.315 26.315 24 23 24ZM23 22C25.21 22 27 20.21 27 18C27 15.79 25.21 14 23 14C20.79 14 19 15.79 19 18C19 20.21 20.79 22 23 22Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-form">
                                <label htmlFor="projectName">Password</label>

                                <div className="input-group">
                                    <input required type="password" className="form-control form-input-field" minLength="4" name="password" value={this.state.password} onChange={this.dataChange} id="password" />
                                    <div class="input-group-append">
                                        <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M30 21H31C31.2652 21 31.5196 21.1054 31.7071 21.2929C31.8946 21.4804 32 21.7348 32 22V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V22C14 21.7348 14.1054 21.4804 14.2929 21.2929C14.4804 21.1054 14.7348 21 15 21H16V20C16 19.0807 16.1811 18.1705 16.5328 17.3212C16.8846 16.4719 17.4002 15.7003 18.0503 15.0503C18.7003 14.4002 19.4719 13.8846 20.3212 13.5328C21.1705 13.1811 22.0807 13 23 13C23.9193 13 24.8295 13.1811 25.6788 13.5328C26.5281 13.8846 27.2997 14.4002 27.9497 15.0503C28.5998 15.7003 29.1154 16.4719 29.4672 17.3212C29.8189 18.1705 30 19.0807 30 20V21ZM16 23V31H30V23H16ZM22 25H24V29H22V25ZM28 21V20C28 18.6739 27.4732 17.4021 26.5355 16.4645C25.5979 15.5268 24.3261 15 23 15C21.6739 15 20.4021 15.5268 19.4645 16.4645C18.5268 17.4021 18 18.6739 18 20V21H28Z" fill="white" />
                                        </svg>

                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                            </Button>
                            <Button className="btn btn-theme" onClick={this.addFtpAccount}>
                                {
                                    this.state.loadding ?
                                        <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "ADD FTP"
                                }
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        )
    }
}
export default FTP;