import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import PageHeader from '../components/template/PageHeader';
import Pagination from '../components/template/Pagination';

// import { Button, Alert } from 'react-bootstrap';

class Notifications extends React.Component {
    constructor(props) {
        super()
        this.state = {
            loading: true,
            notificationData: {},
            oldN: [],
            newN: []
        }
        this.apiHandler = new ApiHandler();
    }

    componentDidMount = () => {
        this.getNotifications();
        this.setNotificationStatus();
    }
    setNotificationStatus = () => {
        this.apiHandler.setNotificationStatus((msg, data) => {
            this.getNotifications();
        }, err => {
            console.log(err)
        })
    }
    getNotifications(page = 1) {
        this.apiHandler.getNotifications(page, (msg, data) => {
            this.setState({
                notificationData: data,
                loading: false
            })
            this.filterNotifications()
        }, err => {
            console.log(err)
        })
    }
    isOld() {
        return true;
    }
    filterNotifications() {
        let n = [];
        let o = [];
        var dateOffset = (24 * 60 * 60 * 1000) * 1;
        this.state.notificationData.data.forEach(data => {
            if (new Date(data.created_at).getTime() >= new Date().getTime() - dateOffset) {
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
    handlePageChange = (data) => {
        this.getNotifications(data)
    }
    render() {
        return (
            <>
                <div className="container-fluid p-0">
                    <Navigation name="Notifications" />
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
                                            {(this.state.notificationData.total < 1) ?
                                                <div className="card-body">
                                                    <p className="p-0 m-0">
                                                        {(this.state.loading) ?
                                                            <div style={{ width: "100%", paddingLeft: "40%" }}>
                                                                <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
                                                            </div> : 'No Notifications'}
                                                    </p>
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
                                <Pagination onPageChange={this.handlePageChange} key={this.state.notificationData.current_page} data={this.state.notificationData}></Pagination>
                            </div>
                        </section>
                    </div>
                </div>
            </>
        )
    }
}
export default Notifications;
