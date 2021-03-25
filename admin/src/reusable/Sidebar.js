import routes from "src/routes"
import CIcon from '@coreui/icons-react'


export default class sidebarMenu {

    constructor() {
        this.routes = routes
        this.sidebarMenu = []
        this.defaultIcon = <CIcon name="cil-file" customClasses="c-sidebar-nav-icon" />
    }

    // get route details
    getRoute = (name) => {
        return this.routes.find(route => route.routeName === name)
    }

    // Add header
    header = (name) => {
        this.sidebarMenu.push(
            {
                _tag: 'CSidebarNavTitle',
                _children: [name]
            }
        )
    }

    // Add Menu
    menu = (name, fName = null, icon = null) => {
        if (this.getRoute(name) === undefined) {
            return;
        }
        this.sidebarMenu.push(
            {
                _tag: 'CSidebarNavItem',
                to: this.getRoute(name).path,
                name: (fName) ? fName : this.getRoute(name).name,
                permission: this.getRoute(name).permission,
                icon: (icon) ? this.getIcon(icon) : (this.getRoute(name).icon) ? this.getIcon(this.getRoute(name).icon) : this.defaultIcon,
            }
        )
        return this.sidebarMenu.length - 1;
    }

    // Add Sub menu
    subMenu = (index, name, fName = null, iconName = null) => {
        if (this.getRoute(name) === undefined) {
            return;
        }
        this.sidebarMenu[index]['route'] = this.sidebarMenu[index]['to']
        this.sidebarMenu[index]['_tag'] = 'CSidebarNavDropdown'
        this.sidebarMenu[index]['_children'] = []
        delete this.sidebarMenu[index]['to']
        let sub = {
            _tag: 'CSidebarNavItem',
            to: this.getRoute(name).path,
            name: (fName) ? fName : this.getRoute(name).name,
            icon: (iconName) ? this.getIcon(iconName) : (this.getRoute(name).icon) ? this.getIcon(this.getRoute(name).icon) : this.defaultIcon,
        }
        if (this.getRoute(name).permission) {
            sub.permission = this.getRoute(name).permission
        }
        this.sidebarMenu[index]['_children'].push(sub)
        // if (this.getRoute(name).permission !== undefined && this.getRoute(name).permission !== '') {
        //     this.sidebarMenu[index]['_children'].push(
        //         { permission: this.getRoute(name).permission }
        //     )
        // }
    }


    getIcon = (icon) => {
        let Icon = <CIcon name="cil-file" customClasses="c-sidebar-nav-icon" />;
        if (icon) {
            Icon = <CIcon name={icon} customClasses="c-sidebar-nav-icon" />
            if (typeof icon !== 'string') {
                Icon = <CIcon content={icon} customClasses="c-sidebar-nav-icon" />
            }
        }
        return Icon;
    }
}