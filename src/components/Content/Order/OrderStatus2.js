import React, { Component } from 'react'
import './style.css'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { actFetchOrdersRequest, actDeliveredOrderRequest, actDeleteOrderRequest } from '../../../redux/actions/order';
import { actFetchDashboardRequest} from '../../../redux/actions/dashboard'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Paginator from 'react-js-paginator';
import { css } from '@emotion/core';
const MySwal = withReactContent(Swal)
let status;
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
class OrderStatus2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      currentPage: 1,
      statusPage: 'Đã duyệt',
      redirectToProduct: false
    }

  }
  componentDidMount() {
    const { statusPage } = this.state
    this.fetch_reload_data(statusPage);
  }

  fetch_reload_data(statusPage) {
    this.props.fetch_orders(statusPage).then(res => {
      this.setState({
        total: res.totalPage
      });
    }).catch(err => {
      console.log(err);
    })
  }

  pageChange(content) {
    const page = content;
    const { statusPage } = this.state
    this.props.fetch_orders(statusPage, page);
    if (content <= 0) {

      this.setState({
        currentPage: 1
      })
    }
    else {
      this.setState({
        currentPage: content
      })

    }

    window.scrollTo(0, 0);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleBrowse = async (event) => {
    const id = event.target.value;
    const { statusPage, currentPage } = this.state
    await this.props.deliveredOrder(id, statusPage, currentPage);
    await this.props.fetch_dashboard();

  }
  handleRemove = (id) => {
    MySwal.fire({
      title: 'Xóa đơn hàng?',
      text: `Bạn chắc chắn xóa đơn hàng ${id}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_order(id);
        Swal.fire(
          'Xóa!',
          'Đơn hàng của bạn đã được xóa.!',
          'success'
        )
      }
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { orders } = this.props;
    console.log("dữ liệu this.props.", this.props)
    const { searchText, total, statusPage } = this.state;

    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Đơn hàng</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Đơn hàng</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Đơn hàng đang giao</h3>
                    {/* <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
                  </div>
                  {/* <form
                    onSubmit={(event) => this.handleSubmit(event)}
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    <div>
                      <button style={{ border: 0, background: 'white' }}><i className="fa fa-search" aria-hidden="true"></i></button>
                      <input
                        name="searchText"
                        onChange={this.handleChange}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div>

                  </form> */}
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>id đơn hàng</th>
                            <th>Tên khách hàng</th>
                            {/* <th>Address</th> */}
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>

                            <th>Tổng tiền</th>
                            <th>Ngày tạo HĐ</th>
                            <th>Chi tiết</th>
                            <th>Duyệt

                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders && orders.length ? orders.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{item.orderId}</th>
                                <td>{item.customerFKDto.lastName}</td>
                                <td>{item.phoneNumber}</td>
                                <td>
                                  <div className="col">
                                    <label className="fix-status px-2  bg-warning" >{item.statusOrder}
                                    </label>
                                  </div> </td>
                                <td>{item.totalAmount}</td>
                                <td>
                                  <Moment format="YYYY/MM/DD">
                                    {item.createDate}
                                  </Moment>
                                </td>
                                <td>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/orders/edit/${item.orderId}`}> <i className="fa fa-edit"></i></Link></span>

                                    <span title='Delete' onClick={() => this.handleRemove(item.orderId)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                </td>
                                <td>
                                  <button className="btn btn-primary" value={item.orderId} onClick={this.handleBrowse} > Giao hàng</button>
                                </td>
                              </tr>
                            )
                          }) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <nav aria-label="Page navigation example" style={{ float: "right" }}>
                  <ul className="pagination">
                    <Paginator
                      pageSize={1}
                      totalElements={total}
                      onPageChangeCallback={(e) => { this.pageChange(e) }}
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_orders: (status, offset) => {
      return dispatch(actFetchOrdersRequest(status, offset))
    },
    fetch_dashboard: () => {
      dispatch(actFetchDashboardRequest())
    },
    deliveredOrder: (id, status, page) => {
      return dispatch(actDeliveredOrderRequest(id, status, page))
    },
    delete_order: (id) => {
      dispatch(actDeleteOrderRequest(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatus2)
