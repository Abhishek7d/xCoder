import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ServerCard from '../components/ServerCard';
import ApiHandler from '../model/ApiHandler';
// import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import ServerDetails from '../components/ServerDetails';
import "../assets/css/dashboard.css";
import CreateServerScreen from "./CreateServerScreen";
import PageHeader from '../components/template/PageHeader';
import Pagination from '../components/template/Pagination';

class Servers extends React.Component {
    constructor(props) {
        super();
        let serverId = props.match.params.serverId;
        this.state = {
            serverData: {},
            servers: [],
            regions: {},
            selectedSever: null,
            isServerClicked: false,
            loadding: true,
            showModal: false,
            serverId: serverId,
            screenName: "Servers"
        }
        this.apiHandler = new ApiHandler();
        this.createServer = React.createRef();
    }
    showError = (err) => {

    }

    componentDidMount() {
        document.title = "Your Servers";
        this.getServers();
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
    getServers(page = 1) {
        this.apiHandler.getServers(page, (msg, data) => {
            data.data.forEach((s) => {
                if (s.id === this.state.serverId) {
                    this.setState({
                        selectedSever: s,
                        isServerClicked: true
                    })
                }
            })
            this.setState({ servers: data.data, loadding: false, serverData: data })
        }, err => {
            this.showError(err);
        })
    }
    getRegionName = (slug) => {
        return this.state.regions[slug];
    }
    renderServers() {
        if (this.state.loadding) {
            return <div style={{ width: "100%", paddingLeft: "40%" }}>
                <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "100px" }} className="serviceLoadding" />
            </div>
        }
        let servers = [];
        this.state.servers.forEach((data, index) => {
            servers.push(<ServerCard serverClickHandler={this.serverClickHandler} region={this.getRegionName(data.region)} key={data.id} server={data} />);
        })
        if (servers.length < 1) {
            servers = <p style={{ textAlign: "center", marginTop: "20px", color: "#949292" }}>No Servers Created</p>
        }
        return servers;
    }
    serverClickHandler = (server = null) => {
        if (server) {
            if (server.status === "READY") {
                this.setState({ selectedSever: server });
                if (!this.state.isServerClicked) {
                    window.history.replaceState(null, null, "/servers/" + server.id)
                }
                this.setState({
                    isServerClicked: !this.state.isServerClicked,
                    screenName: server.name
                })
            }
        }
    }
    goBack = () => {
        if (this.state.isServerClicked) {
            window.history.replaceState(null, null, "/servers")
        }
        this.setState({
            isServerClicked: !this.state.isServerClicked,
        })
    }
    handleModalClose = () => {
        this.createServer.handleModalClose();
    }
    handleModalShow = () => {
        this.createServer.current.handleModalShow();
    }
    handlePageChange = (data) => {
        this.getServers(data)
    }
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation name={this.state.screenName} />
                <Sidebar />
                <div className="content-wrapper">
                    <div className="section-container">
                        {(this.state.isServerClicked) ?
                            <ServerDetails serverClickHandler={this.goBack} server={this.state.selectedSever} />
                            :
                            <>
                                <PageHeader heading="My Servers" subHeading={this.state.servers.length + " Servers"}>
                                    <div className="row">
                                        <div className="col-md-4">

                                        </div>
                                        <div className="col-md-4">

                                        </div>
                                        <div className="col-md-4">
                                            <button type="button" onClick={this.handleModalShow} className="btn btn-theme btn-block">
                                                <span>Create Server</span>
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </PageHeader>
                                <div className="row">
                                    {this.renderServers()}
                                </div>
                                <Pagination onPageChange={this.handlePageChange} key={this.state.serverData.current_page} data={this.state.serverData}></Pagination>
                            </>
                        }
                    </div>
                </div>
                <CreateServerScreen ref={this.createServer} handleModalClose={this.handleModalClose} handleModalShow={this.handleModalShow} modalView={this.state.showModal} />
            </div>
        );
    }
}
export default withRouter(Servers);
