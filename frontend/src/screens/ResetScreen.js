import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";

class ResetScreen extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loggedIn: false,
            loadding: false,
            email: "",
            newPassword: "",
            confirmPassword: "",
            token: ""
        }

        this.apiHandler = new ApiHandler();
        // alert(window.location.href)

    }
    componentDidMount() {
        document.title = "Reset Password";
        try {
            let params = window.location.href
            params = params.split("?")[1];
            let token = params.split("&")[0].split("=").pop()
            let email = params.split("&")[1].split("=").pop()
            this.setState({ email: email, token: token })
        } catch (ex) {
            window.location.href = "/login";
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
        this.apiHandler.resetPassword(this.state.email, this.state.newPassword, this.state.confirmPassword, this.state.token,
            (message, data) => {
                this.setState({ error: "", success: message, loadding: false, loggedIn: true })

            }, (message) => {
                this.setState({ error: message, success: "", loadding: false, loggedIn: false })
            });
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/login" />
        }
        return (
            <div class="main-container">
                <div class="row">
                    <div class="col-md-4" >
                        <div class="login-card-container">
                            <div class="col-sm-12 center">
                                <img rc={require("../assets/images/parvaty-logo.png")} alt="" srcset="" />
                            </div>
                            <div class="col-sm-12">
                                <h3>Reset Password</h3>
                            </div>
                            <div class="col-sm-12">
                                <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: this.state.error }}></p>
                                <p style={{ color: "green" }} dangerouslySetInnerHTML={{ __html: this.state.success }}></p>
                            </div>
                            <form action="#" method="post">
                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="password" name="newPassword" onChange={this.dataChange} defaultValue={this.state.newPassword} className="form-input-field" id="newPassword" placeholder="New Password" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M30 21H31C31.2652 21 31.5196 21.1054 31.7071 21.2929C31.8946 21.4804 32 21.7348 32 22V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V22C14 21.7348 14.1054 21.4804 14.2929 21.2929C14.4804 21.1054 14.7348 21 15 21H16V20C16 19.0807 16.1811 18.1705 16.5328 17.3212C16.8846 16.4719 17.4002 15.7003 18.0503 15.0503C18.7003 14.4002 19.4719 13.8846 20.3212 13.5328C21.1705 13.1811 22.0807 13 23 13C23.9193 13 24.8295 13.1811 25.6788 13.5328C26.5281 13.8846 27.2997 14.4002 27.9497 15.0503C28.5998 15.7003 29.1154 16.4719 29.4672 17.3212C29.8189 18.1705 30 19.0807 30 20V21ZM16 23V31H30V23H16ZM22 25H24V29H22V25ZM28 21V20C28 18.6739 27.4732 17.4021 26.5355 16.4645C25.5979 15.5268 24.3261 15 23 15C21.6739 15 20.4021 15.5268 19.4645 16.4645C18.5268 17.4021 18 18.6739 18 20V21H28Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="password" name="confirmPassword" onChange={this.dataChange} defaultValue={this.state.confirmPassword} className="form-input-field" id="confirmPassword" placeholder="confirmPassword" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M29 19H31C31.2652 19 31.5196 19.1054 31.7071 19.2929C31.8946 19.4804 32 19.7348 32 20V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V20C14 19.7348 14.1054 19.4804 14.2929 19.2929C14.4804 19.1054 14.7348 19 15 19H17V18C17 16.4087 17.6321 14.8826 18.7574 13.7574C19.8826 12.6321 21.4087 12 23 12C24.5913 12 26.1174 12.6321 27.2426 13.7574C28.3679 14.8826 29 16.4087 29 18V19ZM16 21V31H30V21H16ZM22 25H24V27H22V25ZM18 25H20V27H18V25ZM26 25H28V27H26V25ZM27 19V18C27 16.9391 26.5786 15.9217 25.8284 15.1716C25.0783 14.4214 24.0609 14 23 14C21.9391 14 20.9217 14.4214 20.1716 15.1716C19.4214 15.9217 19 16.9391 19 18V19H27Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="col-sm-12 login-form-container">
                                    <button type="button" className="form-action-btn" onClick={this.formAction}>
                                        {this.state.loadding ?
                                            <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                            :
                                            "Reset Password"
                                        }
                                    </button>
                                </div>
                            </form>
                            <div class="col-sm-12">
                                <div class="separator">
                                    <span class="separator-text">
                                        OR
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm-12 login-form-container">
                                <Link type="button" to="/login" className="form-subaction-btn">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 form-side-image-container d-none d-lg-block">
                        <div class="image-container">
                            <img class="login-right" src={require("../assets/images/forgot-password-right.png")} alt="login" srcset="" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetScreen;
