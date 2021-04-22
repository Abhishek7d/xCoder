import React, { useState, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import Cookies from 'js-cookie';

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CInputRadio,
    CInputCheckbox,
    CTextarea
} from '@coreui/react'
import Api from 'src/Api'
// import CIcon from '@coreui/icons-react'

const Invoice = (props) => {
    const [settings, setSettings] = useState({
        note1: '',
        note2: '',
        note3: ''
    })
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(null)
    useEffect(() => {
        getSettings()
    }, [])
    useEffect(() => {
        if (form) {
            saveSettings()
        }
    }, [form])
    // useEffect(() => {
    //     saveSettings()
    // }, [settings])
    const getSettings = () => {
        // setLoading(true)
        new Api().get("GET", "/actions/settings/invoice_notes/json", null, true, (data, msg) => {
            setSettings(data)
            setLoading(false)
        }, (error) => {
            console.log(error);
            setLoading(false)
        })
    }
    const setValue = (e) => {
        if (settings[e.target.name] !== e.target.value) {
            setLoading(true)
            setForm({
                ...settings, [e.target.name]: e.target.value
            })
        }

        // console.log(f);
    }
    const saveSettings = () => {
        // setLoading(e.target.name)
        let data = {
            option: 'invoice_notes',
            json: true,
            value: form,
            raw: true
        }
        new Api().get("POST", '/actions/settings', data, true, (data, msg) => {
            getSettings()
            setLoading(null)
        }, error => {
            setLoading(null)
            console.log(error);
        })
    }
    return (
        <>
            <CCard>
                <CCardHeader>Invoice Settings</CCardHeader>
                <CCardBody>
                    <CForm>
                        <CFormGroup className="ml-4">
                            <CInputCheckbox id="card-enable" name="enableCard" />
                            <CLabel htmlFor="card-enable">
                                Display Notes
                            </CLabel>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Invoice Note: 1 {(loading) ? <span className="text-info">Saving</span> : null}
                            </CLabel>
                            <CTextarea defaultValue={settings.note1} name="note1" onBlur={setValue} rows="4" placeholder="Enter notes for users to display on invoice page" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Invoice Note: 2 {(loading) ? <span className="text-info">Saving</span> : null}
                            </CLabel>
                            <CTextarea defaultValue={settings.note2} name="note2" onBlur={setValue} rows="4" placeholder="Enter notes for users to display on invoice page" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel>
                                Invoice Note: 3 {(loading) ? <span className="text-info">Saving</span> : null}
                            </CLabel>
                            <CTextarea defaultValue={settings.note3} name="note3" onBlur={setValue} rows="4" placeholder="Enter notes for users to display on invoice page" />
                        </CFormGroup>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Invoice
