import React from 'react';

class Card extends React.Component{
    constructor(props){
        super(props);
        this.server = props.server;
        this.title = this.title;
        this.sub_title = this.sub_title;
        this.image = props.image;
        this.label = props.label;
        this.children = props.children;
    }
    render(){
        return(
            <div className="col-md-4 col-12 server-card" onClick={()=>this.props.serverClickHandler(this.props.server)}>
                <div className="server-card-header row">
                    <div className="col-2 server-card-image">
                        <img alt="wordpress" style={{ width: "35px" }} src={require('../assets/images/wordpress.png')} />
                    </div>
                    <div className="col-8 server-card-lebel">
                        <h6>{this.server.name}</h6>
                        <p>{new Date(this.state.created_at).toDateString()}</p>
                    </div>
                    <div className="col-2 server-card-status" title={this.server.status}>
                        <Status status={this.server.status}/>
                    </div>
                </div>
                <div className="col-12 server-card-content">
                    <div className="col-12 row">
                        <div className="col-3">
                            <img src={require("../assets/images/server-ip.svg")} alt="" srcSet=""/>
                        </div>
                        <div className="col-9">{this.state.ip_address}</div>
                    </div>
                    <div className="col-12 row">
                        <div className="col-3">
                            <img src={require("../assets/images/server-ram.svg")} alt="" srcSet=""/>
                        </div>
                        <div className="col-9">{this.state.size.split("-").pop().toUpperCase()}</div>
                    </div>
                    <div className="col-12 row">
                        <div className="col-3">
                            <img src={require("../assets/images/server-location.svg")} alt="" srcSet=""/>
                        </div>
                        <div className="col-9">{this.props.region}</div>
                    </div>
                    <div className="col-12 row">
                        <div className="col-3">
                            <img src={require("../assets/images/server-apps.svg")} alt="" srcSet=""/>
                        </div>
                        <div className="col-9">
                            <Link to={'/applications?serverId='+this.server.id} style={{color:"inherit"}}>
                                {(this.server.applications)?this.server.applications.length:0} Applications
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;