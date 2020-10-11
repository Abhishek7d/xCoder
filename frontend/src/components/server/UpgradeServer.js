import React from 'react';
import ApiHandler from '../../model/ApiHandler';
import {Link} from 'react-router-dom';

   
class UpgradeServer extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            serverName: this.server.name,
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
    }
    formAction = () => {
        
        this.setState({ error: "", success: "", loadding: false })
        this.apiHandler.serverUpgrade(this.server.id, this.state.size, (message, data) => {
            this.setState({ error: "", success: message, loadding: false })
            // window.location.href = "/servers"
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
        tmp_data.sort()
        return tmp_data.sort();
    }
    render() {
        return (
            <div className="tab-pane fade show active" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                
                <form action="#" method="post">
                    <p style={{color:"red",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
                    <p style={{color:"green",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>
        
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h3 className="card-title col-sm-12">Upgrade Server : <b>{this.server.name}</b></h3>
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

                    </div>
                    <div className="card-footer">
                        <button type="button" onClick={this.formAction} className="btn btn-primary">
                            {this.state.loadding ?
                                <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                : "UPGRADE NOW"
                            }

                        </button>
                    </div>
                </form>

            </div>
        );
    }
}
export default UpgradeServer;
