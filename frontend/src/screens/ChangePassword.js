import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import PageHeader from '../components/template/PageHeader';
import { Alert } from 'react-bootstrap';
import { read_cookie } from 'sfcookies';

class Profile extends React.Component {
    constructor(props) {
        super()
        this.state = {
            email: read_cookie("email"),
            newPassword: "",
            oldPassword: "",
            error: "",
            success: "",
            loading: false
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount() {
        document.title = "Change Password";
    }
    handleChangePassword = () => {
        this.setState({ loading: true })

        this.apiHandler.changePassword(this.state.email, this.state.oldPassword, this.state.newPassword, (msg) => {
            this.setState({ error: "", success: msg, loading: false })
            console.log(msg);
        }, (err) => {
            this.setState({ error: err, success: "", loading: false })
            console.log(err);
        })
    }

    dataChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    setShow() {
        this.setState({ error: "", success: "", loading: false })
    }
    render() {
        return (
            <>
                <div className="container-fluid p-0">
                    <Navigation name="Profile" onProjectChange={() => { }} />
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="section-container">
                            <PageHeader
                                heading="Chnage Password" subHeading="Change your password">
                            </PageHeader>
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-5">
                                        <div className="card">
                                            <div className="card-body p-5">
                                                <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                                    {this.state.error}
                                                </Alert>
                                                <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                                    {this.state.success}
                                                </Alert>
                                                <div className="modal-form">
                                                    <div className="input-group">
                                                        <input type="password" className="form-control form-input-field" value={this.state.oldPassword} name="oldPassword" onChange={this.dataChange} placeholder="old password" />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text theme"><i className="fa fa-lock"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-form mt-4">
                                                    <div className="input-group">
                                                        <input type="password" className="form-control form-input-field" value={this.state.newPassword} name="newPassword" onChange={this.dataChange} placeholder="new password" />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text theme"><i className="fa fa-lock"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-theme btn-block mt-4" onClick={this.handleChangePassword}>
                                                    {this.state.loading ?
                                                        <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                        : "Update Password"
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </>

        )
    }
}
export default Profile;
