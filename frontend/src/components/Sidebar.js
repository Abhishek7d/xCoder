import React from 'react';
import { Link } from 'react-router-dom';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

class Sidebar extends React.Component {
    constructor(props){
        super();
        this.state = {
            name : read_cookie("name")
        }
    }
    render() {
        return (
            <aside className="main-sidebar sidebar-dark-primary elevation-4" id="sidebar">
                <a href="index3.html" className="brand-link">
                    <img src={require("../assets/images/logo.png")} alt="admin Logo" className="brand-image img-circle elevation-3"
                    />
                    <span className="brand-text font-weight-light">Parvaty Cloud</span>
                </a>
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src={require("../assets/images/user.jpg")} className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info">
                            <a href="#" className="d-block">{this.state.name}</a>
                        </div>
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item has-treeview menu-open">
                                <Link to="/servers">
                                    <a href="#" className="nav-link ">
                                        <i className="nav-icon fas fa-tachometer-alt"></i>
                                        <p>
                                            Servers
                                        <i className="right fas "></i>
                                        </p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item has-treeview menu-open">
                                <Link to="/applications">
                                    <a href="#" className="nav-link ">
                                        <i className="nav-icon fas fa-tachometer-alt"></i>
                                        <p>
                                            Applications
                                        <i className="right fas "></i>
                                        </p>
                                    </a>
                                </Link>
                            </li>
                            <li className="nav-item has-treeview menu-open">
                                <a href="dashboard.php" className="nav-link ">
                                    <i className="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Teams
                                        <i className="right fas "></i>
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
}
export default Sidebar;
