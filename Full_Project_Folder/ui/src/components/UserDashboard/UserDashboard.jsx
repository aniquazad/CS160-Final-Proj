import React, { useState } from 'react';
import './UserDashboard.css';
import Logo from '../Logo';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from '../../axios';
import UserNavigationBar from '../UserNavBar/UserNavBar';
import Loader from "react-loader-spinner";

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            firstName: '',
            checkingAccount: '',
            savingAccount: '',
            checkingBalance: '',
            savingBalance: '',
            accts: [],
            axiosInstance: null,
            email: '',
            loading: true
        };
    }
    async getAccounts() {
        try {
            const res = await this.state.axiosInstance.get('/accounts');
            console.log(res.data);
            const d = res.data;
            this.setState({ accts: d });
            console.log(d);
            return res;
        } catch (error) {
            // console.log("Header AFTER: " + this.state.axiosInstance.defaults.headers['Authorization'])
            console.log('Hello error: ', JSON.stringify(error, null, 4));
            // throw error; todo
        }
    }

    async getClients() {
        try {
            const res2 = await this.state.axiosInstance.get('/clients');
            this.state.email = localStorage.getItem('email');
            let users = res2.data;
            this.setState({ firstName: users.first_name });
            // for (var index = 0; index < localStorage.getItem('user'); index++) {
            //     console.log(localStorage.getItem('user').email)
            // }
            // console.log("Header AFTER: " + this.state.axiosInstance.defaults.headers['Authorization'])

            return res2;
        } catch (error) {
            // console.log("Header: " + axiosInstance.defaults.headers['Authorization'])
            // console.log("Hello Client error: ", JSON.stringify(error, null, 4));
            throw error;
        }
    }

    async setID(){
        try {
            const res2 = await this.state.axiosInstance.get('/clients')
            this.setState({ id: res2.data.id });
            // for (var index = 0; index < localStorage.getItem('user'); index++) {
            //     console.log(localStorage.getItem('user').email)
            // }
            // console.log("Header AFTER: " + this.state.axiosInstance.defaults.headers['Authorization'])
            return res2
        } catch(error){
            // console.log("Header: " + axiosInstance.defaults.headers['Authorization'])
            // console.log("Hello Client error: ", JSON.stringify(error, null, 4));
            throw error
        }
    }
    async componentDidMount() {
        this.state.axiosInstance = axiosInstance
        console.log("Header AFTER: " + this.state.axiosInstance.defaults.headers['Authorization'])
        const clients = await this.getClients()
        const accounts = await this.getAccounts()
        const iD = await this.setID()
        this.setState({ loading: false }) 
    }
    
    render() {
        localStorage.setItem('user_id', this.state.id);
        
        let acctTemplate = this.state.accts.map((v) => (
            <div key={v.account_num} className="acctBox">
                <div className={v.account_type} id="acct-info">
                    {v.account_type} ${v.balance}
                    <div id="bal">{v.account_num} Balance</div>
                </div>
            </div>
        ));
        const { name, saving, checking } = this.state;
        // console.log(localStorage)

        if (this.state.loading) {
            return (
                <div>
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>
            )
        }

        return (
            <div className="userdashboard">
                <UserNavigationBar active={0} />
                <div className="container-userdash">
                    <div id="greeting-userdash">
                        Welcome to your dashboard, {this.state.firstName}!
                    </div>
                    <div id="greeting-userdash2">Personal Accounts</div>
                    <Link to="/Account" id="acct-temp-link">
                        {acctTemplate}
                    </Link>
                </div>
            </div>
        );
    }
}
export default UserDashboard;
