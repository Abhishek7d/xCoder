import React, { Component } from 'react'

class ApplicationDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <div className="col-3 float-left">
                            <h5 className="font-weight-bold text-secondary">{this.props.application.domain}</h5>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="col-12 application_page_cards" id="huddles">
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">App Credentials</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">DB Credentials</a>
                                </li>

                            </ul>
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div className="row ml-2">
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">User Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">Password :</span>
                                        </div>
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">User Name</span>
                                            <span className="mt-3 font-weight-bold text-primary">Password</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div className="row ml-2">
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-info">DB Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">DB User Name :</span>
                                            <span className="mt-3 font-weight-bold text-info">DB Password :</span>
                                        </div>
                                        <div className="col-md-2 d-flex flex-column">
                                            <span className="mt-3 font-weight-bold text-primary">DB Name</span>
                                            <span className="mt-3 font-weight-bold text-primary">DB User Name</span>
                                            <span className="mt-3 font-weight-bold text-primary">DB Password</span>
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
