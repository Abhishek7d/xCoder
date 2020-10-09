import React from 'react';
import ApiHandler from "../../model/ApiHandler";

class Summery extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            regions:{},
            loadding:false
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount(){
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
    render(){
        return(
            // <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                
            <div class="tab-pane fade show active" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <div className="row col-md-12">
                    <div className="col-sm-6 col-md-2 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-info">Size :</span>
                        <span className="mt-3 font-weight-bold text-info">Memory :</span>
                        <span className="mt-3 font-weight-bold text-info">Disk :</span>
                        <span className="mt-3 font-weight-bold text-info">vCPUs :</span>
                        <span className="mt-3 font-weight-bold text-info">IP Address :</span>
                        <span className="mt-3 font-weight-bold text-info">Region :</span>
                    </div>
                    <div className="col-sm-6 col-md-2 d-flex flex-column">
                        <span className="mt-3 font-weight-bold text-primary">{this.server.size}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.memory} MB</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.disk} GB</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.vcpus}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.server.ip_address}</span>
                        <span className="mt-3 font-weight-bold text-primary">{this.state.regions[this.server.region]}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Summery;