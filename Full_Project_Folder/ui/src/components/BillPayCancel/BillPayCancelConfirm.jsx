import React from 'react';
import './BillPayCancel.css';
import { Link } from 'react-router-dom';
import UserNavigationBar from '../UserNavBar/UserNavBar';

class BillPayCancelConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: window.location.pathname.split('/')[2] || -1,
        };
    }

    render() {
        return (
            <div className="BillPayCancel">
                <UserNavigationBar active={1} />
                <div className="billpay-headerDiv">
                    <div id="billpay-confirm-transfer">Cancel Bill Payment</div>
                    <div>
                        Are you sure you want to cancel this bill payment?
                    </div>
                </div>
                <div className="billpay-confirm-details">
                    <h4>Transfer From: {this.props.location.from_acct}</h4>
                    <h4>Pay bill to: {this.props.location.to_acct}</h4>
                    <h4>Routing number: {this.props.location.routing_num}</h4>
                    <h4>Amount: ${this.props.location.amount}</h4>
                    <h4>Bill payment date: {this.props.location.pay_date}</h4>
                    <h4>Frequency: One Time</h4>
                </div>
                <div className="billpay-buttons">
                    <Link
                        to={{
                            pathname: '/billpayshow',
                        }}
                    >
                        <button type="button" class="btn btn-danger">
                            Go Back
                        </button>
                    </Link>
                    <Link
                        to={{
                            pathname: `/billpaycancel_transaction/${this.state.id}`,
                            from_acct: this.props.location.from_acct,
                            to_acct: this.props.location.to_acct,
                            routing_num: this.props.location.routing_num,
                            amount: this.props.location.amount,
                            pay_date: this.props.location.pay_date,
                            frequency: this.props.location.frequency,
                        }}
                    >
                        <button type="button" class="btn btn-primary">
                            Submit
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default BillPayCancelConfirm;
