 import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";

class Register extends React.Component{
    constructor(props){
        super();
        this.state = {
            loadding:false,
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
            error:"",
            success:"",
            registered: false
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
        this.apiHandler.register(this.state.name,this.state.email,this.state.password, this.state.confirmPassword, (message, data)=>{
            this.setState({error:"", success:message, loadding:false, registered:true})
        }, (data)=>{
            this.setState({error:data, success:"", loadding:false, registered:false})
        });
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    render(){

         if(this.state.registered){
            return <Redirect to="/login" />
        }
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
                                                        <img src={require("../assets/images/loading.gif")} style={{width: "25px", filter: "brightness(20)"}}/>
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
        );
    }
}
export default Register;
