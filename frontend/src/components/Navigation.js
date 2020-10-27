import React from 'react';
import ApiHandler from '../model/ApiHandler';
import { delete_cookie } from 'sfcookies';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

class Navigation extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loadding: false,
            error: "",
            success: "",
            sidebarToggle: false,
            showModal: false,
            projects:[]
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = ()=>{
        this.apiHandler.getProjects((msg, data) => {
            this.setState({ projects: data })
        }, err => {
            this.showError(err);
        })
    }
    makeHashString = (string=null) => {
        // TODO : add crypto in repo replace with timestamp
        let tmp = new Date();
        tmp = tmp.getTime();
        return tmp;
        if(string){
            var rst = crypto.createHash('sha1').update(string).digest('hex');
        }else{
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var rst = crypto.createHash('sha1').update(current_date + random).digest('hex');    
        }
        return rst;
    }
    renderProjects = ()=>{
        let projects = [];
        this.state.projects.forEach((data, index) => {
            let hash = this.makeHashString(index);
            let hash1 = this.makeHashString(index)+1;
            projects.push(
            <>
                <p key={hash} style={{textAlign:"center"}}>{data.name}</p>
                <div key={hash1} className="dropdown-divider"></div>
            </>);
        })
        return projects;
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
    showError = (err)=>{
        console.log(err)
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
        this.setState({loadding:true})
        this.apiHandler.createProject(this.state.name, (message, data)=>{
            this.setState({loadding:false});
            window.location.href = "/projects";
        }, data=>console.log(data))
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
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown" style={{background: "linear-gradient(0deg, #05a1f7b0, #91b8e8b5)",borderRadius: '10px', color:"#fff"}}>
                        <a className="nav-link" data-toggle="dropdown" href="#" style={{color:"#fff"}}>
                            No Project
                        </a>
                        <div className="dropdown-menu">
                            <a href="#" className="dropdown-item" onClick={this.handleModalShow}>
                                Add Project
                            </a>
                            <div className="dropdown-divider"></div>
                            {this.renderProjects()}
                            <Link to="/projects" className={"dropdown-item"}>
                                Show All Projects
                                <i className="right fas "></i>
                            </Link>
                        </div>
                    </li>
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
                                    <img src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
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
