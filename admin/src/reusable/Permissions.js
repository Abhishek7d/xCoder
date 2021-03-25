// import React from 'react';
import { useSelector } from 'react-redux';

function UsePermission(per) {
    const permissions = useSelector(stateObj => stateObj.userPermissions)
    let isTrue = false;
    if (permissions !== null && permissions !== '') {
        isTrue = (permissions.find(permission => permission.name === per) !== undefined) ? true : false
    }
    return isTrue;
}

function WithPermission(_nav) {
    const permissions = useSelector(stateObj => stateObj.userPermissions)
    let menu = [];
    if (permissions.length > 0) {
        _nav.forEach((nav) => {
            if (nav._tag === 'CSidebarNavItem') {
                if (nav.hasOwnProperty("permission")) {
                    if (permissions.find(permission => permission.name === nav.permission) !== undefined) {
                        menu.push(nav)
                    }
                } else {
                    menu.push(nav)
                }
            } else if (nav._tag === 'CSidebarNavDropdown') {
                let dropdown = []
                if (nav.hasOwnProperty("_children")) {
                    nav._children.forEach((subNav) => {
                        if (subNav.hasOwnProperty("permission")) {
                            if (permissions.find(permission => permission.name === subNav.permission) !== undefined) {
                                dropdown.push(subNav)
                            }
                        } else {
                            dropdown.push(subNav)
                        }
                    });
                }
                nav._children = dropdown
                if (dropdown.length > 0) {
                    menu.push(nav)
                }
            } else if (nav._tag === 'CSidebarNavTitle') {
                menu.push(nav)
            }
        })
    }
    return menu;
}
export {
    UsePermission as usePermission,
    WithPermission as withPermission
}
// export {
//     UsePermission
// }