import React, { Suspense } from 'react'
import {
    Redirect,
    Route,
    Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
// import Api from '../Api';
import { usePermission } from '../reusable/Permissions';
import Page403 from 'src/views/pages/Page403';

const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
)

const TheContent = () => {
    const can = usePermission

    return (
        <main className="c-main">
            <CContainer fluid>
                <Suspense fallback={loading}>
                    <Switch>
                        {routes.map((route, idx) => {
                            if (can(route.permission)) {
                                return route.component && (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={props => (
                                            <CFade>
                                                <route.component {...props} />
                                            </CFade>
                                        )} />
                                )
                            } else {
                                return route.component && (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={props => (
                                            <CFade>
                                                <Page403 {...props} />
                                            </CFade>
                                        )} />
                                )
                            }

                        })}
                        <Redirect from="/" to="/dashboard" />

                    </Switch>
                </Suspense>
            </CContainer>
        </main>
    )
}

export default React.memo(TheContent)
