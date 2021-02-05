import React from 'react';
import Navigation from '../Navigation';
import Sidebar from '../Sidebar';
import ApiHandler from '../../model/ApiHandler';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';


class EditCronJobModal extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.cron = props.cron;
        this.state = {
            minute: (props.cron) ? props.cron.MIN : '',
            hour: (props.cron) ? props.cron.HOUR : '',
            day: (props.cron) ? props.cron.DAY : '',
            month: (props.cron) ? props.cron.MONTH : '',
            wday: (props.cron) ? props.cron.WDAY : '',
            command: (props.cron) ? props.cron.CMD : '',
            cron: props.cron,
            loadding: false,
            error: "",
            success: "",
            showModal: props.modalView
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {

    }
    dataChange = (event) => {
        event.persist();
        const theName = event.target.name;
        const val = event.target.value;

        this.setState({ [theName]: val });
    }
    formSubmit = () => {
        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.cronUpdate(this.props.serverId, this.state.cron.JOB, this.state.minute, this.state.hour, this.state.day, this.state.month, this.state.wday, this.state.command, (message, data) => {
            this.setState({
                error: "",
                success: message,
                loadding: false,
            })
            setTimeout(() => {
                this.props.cronUpdated();
                this.props.cancel();
                this.handleModalClose();
            }, 2000)
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false, loggedIn: false })
        });
    }
    handleModalClose = () => {
        this.props.cancel();
        this.setState({
            showModal: false,
        })
    }
    handleModalShow = () => {
        this.setState({
            showModal: true,
        })
    }
    render() {
        return (
            <Modal centered show={this.state.showModal} onHide={this.handleModalClose}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Cron Job</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert show={(this.state.error != "") ? true : false} variant="danger" dismissible>
                            {this.state.error}
                        </Alert>
                        <Alert show={(this.state.success != "") ? true : false} variant="success" dismissible>
                            {this.state.success}
                        </Alert>
                        {this.state.loadding ?
                            <div style={{ width: "100%", paddingLeft: "40%" }}>
                                <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
                            </div>
                            :
                            <div>
                                <div class="modal-form form-group">
                                    <label htmlFor="">Command</label>
                                    <input type="text" required name="command" defaultValue={this.state.command} onChange={this.dataChange} className="form-input-field"
                                        placeholder="Enter Command" />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div class="modal-form form-group">
                                            <label htmlFor="">Minute</label>
                                            <input type="text" required name="minute" defaultValue={this.state.minute} onChange={this.dataChange} min="0" max="59" className="form-input-field"
                                                placeholder="1 for every" />
                                        </div>
                                        <div class="modal-form form-group">
                                            <label htmlFor="">Day</label>
                                            <input type="text" required name="day" defaultValue={this.state.day} onChange={this.dataChange} min="1" max="31" className="form-input-field"
                                                placeholder="1 for every" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="modal-form form-group">
                                            <label htmlFor="">Hour</label>
                                            <input type="text" required name="hour" defaultValue={this.state.hour} onChange={this.dataChange} min="0" max="59" className="form-input-field"
                                                placeholder="1 for every" />
                                        </div>
                                        <div class="modal-form form-group">
                                            <label htmlFor="">Week Day</label>
                                            <input type="text" required name="wday" defaultValue={this.state.wday} onChange={this.dataChange} min="1" max="7" className="form-input-field"
                                                placeholder="1 for every" />
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-form form-group mb-0">
                                    <label htmlFor="">Month</label>
                                    <input type="text" required name="month" defaultValue={this.state.month} onChange={this.dataChange} min="1" max="12" className="form-input-field"
                                        placeholder="1 for every" />
                                </div>
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="col-12 model-form-action text-right">
                            <Button variant="default" className="mr-4" onClick={this.handleModalClose}>
                                CLOSE
                            </Button>
                            <button type="button" onClick={this.formSubmit} className="btn btn-theme">
                                {this.state.loadding ?
                                    <img alt="loadding" src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                    : "Update"
                                }
                            </button>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>

        );
    }
}
export default EditCronJobModal;
