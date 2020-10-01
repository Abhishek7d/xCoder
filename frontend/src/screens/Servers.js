import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

class Servers extends React.Component{
    render(){
        return(
            <div class="container-fluid p-0">
                <Navigation/>
                <Sidebar/>
                <div class="content-wrapper">
                    <section class="content-header">
                        <div class="container-fluid">
                            
                        </div>
                    </section>

                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card card-primary card-outline">
                                        <div class="card-header">
                                            <div class="col-3 float-left">
                                                <a href="createserver.php" class="btn btn-info ">+ Add Server</a>
                                            </div>
                                            <div class="float-right">
                                                <i class="fa fa-step-backward"></i>&nbsp;
                                                <i class="fa fa-chevron-left"></i>&nbsp;
                                                <span>1 to 3 of 3 Applications</span>&nbsp;
                                                <i class="fa fa-chevron-right"></i>&nbsp;
                                                <i class="fa fa-step-forward"></i>
                                            </div>
                                            <div class="col-3 float-right pt-1">
                                                <div class="btn-group pl-3 float-right">
                                                    <i class="fas fa-bars" data-toggle="dropdown"
                                                    aria-haspopup="true" aria-expanded="false"></i>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" href="#">Name</a>
                                                        <a class="dropdown-item" href="#">Created Date</a>
                                                        <a class="dropdown-item" href="#">Projects</a>
                                                        <a class="dropdown-item" href="#">Servers</a>
                                                        <a class="dropdown-item" href="#">Staging</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="col-12 application_page_cards" id="huddles">
                                                <div class="card card-outline">
                                                    <div class="card-body">
                                                        <div class="row mb-2">
                                                            <daiv class="col-sm-12 col-md-9 application_page_card_info">
                                                                <div class="float-left">
                                                                    <span class="p-2 channel_green_dot btn-success"></span>
                                                                </div>
                                                                <a href="server-details.php">
                                                                    <div class="row">
                                                                        <div class="col-1">
                                                                            <img style={{width:"100%"}} src={require('../assets/images/wordpress.png')} />
                                                                        </div>
                                                                        <div class="col-11">
                                                                            <p class="m-0">Lifehacks Server</p>
                                                                            <p class="m-0">1GB 167.172.144.174 New York</p>
                                                                            <p class="mt-3"><small>Created: 12 March, 2020</small></p>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </daiv>
                                                            <div class="col-sm-12 col-md-3 text-right application_page_card_actions">
                                                                <a href="" class="pl-3">www<span class="number_of_users"> 0</span></a>
                                                                <a href="" class="pl-3"><i class="fa fa-folder-open"><span class="number_of_users">0</span></i></a>
                                                                <a href="" class="pl-3"><i class="fa fa-user"><span class="number_of_users">0</span></i></a>
                                                                <div class="btn-group pl-3 dropleft">
                                                                    <i class="fas fa-ellipsis-v" data-toggle="dropdown"
                                                                    aria-haspopup="true" aria-expanded="false"></i>
                                                                    <div class="dropdown-menu">
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-stop "></i>&nbsp;Stop</a>
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-redo" aria-hidden="true"></i>&nbsp;Restart</a>
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-globe"></i>&nbsp;Add Application</a>
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-server"></i>&nbsp;Transfer Server</a>
                                                                        <a class="dropdown-item" href="#"><i class="fa fa-clone"></i>&nbsp;Clone Server</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer"></div>
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
export default Servers;