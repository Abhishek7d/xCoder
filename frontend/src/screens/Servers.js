import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ServerCard from '../components/ServerCard';
import ApiHandler from '../model/ApiHandler';
import { Redirect, Link } from 'react-router-dom';

class Servers extends React.Component {
    constructor(props) {
        super();
        this.state = {
            servers: []
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
    }
    renderServers() {
        let servers = [];
        this.state.servers.forEach((data, index) => {
            servers.push(<ServerCard key={index} server={data} />);
        })
        return servers;
    }
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">

                        </div>
                    </section>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card card-primary card-outline">
                                        <div className="card-header">
                                            <div className="col-3 float-left">
                                                <Link to="/server/create" className="text-center">
                                                    <a href="#" className="btn btn-info ">+ Add Server</a>
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
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}
export default Servers;
