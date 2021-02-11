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
                    <Navigation />
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
                                                <div class="modal-form">
                                                    <div className="input-group">
                                                        <input type="password" className="form-control form-input-field" value={this.state.oldPassword} name="oldPassword" onChange={this.dataChange} placeholder="old password" />
                                                        <div class="input-group-append">
                                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                                <path d="M23 31.9L27.95 26.95C28.9289 25.971 29.5955 24.7238 29.8656 23.3659C30.1356 22.0081 29.9969 20.6006 29.4671 19.3216C28.9373 18.0426 28.04 16.9494 26.8889 16.1802C25.7378 15.4111 24.3844 15.0005 23 15.0005C21.6156 15.0005 20.2622 15.4111 19.1111 16.1802C17.96 16.9494 17.0628 18.0426 16.5329 19.3216C16.0031 20.6006 15.8644 22.0081 16.1345 23.3659C16.4045 24.7238 17.0711 25.971 18.05 26.95L23 31.9ZM23 34.728L16.636 28.364C15.3773 27.1054 14.5202 25.5017 14.1729 23.7559C13.8257 22.0101 14.0039 20.2005 14.6851 18.5559C15.3663 16.9114 16.5198 15.5058 17.9999 14.5169C19.4799 13.528 21.22 13.0001 23 13.0001C24.78 13.0001 26.5201 13.528 28.0001 14.5169C29.4802 15.5058 30.6337 16.9114 31.3149 18.5559C31.9961 20.2005 32.1743 22.0101 31.8271 23.7559C31.4798 25.5017 30.6227 27.1054 29.364 28.364L23 34.728ZM23 24C23.5304 24 24.0391 23.7893 24.4142 23.4143C24.7893 23.0392 25 22.5305 25 22C25 21.4696 24.7893 20.9609 24.4142 20.5858C24.0391 20.2108 23.5304 20 23 20C22.4696 20 21.9609 20.2108 21.5858 20.5858C21.2107 20.9609 21 21.4696 21 22C21 22.5305 21.2107 23.0392 21.5858 23.4143C21.9609 23.7893 22.4696 24 23 24ZM23 26C21.9391 26 20.9217 25.5786 20.1716 24.8285C19.4214 24.0783 19 23.0609 19 22C19 20.9392 19.4214 19.9218 20.1716 19.1716C20.9217 18.4215 21.9391 18 23 18C24.0609 18 25.0783 18.4215 25.8284 19.1716C26.5786 19.9218 27 20.9392 27 22C27 23.0609 26.5786 24.0783 25.8284 24.8285C25.0783 25.5786 24.0609 26 23 26Z" fill="white" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-form mt-4">
                                                    <div className="input-group">
                                                        <input type="password" className="form-control form-input-field" value={this.state.newPassword} name="newPassword" onChange={this.dataChange} placeholder="new password" />
                                                        <div class="input-group-append">
                                                            <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="45" height="45" rx="8" fill="#7973FE" />
                                                                <path d="M23 31.9L27.95 26.95C28.9289 25.971 29.5955 24.7238 29.8656 23.3659C30.1356 22.0081 29.9969 20.6006 29.4671 19.3216C28.9373 18.0426 28.04 16.9494 26.8889 16.1802C25.7378 15.4111 24.3844 15.0005 23 15.0005C21.6156 15.0005 20.2622 15.4111 19.1111 16.1802C17.96 16.9494 17.0628 18.0426 16.5329 19.3216C16.0031 20.6006 15.8644 22.0081 16.1345 23.3659C16.4045 24.7238 17.0711 25.971 18.05 26.95L23 31.9ZM23 34.728L16.636 28.364C15.3773 27.1054 14.5202 25.5017 14.1729 23.7559C13.8257 22.0101 14.0039 20.2005 14.6851 18.5559C15.3663 16.9114 16.5198 15.5058 17.9999 14.5169C19.4799 13.528 21.22 13.0001 23 13.0001C24.78 13.0001 26.5201 13.528 28.0001 14.5169C29.4802 15.5058 30.6337 16.9114 31.3149 18.5559C31.9961 20.2005 32.1743 22.0101 31.8271 23.7559C31.4798 25.5017 30.6227 27.1054 29.364 28.364L23 34.728ZM23 24C23.5304 24 24.0391 23.7893 24.4142 23.4143C24.7893 23.0392 25 22.5305 25 22C25 21.4696 24.7893 20.9609 24.4142 20.5858C24.0391 20.2108 23.5304 20 23 20C22.4696 20 21.9609 20.2108 21.5858 20.5858C21.2107 20.9609 21 21.4696 21 22C21 22.5305 21.2107 23.0392 21.5858 23.4143C21.9609 23.7893 22.4696 24 23 24ZM23 26C21.9391 26 20.9217 25.5786 20.1716 24.8285C19.4214 24.0783 19 23.0609 19 22C19 20.9392 19.4214 19.9218 20.1716 19.1716C20.9217 18.4215 21.9391 18 23 18C24.0609 18 25.0783 18.4215 25.8284 19.1716C26.5786 19.9218 27 20.9392 27 22C27 23.0609 26.5786 24.0783 25.8284 24.8285C25.0783 25.5786 24.0609 26 23 26Z" fill="white" />
                                                            </svg>
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
