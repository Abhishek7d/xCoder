import React from 'react'
import Cookies from 'js-cookie';

import {
    Redirect
} from 'react-router-dom'
import {
    TheContent,
    TheSidebar,
    TheFooter,
    TheHeader
} from './index'
// const Login = React.lazy(() => import('../views/pages/Login'));

const TheLayout = () => {
    const token = Cookies.get('authToken');

    return (
        <div className="c-app c-default-layout">
            <TheSidebar />
            <div className="c-wrapper">
                <TheHeader />
                <div className="c-body">
                    {(token === 'undefined' || token === undefined || token === '' || token === null) ? <Redirect to="/login" />
                        : <TheContent />}
                </div>
                <TheFooter />
            </div>
        </div>
    )

}

export default TheLayout
