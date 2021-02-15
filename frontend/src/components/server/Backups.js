import React from 'react';
import ApiHandler from "../../model/ApiHandler";
import { Alert } from 'react-bootstrap';

class Backups extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            backups: [],
            showBackup: null,
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

        this.apiHandler.getAllBackups(this.server.id, (msg, data) => {
            this.setState({
                backups: data,
                loading: false
            });
        });
    }
    restoreBackup = (xindex, index) => {
        if (this.state.restoring) return;
        this.setState({
            restoring: true,
            restoringIndex: index,
        })
        this.apiHandler.restoreBackup(this.server.id, this.getBackup(xindex, index).name, this.getBackup(xindex, index).domain, this.getBackup(xindex, index).db_name, this.getBackup(xindex, index).domain, this.getBackup(xindex, index).domain, "no", (msg, data) => {
            this.setState({ restoring: false, success: msg })
        }, (error) => {
            this.setState({ restoring: false, error: error })
        });
    }
    getBackup(xindex, index) {
        return this.state.backups[xindex][index]
    }
    showBackups = (index) => {
        let bkp = this.state.backups[index];
        if (bkp.length === 1) {

        } else {
            this.setState({
                showBackup: index,
            })
        }
    }
    renderBackups = () => {
        let list = [];
        if (this.state.backups.length > 0) {
            this.state.backups.forEach((data, index) => {
                list.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data[0].domain}</td>
                        <td>{data[0].date}</td>
                        <td>
                            {(data[0].web) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Website,&nbsp;&nbsp;
                            {(data[0].db) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Database,&nbsp;&nbsp;
                            {(data[0].mail) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Emails,&nbsp;&nbsp;
                            {(data[0].dns) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} DNS
                        </td>
                        <td>
                            <button key={index} onClick={() => this.showBackups(index)} className="btn btn-theme btn-sm">
                                {
                                    (this.state.restoring && this.state.restoringIndex === index) ?
                                        <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "20px", filter: "brightness(20)" }} />
                                        : 'View'
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
    renderDomainBackup = (xindex) => {
        let list = [];
        if (this.state.backups[xindex].length > 0) {
            this.state.backups[xindex].forEach((data, index) => {
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
                            <button key={index} onClick={() => this.restoreBackup(xindex, index)} className="btn btn-theme btn-sm">
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
                        No Backups Created
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
                                    {(this.state.showBackup !== null) ?
                                        <>
                                            <h6 className="heading">
                                                <i onClick={() => this.setState({ showBackup: null })} className="fa fa-arrow-left mr-2"></i>
                                                {this.state.backups[this.state.showBackup][0].domain}
                                            </h6>
                                        </>
                                        :
                                        <>
                                            <h6 className="heading">Backups</h6>
                                            <p className="sub-heading">Backups Details</p>
                                        </>}
                                </div>
                                <div className="col-4 align-self-center text-right">
                                    <button className={"btn btn-theme btn-sm"} onClick={() => this.takeBackup()} style={{ marginLeft: '10px' }}>
                                        {
                                            this.state.makingBackup ?
                                                <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                : 'Take Backup Now'
                                        }
                                    </button>
                                </div>
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
                                    {(this.state.showBackup !== null) ?
                                        <tr>
                                            <th>#</th>
                                            {/* <th>Name</th> */}
                                            <th>Date</th>
                                            <th>Backups</th>
                                            <th>Size</th>
                                            <th>Action</th>
                                        </tr> : <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Date</th>
                                            <th>Backups</th>
                                            <th>Action</th>
                                        </tr>
                                    }

                                </thead>
                                <tbody>
                                    {(this.state.loading) ?
                                        <tr>
                                            <td className="text-center" colSpan="6">
                                                <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
                                            </td>
                                        </tr>
                                        :
                                        (this.state.showBackup !== null) ? this.renderDomainBackup(this.state.showBackup) : this.renderBackups()

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