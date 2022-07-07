import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import callApi from '../../../utils/apiCaller';
import {  actEditUserRequest } from '../../../redux/actions/user';
import { Redirect } from 'react-router-dom';
import { uploadImage } from '../../../utils/upload'
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';



let id;
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
class ActionUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: '',
            firstName:'',
            userCustomer: '',
            gmailCustomer: '',
            phoneNumber: '',
            address: '',
            redirectToUser: false,
            loading: false
        };
        id = this.props.id
    }
    async componentDidMount() {
        if (id) {
            const res = await callApi(`customer/${id}`, 'GET');
            console.log("user",res.data)
            this.setState({
                lastName: res.data.lastName,
                firstName:res.data.firstName,
                userCustomer: res.data.userCustomer,
                gmailCustomer: res.data.gmailCustomer,
                phoneNumber: res.data.phoneNumberCustomer,
                address: res.data.address

            })
        }
    }



    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { lastName, firstName, phoneNumber, address } = this.state;
        this.setState({
            loading: true
        })
        const newAddress = (address === '') ? null : address
        const newPhone = (phoneNumber === '') ? null : phoneNumber
        const newlastName = (lastName === '') ? null : lastName
        const newfirstName = (firstName === '') ? null : firstName
        if (id) {
            const editUser = {
                lastname: newlastName,
                firstname: newfirstName,
                phoneNumber: newPhone,
                address: newAddress
            }
           
            await this.props.edit_user(id, editUser);
            this.setState({
                loading: false,
                redirectToUser: true
            })
        }
    }


    render() {
        const {firstName,lastName ,gmailCustomer, phoneNumber, address, redirectToUser, loading } = this.state;
        if (redirectToUser) {
            return <Redirect to="/customers"></Redirect>
        }
        return (
            <div className="content-inner">
                {/* Page Header*/}
                <div className='sweet-loading'>
                    <ClipLoader
                        css={override}
                        sizeUnit={"px"}
                        size={30}
                        color={'#796aeebd'}
                        loading={loading}
                    />
                </div>
                <header className="page-header">
                    <div className="container-fluid">
                        <h2 className="no-margin-bottom">Trang người dùng</h2>
                    </div>
                </header>
                {/* Breadcrumb*/}
                <div className="breadcrumb-holder container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/customer">trang chủ</Link></li>
                        <li className="breadcrumb-item active">người dùng</li>
                    </ul>
                </div>
                {/* Forms Section*/}
                <section className="forms">
                    <div className="container-fluid">
                        <div className="row">
                            {/* Form Elements */}
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header d-flex align-items-center">
                                        <h3 className="h4">Thông tin người dùng</h3>
                                    </div>
                                    <div className="card-body">
                                        <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)}>
                                            <div className="form-group row">
                                                <label className="col-sm-1 form-control-label">Họ và tên đệm</label>
                                                <div className="col-sm-2">
                                                    <input type="text" onChange={this.handleChange} name="firstName" value={firstName} className="form-control" />
                                                </div>
                                                <label className="col-sm-1 form-control-label">Tên</label>
                                                <div className="col-sm-2">
                                                    <input type="text" onChange={this.handleChange} name="lastName" value={lastName} className="form-control" />
                                                </div>
                                                <label className="col-sm-1 form-control-label" style={{ textAlign: 'center' }}>Địa chỉ</label>
                                                <div className="col-sm-5">
                                                    <input type="text" onChange={this.handleChange} name="address" value={address} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="line" />
                                            <div className="form-group row">
                                                <label className="col-sm-3 form-control-label">Sđt</label>
                                                <div className="col-sm-3">
                                                    <input type="text" onChange={this.handleChange} name="phoneNumber" value={phoneNumber} className="form-control" />
                                                </div>
                                                <label className="col-sm-3 form-control-label" style={{ textAlign: 'center' }}>Email</label>
                                                <div className="col-sm-3">
                                                    <input type="email" onChange={this.handleChange} name="gmailCustomer" value={gmailCustomer} disabled className="form-control" />
                                                </div>
                                            </div>
                                            <div className="line" />
                                            <div className="form-group row">
                                                <div className="col-sm-4 offset-sm-3">
                                                    <Link to='/customers' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
                                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Page Footer*/}
                
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        edit_user: (id, data) => {
            dispatch(actEditUserRequest(id, data))
        }
    }
}
export default connect(null, mapDispatchToProps)(ActionUser)
