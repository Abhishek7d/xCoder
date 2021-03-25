import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
    return (
        <CFooter fixed={false}>
            <div>
                {new Date().getFullYear()}  &copy; Parvaty.me
            </div>
            <div className="mfs-auto">
                <span className="mr-1">Powered by</span>
                <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">CoreUI</a>
            </div>
        </CFooter>
    )
}

export default React.memo(TheFooter)
