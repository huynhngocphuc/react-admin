import React, { Component } from 'react'
import { connect } from 'react-redux'
import callApi from '../../../utils/apiCaller';
// import { actAddOrderRequest, actGetOrderRequest, actEditOrderRequest } from '../../../redux/actions/order';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

let id;

class ActionOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameCustomer: '',
            orderId: '',
            totalAmount: 0,
            itemAmount: 0,
            dataOrderDetails: []
        };
        id = this.props.id


    }

    async componentDidMount() {
        if (id) {
            const res = await callApi(`orders/detail/${id}`, 'GET');
            
            const resOrderDetails = res.data.list
            console.log("danh sách sản phẩm", res.data)
            this.setState({
                nameCustomer: res.data.nameCustomer,
                orderId: res.data.id,
                totalAmount: res.data.totalAmount,
                itemAmount: resOrderDetails.length,
                dataOrderDetails: resOrderDetails
            })
        } else {

            this.setState({
                nameCustomer: '',
                orderId: '',
                totalAmount: 0,
                itemAmount: 0,
                dataOrderDetails: []
            })
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
    }

  




    render() {
        const { nameCustomer, orderId, totalAmount, itemAmount, dataOrderDetails } = this.state;
        let orderDetailAmount = 0;
        const { history } = this.props
        console.log("props trong action", history)
        console.log(dataOrderDetails)
        
        return (

            <div className="content-inner">
                {/* Page Header*/}
                <header className="page-header">
                    <div className="container-fluid">
                        <h2 className="no-margin-bottom">Form Order</h2>
                    </div>
                </header>
                {/* Breadcrumb*/}
                <div className="breadcrumb-holder container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
                        <li className="breadcrumb-item active">Đơn hàng</li>
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
                                        <h3 className="h4">Thông tin</h3>
                                    </div>
                                    <div className="card-body">
                                        <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                                            <div className="form-group row">
                                                <label className="col-sm-3 form-control-label">Tên khách hàng</label>
                                                <div className="col-sm-9">
                                                    <input type="text" name="nameCustomer" value={nameCustomer} onChange={this.handleChange} className="form-control" />
                                                </div>
                                            </div>

                                            {
                                                id ?
                                                    <div>
                                                        <div className="line" />
                                                        <div className="form-group row">
                                                            <label className="col-sm-3 form-control-label" style={{ paddingTop: 50 }}>Sản phẩm</label>
                                                            <div className="col-sm-9">
                                                                <div className="card-body">
                                                                    <div className="table-responsive">
                                                                        <table className="table table-hover">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>STT</th>
                                                                                    <th>Sản phẩm</th>
                                                                                    <th>Hình</th>
                                                                                    <th>Số lượng</th>
                                                                                    <th>Giá </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {dataOrderDetails && dataOrderDetails.length ? dataOrderDetails.map((item, index) => {
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <th scope="row">{index + 1}</th>
                                                                                            <td>{item.nameProduct}</td>
                                                                                            <td>
                                                                                                <div className="fix-cart">
                                                                                                    <img src={item && item.productImageSet >0 ? item.productImageSet[0].image : null} className="fix-img" alt="not found" />
                                                                                                </div>
                                                                                            </td>
                                                                                            <td>{item.quantity}</td>
                                                                                            <td>{item.amount}</td>
                                                                                        </tr>
                                                                                    )
                                                                                }) : null}
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td></td>
                                                                                    <td><b style={{ fontSize: 16 }}>Tổng tiền: </b></td>
                                                                                    <td>
                                                                                        <b style={{ fontSize: 16 }}>
                                                                                            {
                                                                                                totalAmount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                                                                                            }
                                                                                        </b></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <div className="line" />
                                                        <div className="form-group row">
                                                            <label className="col-sm-3 form-control-label">Item Amount</label>
                                                            <div className="col-sm-3">
                                                                <input name="itemAmount" value={itemAmount} onChange={this.handleChange} type="number" className="form-control" />
                                                            </div>
                                                            <label className="col-sm-3 form-control-label" style={{ textAlign: 'center' }}>Shipping Total</label>

                                                        </div>
                                                    </div>
                                            }

                                            <div className="line" />
                                            <div className="form-group row">
                                                <div className="col-sm-4 offset-sm-3">
                                                    <button onClick={() => history.goBack()} className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</button>

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


export default (ActionOrder)
