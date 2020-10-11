import React from 'react';
import {Link, Redirect} from 'react-router-dom';
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
    componentDidMount(){
        try{
            let params = window.location.href
            params = params.split("?")[1];
            let token = params.split("&")[0].split("=").pop()
            let email = params.split("&")[1].split("=").pop()
            this.setState({email: email, token: token})
        }catch(ex){
            window.location.href = "/login";
        }
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
        this.apiHandler.resetPassword(this.state.email,this.state.newPassword, this.state.confirmPassword, this.state.token,
        (message, data)=>{
            this.setState({error:"", success:message, loadding:false, loggedIn:true})

        }, (message)=>{
            this.setState({error:message, success:"", loadding:false, loggedIn:false})
        });
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    render() {
         if(this.state.loggedIn){
            return <Redirect to="/login" />
        }
        return (
            <div className="wrapper">
                <div className="container-fluid">
                    <div className="row">

                        <div style={{textAlign:"center",margin:"auto"}} className="col-sm-6  login-page-fields">
                            <div className="login-box m-auto">
                                <div className="login-logo mt-5">
                                    <a href="/"><b>Parvaty Cloud Hosting</b></a>
                                </div>
                                <div className="card" >
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Reset Password</h4>
                                        <p style={{color:"red"}}>{this.state.error}</p>
                                        <p style={{color:"green"}}>{this.state.success}</p>
                                        <form action="#" method="post">
                                            <div className="input-group mb-3">
                                                <input type="password" name="newPassword" onChange={this.dataChange} defaultValue={this.state.newPassword} className="form-control border-bottom" id="newPassword" placeholder="New Password"/>
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-lock"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="password" name="confirmPassword" onChange={this.dataChange} defaultValue={this.state.confirmPassword} className="form-control border-bottom" id="confirmPassword" placeholder="confirmPassword"/>
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
                                                        "Reset"
                                                        }
                                                    </button>
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
        )
    }
}

export default ResetScreen;
