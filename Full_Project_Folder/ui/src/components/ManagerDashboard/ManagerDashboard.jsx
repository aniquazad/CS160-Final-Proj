import React, { useState } from "react";
import "./ManagerDashboard.css";
import Logo from "../Logo";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "../../axios";
import ManagerNavigationBar from "../ManagerNavBar/ManagerNavBar";
import Loader from "react-loader-spinner";

class ManagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_clients: [],
      all_info: [],
      selected_client: "",
      selected_client_accts: [],
      selected_acct: "",
      selected_acct_transactions: [],
      num_clients: 0,
      num_accounts: 0,
      num_transactions: 0,
    };
    this.selected_client = this.selected_client.bind(this);
  }
  selected_client(e) {
    this.setState({ selected_client: e.target.value });
  }
  async getClientsAndAccts() {
    try {
      const res1 = await this.state.axiosInstance.get(
        "/client_account_statistics/"
      );
      this.setState({ all_info: res1.data });
      res1.data.forEach((element) =>
        this.state.all_clients.push(element.email)
      );
      //this.setState({ accounts: res1.data[0].accounts });
      //console.log(res1.data);
      console.log(this.state.all_clients);
      //return res1;
    } catch (error) {
      throw error;
    }
  }

  async getBankStats() {
    try {
      const res2 = await this.state.axiosInstance.get("/bank_statistics/");
      //console.log(res2);
      this.setState({ num_accounts: res2.data.num_accounts });
      this.setState({ num_clients: res2.data.num_clients });
      this.setState({ num_transactions: res2.data.num_transactions });
      console.log(this.state.num_accounts);
    } catch (error) {
      throw error;
    }
  }

  async componentDidMount() {
    this.state.axiosInstance = axiosInstance;
    await this.getClientsAndAccts();
    await this.getBankStats();
    this.setState({ loading: false });
  }

  render() {
    let client_email = this.state.all_clients.map((v) => (
      <option value={v}>{v}</option>
    ));
    return (
      <div className="managerdashboard">
        <ManagerNavigationBar />
        <div className="statistics">
          <label for="client-stats">Clients</label>
          <span id="client-stats" class="badge badge-secondary">
            {this.state.num_clients}
          </span>
          <label for="account-stats">Accounts</label>
          <span id="account-stats" class="badge badge-secondary">
            {this.state.num_accounts}
          </span>
          <label for="transaction-stats">Transactions</label>
          <span id="transaction-stats" class="badge badge-secondary">
            {this.state.num_transactions}
          </span>
        </div>

        <div className="search-area">
          <div class="input-group-prepend">
            <label class="input-group-text" for="clients">
              Clients
            </label>
          </div>
          <select class="custom-select" id="clients">
            <option value="defaultVal" disabled selected>
              Select Client
            </option>
            {client_email}
          </select>

          <div class="input-group-prepend">
            <label class="input-group-text" for="accounts">
              Accounts
            </label>
          </div>
          <select class="custom-select" id="accounts">
            <option value="defaultVal" disabled selected>
              Select Account
            </option>
            {}
          </select>
        </div>

        <div className="query-results"></div>
      </div>
    );
  }
}
export default ManagerDashboard;
