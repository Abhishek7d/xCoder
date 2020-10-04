import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import ApiHandler from "../model/ApiHandler";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

class Login extends React.Component{

    constructor(props){
        super();
        this.state = {
            loggedIn: false,
            loadding:false,
            email:"",
            password:""
        }

        this.apiHandler = new ApiHandler();
    }
    componentDidMount(){
        document.title = "Login";
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
        this.apiHandler.login(this.state.email,this.state.password, (message, data)=>{
            this.setState({error:"", success:message, loadding:false, loggedIn:true})
            bake_cookie("name", data.name);
            bake_cookie("email", data.email);
            bake_cookie("auth", data.access_tokens.pop());
            window.location.href="/servers";
        }, (message)=>{
            this.setState({error:message, success:"", loadding:false, loggedIn:false})
        });
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    render(){
        if(this.state.loggedIn){
            return <Redirect to="/servers" />
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
                                <div className="card form-card" >
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Login Here</h4>
                                        <p style={{color:"red"}}>{this.state.error}</p>
                                        <p style={{color:"green"}}>{this.state.success}</p>
                                        <form action="#" method="post">
                                            <div className="input-group mb-3">
                                                <input type="email" name="email" onChange={this.dataChange} defaultValue={this.state.email} className="form-control border-bottom" id="email" placeholder="Email"/>
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-envelope"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="password" name="password" onChange={this.dataChange} defaultValue={this.state.password} className="form-control border-bottom" id="password" placeholder="Password"/>
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
                                                        "Login"
                                                        }
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 font-weight-lighter un">
                                                        <Link to="/forgot-password" className="text-center">
                                                            <small><u>Forgot Password?</u></small>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-lighter">
                                                        <Link to="/register" className="text-center">
                                                            <small><u>New to Parvaty? SignUp</u></small>
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
export default Login;
