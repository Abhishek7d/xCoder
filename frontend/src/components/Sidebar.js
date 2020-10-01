import React from 'react';

class Sidebar extends React.Component{
    render(){
        return(
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                <a href="index3.html" class="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
                         />
                    <span class="brand-text font-weight-light">Parvaty Cloud</span>
                </a>
                <div class="sidebar">
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"/>
                        </div>
                        <div class="info">
                            <a href="#" class="d-block">Alexander Pierce</a>
                        </div>
                    </div>
                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li class="nav-item has-treeview menu-open">
                                <a href="servers.php" class="nav-link ">
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Servers
                                        <i class="right fas "></i>
                                    </p>
                                </a>
                            </li>
                            <li class="nav-item has-treeview menu-open">
                                <a href="applications.php" class="nav-link ">
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Applications
                                        <i class="right fas "></i>
                                    </p>
                                </a>
                            </li>
                            <li class="nav-item has-treeview menu-open">
                                <a href="dashboard.php" class="nav-link ">
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Teams
                                        <i class="right fas "></i>
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
}
export default Sidebar;