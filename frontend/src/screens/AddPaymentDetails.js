import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/template/PageHeader';
import card from 'card-validator';
import visa from '../assets/images/credit/visa.png';
import mastercard from '../assets/images/credit/mastercard.png';
import maestro from '../assets/images/credit/mestro.png';
import cirrus from '../assets/images/credit/cirrus.png';
import americanExpress from '../assets/images/credit/american-express.png';
import isracard from '../assets/images/credit/isracard.gif';
import diners from '../assets/images/credit/diners.gif';
import ApiHandler from '../model/ApiHandler';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

class AddPaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screenName: 'Add Card',
            loading: false,
            cardIdentified: false,
            cardIsValid: false,
            number: null,
            month: null,
            year: null,
            cvv: null,
            name: null,
            id: null,
            address: null,
            city: null,
            state: null,
            country: null,
            postalCode: null,
            error: "",
            success: ""
        }
    }
    refreshPage = () => {

    }
    displayCardLogo = () => {
        let icon = null;
        let style = {
            width: '40px', height: 'auto'
        }
        switch (this.state.cardIdentified) {
            case 'visa':
                icon = <img style={style} alt="visa" className="img-fluid"
                    src={visa} />
                break;
            case 'mastercard':
                icon = <img style={style} alt="mastercard" className="img-fluid"
                    src={mastercard} />
                break;
            case 'maestro':
                icon = <img style={style} alt="mestro" className="img-fluid"
                    src={maestro} />
                break;
            case 'cirrus':
                icon = <img style={style} alt="cirrus" className="img-fluid"
                    src={cirrus} />
                break;
            case 'american-express':
                icon = <img style={style} alt="American Express" className="img-fluid"
                    src={americanExpress} />
                break;
            case 'isracard':
                icon = <img style={style} alt="isracard" className="img-fluid"
                    src={isracard} />
                break;
            case 'diners-club':
                icon = <img style={style} alt="diners-club" className="img-fluid"
                    src={diners} />
                break;
            default:
                icon = ''
        }
        return icon;
    }
    validateCard = (event) => {
        let name = event.target.name
        let value = event.target.value
        this.setState({
            [name]: value
        })
        if (name === 'number') {
            let cardNumber = card.number(event.target.value)
            if (cardNumber.card) {
                this.setState({ cardIdentified: cardNumber.card.type, cardIsValid: cardNumber.isValid })
            } else {
                this.setState({ cardIdentified: false })
            }
        }
    }
    renderYears = () => {
        let s = [];
        let currentYear = new Date().getFullYear()
        s.push(<option disabled key="-1" value="0">Year</option>)
        for (let i = currentYear; i <= (currentYear + 15); i++) {
            s.push(<option key={i} value={i}>{i}</option>)
        }
        return s;
    }
    renderMonth = () => {
        let s = [];
        s.push(<option disabled key="-1" value="0">Month</option>)
        for (let i = 1; i <= 12; i++) {
            s.push(<option key={i} value={i}>{i}</option>)
        }
        return s;
    }
    addCreditCard = () => {
        let s = this.state
        this.setState({
            loading: true
        })
        new ApiHandler().addCreditCard(s.name, s.id, s.number, s.cardIdentified, s.month, s.year, s.cvv, s.address, s.city, s.state, s.country, s.postalCode, (msg, data) => {
            this.setState({
                error: "",
                success: msg,
                cardIdentified: false,
                cardIsValid: false,
                number: null,
                month: null,
                year: null,
                cvv: null,
                name: null,
                id: null,
                address: null,
                city: null,
                state: null,
                country: null,
                postalCode: null,
                loading: false
            })
        }, (error) => {
            this.setState({ error: error, success: "", loading: false })
        })
    }

    setShow() {
        this.setState({ error: "", success: "", })
    }
    render() {
        return (
            <div>
                <div className="container-fluid p-0">
                    <Navigation onProjectChange={this.refreshPage} name={this.state.screenName} />
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="section-container">
                            <PageHeader
                                heading={"Add Payment Method"} subHeading=""
                                back={<Link className="text-dark" to="/payment"><i className="fas fa-arrow-left"></i></Link>} />
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="row no-gutters">
                                                <div className="col-12 align-self-center">
                                                    <h6 className="heading">Add New Card</h6>
                                                    <p className="sub-heading">
                                                        Please enter your credit card details
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <Alert onClose={() => this.setShow()} show={(this.state.error !== "") ? true : false} variant="danger" dismissible>
                                                {this.state.error}
                                            </Alert>
                                            <Alert onClose={() => this.setShow()} show={(this.state.success !== "") ? true : false} variant="success" dismissible>
                                                {this.state.success}
                                            </Alert>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p className="text-muted">Enter Card Details</p>
                                                    <div className="">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text theme">
                                                                    <i style={{ fontSize: '13px' }} className="fa fa-credit-card"></i>
                                                                </div>
                                                            </div>
                                                            <input type="text" name="number" placeholder="Card Number" onChange={this.validateCard} className="form-control form-input-field" />
                                                            <span className="card-logo-float">
                                                                {this.displayCardLogo()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text theme">
                                                                    <i className="fa fa-calendar-alt"></i>
                                                                </div>
                                                            </div>
                                                            <select defaultValue={'0'} name="month" onChange={this.validateCard} placeholder="Expiry Month" required className="custom-select form-input-field">
                                                                {this.renderMonth()}

                                                            </select>
                                                            <select defaultValue={'0'} name="year" onChange={this.validateCard} placeholder="Expiry Year" required className="custom-select form-input-field">
                                                                {this.renderYears()}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text theme">
                                                                    <i className="fa fa-lock"></i>
                                                                </div>
                                                            </div>
                                                            <input name="cvv" type="password" onChange={this.validateCard} placeholder="Security Digit (CVV)" className="form-control form-input-field" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text theme">
                                                                    <i className="fa fa-user"></i>
                                                                </div>
                                                            </div>
                                                            <input name="name" type="text" onChange={this.validateCard} placeholder="Card Owner Name" className="form-control form-input-field" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <div className="input-group-text theme">
                                                                    <i style={{ fontSize: '13px' }} className="fa fa-id-card"></i>
                                                                </div>
                                                            </div>
                                                            <input name="id" type="text" onChange={this.validateCard} placeholder="Card Owner ID" className="form-control form-input-field" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="text-muted mt-3 mt-md-0">Enter Billing Address</p>
                                                    <div className="">
                                                        <div className="input-group">
                                                            <input name="address" type="text" onChange={this.validateCard} placeholder="Address (House No, Office No, Block No)" className="form-control form-input-field" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <input name="city" type="text" onChange={this.validateCard} placeholder="City" className="form-control form-input-field" />

                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <input name="state" type="text" onChange={this.validateCard} placeholder="State" className="form-control form-input-field" />

                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <input name="country" type="text" onChange={this.validateCard} placeholder="Country" className="form-control form-input-field" />

                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="input-group">
                                                            <input name="postalCode" type="text" onChange={this.validateCard} placeholder="Postal Code" className="form-control form-input-field" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-9 mt-3">
                                                    <p className="text-muted text-small">
                                                        Note: We will charge $1 USD to verify your card.
                                                    </p>
                                                </div>
                                                <div className="col-md-3 mt-3">
                                                    <button disabled={!this.state.cardIsValid} onClick={this.addCreditCard} className="btn btn-theme btn-block">
                                                        {this.state.loading ?
                                                            <img alt="load" src={require("../assets/images/loading.gif")} style={{ width: "25px", filter: "brightness(20)" }} />
                                                            : "Add Credit Card"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPaymentDetails;