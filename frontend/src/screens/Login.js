import React from 'react';
import {Link} from 'react-router-dom';

class Login extends React.Component{
    render(){
        return(
            <div className="wrapper">
                <div className="container-fluid">
                    <div className="row">
                        
                        <div style={{textAlign:"center",margin:"auto"}} className="col-sm-6  login-page-fields">
                            <div className="login-box m-auto">
                                <div className="login-logo mt-5">
                                    <a href="../../index2.html"><b>Parvaty</b></a>
                                </div>
                                <div className="card shadow-none">
                                    <div className="card-body login-card-body">
                                        <h4 className="login-box-msg ">Hello Again</h4>
                                        
                                        <form action="../../index3.html" method="post">
                                            <div className="input-group mb-3">
                                                <input type="email" className="form-control border-bottom" id="email" placeholder="Email"/>
                                                <div className="input-group-append  border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-envelope"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                <input type="password" className="form-control border-bottom" id="password" placeholder="Password"/>
                                                <div className="input-group-append border-bottom">
                                                    <div className="input-group-text">
                                                        <span className="fas fa-lock"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <button type="button" className="btn btn-primary btn-block text-uppercase">login now</button>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-1 font-weight-lighter un">
                                                        <Link to="/forgot-password" class="text-center">
                                                            <small><u>Forgot Password?</u></small>
                                                        </Link> 
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-lighter">
                                                        <Link to="/register" class="text-center">
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