import React from 'react';
import { Link } from 'react-router-dom';
import { read_cookie } from 'sfcookies';
import "../App.css";

class Sidebar extends React.Component {
    constructor(props) {
        super();
        this.state = {
            name: read_cookie("name"),
            page: window.location.pathname.split("/")[1],
            sidebarToggle: false,

        }
    }
    hideSideBar() {
        let tmpBody = document.getElementsByTagName("body")[0].classList;
        if (tmpBody.contains("sidebar-open")) {
            tmpBody.remove("sidebar-open")
            tmpBody.value = ("sidebar-closed sidebar-collapse")
        }
    }
    render() {
        return (
            <>
            <aside className="main-sidebar sidebar-dark-primary elevation-4" id="sidebar">
                <a href="/" className="brand-link">
                    <img src={require("../assets/images/logo.webp")} alt="admin Logo" className="brand-image img-circle elevation-3"
                    />
                    <span className="brand-text font-weight-light">Parvaty Cloud</span>
                </a>
                <div className="sidebar">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className={'nav-item has-treeview '}>
                                <Link to="/servers" className={"nav-link " + ((this.state.page === "servers") ? "menu-opened" : "")}>
                                    <i className="nav-icon fa fa-server"></i>
                                    <p>
                                        Servers
                                <i className="right fas "></i>
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item has-treeview">
                                <Link to="/applications" className={"nav-link " + ((this.state.page === "applications") ? "menu-opened" : "")}>
                                    <i className="nav-icon fa fa-window-maximize"></i>
                                    <p>
                                        Applications
                                <i className="right fas "></i>
                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <div onClick={this.hideSideBar} id="sidebar-overlay"></div>
            </>
        );
    }
}
export default Sidebar;
