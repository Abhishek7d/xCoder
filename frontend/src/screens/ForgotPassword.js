import React from 'react';
import { Link } from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";
import { Alert } from 'react-bootstrap';

class ForgotPassword extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loggedIn: false,
            loadding: false,
            email: "",
            error: '',
            success: ''
        }
        this.apiHandler = new ApiHandler();
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    componentDidMount() {
        document.title = "Forgot Password";
    }
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.formAction();
        }
    }
    formAction = () => {
        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.forgotPassword(this.state.email, (message) => {
            this.setState({ error: "", success: message, loadding: false })

        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        return (
            <div className="main-container">
                <div className="row">
                    <div className="col-md-4 d-flex bg-white height-100-vh box-shadow-left">
                        <div className="align-self-center login-sidebar">
                            <div className="col-sm-12 center">
                                <img className="logo img-fluid" src={require("../assets/images/parvaty-logo.png")} alt="" />
                            </div>
                            <div className="col-sm-12">
                                <h3>Forgot Password</h3>
                            </div>
                            <div className="col-sm-12 text-left">
                                <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                    {this.state.error}
                                </Alert>
                                <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                    {this.state.success}
                                </Alert>
                            </div>
                            <form action="#" method="post">
                                <div className="col-sm-12 modal-form">
                                    <div className="input-group">
                                        <input onKeyDown={this.onEnterPress} required type="email" name="email" defaultValue={this.state.email} className="form-control form-input-field" id="email" placeholder="Email"
                                            onChange={this.dataChange} />
                                        <div className="input-group-append">
                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                <path d="M27.1 14C26.9659 14.6599 26.9659 15.3401 27.1 16H15.511L23.061 22.662L28.11 18.142C28.536 18.669 29.068 19.108 29.673 19.427L23.072 25.338L15 18.216V30H31V19.9C31.6599 20.0341 32.3401 20.0341 33 19.9V31C33 31.2652 32.8946 31.5196 32.7071 31.7071C32.5196 31.8946 32.2652 32 32 32H14C13.7348 32 13.4804 31.8946 13.2929 31.7071C13.1054 31.5196 13 31.2652 13 31V15C13 14.7348 13.1054 14.4804 13.2929 14.2929C13.4804 14.1054 13.7348 14 14 14H27.1ZM32 18C31.606 18 31.2159 17.9224 30.8519 17.7716C30.488 17.6209 30.1573 17.3999 29.8787 17.1213C29.6001 16.8427 29.3791 16.512 29.2284 16.1481C29.0776 15.7841 29 15.394 29 15C29 14.606 29.0776 14.2159 29.2284 13.8519C29.3791 13.488 29.6001 13.1573 29.8787 12.8787C30.1573 12.6001 30.488 12.3791 30.8519 12.2284C31.2159 12.0776 31.606 12 32 12C32.7956 12 33.5587 12.3161 34.1213 12.8787C34.6839 13.4413 35 14.2044 35 15C35 15.7956 34.6839 16.5587 34.1213 17.1213C33.5587 17.6839 32.7956 18 32 18Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 mt-4">
                                    <button type="button" className="btn btn-theme btn-block" onClick={this.formAction}>
                                        {this.state.loadding ?
                                            <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                            :
                                            "Send Password Reset Mail"
                                        }
                                    </button>
                                </div>
                            </form>
                            <div className="col-sm-12 mt-4">
                                <div className="separator">
                                    <span className="separator-text">
                                        OR
                                    </span>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-5">
                                <Link type="button" to="/login" className="btn btn-theme-outline btn-block">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 d-flex">
                        <div className="text-center flex-1 align-self-center">
                            <img className="login-right d-none d-lg-block" src={require("../assets/images/forgot-password-right.png")} alt="login" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ForgotPassword;
