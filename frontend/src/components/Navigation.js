import React from 'react';
import ApiHandler from '../model/ApiHandler';
import { delete_cookie } from 'sfcookies';
import { Link } from 'react-router-dom';


class Navigation extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loadding: false,
            error: "",
            success: "",
            sidebarToggle: false,
        }
        this.apiHandler = new ApiHandler();

    }
    handleLogout = () => {
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.logout((message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            delete_cookie("name");
            delete_cookie("email");
            delete_cookie("auth");
            window.location.href = "/login";
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
            console.log(message);
        });
    }

    render() {
        return (
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="nav-link" data-widget="pushmenu" type="button"><i className="fas fa-bars"></i></div>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/profile"  className="nav-link" role="button">
                            <i className="fas fa-user-circle"></i>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <div className="nav-link" type="button" onClick={this.handleLogout}>
                            {this.state.loadding ?
                                <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                : <b>Logout</b>
                            }

                        </div>
                    </li>
                </ul>
            </nav>
        );
    }
}
export default Navigation;
