import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";

class Register extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loadding: false,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            error: "",
            success: "",
            registered: false
        }
        this.apiHandler = new ApiHandler();
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
        this.apiHandler.register(this.state.name, this.state.email, this.state.password, this.state.confirmPassword, (message, data) => {
            this.setState({ error: "", success: message, loadding: false, registered: true })
        }, (data) => {
            this.setState({ error: data, success: "", loadding: false, registered: false })
        });
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    componentDidMount() {
        document.title = "Register";
    }
    render() {

        if (this.state.registered) {
            return <Redirect to="/login" />
        }
        return (
            <div class="main-container">
                <div class="row">
                    <div class="col-md-4" >
                        <div class="login-card-container">
                            <div class="col-sm-12 center">
                                <img src={require("../assets/images/parvaty-logo.png")} alt="" srcset="" />
                            </div>
                            <div class="col-sm-12">
                                <h3>Signup</h3>
                            </div>
                            <div class="col-sm-12">
                                <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: this.state.error }}></p>
                                <p style={{ color: "green" }} dangerouslySetInnerHTML={{ __html: this.state.success }}></p>
                            </div>
                            <form action="#" method="post">
                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="text" onChange={this.dataChange} defaultValue={this.state.name} className="form-input-field" placeholder="Full Name" required name="name" id="name" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M15 33C15 30.8783 15.8429 28.8434 17.3431 27.3431C18.8434 25.8429 20.8783 25 23 25C25.1217 25 27.1566 25.8429 28.6569 27.3431C30.1571 28.8434 31 30.8783 31 33H29C29 31.4087 28.3679 29.8826 27.2426 28.7574C26.1174 27.6321 24.5913 27 23 27C21.4087 27 19.8826 27.6321 18.7574 28.7574C17.6321 29.8826 17 31.4087 17 33H15ZM23 24C19.685 24 17 21.315 17 18C17 14.685 19.685 12 23 12C26.315 12 29 14.685 29 18C29 21.315 26.315 24 23 24ZM23 22C25.21 22 27 20.21 27 18C27 15.79 25.21 14 23 14C20.79 14 19 15.79 19 18C19 20.21 20.79 22 23 22Z" fill="white" />
                                        </svg>

                                    </div>
                                </div>
                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="email" name="email" onChange={this.dataChange} defaultValue={this.state.email} className="form-input-field" placeholder="Email" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M27.1 14C26.9659 14.6599 26.9659 15.3401 27.1 16H15.511L23.061 22.662L28.11 18.142C28.536 18.669 29.068 19.108 29.673 19.427L23.072 25.338L15 18.216V30H31V19.9C31.6599 20.0341 32.3401 20.0341 33 19.9V31C33 31.2652 32.8946 31.5196 32.7071 31.7071C32.5196 31.8946 32.2652 32 32 32H14C13.7348 32 13.4804 31.8946 13.2929 31.7071C13.1054 31.5196 13 31.2652 13 31V15C13 14.7348 13.1054 14.4804 13.2929 14.2929C13.4804 14.1054 13.7348 14 14 14H27.1ZM32 18C31.606 18 31.2159 17.9224 30.8519 17.7716C30.488 17.6209 30.1573 17.3999 29.8787 17.1213C29.6001 16.8427 29.3791 16.512 29.2284 16.1481C29.0776 15.7841 29 15.394 29 15C29 14.606 29.0776 14.2159 29.2284 13.8519C29.3791 13.488 29.6001 13.1573 29.8787 12.8787C30.1573 12.6001 30.488 12.3791 30.8519 12.2284C31.2159 12.0776 31.606 12 32 12C32.7956 12 33.5587 12.3161 34.1213 12.8787C34.6839 13.4413 35 14.2044 35 15C35 15.7956 34.6839 16.5587 34.1213 17.1213C33.5587 17.6839 32.7956 18 32 18Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="password" name="password" onChange={this.dataChange} defaultValue={this.state.password} className="form-input-field" id="password" placeholder="Password" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M30 21H31C31.2652 21 31.5196 21.1054 31.7071 21.2929C31.8946 21.4804 32 21.7348 32 22V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V22C14 21.7348 14.1054 21.4804 14.2929 21.2929C14.4804 21.1054 14.7348 21 15 21H16V20C16 19.0807 16.1811 18.1705 16.5328 17.3212C16.8846 16.4719 17.4002 15.7003 18.0503 15.0503C18.7003 14.4002 19.4719 13.8846 20.3212 13.5328C21.1705 13.1811 22.0807 13 23 13C23.9193 13 24.8295 13.1811 25.6788 13.5328C26.5281 13.8846 27.2997 14.4002 27.9497 15.0503C28.5998 15.7003 29.1154 16.4719 29.4672 17.3212C29.8189 18.1705 30 19.0807 30 20V21ZM16 23V31H30V23H16ZM22 25H24V29H22V25ZM28 21V20C28 18.6739 27.4732 17.4021 26.5355 16.4645C25.5979 15.5268 24.3261 15 23 15C21.6739 15 20.4021 15.5268 19.4645 16.4645C18.5268 17.4021 18 18.6739 18 20V21H28Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="col-sm-12 login-form-container">
                                    <div class="col-sm-12 form-group">
                                        <input type="password" onChange={this.dataChange} required className="form-input-field" name="confirmPassword" id="confirm-password" placeholder="Confirm Password" />
                                        <svg class="input-icon" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="45" height="45" rx="8" fill="#7973FE" />
                                            <path d="M29 19H31C31.2652 19 31.5196 19.1054 31.7071 19.2929C31.8946 19.4804 32 19.7348 32 20V32C32 32.2652 31.8946 32.5196 31.7071 32.7071C31.5196 32.8946 31.2652 33 31 33H15C14.7348 33 14.4804 32.8946 14.2929 32.7071C14.1054 32.5196 14 32.2652 14 32V20C14 19.7348 14.1054 19.4804 14.2929 19.2929C14.4804 19.1054 14.7348 19 15 19H17V18C17 16.4087 17.6321 14.8826 18.7574 13.7574C19.8826 12.6321 21.4087 12 23 12C24.5913 12 26.1174 12.6321 27.2426 13.7574C28.3679 14.8826 29 16.4087 29 18V19ZM16 21V31H30V21H16ZM22 25H24V27H22V25ZM18 25H20V27H18V25ZM26 25H28V27H26V25ZM27 19V18C27 16.9391 26.5786 15.9217 25.8284 15.1716C25.0783 14.4214 24.0609 14 23 14C21.9391 14 20.9217 14.4214 20.1716 15.1716C19.4214 15.9217 19 16.9391 19 18V19H27Z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="col-sm-12 login-form-container">
                                    <button type="button" onClick={this.formAction} class="form-action-btn">
                                        {this.state.loadding ?
                                            <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                            :
                                            "Signup"
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
                            <img class="login-right" src={require("../assets/images/signup-right-image.png")} alt="" srcset="" />
                        </div>
                    </div>
                </div>
            </div>
            /*
            <div className="wrapper">
                <div className="container-fluid">
                    <div className="row">

                        <div style={{textAlign:"center",margin:"auto"}} className="col-sm-6  login-page-fields">
                            <div className="login-box m-auto">
                                <div className="login-logo mt-5">
                                    <a href="/"><b>Parvaty Cloud Hosting</b></a>
                                </div>
                                <div className="card form-card">
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Register Here</h4>
                                        <p style={{color:"red"}}>{this.state.error}</p>
                                        <p style={{color:"green"}}>{this.state.success}</p>
                                        <form action="#" method="post">
                                            <div className="input-group mb-3">
                                                <input type="text" onChange={this.dataChange} defaultValue={this.state.name} className="form-control border-bottom" required name="name" id="name" placeholder="Full Name"/>
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-user"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="email" onChange={this.dataChange} defaultValue={this.state.email} required className="form-control border-bottom" name="email" id="email" placeholder="Email"/>
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-envelope"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="password" onChange={this.dataChange} required className="form-control border-bottom" name="password" id="password" placeholder="Password"/>
                                                <div className="input-group-append border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-lock"></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="input-group mb-3">
                                                <input type="password" onChange={this.dataChange} required className="form-control border-bottom" name="confirmPassword" id="confirm-password" placeholder="Confirm Password"/>
                                                <div className="input-group-append border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-lock"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <button type="button" className="btn btn-primary btn-block text-uppercase" onClick={this.formAction}>
                                                    {this.state.loadding?
                                                        <img alt="loadding" src={require("../assets/images/loading.gif")} style={{width: "25px", filter: "brightness(20)"}}/>
                                                        :
                                                        "Register"
                                                    }
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 font-weight-lighter un">
                                                        <Link to="/login" className="text-center">
                                                            <small><u>Already have a account?</u></small>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-lighter">
                                                        <Link to="/forgot-password" className="text-center">
                                                            <small><u>Forgot Password?</u></small>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            */
        );
    }
}
export default Register;
