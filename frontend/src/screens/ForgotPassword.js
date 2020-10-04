import React from 'react';
import {Link} from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";

class ForgotPassword extends React.Component{
    constructor(props){
        super();
        this.state = {
            loggedIn: false,
            loadding:false,
            email:"",
        }

        this.apiHandler = new ApiHandler();
    }
    formAction = ()=>{
        let form = document.getElementsByTagName("form")[0]
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }
        if(this.state.loadding){
            return;
        }
        this.setState({error:"", success:"", loadding:true})
        this.apiHandler.forgotPassword(this.state.email, (message)=>{
            this.setState({error:"", success:message, loadding:false})

        }, (message)=>{
            this.setState({error:message, success:"", loadding:false})
        });
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    render(){
        return(
            <div className="wrapper">
                <div className="container-fluid">
                    <div className="row">

                        <div style={{textAlign:"center",margin:"auto"}} className="col-sm-6  login-page-fields">
                            <div className="login-box m-auto">
                                <div className="login-logo mt-5">
                                    <a href="/"><b>Parvaty Cloud Hosting</b></a>
                                </div>
                                <div className="card">
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Forgot Password</h4>
                                        <p style={{color:"red"}}>{this.state.error}</p>
                                        <p style={{color:"green"}}>{this.state.success}</p>
                                        <form action="#" method="post">
                                            <div className="input-group mb-3">
                                                <input type="email" name="email" defaultValue={this.state.email} className="form-control border-bottom" id="email" placeholder="Email"
                                                    onChange={this.dataChange}
                                                />
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-envelope"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <button type="button" className="btn btn-primary btn-block text-uppercase"onClick={this.formAction}>
                                                        {this.state.loadding?
                                                        <img src={require("../assets/images/loading.gif")} style={{width: "25px", filter: "brightness(20)"}}/>
                                                        :
                                                        "Send Password Reset Mail"
                                                        }</button>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 font-weight-lighter un">
                                                        <Link to="/login" className="text-center">
                                                            <small><u>Login here</u></small>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-lighter">
                                                        <Link to="/register" className="text-center">
                                                            <small><u>Dont have a account?</u></small>
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
        );
    }
}
export default ForgotPassword;
