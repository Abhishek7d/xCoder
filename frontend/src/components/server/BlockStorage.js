import React from 'react';
import ApiHandler from '../../model/ApiHandler';
import "../../index.css"

class BlockStorage extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.server = props.server;
        this.state = {
            error:"",
            success:"",
            options:[],
            value:0,
            min:1
        }
        if(this.server.storage){
            this.state.min = this.server.storage.size
        }
        this.apiHandler = new ApiHandler();
    
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
    componentDidMount(){
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
    handleChange = (value)=>{
        let newSize = value.target.value;
        if(this.server.storage){
            if(this.server.storage.size < newSize){
                return;
            }
        }
        this.setState({value:newSize})
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                <p style={{color:"red",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
                <p style={{color:"green",textAlign:"center"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>
    
                <div className="card-body">

                    <div class="row">
                        <div class="col-sm-12">
                            <h5 class="">Add Storage To Server</h5>
                            <br/>
                        </div>
                        <div class="col-sm-2" style={{display: "inherit"}}>

                        <input value={this.state.value} min={this.state.min} onChange={this.handleChange} type="number" id="gb" style={{width:"80%"}}/>
                        GB
                        </div>
                        <input class="col-sm-10" type="range" min={this.state.min} value={this.state.value}  onChange={this.handleChange} max="20" step="1"/>
                    </div>    
                <br />

                </div>
                <div className="card-footer">
                    <button type="button" onClick={this.formAction} className="btn btn-primary">
                        {this.state.loadding ?
                            <img src={require("../../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                            : "Attach Now"
                        }

                    </button>
                </div>
            </div>
        )
    }
}
export default BlockStorage;