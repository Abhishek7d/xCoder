import React from 'react';
import ApiHandler from '../model/ApiHandler';
import { read_cookie, delete_cookie, bake_cookie } from 'sfcookies';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

class Navigation extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loadding: false,
            error: "",
            name: read_cookie("name"),
            success: "",
            sidebarToggle: false,
            showModal: false,
            projects: [],
            notifications: [],
            projectName: 'No Project Select'
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = () => {

        this.apiHandler.getProjects(1, (msg, data) => {
            this.setState({ projects: data.data })

        }, err => {
            this.showError(err);
        })
        this.getProject()
        this.checkNotification()
        this.getDelegateAccess();
        setInterval(() => { this.checkNotification() }, 60000);
    }
    getDelegateAccess = () => {
        this.apiHandler.getDelegateAccount((msg, data) => {
            data.forEach((d, index) => {
                if (d.status === 'active') {
                    this.setState({
                        projects: [...this.state.projects, d.project],
                    })
                }
            })
        })
    }
    checkNotification = () => {
        this.apiHandler.checkNotifications((msg, data) => {
            this.setState({ notifications: data })

        }, (error) => {
            this.showError(error);
        })
    }
    showError = (err) => {
        console.log(err)
    }
    makeHashString = (string = null) => {
        // TODO : add crypto in repo replace with timestamp
        let tmp = new Date();
        tmp = tmp.getTime();
        return tmp;
        // if (string) {
        //     var rst = crypto.createHash('sha1').update(string).digest('hex');
        // } else {
        //     var current_date = (new Date()).valueOf().toString();
        //     var random = Math.random().toString();
        //     var rst = crypto.createHash('sha1').update(current_date + random).digest('hex');
        // }
        // return rst;
    }
    renderProjects = () => {
        let projects = [];
        this.state.projects.forEach((data, index) => {
            projects.push(
                <div onClick={() => this.setProject(data)} className="dropdown-item" key={index}>
                    {data.name}
                </div>);
        })
        return projects;
    }
    getProject = () => {
        let project = read_cookie('projectName')
        if (!Array.isArray(project)) {
            this.setState({
                projectName: project
            })
        } else {
            this.setState({
                projectName: 'Select a Project'
            })
        }
    }
    setProject = (data) => {
        if (read_cookie('projectId') !== data.uuid) {
            bake_cookie('projectId', data.uuid)
            bake_cookie('projectName', data.name)
            this.getProject()
            window.location.reload();
        }
    }
    handleModalShow = () => {
        this.setState({
            showModal: true,
        })
    }
    handleModalClose = () => {
        this.setState({
            showModal: false,
        })
    }
    handleAddProject = () => {
        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ loadding: true })
        this.apiHandler.createProject(this.state.name, (message, data) => {
            this.setState({ loadding: false });
            window.location.href = "/projects";
        }, data => console.log(data))
    }
    dataChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
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
            <>
                <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div className="nav-link" data-widget="pushmenu" type="button"><i className="fas fa-bars"></i></div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link nav-name">{this.props.name}</div>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" >
                            <div className="dropdown show prifile-dropdown">
                                <div className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.state.projectName}
                                </div>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                    {this.renderProjects()}
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link to="/notifications" className={"nav-link p-0"}>
                                <svg width="50" height="55" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d)">
                                        <rect x="8" width="40" height="40" rx="8" fill="#7973FE" />
                                    </g>
                                    <path d="M22.1667 25H33.8333V19.1925C33.8333 15.9567 31.2217 13.3333 28 13.3333C24.7783 13.3333 22.1667 15.9567 22.1667 19.1925V25ZM28 11.6667C32.1417 11.6667 35.5 15.0358 35.5 19.1925V26.6667H20.5V19.1925C20.5 15.0358 23.8583 11.6667 28 11.6667ZM25.9167 27.5H30.0833C30.0833 28.0525 29.8638 28.5824 29.4731 28.9731C29.0824 29.3638 28.5525 29.5833 28 29.5833C27.4475 29.5833 26.9176 29.3638 26.5269 28.9731C26.1362 28.5824 25.9167 28.0525 25.9167 27.5Z" fill="white" />
                                    {(this.state.notifications > 0 ? <circle stroke="black" fill="red" stroke-width="0" r="5" cy="15" cx="35"></circle> : '')}
                                    <defs>
                                        <filter id="filter0_d" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                            <feOffset dy="8" />
                                            <feGaussianBlur stdDeviation="4" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.47451 0 0 0 0 0.45098 0 0 0 0 0.996078 0 0 0 0.3 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                                        </filter>
                                    </defs>
                                </svg>
                            </Link>
                        </li>

                        <li className="nav-item">
                            <div className="dropdown show prifile-dropdown">
                                <div className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Hello, <b>{this.state.name}</b>
                                </div>
                                <div className="dropdown-menu" style={{ left: '-50px' }} aria-labelledby="dropdownMenuLink">
                                    <Link to="/profile" className="dropdown-item" role="button">
                                        Profile
                                </Link>
                                    <Link to="/delegate-access" className="dropdown-item" role="button">
                                        Delegate Access
                                </Link>
                                    <button className="dropdown-item" onClick={this.handleLogout}>Logout</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>

                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <form action="#" method="post">
                        <Modal.Header closeButton>
                            <Modal.Title>ADD PROJECT</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: "red" }} dangerouslySetInnerHTML={{ __html: this.state.error }}></p>
                            <p style={{ color: "green" }} dangerouslySetInnerHTML={{ __html: this.state.success }}></p>

                            <div className="form-group">
                                <label htmlFor="projectName">Project Name</label>
                                <input required type="text" className="form-control" name="name" value={this.state.projectName} onChange={this.dataChange} id="projectName" />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="info" onClick={this.handleAddProject}>
                                {
                                    this.state.loadding ?
                                        <img alt="" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                        : "ADD PROJECT"
                                }
                            </Button>
                            <Button variant="default" onClick={this.handleModalClose}>
                                CLOSE
                    </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        );
    }
}
export default Navigation;
