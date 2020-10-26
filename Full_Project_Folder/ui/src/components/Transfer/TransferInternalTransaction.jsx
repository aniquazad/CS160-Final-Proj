import React from "react";
import "./Transfer.css";
import { Link } from "react-router-dom";
import UserNavigationBar from "../UserNavBar/UserNavBar";

class TransferInternalTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  check() {}
  render() {
    const { amount } = this.state;
    return (
      <div className="DepositCheckTransaction">
        <UserNavigationBar />
        <div
          className="TransactionAlert"
          class="alert alert-success"
          role="alert"
        >
          <p>
            Thank you for your transfer request! Please contact us if you have
            any questions or concerns.
          </p>
        </div>
        <div className="transactionInfo">
          <h4>Transaction Number: [insert transaction number]</h4>
          <h4>From: {this.props.location.from_acct}</h4>
          <h6>New Balance: [insert new balance]</h6>
          <h4>To: {this.props.location.to_acct}</h4>
          <h6>New Balance: [insert new balance]</h6>
          <h4>Amount: {this.props.location.amount}</h4>
          <h4>Memo: {this.props.location.memo}</h4>
        </div>
        <div className="buttons">
          <Link to="/userdashboard">
            <button type="button" class="btn btn-primary" onClick={this.check}>
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default TransferInternalTransaction;
