import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import ApiHandler from '../model/ApiHandler';
import ProjectDetails from '../components/ProjectDetails'
import { Modal, Button } from 'react-bootstrap';

class Projects extends React.Component {
    constructor(props) {
        super();
        this.state = {
            projects: [],
            selectedProject: null,
            isProjectClicked: false,
            showModal: false,
            loadding: false,
            projectName: "",

        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }

    componentDidMount() {
        document.title = "Your Projects";
        // this.apiHandler.getProjects((msg, data) => {
        //     this.setState({ projects: data })
        // }, err => {
        //     this.showError(err);
        // })
    }
    renderProjects() {

        let projects = [];
        // this.state.projects.forEach((data, index) => {
        projects.push(<ProjectCard key="1" projectClickHandler={this.projectClickHandler} />);
        // })
        // if (projects.length < 1) {
        //     projects = <p style={{ textAlign: "center", marginTop: "20px", color: "#949292" }}>No projects Created</p>
        // }
        return projects;
    }
    projectClickHandler = (project = null) => {
        if (project) {
            this.setState({ selectedProject: project });
        }
        this.setState({
            isProjectClicked: !this.state.isProjectClicked,
        })
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
    dataChange = (event) => {

        this.setState({ [event.target.name]: event.target.value })
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
        // this.setState({ error: "", success: "", loadding: true })
        // this.apiHandler.createProject(this.state.projectName, (message, data) => {
        //     this.setState({ error: "", success: message, loadding: false })
        //     window.location.href = "/projects"
        //     console.log(data, message);
        // }, (message) => {
        //     this.setState({ error: message, success: "", loadding: false })
        //     console.log(message);
        // });
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
                                        {(this.state.isProjectClicked) ?
                                            <ProjectDetails projectClickHandler={this.projectClickHandler} />
                                            :
                                            <div className="card card-primary card-outline">
                                                <div className="card-header">
                                                    <div className="col-3 float-left">
                                                        <a href="#" className="btn btn-info start_new_app" onClick={this.handleModalShow}>New Project</a>
                                                    </div>

                                                </div>
                                                <div className="card-body">
                                                    <div className="col-12 application_page_cards" id="huddles">
                                                        {this.renderProjects()}
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
                                <input required type="text" className="form-control" name="projectName" value={this.state.projectName} onChange={this.dataChange} id="projectName" />
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

        )
    }
}
export default Projects;
