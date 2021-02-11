import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Summery extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            regions: {},
            loadding: false
        }

        this.apiHandler = new ApiHandler();
    }
    componentDidMount() {
        this.apiHandler.getRegions((regions) => {
            let tmp_regions = this.state.regions;
            regions.forEach(region => {
                tmp_regions[region.slug] = region.name
            })
            this.setState({ regions: tmp_regions })
        }, (err) => {
            console.log(err)
        })
    }
    render() {
        return (
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4 full-height">
                <div className="card">
                    <div className="card-header">
                        <h6 className="heading">Summary</h6>
                        <p className="sub-heading">Genral Details</p>
                    </div>
                    <div className="card-body server-details-list">
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ram.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.server.size}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.server.ip_address}</p></div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-location.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.state.regions[this.server.region]}</p></div>
                        </div>

                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-memory.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.server.memory} MB</p></div>
                        </div>

                        <div className="row">
                            <div className="col-2">
                                <img src={require("../../assets/images/icons/server-storage.svg")} alt="" srcSet="" />
                            </div>
                            <div className="col-10"><p>{this.server.disk} GB</p></div>
                        </div>
                    </div>
                </div>
            </div>


            // <div className="col-md-4 col-12 server-card">
            //     <div className="server-card-header row">
            //         <div className="col-8 server-card-lebel">
            //             <h6>Summary</h6>
            //             <p>Genral Details</p>
            //         </div>
            //     </div>
            //     <div className="col-12 server-card-content">
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-ram.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10"><p>{this.server.size}</p></div>
            //         </div>
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-ip.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10"><p>{this.server.ip_address}</p></div>
            //         </div>
            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-location.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10"><p>{this.state.regions[this.server.region]}</p></div>
            //         </div>

            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-memory.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10"><p>{this.server.memory} MB</p></div>
            //         </div>

            //         <div className="row">
            //             <div className="col-2">
            //                 <img src={require("../../assets/images/icons/server-storage.svg")} alt="" srcSet=""/>
            //             </div>
            //             <div className="col-10"><p>{this.server.disk} GB</p></div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}
export default Summery;