import React, { Component } from "react";
function PageHeader(props) {

    return (
        <div className="pageHeader">
            <div className="row">
                <div className="col-md-4 align-self-center page_header">
                    <h5 className="heading">
                        {props.status}
                        {props.heading}
                    </h5>
                    <p className="sub_heading pt-1 pb-0 mb-0 ">
                        {props.subHeading}
                    </p>
                </div>
                <div className="col-md-8 align-self-center">
                    {props.children}
                </div>
            </div>
        </div>
    );
}
export default PageHeader;