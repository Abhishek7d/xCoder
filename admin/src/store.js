import { createStore } from 'redux'
import Cookies from 'js-cookie';

const initialState = {
  sidebarShow: 'responsive',
  userRole: (localStorage.getItem('authUserRole')) ? localStorage.getItem('authUserRole') : null,
  authToken: Cookies.get('authToken')
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