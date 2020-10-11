import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import {Link} from 'react-router-dom';

   
class CreateServerScreen extends React.Component {
    constructor(props) {
        super();
        this.state = {
            serverName: "",
            serverSize: "",
            serverLocation: "",
            appName: "",
            project: "",
            error: "",
            success: "",
            loadding: false,
            options:[],
            sizes:[],
            regions:{},
            selectd_size:0
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = ()=>{
        this.apiHandler.getServerSizes((data)=>{
            let tmp_sizes = [];
            data.forEach(size=>{
                tmp_sizes.push(size.slug)
            })
            this.setState({sizes:data,options:tmp_sizes})
        }, (err)=>{
            console.log(err)
        })
        this.apiHandler.getRegions((regions)=>{
            let tmp_regions = this.state.regions;
            regions.forEach(region=>{
                tmp_regions[region.slug] = region.name
            })
            this.setState({regions:tmp_regions})
        }, (err)=>{
            console.log(err)
        })
    }
    formAction = () => {

        let form = document.getElementsByTagName("form")[0]
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (this.state.loadding) {
            return;
        }
        this.setState({ error: "", success: "", loadding: true })
        this.apiHandler.createServer(this.state.name, this.state.size, this.state.location, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            window.location.href = "/servers"
        }, (message) => {
            this.setState({ error: message, success: "", loadding: false })
        });
    }
    dataChange = (event) => {
        if(event.target.name==="size"){
            let tmp = Object.values(this.state.sizes);
            let flag = null;
            tmp.forEach((size,index)=>{
                if(size.slug===event.target.value){
                    flag = index;
                }
            })
            if(flag===null){
                return;
            }
            tmp = tmp[flag].regions;
            this.setState({location:tmp[0]}) 
        }
        this.setState({ [event.target.name]: event.target.value })
    }
    renderOptions(){
        let tmp_data = [<option value="" >Available Sizes</option>];
        let tmp_list = [];
        this.state.options.forEach(data=>{
            let tmp = data.split("-");
            if(tmp.length===3){
                tmp_list.push(data);
            }
        })
        tmp_list.sort();
        tmp_list.forEach(data=>{
            let tmp = data.split("-");
            tmp_data.push(<option value={data}>{tmp[1].toUpperCase()+" + "+tmp[2].toUpperCase()}</option>);
        })
        return tmp_data;
    }
    renderLocations (){
        let tmp_data = [];
        if(this.state.sizes===undefined){
            return;
        }
        let tmp = Object.values(this.state.sizes);
        let flag = null;
        tmp.forEach((size,index)=>{
            if(size.slug===this.state.size){
                flag = index;
            }
        })
        if(flag===null){
            return;
        }
        tmp = tmp[flag].regions;
        tmp.forEach((data)=>{
            let tmp = this.state.regions[data]
            tmp_data.push(<option value={data}>{tmp}</option>);
        });
        
        return tmp_data;
    }
    render() {
        return (
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
                                    <div className="card card-primary card-outline">
                                        <div className="card-header">
                                            <div className="col-3 float-left" style={{display: "flex"}}>
                                                <Link className="nav-link" to="/servers">
                                                    <i className="fas fa-arrow-left"></i>
                                                </Link>
                                                <h5 className="nav-link font-weight-bold text-secondary" style={{minWidth:"max-content"}}>{"Create Server"}</h5>
                                            </div>
                                        </div>
                                        <form action="#" method="post">
                                            <p style={{color:"red",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
                                            <p style={{color:"green",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>
                                
                                            <div className="card-body">
                                            <div className="row">
                                                    <div className="col-2">
                                                        <h3 className="card-title">Server Name</h3>
                                                    </div>
                                                    <div className="col-9">
                                                    <input type="text" required value={this.state.name} onChange={this.dataChange} name="name" className="form-control border-bottom col-md-9" id="Namemanageserver"
                                                            placeholder="Name your Managed Server" />
                                                    
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="row">
                                                    <div className="col-2">
                                                        <h3 className="card-title">Server Size</h3>
                                                    </div>
                                                    <div className="col-7">
                                                    <select required value={this.state.size} onChange={this.dataChange} name="size" className="form-control border-bottom">
                                                        {this.renderOptions()}
                                                    </select>
                                                    </div>
                                                </div>
                                                <br />

                                                <div className="row">
                                                    <div className="col-2">
                                                        <h3 className="card-title">Server Location</h3>
                                                    </div>
                                                    <div className="col-7">
                                                    <select id="locations" required value={this.state.location} onChange={this.dataChange} name="location" className="form-control border-bottom">
                                                        {this.renderLocations()}
                                                    </select>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="card-footer">
                                                <button type="button" onClick={this.formAction} className="btn btn-primary">
                                                    {this.state.loadding ?
                                                        <img alt="loadding" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                        : "LAUNCH NOW"
                                                    }

                                                </button>
                                            </div>
                                        </form>
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
export default CreateServerScreen;
