import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import ReactBootstrapSlider from 'react-bootstrap-slider';

class CreateServerScreen extends React.Component {
    constructor(props) {
        super();
        this.state = {
            serverName: "",
            serverSize: "",
            serverLocation: "",
            appName: "",
            project: "",
            error: "",
            success: "",
            loadding: false
        }
        this.apiHandler = new ApiHandler();
    }
    formAction = () => {

        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.createServer(this.state.serverName, this.state.serverSize, this.state.serverLocation, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            console.log(data, message);
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Your Dashboard</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item"><a href="#">Layout</a></li>
                                        <li className="breadcrumb-item active">Boxed Layout</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title"></h3>

                                            <div className="card-tools">
                                                <button type="button" className="btn btn-tool" data-card-widget="collapse"
                                                    data-toggle="tooltip" title="Collapse">
                                                    <i className="fas fa-minus"></i></button>
                                                <button type="button" className="btn btn-tool" data-card-widget="remove"
                                                    data-toggle="tooltip" title="Remove">
                                                    <i className="fas fa-times"></i></button>
                                            </div>
                                        </div>
                                        <form action="#" method="post">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <select value={this.state.serverLocation} onChange={this.dataChange} name="serverLocation" className="form-control border-bottom">
                                                            <option value="" disabled selected>Wordpress</option>
                                                            <option>Version 5.4.2</option>
                                                            <option>Version 5.4.2 with WooCommerce Version 4.3.0</option>
                                                            <option>Multisite Version 5.4.2</option>
                                                            <option>Clean (No cloudways optimization) Version 5.4.2</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-3">
                                                        <input type="text" value={this.state.appName} onChange={this.dataChange} name="appName" className="form-control border-bottom" id="Namemanageapp"
                                                            placeholder="Name your Managed App" />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <input type="text" value={this.state.serverName} onChange={this.dataChange} name="serverName" className="form-control border-bottom" id="Namemanageserver"
                                                            placeholder="Name your Managed Server" />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <input type="text" value={this.state.project} onChange={this.dataChange} name="project" className="form-control border-bottom" id="Selectyourproj"
                                                            placeholder="Select your Project" />
                                                    </div>

                                                </div>

                                                <br />

                                                <div className="row">
                                                    <div className="col-12">
                                                        <h3 className="card-title">Server Size</h3>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <input id="ex19" type="text"
                                                            value={this.state.serverSize}
                                                            onChange={this.dataChange}
                                                            name="serverSize"
                                                            data-provide="slider"
                                                            data-slider-ticks="[1, 2, 3, 4, 5,6,7,8,9,10,11]"
                                                            data-slider-ticks-labels='["1GB", "2GB", "4gb","8gb","16gb","32gb","48gb","64gb","96gb","128gb","192gb"]'
                                                            data-slider-min="1"
                                                            data-slider-max="11"
                                                            data-slider-step="1"
                                                            data-slider-value="3"
                                                            data-slider-tooltip="hide"

                                                        />
                                                        {/* <ReactBootstrapSlider
                                                            value={3}
                                                            step={1}
                                                            max={11}
                                                            min={1}
                                                            reversed={true}
                                                            ticks={[0, 100, 200, 300, 400]}
                                                            ticks_labels={["1GB", "2GB", "4gb","8gb","16gb","32gb","48gb","64gb","96gb","128gb","192gb"]}
                                                            ticks_snap_bounds={30}
                                                        /> */}
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="row ">

                                                    <div className="col-8">
                                                        <h3 className="card-title">LOCATION</h3>
                                                        <br />
                                                        <div className="form-group">
                                                            <label for="exampleInputEmail1">Please select your server location.</label>
                                                            <select id="locations" value={this.state.serverLocation} onChange={this.dataChange} name="serverLocation" className="form-control border-bottom">
                                                                <option value="lon1" selected>London</option>
                                                                <option>San Francisco</option>
                                                                <option value="sgp1">Singapore</option>
                                                                <option value="nyc1">New York</option>
                                                                <option value="ams3">Amsterdam</option>
                                                                <option value="fra1">Frankfurt</option>
                                                                <option value="tor1">Toronto</option>
                                                                <option value="blr1">Bangalore</option>

                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <button type="button" onClick={this.formAction} className="btn btn-primary">
                                                    {this.state.loadding ?
                                                        <img src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                        :
                                                        "LAUNCH NOW"
                                                    }

                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        );
    }
}
export default CreateServerScreen;
