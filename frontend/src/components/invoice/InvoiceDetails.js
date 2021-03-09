import React from 'react';
import ApiHandler from '../../model/ApiHandler';
// import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { read_cookie } from 'sfcookies';
// import { Alert } from 'react-bootstrap';

class InvoiceDetails extends React.Component {
    constructor(props) {
        super();
        this.props = props
        this.state = {
            projectName: read_cookie('projectName'),
            projectId: read_cookie('projectId'),
            screenName: "Invoice Details",
            stats: null,
            total: null,
            taxPercent: null,
            taxAmount: null,
            totalWithTax: null,
            previousArrears: null,
            grandTotal: null,
            status: null,
            paymentDate: null,
            dueDate: null,
            invoiceDate: null,
            invoiceMonth: null,
            invoicedTo: null,
            payTo: null,
            loading: true,
            invoiceId: props.invoiceId
        }
        this.apiHandler = new ApiHandler();
    }
    showError = (err) => {

    }
    componentDidMount() {
        this.loadStatistics();
    }
    refreshPage = () => {
        this.loadStatistics();
    }
    loadStatistics = () => {
        this.setState({
            loading: true
        })
        this.apiHandler.getInvoiceDetails(this.state.invoiceId, (msg, data) => {
            this.setState({
                stats: data.items,
                total: data.total,
                taxPercent: data.taxPercent,
                taxAmount: data.taxAmount,
                totalWithTax: data.totalWithTax,
                previousArrears: data.previousArrears,
                grandTotal: data.grandTotal,
                status: data.status,
                paymentDate: data.paymentDate,
                dueDate: data.dueDate,
                invoiceDate: data.invoiceDate,
                invoiceMonth: data.invoiceMonth,
                invoicedTo: data.invoicedTo,
                payTo: data.payTo,
                loading: false
            })
        }, error => {
            this.setState({
                loading: false
            })
        })
    }
    pad = (num, size) => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
    renderInvoiceDetails = () => {
        let tr = [];
        let td = [];
        if (this.state.stats) {
            this.state.stats.forEach((data, index) => {
                td.push(<tr key={data.id}>
                    <td>{data.item}</td>
                    {/* <td className="text-center text-capitalize">{data.cost_type}</td> */}
                    {(data.cost_type === "monthly") ?
                        <td className="text-left">{this.pad(data.days, 2)} Days</td> :
                        <td className="text-left" title={data.hours + " Hours"}>{data.hours} Hours</td>
                    }
                    <td title={data.cost_type + " rate"}>${data.description + " " + data.cost_type}</td>
                    <td title={"Billed " + data.cost_type}>${data.total}</td>
                </tr>)

            });
            tr.push(<tbody>{td}</tbody>)
        }
        tr.push(
            <tfoot>
                <tr key="total">
                    <th className="text-right" colSpan="3">Total</th>
                    <th className="" >${parseFloat(this.state.total).toFixed(2)}</th>
                </tr>
                {
                    (this.state.taxAmount) ? <tr key="tax">
                        <th className="text-right" colSpan="3">Tax {this.state.taxPercent + "%"} (+)</th>
                        <th className="" >${this.state.taxAmount}</th>
                    </tr> : ''
                }
                {
                    (this.state.previousArrears) ? <tr key="pre">
                        <th className="text-right" colSpan="3">Previous Arrears (+)</th>
                        <th className="" >${this.state.previousArrears}</th>
                    </tr> : ''
                }
                {
                    (this.state.grandTotal !== this.state.total) ? <tr key="grandtotal" className="bg-striped">
                        <th colSpan="3" className="text-right "><h5>Grand Total: </h5></th>
                        <th className=""><h5>${parseFloat(this.state.grandTotal).toFixed(2)}</h5></th>
                    </tr> : ''
                }
            </tfoot>
        )
        return tr
    }
    renderAddress = (data) => {
        let p = [];
        if (this.state.stats) {
            data.forEach((line) => {
                p.push(<span> {line} <br /></span>)
            })
        }
        return p;
    }
    render() {
        return (
            <> {(this.state.loading) ?
                <div className='col-12 text-center'>
                    <img alt="" src={require("../../assets/images/loading.gif")} style={{ width: "100px", filter: "brightness(1)" }} />
                </div> : <div className="row">
                    <div className="col-12">
                        <button onClick={this.props.goBack} className="btn btn-light mb-3 d-print-none">
                            <i className="cursor-pointer fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                    <div className="col-md-9">
                        <div className="card invoice">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="text-left border-top-0">

                                                    <h4 className="p-0 m-0">Invoice: {this.state.invoiceMonth}</h4>
                                                </td>
                                                <td className="border-top-0 p-4 text-right">
                                                    <img src={require("../../assets/images/logo.webp")} alt="admin Logo" className="brand-image img-circle elevation-3"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pt-4 pb-4 text-bold">
                                                    #{this.state.invoiceId}
                                                </td>
                                                <td className="text-right text-bold">
                                                    {this.state.invoiceDate}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="address">
                                                    <h6 className="text-bold">Invoiced To:</h6>
                                                    <p className='mt-3'>
                                                        {this.renderAddress(this.state.invoicedTo)}
                                                    </p>
                                                    <p className="email">anil.kumar@newrise.in</p>
                                                </td>
                                                <td className="address text-right">
                                                    <h6 className="text-bold"> Pay To:</h6>
                                                    <p className="ml-auto mt-3">
                                                        {this.renderAddress(this.state.payTo)}
                                                    </p>
                                                    <p className="ml-auto email">sales@parvaty.me</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="table mb-100 table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50%' }}>Items</th>
                                                <th className="text-left">Usage</th>
                                                <th className="" >Unit Price</th>
                                                <th className="" >Subtotal</th>
                                            </tr>
                                        </thead>
                                        {this.renderInvoiceDetails()}
                                    </table>
                                    {/* <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td className="">
                                                    <p className='m-0'>
                                                        Invoice Id: {this.state.invoiceId}
                                                    </p>
                                                    <p className='m-0'>
                                                        Due Date: {this.state.dueDate}
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table> */}
                                </div>
                                <div className="text-center">
                                    <p className="text-muted">
                                        Thank you for choosing us.
                                    </p>
                                    <p className="text-muted text-small">Parvaty Cloud Hosting | 778-5457-5478 | www.parvaty.me</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3  d-print-none">
                        <div className="pt-2 d-print-none">
                            <button className="btn btn-theme btn-block">
                                Pay Now
                            </button>
                            <button className="btn btn-theme-outline btn-block">
                                Download
                            </button>
                            <button className="btn btn-link btn-block">
                                Need Help?
                            </button>
                            <p style={{ marginTop: '20px' }} className="text-muted text-small">
                                Note 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <p className="text-muted text-small">
                                Note 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <p className="text-muted text-small">
                                Note 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>
                </div>
            }
            </>
        );
    }
}
export default withRouter(InvoiceDetails);
