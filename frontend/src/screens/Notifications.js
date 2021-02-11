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
            notifications: [],
            oldN: [],
            newN: []
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.getNotifications();
        this.interval = setInterval(() => {
            this.getNotifications();
        }, 5000);
    }
    getNotifications() {
        this.apiHandler.getNotifications((msg, data) => {
            this.setState({
                notifications: data
            })
            this.filterNotifications()
        })
    }
    isOld() {
        return true;
    }
    filterNotifications() {
        let n = [];
        let o = [];
        this.state.notifications.forEach(data => {
            if (new Date(data.created_at) >= new Date()) {
                n.push(data)
            } else {
                o.push(data)
            }
        })
        this.setState({
            newN: n,
            oldN: o
        })
    }
    renderOldNotification() {
        let tmp = [];
        this.state.oldN.forEach(data => {
            tmp.push(<li>{data.msg}</li>)
        })
        if (this.state.oldN.length > 0) {
            return <div className="card-body border-bottom">
                <ul className="bullet-theme old">
                    {tmp}
                </ul>
            </div>;
        } else {
            return false
        }
    }
    renderNewNotification() {
        let tmp = []
        this.state.newN.forEach(data => {
            tmp.push(<li>{data.msg}</li>)
        })
        if (this.state.newN.length > 0) {
            return <div className="card-body border-bottom">
                <ul className="bullet-theme pt-3">
                    {tmp}
                </ul>
            </div>;
        } else {
            return false
        }

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
                                        <div className="card p-0">
                                            {(this.state.notifications.length <= 0) ?
                                                <div className="card-body">
                                                    <p className="p-0 m-0">No Notifications</p>
                                                </div>
                                                :
                                                <>
                                                    {this.renderNewNotification()}
                                                    {this.renderOldNotification()}
                                                </>
                                            }
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
