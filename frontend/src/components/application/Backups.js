import React from 'react';
import ApiHandler from "../../model/ApiHandler";
import { Alert } from 'react-bootstrap';

class Backups extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.application = props.application;
        this.state = {
            backups: [],
            loading: true,
            showModal: false,
            makingBackup: false,
            restoring: false,
            restoringIndex: null,
            error: "",
            success: "",

        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.loadBackups()
    }
    handleModalClose = () => {
        this.setState({
            showModal: false,
        })
    }
    loadBackups = () => {
        this.apiHandler.getBackups(this.server.id, this.application.id, (msg, data) => {
            this.setState({
                backups: data[this.application.domain],
                loading: false
            });
        });
    }
    restoreBackup = (index) => {
        if (this.state.restoring) return;
        this.setState({
            restoring: true,
            restoringIndex: index,
        })
        this.apiHandler.restoreBackup(this.server.id, this.getBackup(index).name, this.application.domain, this.application.db_name, this.application.domain, this.application.domain, "no", (msg, data) => {
            this.setState({ restoring: false, success: msg })
        }, (error) => {
            this.setState({ restoring: false, error: error })
        });
    }
    getBackup(index) {
        return this.state.backups[index]
    }
    renderBackups = () => {
        let list = [];
        if (this.state.backups.length > 0) {
            this.state.backups.forEach((data, index) => {
                list.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {/* <td>{data.name}</td> */}
                        <td>{data.date}</td>
                        <td>
                            {(data.web) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Website,&nbsp;&nbsp;
                            {(data.db) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Database,&nbsp;&nbsp;
                            {(data.mail) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Emails,&nbsp;&nbsp;
                            {(data.dns) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} DNS
                        </td>
                        <td>{data.size} MB</td>
                        <td>
                            <button key={index} onClick={() => this.restoreBackup(index)} className="btn btn-theme btn-sm">
                                {
                                    (this.state.restoring && this.state.restoringIndex === index) ?
                                        <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "20px", filter: "brightness(20)" }} />
                                        : 'Restore'
                                }
                            </button>
                        </td>
                    </tr>
                )
            })
        } else {
            list.push(
                <tr key={0}>
                    <td colSpan="5" className="text-center">
                        No Backups
                    </td>
                </tr>
            )
        }
        return list;
    }
    takeBackup = () => {
        this.setState({ makingBackup: true, })

        this.apiHandler.createBackups(this.server.id, (msg, data) => {
            this.setState({ loading: true, success: msg, makingBackup: false })
            this.loadBackups()
        }, (err) => {
            console.log(err)
        })
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    render() {
        return (
            <>
                <div className="col-md-12 full-height">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-8 align-self-center">
                                    <h6 className="heading">Backups</h6>
                                    <p className="sub-heading">Backups Details</p>
                                </div>
                                {/* <div className="col-4 align-self-center text-right">
                                    <button className={"btn btn-theme btn-sm"} onClick={() => this.takeBackup()} style={{ marginLeft: '10px' }}>
                                        {
                                            this.state.makingBackup ?
                                                <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                : 'Take Backup Now'
                                        }
                                    </button>
                                </div> */}
                            </div>
                        </div>
                        <div className="card-body table-responsive">
                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                {this.state.error}
                            </Alert>
                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                {this.state.success}
                            </Alert>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {/* <th>Name</th> */}
                                        <th>Date</th>
                                        <th>Backups</th>
                                        <th>Size</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(this.state.loading) ?
                                        <tr>
                                            <td className="text-center" colSpan="6">
                                                <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
                                            </td>
                                        </tr>
                                        :
                                        this.renderBackups()
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
export default Backups;