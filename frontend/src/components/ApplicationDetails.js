import React, { Component } from 'react'

class ApplicationDetails extends Component {
    constructor(props) {
        super()
        this.props = props;
        this.application = props.application;
        this.server = props.application.server;
    }

    render() {
        return (
            <>
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <div className="col-3 float-left" style={{display: "flex"}}>
                            <a className="nav-link" type="button" onClick={()=>this.props.applicationClickHandler()}><i className="fas fa-arrow-left"></i></a>
                            <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{this.application.domain}</h5>
                            <span className="badge badge-info ml-4 pt-1" style={{height:"20px",margin:"auto"}}>{this.application.status}</span>

                        </div>

                    </div>
                    <div className="card-body">
                        <div className="col-12 application_page_cards" id="huddles">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">App Credentials</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">DB Credentials</a>
                                </li>

                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="row ml-2">
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">User Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">Password :</span>
                                        </div>
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">{this.application.username}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.application.password}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className="row ml-2">
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">DB Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">DB User Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">DB Password :</span>
                                        </div>
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">{this.application.db_name}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.application.db_username}</span>
                                            <span className="mt-3 font-weight-bold text-primary">{this.application.db_password}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer"></div>
                </div>
            </>

        )
    }
}
export default ApplicationDetails;
