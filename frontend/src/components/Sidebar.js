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
                    <div data-widget="pushmenu" type="button" className="brand-link">
                        <img src={require("../assets/images/logo.webp")} alt="admin Logo" className="brand-image img-circle elevation-3"
                        />
                        <span className="brand-text font-weight-light">Parvaty Cloud</span>
                        <svg className="ml-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.828 12L15.778 16.95L14.364 18.364L8 12L14.364 5.636L15.778 7.05L10.828 12Z" fill="#7973FE" />
                            <path opacity="0.3" d="M4.828 12L9.778 16.95L8.364 18.364L2 12L8.364 5.636L9.778 7.05L4.828 12Z" fill="#7973FE" />
                        </svg>
                    </div>
                    <div className="sidebar">
                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                <li className={'nav-item has-treeview '}>
                                    <Link to="/projects" className={"nav-link " + ((this.state.page === "projects") ? "menu-opened" : "")}>
                                        <i className="nav-icon fa fa-desktop"></i>
                                        <p> Projects </p>
                                    </Link>
                                </li>
                                <li className={'nav-item has-treeview '}>
                                    <Link to="/servers" className={"nav-link " + ((this.state.page === "servers") ? "menu-opened" : "")}>
                                        <i className="nav-icon fa fa-server"></i>
                                        <p> Servers</p>
                                    </Link>
                                </li>
                                <li className="nav-item has-treeview">
                                    <Link to="/applications" className={"nav-link " + ((this.state.page === "applications") ? "menu-opened" : "")}>
                                        <i className="nav-icon fa fa-globe"></i>
                                        <p>Applications</p>
                                    </Link>
                                </li>
                                <li className="nav-item has-treeview">
                                    <Link to="/invoices" className={"nav-link " + ((this.state.page === "invoices") ? "menu-opened" : "")}>
                                        <i className="nav-icon fa fa-dollar-sign"></i>
                                        <p>Invoices</p>
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
