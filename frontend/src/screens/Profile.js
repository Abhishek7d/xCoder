import React from 'react'
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

class Profile extends React.Component {
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
                                        <div className="card card-primary card-outline">
                                            <div className="card-header">
                                                <div className="col-3 float-left">
                                                    Password Reset
                                                </div>

                                            </div>
                                            <div className="card-body">
                                                <div className="col-4 application_page_cards" id="huddles">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="old password"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="new password"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <button className="btn btn-primary">Reset</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </>

        )
    }
}
export default Profile;
