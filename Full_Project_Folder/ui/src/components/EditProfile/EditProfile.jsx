import React, { useState } from 'react';
import './EditProfile.css';
import UserNavigationBar from '../UserNavBar/UserNavBar';
import Logo from '../Logo';
import { Link, withRouter, Redirect } from 'react-router-dom';
import axiosInstance from '../../axios';
import Loader from 'react-loader-spinner';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            address: '',
            city: '',
            region: '',
            zipcode: '',
            phone_number: '',
            birthday: '',

            other_accts: [],

            err_firstname: '',
            err_lastname: '',
            err_email: '',
            err_address: '',
            err_city: '',
            err_region: '',
            err_zipcode: '',
            err_phone_number: '',
            err_birthday: '',
            loading: true,
        };

        this.firstname = this.firstname.bind(this);
        this.lastname = this.lastname.bind(this);
        this.email = this.email.bind(this);
        this.address = this.address.bind(this);
        this.city = this.city.bind(this);
        this.region = this.region.bind(this);
        this.zipcode = this.zipcode.bind(this);
        this.phone_number = this.phone_number.bind(this);
        this.birthday = this.birthday.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getClient() {
        const response = await axiosInstance.get();
    }

    async getClient() {
        try {
            const res2 = await axiosInstance.get(`/clients`);
            const loaded_client = res2.data;

            this.setState({ firstname: loaded_client.first_name });
            this.setState({ lastname: loaded_client.last_name });
            this.setState({ email: loaded_client.email });
            this.setState({ address: loaded_client.address });
            this.setState({ city: loaded_client.city });
            this.setState({ region: loaded_client.state });
            this.setState({ zipcode: loaded_client.zipcode });
            this.setState({ phone_number: loaded_client.phone_num });
            this.setState({ birthday: loaded_client.birthday });

            return res2;
        } catch (error) {
            throw error;
        }
    }

    // To check other user's emails (can't be the same!!!)
    async getOtherAccounts() {
        try {
            const res2 = await axiosInstance.get(`/all_clients/`);

            const loaded_accounts = res2.data;

            this.setState({ other_accts: loaded_accounts });

            return res2;
        } catch (error) {
            throw error;
        }
    }
    async componentDidMount() {
        const client = await this.getClient();
        const other_accounts = await this.getOtherAccounts();
        this.setState({ loading: false });

        for (var i = 0; i < this.state.other_accts.length; i++) {
            console.log(this.state.other_accts[i]);
        }
    }

    firstname(e) {
        this.setState({ firstname: e.target.value, err_firstname: '' });
    }

    lastname(e) {
        this.setState({ lastname: e.target.value, err_lastname: '' });
    }

    email(e) {
        this.setState({ email: e.target.value, err_email: '' });
    }

    address(e) {
        this.setState({ address: e.target.value, err_address: '' });
    }

    city(e) {
        this.setState({ city: e.target.value, err_city: '' });
    }

    region(e) {
        this.setState({ region: e.target.value, err_region: '' });
    }

    zipcode(e) {
        this.setState({ zipcode: e.target.value, err_zipcode: '' });
    }

    phone_number(e) {
        this.setState({ phone_number: e.target.value, err_phone_number: '' });
    }

    birthday(e) {
        this.setState({ birthday: e.target.value, err_birthday: '' });
    }

    calculate_age = (date) => {
        var today = new Date();
        var birth_date = this.state.birthday;
        var age_now = today.getFullYear() - birth_date.getFullYear();
        var m = today.getMonth() - birth_date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth_date.getDate())) {
            age_now--;
        }
        console.log('my age', age_now);
        return age_now;
    };




    handleSubmit(e) {
        if (this.state.firstname.match(/^[a-zA-Z ]{2,40}$/gm) == null) {
            e.preventDefault();
            this.setState({
                err_firstname: 'Please omit any special characters and keep it between 2 and 40 characters long',
            });
        }

        if (this.state.lastname.match(/^[a-zA-Z ]{2,40}$/gm) == null) {
            e.preventDefault();
            this.setState({
                err_lastname: 'Please omit any special characters and keep it between 2 and 40 characters long',
            });
        }

        if (
            this.state.email.match(
                /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/gm
            ) == null
        ) {
            e.preventDefault();
            this.setState({
                err_email:
                    'Not a valid email address',
            });
        } else if (
            this.state.other_accts.some(
                (acct) => acct.email === this.state.email
            )
        ) {
            e.preventDefault();
            this.setState({
                err_email: 'This email is already in use. Please try again with a different email address.',
            });
        }

        if (this.state.address.match(/^[.#0-9a-zA-Z ]{2,50}$/gm) == null) {
            e.preventDefault();
            this.setState({
                err_address: 'Please omit any special characters and ensure the address is between 2 and 50 characters long',
            });
        }

        if (
            this.state.city.match(
                /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']{2,40}$/gm
            ) == null
        ) {
            e.preventDefault();
            this.setState({
                err_city:
                    'Please omit any special characters and ensure the name is between 2 and 40 characters long.',
            });
        }

        if (this.state.region == '') {
            e.preventDefault();
            this.setState({
                err_region:
                    'Must select a U.S. State/Territory',
            });
        }

        if (this.state.zipcode.length != 5) {
            e.preventDefault();
            this.setState({
                err_zipcode: 'Not a valid U.S. zipcode. Please make sure it is 5 digits long',
            });
        }

        if (
            this.state.phone_number.toString().length != 10 && this.state.phone_number.toString().length != 11
        ) {
            e.preventDefault();
            this.setState({
                err_phone_number:
                    'The provided number is not valid. The country code is optional.'
            });
        }

        const getAge = Math.floor(
            (new Date() - new Date(this.state.birthday).getTime()) / 3.15576e10
        );

        if (this.state.birthday == '' || getAge <= 17) {
            this.setState({
                err_birthday: 'You must be at least 18 years old to join.',
            });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.props.history);
        this.props.history.push('/userdashboard/');
        if (
            this.state.err_address == '' &&
            this.state.err_birthday == '' &&
            this.state.err_city == '' &&
            this.state.err_email == '' &&
            this.state.err_firstname == '' &&
            this.state.err_lastname == '' &&
            this.state.err_phone_number == '' &&
            this.state.err_region == '' &&
            this.state.err_zipcode == ''
        ) {
            const id = localStorage.getItem('user_id');
            console.log(this.state.firstname);
            console.log(this.state.lastname);
            console.log(this.state.email);
            console.log(this.state.address);
            console.log(this.state.city);
            console.log(this.state.region);
            console.log(this.state.zipcode);
            console.log(this.state.phone_number);
            console.log(this.state.birthday);
            const response = axiosInstance.post(`clients/${id}/edit_client/`, {
                first_name: this.state.firstname,
                last_name: this.state.lastname,
                email: this.state.email,
                address: this.state.address,
                city: this.state.city,
                state: this.state.region,
                zipcode: this.state.zipcode,
                phone_num: this.state.phone_number,
                birthday: this.state.birthday,
            });
        }
    };

    render() {
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
            );
        }

        console.log('Client: ' + this.state.email);
        console.log('Accounts: ' + this.state.other_accts);

        return (
            <div className="EditProfile">
                <UserNavigationBar active={4} />
                <div className="header-editprofile">Edit Profile</div>
                <form className="form" onSubmit={this.onSubmit}>
                    <input
                        className="form-control"
                        name="firstname"
                        label="Firstname"
                        id="firstname"
                        placeholder="First Name"
                        value={this.state.firstname}
                        onChange={this.firstname}
                    />
                    <h6 className="error">{this.state.err_firstname}</h6>
                    <input
                        className="form-control"
                        name="lastname"
                        id="lastname"
                        label="Lastname"
                        placeholder="Last Name"
                        value={this.state.lastname}
                        onChange={this.lastname}
                    />
                    <h6 className="error">{this.state.err_lastname}</h6>
                    <input
                        className="form-control"
                        name="email"
                        id="email"
                        label="email"
                        placeholder="Email Address"
                        value={this.state.email}
                        onChange={this.email}
                    />
                    <h6 className="error">{this.state.err_email}</h6>
                    <input
                        className="form-control"
                        type="address"
                        name="address"
                        id="address"
                        label="address"
                        placeholder="Address"
                        value={this.state.address}
                        onChange={this.address}
                    />
                    <h6 className="error">{this.state.err_address}</h6>
                    <input
                        className="form-control"
                        type="city"
                        name="city"
                        id="city"
                        label="city"
                        placeholder="City"
                        value={this.state.city}
                        onChange={this.city}
                    />
                    <h6 className="error">{this.state.err_city}</h6>
                    <select
                        className="form-control"
                        type="region"
                        name="region"
                        id="region"
                        label="region"
                        placeholder="Region"
                        value={this.state.region}
                        onChange={this.region}
                    >
                        <option value="" hidden={true}>U.S. State/Territory</option>
                        <optgroup label="States">
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Deleware</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LS">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </optgroup>
                        <optgroup label="U.S. Territories">
                            <option value="DC">Washington D.C.</option>
                            <option value="AS">American Samoa</option>
                            <option value="GU">Guam</option>
                            <option value="MP">Northern Mariana Islands</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="VI">U.S. Virgin Islands</option>
                        </optgroup>
                     </select>
                    <h6 className="error">{this.state.err_region}</h6>
                    <input
                        className="form-control"
                        type="number"
                        name="zipcode"
                        id="zipcode"
                        label="zipcode"
                        placeholder="Zipcode"
                        value={this.state.zipcode}
                        onChange={this.zipcode}
                    />
                    <h6 className="error">{this.state.err_zipcode}</h6>
                    <input
                        className="form-control"
                        type="number"
                        name="phone_number"
                        id="phone_number"
                        label="phone_number"
                        placeholder="Phone Number"
                        value={this.state.phone_number}
                        onChange={this.phone_number}
                    />
                    <h6 className="error">{this.state.err_phone_number}</h6>
                    <input
                        className="form-control"
                        type="date"
                        name="birthday"
                        id="birthday"
                        label="birthday"
                        placeholder="Birthday"
                        value={this.state.birthday}
                        onChange={this.birthday}
                    />
                    <h6 className="error">{this.state.err_birthday}</h6>
                    <button
                        className="editprofile-btn btn btn-primary"
                        type="submit"
                        onSubmit={this.onSubmit}
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(EditProfile);
