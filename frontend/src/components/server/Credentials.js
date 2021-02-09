import React from 'react';
import { Link } from 'react-router-dom';

class Credentials extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
    }
    render() {
        return (
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <h6 className="heading">Credentials</h6>
                        <p className="sub-heading">SSH/SFTP Access</p>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-user.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
                                <p>
                                    {"admin"}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-password.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
                                <p>
                                    {this.server.password}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
                                <p>
                                    {this.server.ip_address}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-apps.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10">
                                <p>
                                    <Link to={'/applications?serverId=' + this.server.id} style={{ color: "inherit" }}>
                                        {(this.server.applications) ? this.server.applications.length : 0} Applications
                            </Link>
                                </p>
                            </div>
                        </div>
                        {/* <div className="text-center mt-4">
                            <button type="button" onClick={this.handleModalShow} className="btn btn-theme btn-sm">
                                Lounch phpMyAdmin
                            </button>
                        </div> */}
                        {/* <div>
                            <div><p>Try ssh admin@{this.server.ip_address} <br /> or do it via ftp client</p></div>
                        </div> */}
                    </div>
                </div>

            </div>
            // <div className="col-md-4 col-12 server-card">
            //     <div className="server-card-header row">
            //         <div className="col-8 server-card-lebel">
            //             <h6>Credentials</h6>
            //             <p>SSH/SFTP Access</p>
            //         </div>
            //     </div>
            //     <div className="col-12 server-card-content">
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-user.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
            //                 <p>
            //                     {"admin"}
            //                 </p>
            //             </div>
            //         </div>
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-password.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
            //                 <p>
            //                     {this.server.password}
            //                 </p>
            //             </div>
            //         </div>
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10" onClick={this.props.copyToClipBoard} title={"Click to Copy"} >
            //                 <p>
            //                     {this.server.ip_address}
            //                 </p>
            //             </div>
            //         </div>
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-apps.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10">
            //                 <p>
            //                 <Link to={'/applications?serverId='+this.server.id} style={{color:"inherit"}}>
            //                     {(this.server.applications)?this.server.applications.length:0} Applications
            //                 </Link>
            //                 </p>
            //             </div>
            //         </div>
            //         <br/>
            //         <div>
            //             <div><p>Try ssh admin@{this.server.ip_address} <br/> or do it via ftp client</p></div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}

export default Credentials;