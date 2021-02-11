import React, { Component } from 'react'
import "../index.css"

class ProjectDetails extends Component {
    constructor(props) {
        super();
        // this.props = props;
    }
    render() {
        return (
            <>
                <div className="card card-primary card-outline">
                    <div className="card-header">
                        <div className="col-3 float-left" style={{ display: "flex" }}>
                            <button className="nav-link" onClick={this.props.projectClickHandler}><i className="fas fa-arrow-left"></i></button>
                            <h5 className="nav-link font-weight-bold text-secondary" style={{ minWidth: "max-content" }}>Project 1</h5>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="col-12 application_page_cards" id="huddles">
                            <ul class="nav nav-pills mb-3" id="server-details-tab-header" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="pills-summery-tab" data-toggle="pill" href="#pills-summery" role="tab" aria-controls="pills-summery" aria-selected="true">Summery</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-credentials-tab" data-toggle="pill" href="#pills-credentials" role="tab" aria-controls="pills-credentials" aria-selected="true">Servers</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="pills-credentials-tab" data-toggle="pill" href="#pills-credentials" role="tab" aria-controls="pills-credentials" aria-selected="true">Team Members</a>
                                </li>
                            </ul>
                            <div class="tab-content" id="pills-tabContent">

                            </div>
                        </div>
                    </div>
                    <div className="card-footer"></div>
                </div>
            </>

        )
    }
}
export default ProjectDetails;