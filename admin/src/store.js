import { createStore } from 'redux'
import Cookies from 'js-cookie';

const initialState = {
    sidebarShow: 'responsive',
    authUser: (localStorage.getItem('authUser')) ? JSON.parse(localStorage.getItem('authUser')) : null,
    authToken: Cookies.get('authToken'),
    userPermissions: (localStorage.getItem('userPermissions')) ? Array.from(JSON.parse(localStorage.getItem('userPermissions'))) : [],
}

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest }
        default:
            return state
    }
}

const store = createStore(changeState)
export default store