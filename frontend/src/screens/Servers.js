import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ServerCard from '../components/ServerCard';
import ApiHandler from '../model/ApiHandler';
import { Redirect, Link } from 'react-router-dom';
import ServerDetails from '../components/ServerDetails'

class Servers extends React.Component {
    constructor(props) {
        super();
        this.state = {
            servers: [],
            regions: {},
            selectedSever:null,
            isServerClicked:false
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }

    componentDidMount() {
        document.title = "Your Servers";
        this.apiHandler.getServers((msg, data) => {
            this.setState({ servers: data })
        }, err => {
            this.showError(err);
        })
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
    getRegionName = (slug) => {
        return this.state.regions[slug];
    }
    renderServers() {
        
        let servers = [];
        this.state.servers.forEach((data, index) => {
            servers.push(<ServerCard serverClickHandler={this.serverClickHandler} region={this.getRegionName(data.region)} key={index} server={data} />);
        })
        if (servers.length < 1) {
            servers = <p style={{ textAlign: "center", marginTop: "20px", color: "#949292" }}>No Servers Created</p>
        }
        return servers;
    }
    serverClickHandler = (server=null) => {
        if(server){
            this.setState({selectedSever:server});
        }
        this.setState({
            isServerClicked: !this.state.isServerClicked,
        })
    }

    render() {
        return (
            <>
                <div className="container-fluid p-0">
                    <Navigation />
                    <Sidebar />
                    <div className="content-wrapper">
                        <section className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-2">

                                </div>
                            </div>
                        </section>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {(this.state.isServerClicked)?
                                        <ServerDetails serverClickHandler={this.serverClickHandler} server={this.state.selectedSever} />
                                        :
                                        <div className="card card-primary card-outline">
                                            <div className="card-header">
                                                <div className="col-3 float-left">
                                                    <Link to="/server/create" className="btn btn-info text-center">
                                                        Create Server
                                                    </Link>
                                                </div>

                                            </div>
                                            <div className="card-body">
                                                <div className="col-12 application_page_cards" id="huddles">
                                                    {this.renderServers()}
                                                </div>
                                            </div>
                                            <div className="card-footer"></div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    }
}
export default Servers;
