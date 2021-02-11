import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";
import { bake_cookie } from 'sfcookies';
import "../assets/css/form-custom.css";
import { Alert } from 'react-bootstrap';

class Login extends React.Component {

    constructor(props) {
        super();
        this.state = {
            loggedIn: false,
            loadding: false,
            email: "",
            password: "",
            error: ""
        }

        this.apiHandler = new ApiHandler();

    }
    componentDidMount() {
        document.title = "Login";
    }
    onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
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
        this.apiHandler.login(this.state.email, this.state.password, (message, data) => {
            this.setState({ error: "", success: message, loadding: false, loggedIn: true })
            bake_cookie("name", data.name);
            bake_cookie("email", data.email);
            bake_cookie("auth", data.access_tokens.pop());
            window.location.href = "/servers";
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false, loggedIn: false })
        });
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/servers" />
        }
        return (
            <div className="main-container">
                <div className="row">
                    <div className="col-md-4 d-flex bg-white height-100-vh box-shadow-left">
                        <div className="align-self-center login-sidebar">
                            <div className="col-sm-12 center">
                                <img className="logo img-fluid" src={require("../assets/images/parvaty-logo.png")} alt="" srcset="" />
                            </div>
                            <div className="col-sm-12">
                                <h3>Login</h3>
                            </div>
                            <div className="col-sm-12 text-left">
                                <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                    {this.state.error}
                                </Alert>
                            </div>
                            <form action="#" method="post">
                                <div className="col-sm-12 modal-form mt-4">
                                    <div className="input-group">
                                        <input required type="email" name="email" onChange={this.dataChange} defaultValue={this.state.email} onKeyDown={this.onEnterPress} className="form-control form-input-field" placeholder="Email" />
                                        <div className="input-group-append">
                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                <path d="M27.1 14C26.9659 14.6599 26.9659 15.3401 27.1 16H15.511L23.061 22.662L28.11 18.142C28.536 18.669 29.068 19.108 29.673 19.427L23.072 25.338L15 18.216V30H31V19.9C31.6599 20.0341 32.3401 20.0341 33 19.9V31C33 31.2652 32.8946 31.5196 32.7071 31.7071C32.5196 31.8946 32.2652 32 32 32H14C13.7348 32 13.4804 31.8946 13.2929 31.7071C13.1054 31.5196 13 31.2652 13 31V15C13 14.7348 13.1054 14.4804 13.2929 14.2929C13.4804 14.1054 13.7348 14 14 14H27.1ZM32 18C31.606 18 31.2159 17.9224 30.8519 17.7716C30.488 17.6209 30.1573 17.3999 29.8787 17.1213C29.6001 16.8427 29.3791 16.512 29.2284 16.1481C29.0776 15.7841 29 15.394 29 15C29 14.606 29.0776 14.2159 29.2284 13.8519C29.3791 13.488 29.6001 13.1573 29.8787 12.8787C30.1573 12.6001 30.488 12.3791 30.8519 12.2284C31.2159 12.0776 31.606 12 32 12C32.7956 12 33.5587 12.3161 34.1213 12.8787C34.6839 13.4413 35 14.2044 35 15C35 15.7956 34.6839 16.5587 34.1213 17.1213C33.5587 17.6839 32.7956 18 32 18Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 modal-form mt-4">
                                    <div className="input-group">
                                        <input required type="password" name="password" onChange={this.dataChange} defaultValue={this.state.password} onKeyDown={this.onEnterPress} className="form-control form-input-field" id="password" placeholder="Password" />
                                        <div className="input-group-append">
                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                <path d="M30 21H31C31.2652 21 31.5196 21.1054 31.7071 21.2929C31.8946 21.4804 32 21.7348 32 22V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V22C14 21.7348 14.1054 21.4804 14.2929 21.2929C14.4804 21.1054 14.7348 21 15 21H16V20C16 19.0807 16.1811 18.1705 16.5328 17.3212C16.8846 16.4719 17.4002 15.7003 18.0503 15.0503C18.7003 14.4002 19.4719 13.8846 20.3212 13.5328C21.1705 13.1811 22.0807 13 23 13C23.9193 13 24.8295 13.1811 25.6788 13.5328C26.5281 13.8846 27.2997 14.4002 27.9497 15.0503C28.5998 15.7003 29.1154 16.4719 29.4672 17.3212C29.8189 18.1705 30 19.0807 30 20V21ZM16 23V31H30V23H16ZM22 25H24V29H22V25ZM28 21V20C28 18.6739 27.4732 17.4021 26.5355 16.4645C25.5979 15.5268 24.3261 15 23 15C21.6739 15 20.4021 15.5268 19.4645 16.4645C18.5268 17.4021 18 18.6739 18 20V21H28Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 mt-4">
                                    <button type="button" onClick={this.formAction} className="btn btn-block btn-theme">
                                        {this.state.loadding ?
                                            <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                            :
                                            "Login"
                                        }
                                    </button>
                                </div>
                            </form>
                            <div className="col-sm-12 mt-4">
                                <Link to="/forgot-password" className="form-link">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="col-sm-12">
                                <div className="separator">
                                    <span className="separator-text">
                                        OR
                                    </span>
                                </div>
                            </div>
                            <div className="col-sm-12 mt-5">
                                <Link type="button" to="/register" className="btn btn-theme-outline btn-block">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 d-flex">
                        <div className="text-center flex-1 align-self-center ">
                            <img className="login-right d-none d-lg-block" src={require("../assets/images/login-right-image.png")} alt="login" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login;
