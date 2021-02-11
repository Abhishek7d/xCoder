import React from 'react';
import ApiHandler from '../model/ApiHandler';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Modal, Button, Alert } from 'react-bootstrap';


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
            loadding: false,
            options: [],
            sizes: [],
            regions: {},
            unavailableRegions: {},
            selectd_size: 0,
            showModal: false
        }
        this.apiHandler = new ApiHandler();
    }
    setShow() {
        this.setState({ error: "", success: "", })
    }
    componentDidMount = () => {
        this.apiHandler.getServerSizes((data) => {
            let tmp_sizes = [];
            data.forEach(size => {
                tmp_sizes.push(size.slug)
            })
            this.setState({ sizes: data, options: tmp_sizes })
        }, (err) => {
            console.log(err)
        })
        this.apiHandler.getRegions((regions) => {
            let tmp_regions = this.state.regions;
            let unavailableRegions = {}
            regions.forEach(region => {
                tmp_regions[region.slug] = region.name
            })
            regions.forEach(region => {
                if (!region.available && !region.features.includes('storage')) {
                    unavailableRegions[region.slug] = "Additional Storage Unavailable"
                }
            })
            this.setState({ regions: tmp_regions })
            this.setState({ unavailableRegions: unavailableRegions })

        }, (err) => {
            console.log(err)
        })
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
        this.apiHandler.createServer(this.state.name, this.state.size, this.state.location, this.state.appName, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            window.location.href = "/servers"
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
    }
    dataChange = (event) => {
        if (event.target.name === "size") {
            let tmp = Object.values(this.state.sizes);
            let flag = null;
            tmp.forEach((size, index) => {
                if (size.slug === event.target.value) {
                    flag = index;
                }
            })
            if (flag === null) {
                return;
            }
            tmp = tmp[flag].regions;
            this.setState({ location: tmp[0] })
        }
        this.setState({ [event.target.name]: event.target.value })
    }
    renderOptions() {
        let tmp_data = [<option key="-1" value="" >Select Size</option>];
        let tmp_list = [];
        this.state.options.forEach(data => {
            let tmp = data.split("-");
            if (tmp.length === 3) {
                tmp_list.push(data);
            }
        })
        tmp_list.sort();
        tmp_list.forEach(data => {
            let tmp = data.split("-");
            tmp_data.push(<option key={data} value={data}>{tmp[1].toUpperCase() + " + " + tmp[2].toUpperCase()}</option>);
        })
        return tmp_data;
    }
    renderLocations() {
        let tmp_data = [];
        if (this.state.sizes === undefined) {
            return;
        }
        let tmp = Object.values(this.state.sizes);
        let flag = null;
        tmp.forEach((size, index) => {
            if (size.slug === this.state.size) {
                flag = index;
            }
        })
        if (flag === null) {
            return;
        }
        tmp = tmp[flag].regions;
        tmp.forEach((data) => {
            let tmp = this.state.regions[data]
            tmp_data.push(<option value={data}>{tmp}</option>);
        });

        return tmp_data;
    }

    handleModalClose = () => {
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
            <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                <form action="#" method="post">
                    <Modal.Header closeButton>
                        <Modal.Title>Create Server</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                            {this.state.error}
                        </Alert>
                        <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                            {this.state.success}
                        </Alert>
                        <div class="modal-form">
                            <label htmlFor="">Server Name</label>
                            <div className="input-group">
                                <input type="text" required value={this.state.name} onChange={this.dataChange} name="name" className="form-control form-input-field" id="Namemanageserver"
                                    placeholder="Name your Managed Server" />
                                <div class="input-group-append">
                                    <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="45" height="45" rx="8" fill="#7973FE" />
                                        <path d="M16 22H30V16H16V22ZM32 15V31C32 31.2652 31.8946 31.5196 31.7071 31.7071C31.5196 31.8946 31.2652 32 31 32H15C14.7348 32 14.4804 31.8946 14.2929 31.7071C14.1054 31.5196 14 31.2652 14 31V15C14 14.7348 14.1054 14.4804 14.2929 14.2929C14.4804 14.1054 14.7348 14 15 14H31C31.2652 14 31.5196 14.1054 31.7071 14.2929C31.8946 14.4804 32 14.7348 32 15ZM30 24H16V30H30V24ZM18 26H21V28H18V26ZM18 18H21V20H18V18Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="modal-form">
                            <label htmlFor="">Server Size</label>
                            <div className="input-group">
                                <select required value={this.state.size} onChange={this.dataChange} name="size" className="custom-select form-input-field">
                                    {this.renderOptions()}
                                </select>
                                <div class="input-group-append">
                                    <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="45" height="45" rx="8" fill="#7973FE" />
                                        <path d="M23 33C17.477 33 13 28.523 13 23C13 18.522 15.943 14.732 20 13.458V15.582C18.2809 16.28 16.8578 17.5537 15.9741 19.1851C15.0903 20.8165 14.8009 22.7043 15.1553 24.5255C15.5096 26.3468 16.4858 27.9883 17.9168 29.1693C19.3477 30.3503 21.1446 30.9975 23 31C24.5938 31 26.1513 30.524 27.4728 29.6332C28.7944 28.7424 29.82 27.4773 30.418 26H32.542C31.268 30.057 27.478 33 23 33ZM32.95 24H22V13.05C22.329 13.017 22.663 13 23 13C28.523 13 33 17.477 33 23C33 23.337 32.983 23.671 32.95 24ZM24 15.062V22H30.938C30.7154 20.2376 29.9129 18.5993 28.6568 17.3432C27.4007 16.0871 25.7624 15.2846 24 15.062Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="modal-form">
                            <label htmlFor="">Server Location</label>
                            <div className="input-group">
                                <select id="locations" required value={this.state.location} onChange={this.dataChange} name="location" className="custom-select form-input-field">
                                    {this.renderLocations()}
                                </select>
                                <div class="input-group-append">
                                    <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="45" height="45" rx="8" fill="#7973FE" />
                                        <path d="M23 31.9L27.95 26.95C28.9289 25.971 29.5955 24.7238 29.8656 23.3659C30.1356 22.0081 29.9969 20.6006 29.4671 19.3216C28.9373 18.0426 28.04 16.9494 26.8889 16.1802C25.7378 15.4111 24.3844 15.0005 23 15.0005C21.6156 15.0005 20.2622 15.4111 19.1111 16.1802C17.96 16.9494 17.0628 18.0426 16.5329 19.3216C16.0031 20.6006 15.8644 22.0081 16.1345 23.3659C16.4045 24.7238 17.0711 25.971 18.05 26.95L23 31.9ZM23 34.728L16.636 28.364C15.3773 27.1054 14.5202 25.5017 14.1729 23.7559C13.8257 22.0101 14.0039 20.2005 14.6851 18.5559C15.3663 16.9114 16.5198 15.5058 17.9999 14.5169C19.4799 13.528 21.22 13.0001 23 13.0001C24.78 13.0001 26.5201 13.528 28.0001 14.5169C29.4802 15.5058 30.6337 16.9114 31.3149 18.5559C31.9961 20.2005 32.1743 22.0101 31.8271 23.7559C31.4798 25.5017 30.6227 27.1054 29.364 28.364L23 34.728ZM23 24C23.5304 24 24.0391 23.7893 24.4142 23.4143C24.7893 23.0392 25 22.5305 25 22C25 21.4696 24.7893 20.9609 24.4142 20.5858C24.0391 20.2108 23.5304 20 23 20C22.4696 20 21.9609 20.2108 21.5858 20.5858C21.2107 20.9609 21 21.4696 21 22C21 22.5305 21.2107 23.0392 21.5858 23.4143C21.9609 23.7893 22.4696 24 23 24ZM23 26C21.9391 26 20.9217 25.5786 20.1716 24.8285C19.4214 24.0783 19 23.0609 19 22C19 20.9392 19.4214 19.9218 20.1716 19.1716C20.9217 18.4215 21.9391 18 23 18C24.0609 18 25.0783 18.4215 25.8284 19.1716C26.5786 19.9218 27 20.9392 27 22C27 23.0609 26.5786 24.0783 25.8284 24.8285C25.0783 25.5786 24.0609 26 23 26Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {(this.state.unavailableRegions[this.state.location]) ? <p className="text-danger text-small text-center"> {this.state.unavailableRegions[this.state.location]} </p> : ''}
                        <div class="modal-form">
                            <label htmlFor="">Application Name</label>
                            <div className="input-group">
                                <input type="text" required value={this.state.appName} onChange={this.dataChange} name="appName" className="form-control form-input-field" id="appName"
                                    placeholder="Application Name" />
                                <div class="input-group-append">
                                    <svg width="38" height="38" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="45" height="45" rx="8" fill="#7973FE" />
                                        <path d="M16 22H30V16H16V22ZM32 15V31C32 31.2652 31.8946 31.5196 31.7071 31.7071C31.5196 31.8946 31.2652 32 31 32H15C14.7348 32 14.4804 31.8946 14.2929 31.7071C14.1054 31.5196 14 31.2652 14 31V15C14 14.7348 14.1054 14.4804 14.2929 14.2929C14.4804 14.1054 14.7348 14 15 14H31C31.2652 14 31.5196 14.1054 31.7071 14.2929C31.8946 14.4804 32 14.7348 32 15ZM30 24H16V30H30V24ZM18 26H21V28H18V26ZM18 18H21V20H18V18Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="default" onClick={this.handleModalClose}>
                            CLOSE
                            </Button>
                        <button type="button" onClick={this.formAction} className="btn btn-theme">
                            {this.state.loadding ?
                                <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                : "LAUNCH NOW"
                            }
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
            // <div className="container-fluid p-0">
            //     <Navigation />
            //     <Sidebar />
            //     <div className="content-wrapper">
            //         <section className="content-header">
            //             <div className="container-fluid">
            //                 <div className="row mb-2">

            //                 </div>
            //             </div>
            //         </section>
            //         <section className="content">
            //             <div className="container-fluid">
            //                 <div className="row">

            //                     <div className="col-12">
            //                         <div className="card card-primary card-outline">
            //                             <div className="card-header">
            //                                 <div className="col-3 float-left" style={{display: "flex"}}>
            //                                     <Link className="nav-link" to="/servers">
            //                                         <i className="fas fa-arrow-left"></i>
            //                                     </Link>
            //                                     <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{"Create Server"}</h5>
            //                                 </div>
            //                             </div>
            //                             <form action="#" method="post">
            //                                 <p style={{color:"red",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
            //                                 <p style={{color:"green",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>

            //                                 <div className="card-body">
            //                                 <div className="row">
            //                                         <div className="col-2">
            //                                             <h3 className="card-title">Server Name</h3>
            //                                         </div>
            //                                         <div className="col-9">
            //                                         <input type="text" required value={this.state.name} onChange={this.dataChange} name="name" className="form-control border-bottom col-md-9" id="Namemanageserver"
            //                                                 placeholder="Name your Managed Server" />

            //                                         </div>
            //                                     </div>
            //                                     <br />
            //                                     <div className="row">
            //                                         <div className="col-2">
            //                                             <h3 className="card-title">Server Size</h3>
            //                                         </div>
            //                                         <div className="col-7">
            //                                         <select required value={this.state.size} onChange={this.dataChange} name="size" className="form-control border-bottom">
            //                                             {this.renderOptions()}
            //                                         </select>
            //                                         </div>
            //                                     </div>
            //                                     <br />

            //                                     <div className="row">
            //                                         <div className="col-2">
            //                                             <h3 className="card-title">Server Location</h3>
            //                                         </div>
            //                                         <div className="col-7">
            //                                         <select id="locations" required value={this.state.location} onChange={this.dataChange} name="location" className="form-control border-bottom">
            //                                             {this.renderLocations()}
            //                                         </select>
            //                                         </div>
            //                                     </div>
            //                                     <br />

            //                                     <div className="row">
            //                                         <div className="col-2">
            //                                             <h3 className="card-title">Application Name</h3>
            //                                         </div>
            //                                         <div className="col-7">
            //                                         <input type="text" required  value={this.state.appName} onChange={this.dataChange} name="appName" className="form-control border-bottom col-md-9" id="appName"
            //                                                 placeholder="Application Name" />
            //                                         </div>
            //                                     </div>

            //                                 </div>
            //                                 <div className="card-footer">
            //                                     <button type="button" onClick={this.formAction} className="btn btn-primary">
            //                                         {this.state.loadding ?
            //                                             <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
            //                                             : "LAUNCH NOW"
            //                                         }

            //                                     </button>
            //                                 </div>
            //                             </form>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </section>
            //     </div>

            // </div>
        );
    }
}
export default CreateServerScreen;
