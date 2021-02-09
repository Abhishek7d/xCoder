import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import PageHeader from '../components/template/PageHeader';
// import { Button, Alert } from 'react-bootstrap';

class Notifications extends React.Component {
    constructor(props) {
        super()
        this.state = {
            notifications: []
        }
        this.apiHandler = new ApiHandler();
    }
    getNotifications() {

    }
    isOld() {
        return true;
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
                                heading="Notifications" subHeading="All notification">
                            </PageHeader>
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-body pt-5 border-bottom">
                                                <ul className="bullet-theme">
                                                    <li >Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing, Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing, Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing</li>
                                                    <li >Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing</li>
                                                </ul>
                                            </div>
                                            <div className="card-body pt-5 border-bottom">
                                                <ul className="bullet-theme old">
                                                    <li >Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing, Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing, Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing</li>
                                                    <li >Amet, eget at nullam sapien egestas sed adipiscing sed ullamcorper in justo porttitor volutpat in quam eu sodales eget adipiscing</li>
                                                </ul>
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
export default Notifications;
