import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

class CreateServerScreen extends React.Component{
    render(){
        return(
            <div class="container-fluid p-0">
                <Navigation/>
                <Sidebar/>
                <div class="content-wrapper">
                    <section class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <div class="col-sm-6">
                                    <h1>Your Dashboard</h1>
                                </div>
                                <div class="col-sm-6">
                                    <ol class="breadcrumb float-sm-right">
                                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                                        <li class="breadcrumb-item"><a href="#">Layout</a></li>
                                        <li class="breadcrumb-item active">Boxed Layout</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section class="content">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h3 class="card-title"></h3>

                                            <div class="card-tools">
                                                <button type="button" class="btn btn-tool" data-card-widget="collapse"
                                                        data-toggle="tooltip" title="Collapse">
                                                    <i class="fas fa-minus"></i></button>
                                                <button type="button" class="btn btn-tool" data-card-widget="remove"
                                                        data-toggle="tooltip" title="Remove">
                                                    <i class="fas fa-times"></i></button>
                                            </div>
                                        </div>

                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <select class="form-control border-bottom">
                                                        <option value="" disabled selected>Wordpress</option>
                                                        <option>Version 5.4.2</option>
                                                        <option>Version 5.4.2 with WooCommerce Version 4.3.0</option>
                                                        <option>Multisite Version 5.4.2</option>
                                                        <option>Clean (No cloudways optimization) Version 5.4.2</option>
                                                    </select>
                                                </div>

                                                <div class="col-md-3">
                                                    <input type="text" class="form-control border-bottom" id="Namemanageapp"
                                                        placeholder="Name your Managed App"/>
                                                </div>

                                                <div class="col-md-3">
                                                    <input type="text" class="form-control border-bottom" id="Namemanageserver"
                                                        placeholder="Name your Managed Server"/>
                                                </div>

                                                <div class="col-md-3">
                                                    <input type="text" class="form-control border-bottom" id="Selectyourproj"
                                                        placeholder="Select your Project"/>
                                                </div>

                                            </div>

                                            <br/>

                                            <div class="row">
                                                <div class="col-12">
                                                    <h3 class="card-title">Server Size</h3>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <input id="ex19" type="text"
                                                        data-provide="slider"
                                                        data-slider-ticks="[1, 2, 3, 4, 5,6,7,8,9,10,11]"
                                                        data-slider-ticks-labels='["1GB", "2GB", "4gb","8gb","16gb","32gb","48gb","64gb","96gb","128gb","192gb"]'
                                                        data-slider-min="1"
                                                        data-slider-max="11"
                                                        data-slider-step="1"
                                                        data-slider-value="3"
                                                        data-slider-tooltip="hide"/>
                                                </div>
                                            </div>
                                            <br/>
                                            <div class="row ">

                                                <div class="col-8">
                                                    <h3 class="card-title">LOCATION</h3>
                                                    <br/>
                                                    <div class="form-group">
                                                        <label for="exampleInputEmail1">Please select your server location.</label>
                                                        <select id="locations" class="form-control border-bottom">
                                                            <option value="lon1" selected>London</option>
                                                            <option>San Francisco</option>
                                                            <option value="sgp1">Singapore</option>
                                                            <option value="nyc1">New York</option>
                                                            <option value="ams3">Amsterdam</option>
                                                            <option value="fra1">Frankfurt</option>
                                                            <option value="tor1">Toronto</option>
                                                            <option value="blr1">Bangalore</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <button type="button" onclick="create_droplet()" class="btn btn-primary">LAUNCH NOW
                                            </button>
                                        </div>
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