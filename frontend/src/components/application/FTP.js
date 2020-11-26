import React from 'react';
import ApiHandler from "../../model/ApiHandler";
import { Modal, Button } from 'react-bootstrap';

class FTP extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            regions:{},
            loadding:false,
            deleting:false,
            showModal: false,
            error:"",
            success:"",
            username:"",
            password:"",
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
    addFtpAccount = ()=>{
        if(this.loadding || this.deleting){
            return;
        }
        this.setState({loadding:true})
        this.apiHandler.addFtpAccount(this.application.id, this.state.username, this.state.password, (message)=>{
            this.setState({loadding:false})
            this.props.loadApplications();
        }, (error)=>{
            this.setState({loadding:false, message: error})
        })
    }
    deleteFtp = (username)=>{
        if(this.loadding || this.deleting){
            return;
        }
        this.setState({deleting:true})
        this.apiHandler.deleteFtpAccount(this.application.id, username, (message)=>{
            this.setState({deleting:false})
            this.props.loadApplications();
        }, (error)=>{
            this.setState({deleting:false, error:error})
        })
    }
    renderFtpAccounts = () =>{
        let list = [];
        this.state.ftps.forEach((data, index)=>{
            list.push(
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{data.host}</td>
                    <td>{data.username}</td>
                    <td>{data.password}</td>
                    <td>
                        <button className={"btn btn-danger"} onClick={()=>this.deleteFtp(data.username)} style={{marginLeft:'10px'}}>
                        {
                            this.state.deleting ?
                                <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                : "Delete"
                        }
                        </button>
                    </td>
                </tr>
            )
        })                
        return list;
    }
    render(){
        return(
            <>
            <div className="tab-pane fade show" id={this.props.tabId} role="tabpanel" aria-labelledby={this.props.tabId}>
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
            </div>
            <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                <form action="#" method="post">
                    <Modal.Header closeButton>
                        <Modal.Title>ADD FTP Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: this.state.error }}></p>
                        <p style={{ color: "green" }} dangerouslySetInnerHTML={{ __html: this.state.success }}></p>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input required type="text" className="form-control" minLength="4" maxLength="12" attern="[a-zA-Z0-9-]+" name="username" value={this.state.username} onChange={this.dataChange} id="username" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="projectName">Password</label>
                            <input required type="password" className="form-control" minLength="4" name="password" value={this.state.password} onChange={this.dataChange} id="password" />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.addFtpAccount}>
                            {
                                this.state.loadding ?
                                    <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                    : "ADD FTP"
                            }
                        </Button>
                        <Button variant="default" onClick={this.handleModalClose}>
                            CLOSE
                    </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            </>
        )
    }
}
export default FTP;