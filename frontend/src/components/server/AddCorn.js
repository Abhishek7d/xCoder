import React from 'react';
import ApiHandler from '../../model/ApiHandler';

class AddCorn extends React.Component{
    constructor(props){
        super();
        this.props = props;
        this.cron = props.cron;
        this.state = {
            minute:"",
            hour:"",
            day:"",
            month:"",
            wday:"",
            command:"",
            loadding:false,
            error:"",
            success:""
        }
        this.apiHandler = new ApiHandler();
    }
    componentDidMount = ()=>{
        
    }
    dataChange = (event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    formSubmit = ()=>{
        let form = document.getElementsByTagName("form")[0]
        if(!form.checkValidity()){
            form.reportValidity();
            return;
        }
        if(this.state.loadding){
            return;
        }
        this.setState({error:"", success:"", loadding:true})
        this.apiHandler.addCron(this.props.serverId, this.state.minute,this.state.hour, this.state.day, this.state.month, this.state.wday, this.state.command, (message, data)=>{
            this.setState({
                error:"", 
                success:message,
                loadding:false,
            })
            setTimeout(()=>{
                this.props.cronUpdated();
                this.props.cancel();
            }, 2000)
        }, (message)=>{
            this.setState({error:message, success:"", loadding:false, loggedIn:false})
        });
    }
    render(){
        return(
            <form class="form-horizontal">
                <h5 className="col-md-12">Add New Cron</h5>
                <p style={{color:"red"}} dangerouslySetInnerHTML={{__html: this.state.error}}></p>
                <p style={{color:"green"}} dangerouslySetInnerHTML={{__html: this.state.success}}></p>
                {this.state.loadding?
                <div style={{width: "100%",paddingLeft: "40%"}}>
                    <img src={require("../../assets/images/loading.gif")} style={{width:"100px"}} className="serviceLoadding"/>
                </div>
                :
                <div class="card-body row">              
                    <div class="form-group col-md-6 row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Minute</label>
                        <div class="col-sm-9">
                            <input type="text" required name="minute" value={this.state.minute} onChange={this.dataChange} min="0" max="59" class="form-control" placeholder="1 for every"/>
                        </div>
                    </div>
                    <div class="form-group col-md-6 row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Hour</label>
                        <div class="col-sm-9">
                            <input type="text" required name="hour" value={this.state.hour} onChange={this.dataChange} min="0" max="59" class="form-control" placeholder="1 for every"/>
                        </div>
                    </div>

                    <div class="form-group col-md-6 row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Day</label>
                        <div class="col-sm-9">
                            <input type="text" required name="day" value={this.state.day} onChange={this.dataChange} min="1" max="31" class="form-control" placeholder="1 for every"/>
                        </div>
                    </div>
                    <div class="form-group col-md-6 row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Month</label>
                        <div class="col-sm-9">
                            <input type="text" required name="month" value={this.state.month} onChange={this.dataChange} min="1" max="12" class="form-control" placeholder="1 for every"/>
                        </div>
                    </div>
                    <div class="form-group col-md-6 row">
                        <label for="inputEmail3" class="col-sm-3 col-form-label">Week Day</label>
                        <div class="col-sm-9">
                            <input type="text" required name="wday" value={this.state.wday} onChange={this.dataChange} min="1" max="7" class="form-control" placeholder="1 for every"/>
                        </div>
                    </div>
                    
                    <div class="form-group col-md-12 row">
                        <label for="inputEmail3" class="col-sm-2 col-form-label">Command</label>
                        <div class="col-sm-10">
                            <input type="text" required name="command" value={this.state.command} onChange={this.dataChange} class="form-control" placeholder="wget https://example.com/"/>
                        </div>
                    </div>
                    
                  
                </div>
                }
                <div class="card-footer">
                  <button type="button" onClick={this.formSubmit} class="btn btn-info">Add</button>
                  <button type="button" class="btn btn-default float-right" onClick={this.props.cancel}>Cancel</button>
                </div>
            </form>
        );
    }
}

export default AddCorn;