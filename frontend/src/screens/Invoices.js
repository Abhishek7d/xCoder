import React from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import ApiHandler from '../model/ApiHandler';
// import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import "../assets/css/dashboard.css";
import PageHeader from '../components/template/PageHeader';
//import Pagination from '../components/template/Pagination';
import { read_cookie } from 'sfcookies';
import { Alert } from 'react-bootstrap';
import InvoiceDetails from '../components/invoice/InvoiceDetails';
import Loader from '../components/template/Loader';

class Invoices extends React.Component {
    constructor(props) {
        super(props);
        let invoiceId = props.match.params.uuId;
        this.state = {
            projectName: read_cookie('projectName'),
            projectId: read_cookie('projectId'),
            screenName: "Invoices",
            stats: null,
            year: '2021',
            loading: true,
            isClicked: (invoiceId) ? true : false,
            selectedInvoiceId: invoiceId
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }
    componentDidMount() {
        let y = new Date();
        this.loadStatistics(y.getFullYear());
    }
    refreshPage = () => {
        let y = new Date();
        this.loadStatistics(y.getFullYear());
        this.setState({
            isClicked: false,
            selectedInvoiceId: null
        })
        window.history.replaceState(null, null, "/invoices")

    }
    loadStatistics = (year) => {
        this.setState({
            loading: true
        })
        this.apiHandler.loadStatistics(year, (msg, data) => {
            this.setState({
                stats: data,
                loading: false
            })
        }, error => {
            this.setState({
                loading: false
            })
        })
    }
    handleClick = (id) => {
        this.setState({
            isClicked: !this.state.isClicked,
            selectedInvoiceId: id
        })

    }
    goBack = () => {
        this.setState({
            isClicked: !this.state.isClicked,
            selectedInvoiceId: null
        })
        window.history.replaceState(null, null, "/invoices/")
    }
    renderInvoiceDetails = () => {
        if (this.state.selectedInvoiceId) {
            window.history.replaceState(null, null, "/invoices/" + this.state.selectedInvoiceId)
        }
        return <InvoiceDetails goBack={this.goBack} invoiceId={this.state.selectedInvoiceId}></InvoiceDetails>
    }
    renderInvoices = () => {
        let tr = [];
        if (this.state.stats.invoices.months) {
            this.state.stats.invoices.months.forEach((data, index) => {
                tr.push(<tr key={index}>
                    <td>{index + 1}</td>
                    <td>{(data.invoice.available) ? <button className="btn btn-link" onClick={() => { this.handleClick(data.invoice.data.uuid) }}>View</button> : '...'}</td>
                    <td>{data.month + ", " + data.year}</td>
                    <td>{(data.invoice.available) ? "$" + data.invoice.data.grand_total : '...'}</td>
                    <td>{(data.invoice.available) ? data.invoice.data.status : '...'}</td>
                    <td>{(data.invoice.available && data.invoice.data.payment_date) ? new Date(data.invoice.data.payment_date).toDateString() : '...'}</td>
                    <td className='text-center'>
                        {(data.invoice.available) ?
                            <div className="">
                                <button type="button" className="btn btn-link pt-0 pb-0 m-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-ellipsis-v"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <button onClick={() => this.handleClick(data.invoice.data.uuid)} type="button" className="dropdown-item">View</button>
                                </div>
                            </div> : ''}
                    </td>
                </tr >)
            })
        } else {
            tr.push(<tr key="0"><td colSpan="7" className="text-center">No Invoices</td></tr>);
        }
        return tr;
    }
    getDate = () => {
        let date = new Date();
        return date.toDateString();
    }
    selectChange = (event) => {
        let value = event.target.value;
        this.setState({ year: parseInt(value) })
        this.loadStatistics(value)
    }
    renderSelectYear = () => {
        let s = [];
        if (this.state.stats !== null) {
            let currentYear = new Date().getFullYear()
            let year = new Date(this.state.stats.invoices.from).getFullYear()
            let y = this.state.year
            let sel = false
            if (currentYear > year) {
                for (let i = currentYear; i >= year; i--) {
                    sel = false
                    if (y === i) {
                        sel = 'selected';
                    }
                    s.push(<option selected={sel} value={i}>{i}</option>)
                }
            } else if (currentYear === year) {
                s.push(<option value={year}>{year}</option>)
            }
        }
        return s;
    }
    render() {
        return (
            <div className="container-fluid p-0">
                <Navigation onProjectChange={this.refreshPage} name={this.state.screenName} />
                <Sidebar />
                <div className="content-wrapper">
                    <div className="section-container">
                        {
                            (this.state.loading) ? <Loader loading={this.state.loading} /> : <>

                                {(this.state.isClicked) ?
                                    <></> :
                                    <PageHeader
                                        heading={"Invoice"} subHeading="Your Invoices">
                                        <div className="row">
                                            <div className="offset-lg-8 col-sm-4 col-md-4 mb-2 mb-sm-0  align-self-center">
                                                <select onChange={this.selectChange} className="custom-select" name="year">
                                                    {this.renderSelectYear()}
                                                </select>
                                            </div>
                                        </div>
                                    </PageHeader>
                                }
                                <Alert show={(this.state.stats === null) ? true : false} variant="info">
                                    Your billing statistics will be available soon.
                                </Alert>
                                {(this.state.isClicked) ?

                                    this.renderInvoiceDetails() :
                                    <>
                                        {(this.state.stats) ?
                                            <>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="row no-gutters">
                                                                    <div className="col-6 align-self-center">
                                                                        <h6 className="heading">This Month</h6>
                                                                        <p className="sub-heading">
                                                                            Till date
                                                                    </p>
                                                                    </div>
                                                                    <div className="col-6 p-0 align-self-center text-right">
                                                                        <h2 className="m-0 text-theme">${this.state.stats.stats.tillDate.cost}</h2>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="row no-gutters">
                                                                    <div className="col-6 align-self-center">
                                                                        <h6 className="heading">Estimated</h6>
                                                                        <p className="sub-heading">
                                                                            Current Month
                                                         </p>
                                                                    </div>
                                                                    <div className="col-6 p-0 align-self-center text-right">
                                                                        <h2 className="m-0 text-theme">${this.state.stats.stats.estimated.cost}</h2>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="row no-gutters">
                                                                    <div className="col-6 align-self-center">
                                                                        <h6 className="heading">Last Payment</h6>
                                                                        <p className="sub-heading">
                                                                            {(this.state.stats.stats.lastPayment !== null) ? new Date(this.state.stats.stats.lastPayment.payment_date).toDateString() : ''}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-6 p-0 align-self-center text-right">
                                                                        {(this.state.stats.stats.lastPayment) ? <h2 className="m-0 text-theme">${this.state.stats.stats.lastPayment.amount}</h2>
                                                                            : <h2 className="m-0 text-theme">$0</h2>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="row no-gutters">
                                                                    <div className="col-12 align-self-center">
                                                                        <h6 className="heading">Invoice History</h6>
                                                                        <p className="sub-heading">
                                                                            All Invoices
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="card-body table-responsive">
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Invoice ID</th>
                                                                            <th>Month</th>
                                                                            <th>Amount</th>
                                                                            <th>Status</th>
                                                                            <th>Paid On</th>
                                                                            <th className="text-center">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {this.renderInvoices()}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : <></>

                                        }
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(Invoices);
