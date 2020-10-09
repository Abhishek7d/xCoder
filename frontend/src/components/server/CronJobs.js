import React from 'react';

class CronJobs extends React.Component{
    constructor(props){
        super();
        this.props = props;
    }
    render(){
        return(
            <div class="tab-pane fade" id={"pills-"+this.props.tabId} role="tabpanel" aria-labelledby={"pills-"+this.props.tabId+"-tab"}>
                fron
            </div>
        )
    }
}
export default CronJobs;