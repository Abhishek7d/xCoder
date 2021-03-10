import React from 'react';
import ApiHandler from "../../model/ApiHandler";
import { Alert } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import Loader from '../../components/template/Loader';

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
            web: null,
            db: null,
            email: null,
            dns: null
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {
        this.loadBackups()
    }
    handleModalClose = () => {
        this.setState({
            showModal: false,
            restoringIndex: null,
            web: null,
            db: null,
            email: null,
            dns: null
        })
    }
    handleModalShow = (index) => {
        if (this.state.restoring) return;
        this.setState({ showModal: true, restoringIndex: index, })
    }
    loadBackups = () => {
        this.apiHandler.getBackups(this.server.id, this.application.id, (msg, data) => {
            this.setState({
                backups: data[this.application.domain],
                loading: false
            });
        });
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
                            {/* {(data.mail) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} Emails,&nbsp;&nbsp; */}
                            {/* {(data.dns) ? <i className="fa fa-check text-green"></i> : <i className="fa fa-times text-danger"></i>} DNS */}
                        </td>
                        <td>{data.size} MB</td>
                        <td>
                            <button key={index} onClick={() => this.handleModalShow(index)} className="btn btn-theme btn-sm">
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
    restoreBackup = () => {
        if (!this.checkDisabled()) return;
        this.setState({
            restoring: true
        })
        let index = this.state.restoringIndex;
        let web = (this.state.web) ? this.application.domain : 'no';
        let db = (this.state.db) ? this.application.db_name : 'no';
        let mail = (this.state.mail) ? this.application.domain : 'no';
        let dns = (this.state.dns) ? this.application.domain : 'no';

        this.apiHandler.restoreBackup(this.server.id, this.getBackup(index).name, web, db, mail, dns, "no", (msg, data) => {
            this.setState({
                restoring: false,
                restoringIndex: null,
                success: msg,
                web: null,
                db: null,
                email: null,
                dns: null
            })
        }, (error) => {
            this.setState({ restoring: false, error: error })
        });
        this.setState({ showModal: false })

    }
    getBackup(index) {
        return this.state.backups[index]
    }
    dataChange = (event) => {
        //  console.log(event.target)
        let value = event.target.checked;
        this.setState({ [event.target.name]: value })
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
    checkDisabled = () => {
        let isChecked = false;
        if (this.state.web) {
            isChecked = true;
        } else if (this.state.db) {
            isChecked = true;
        } else if (this.state.email) {
            isChecked = true;
        } else if (this.state.dns) {
            isChecked = true;
        }
        return isChecked;
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
                                                <Loader type="card" />
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
                <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>Restore Backup</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {(this.state.restoringIndex !== null) ?
                                <div>

                                    <div className="modal-form mb-3">
                                        <label htmlFor="">Select backups to restore</label>
                                        <div className="custom-control custom-checkbox ">
                                            <input name="web" onChange={this.dataChange} type="checkbox" className="custom-control-input" id="web" />
                                            <label className="custom-control-label" htmlFor="web">Restore Website</label>
                                        </div>
                                        <div className="custom-control custom-checkbox">
                                            <input name="db" onChange={this.dataChange} type="checkbox" className="custom-control-input" id="db" />
                                            <label className="custom-control-label" htmlFor="db">Restore Database</label>
                                        </div>
                                        {/* <div className="custom-control custom-checkbox">
                                            <input name="email" onChange={this.dataChange} type="checkbox" className="custom-control-input" id="email" />
                                            <label className="custom-control-label" htmlFor="email">Restore Email</label>
                                        </div>
                                        <div className="custom-control custom-checkbox">
                                            <input name="dns" onChange={this.dataChange} type="checkbox" className="custom-control-input" id="dns" />
                                            <label className="custom-control-label" htmlFor="dns">Restore DNS</label>
                                        </div> */}
                                    </div>
                                    <p className="">Restoring backups from <strong>{this.state.backups[this.state.restoringIndex].name}</strong></p>
                                </div>
                                : ''}

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                            </Button>
                            <Button className="btn btn-theme" onClick={this.restoreBackup}>
                                {
                                    (this.state.restoring) ?
                                        <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "20px", filter: "brightness(20)" }} />
                                        : 'Restore'
                                }
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        )
    }
}
export default Backups;