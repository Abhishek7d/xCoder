import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/template/PageHeader';
import Loader from '../components/template/Loader';
import { Link } from 'react-router-dom';
import ApiHandler from '../model/ApiHandler';
import visa from '../assets/images/credit/visa.png';
import mastercard from '../assets/images/credit/mastercard.png';
import maestro from '../assets/images/credit/mestro.png';
import cirrus from '../assets/images/credit/cirrus.png';
import americanExpress from '../assets/images/credit/american-express.png';
import isracard from '../assets/images/credit/isracard.gif';
import diners from '../assets/images/credit/diners.gif';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenName: 'Payment',
            loading: false,
            methods: null,
            paymentMethod1: null,
            paymentMethod2: null,
            paymentMethod3: null,
            addMethodUrl: '/payment/add-card',
            error: "",
            success: "",
            transactions: null,
        }
    }
    componentDidMount() {
        this.getCreditCard();
        this.getTransactions();
    }
    refreshPage = () => {

    }
    getTransactions = () => {
        new ApiHandler().getTransactions((msg, data) => {
            this.setState({
                transactions: data
            })
        }, (error) => {
            this.setState({ error: error, success: "", })
            this.setState({ loading: false })
        })
    }
    renderTransaction = () => {
        let tr = [];
        if (this.state.transactions && this.state.transactions.data.length > 0) {
            this.state.transactions.data.forEach((data, index) => {
                tr.push(<tr key={index}>
                    <td>{data.id}</td>
                    <td>XXXX-{data.card}</td>
                    <td>{data.amount} {data.currency}</td>
                    <td>{data.invoice_id}</td>
                    <td className={this.getStatusColor(data.status) + ' text-capitalize'}>{data.status}</td>
                    <td>{new Date(data.created_at).toLocaleString()}</td>
                </tr>)
            })
        }
        return tr;
    }
    getCreditCard = () => {
        this.setState({ loading: true })
        new ApiHandler().getCards((msg, data) => {
            if (data) {
                this.setState({
                    methods: data
                })
                data.forEach((data, index) => {
                    this.setState({
                        ['paymentMethod' + (index + 1)]: data
                    })
                })
            }
            this.setState({ loading: false })
        }, (error) => {
            this.setState({ error: error, success: "", })
            this.setState({ loading: false })
        })
    }
    handleCardAction = (id, action) => {
        this.setState({ loading: true })

        new ApiHandler().creditCardAction(action, id, (msg, data) => {
            this.setState({ error: "", success: msg, })
            this.setState({ loading: false })
            this.getCreditCard()
        }, (error) => {
            this.setState({ error: error, success: "", })
            this.setState({ loading: false })
        })
    }
    renderCards = () => {
        let col = [];
        for (let i = 0; i <= 2; i++) {
            col.push(
                <div key={i} className="col-md-4 full-height">
                    <div className="card">
                        {
                            (this.state.methods && typeof this.state.methods[i] !== 'undefined') ?
                                <>
                                    <div className="card-header cursor-pointer">
                                        <div className="row no-gutters">
                                            <div className="col-2 p-1 align-self-center pl-0">
                                                {this.displayCardLogo(this.state.methods[i].card)}
                                            </div>
                                            <div className="col-8 p-2 align-self-center">
                                                <h2 className="heading">
                                                    XXXX-{this.state.methods[i].number}
                                                </h2>
                                                <p className="sub-heading">{this.state.methods[i].month}/
                                                {this.state.methods[i].year} {
                                                        (this.state.methods[i].primary === 1) ? '- Primary' : null
                                                    }
                                                </p>
                                            </div>
                                            <div className="col-2 align-self-center text-right">
                                                <div className="dropdown show">
                                                    <button disabled={(this.state.methods[i].primary !== 1) ? false : true} className="btn btn-link" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fa fa-ellipsis-v"></i>
                                                    </button>

                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                        {

                                                            (this.state.methods[i].primary !== 1) ? <button onClick={() => this.handleCardAction(this.state.methods[i].id, 'make-primary')} className="dropdown-item btn" href="#">Make Primary</button> : null
                                                        }
                                                        {
                                                            (this.state.methods[i].primary !== 1) ? <button onClick={() => this.handleCardAction(this.state.methods[i].id, 'delete')} className="dropdown-item text-danger btn" href="#">Delete</button> : null
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row no-gutters">
                                            <div className="col-2 text-right">
                                                <i className="fa fa-user mr-3 bg-dark-square"></i>
                                            </div>
                                            <div className="col-10 text-muted-x"><p className="mb-2">{this.state.methods[i].name}</p></div>
                                        </div>
                                        <div className="row no-gutters">
                                            <div className="col-2 text-right">
                                                <i className="fa fa-id-card mr-3 bg-dark-square"></i>
                                            </div>
                                            <div className="col-10 text-muted-x"><p className="mb-2">{this.state.methods[i].card_holder_id}</p></div>
                                        </div>
                                        <div className="row no-gutters">
                                            <div className="col-2 text-right">
                                                <i className="fa fa-envelope mr-3 bg-dark-square"></i>
                                            </div>
                                            <div className="col-10 text-muted-x"><p className="mb-2">user@email.com</p></div>
                                        </div>
                                        <div className="row no-gutters">
                                            <div className="col-2 text-right">
                                                <i className="fa fa-map-marker bg-dark-square mr-3"></i>
                                            </div>
                                            <div className="col-10 text-muted-x"><p className="mb-2">
                                                {this.state.methods[i].address}, {this.state.methods[i].city}, {this.state.methods[i].state}, {this.state.methods[i].country} - {this.state.methods[i].postal_code}
                                            </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <Link to={this.state.addMethodUrl} className="add-card cursor-pointer card-body d-flex justify-content-center align-items-center">
                                    <i className="fa fa-plus fa-2x text-muted-x"></i>
                                </Link>
                        }

                    </div>
                </div>
            )

        }
        return col;
    }
    getStatusColor = (status) => {
        let color = '';
        switch (status) {
            case 'success':
                color = 'text-green'
                break;
            case 'failed':
                color = 'text-danger'
                break;
            default:
                color = 'text-info'

        }
        return color
    }
    displayCardLogo = (type) => {
        let icon = null;
        switch (type) {
            case 'visa':
                icon = <img alt="visa" className="img-fluid"
                    src={visa} />
                break;
            case 'mastercard':
                icon = <img alt="mastercard" className="img-fluid"
                    src={mastercard} />
                break;
            case 'maestro':
                icon = <img alt="mestro" className="img-fluid"
                    src={maestro} />
                break;
            case 'cirrus':
                icon = <img alt="cirrus" className="img-fluid"
                    src={cirrus} />
                break;
            case 'american-express':
                icon = <img alt="American Express" className="img-fluid"
                    src={americanExpress} />
                break;
            case 'isracard':
                icon = <img alt="isracard" className="img-fluid"
                    src={isracard} />
                break;
            case 'diners-club':
                icon = <img alt="diners-club" className="img-fluid"
                    src={diners} />
                break;
            default:
                icon = ''
        }
        return icon;
    }

    render() {
        return (
            <>
                <div className="container-fluid p-0">
                    <Navigation onProjectChange={this.refreshPage} name={this.state.screenName} />
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="section-container">
                            {
                                (this.state.loading) ? <Loader loading={this.state.loading} /> : <>
                                    <PageHeader
                                        heading={"Payment Settings"} subHeading="Settings" />
                                    <div className='row'>
                                        {this.renderCards()}
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mt-3">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="row no-gutters">
                                                        <div className="col-12 align-self-center">
                                                            <h6 className="heading">Payments</h6>
                                                            <p className="sub-heading">
                                                                Payment History
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th># Transaction</th>
                                                                <th>Card</th>
                                                                <th>Amount</th>
                                                                <th>Invoice</th>
                                                                <th>Status</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.renderTransaction()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}


export default Payment;