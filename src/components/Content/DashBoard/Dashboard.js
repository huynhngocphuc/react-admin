import React, { Component } from 'react'
import MyFooter from '../../MyFooter/MyFooter'
import { actFetchDashboardRequest, actFetchRevenueRequest, actFetchBestSellingProductRequest } from '../../../redux/actions/dashboard'
import { connect } from 'react-redux'
import { formatNumber } from '../../../config/TYPE'
import { toast } from "react-toastify";
import Paginator from 'react-js-paginator';
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './style.css'
const MySwal = withReactContent(Swal)


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      startDateRevenue: new Date(),
      endDateRevenue: new Date(),
      monthNow: new Date(),
      valueRevenue: 0,
      total: 0,
      currentPage: 1
    }
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetch_dashboard();
  }
  handleChangeDate(date, name) {
    console.log(date, name)
    this.setState({
      [name]: date
    })
  }
  pageChange(content) {
    const { startDateRevenue, endDateRevenue } = this.state
    const page = content;
    const from = startDateRevenue.getFullYear() + "-" + (startDateRevenue.getMonth() + 1) + "-" + startDateRevenue.getDate() + " " + "00:00:00";
    const to = endDateRevenue.getFullYear() + "-" + (endDateRevenue.getMonth() + 1) + "-" + endDateRevenue.getDate() + " " + "00:00:00";
    const dataSend = { from, to }
    this.props.fetch_bestselling(dataSend, page);
    this.setState({
      currentPage: content
    })
    window.scrollTo(0, 700);

  }


  async onFormSubmit(e) {
    e.preventDefault();

    const { startDateRevenue, endDateRevenue } = this.state
    const dateNow = new Date();
 
    

    const from = startDateRevenue.getFullYear() + "-" + (startDateRevenue.getMonth() + 1) + "-" + startDateRevenue.getDate() + " " + "00:00:00";
    const to = endDateRevenue.getFullYear() + "-" + (endDateRevenue.getMonth() + 1) + "-" + endDateRevenue.getDate() + " " + "23:50:00";
    const dateCurent = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate() + " " + "23:58:00";
   if((new Date(from).getTime()) >= (new Date(to).getTime()))
   {
     toast.error('Ngày bắt đầu nhỏ hơn ngày kết thúc')
     return;
   }
   if((new Date(from).getTime()) >= (new Date(dateCurent).getTime()))
   {
     toast.error('Ngày bắt đầu nhỏ hơn ngày hôm nay')
     return;
   }
   if((new Date(to).getTime()) > (new Date(dateCurent).getTime()))
   {
     toast.error('Ngày kết thúc nhỏ hơn hoặc bằng hiện tại')
     return;
   }
   
    const dataSend = { from, to }
    await this.props.fetch_revenue(dataSend)
    this.props.fetch_bestselling(dataSend).then(
      res => {
        this.setState({
          total: res.totalPage
        });
      }
    )

    // const res = await callApi('statistic/revenue','POST',dataSend)
    // if(res && res.status===200){
    //   this.setState({valueRevenue:res.data })
    // }

  }


  render() {


    const { dashboard, revenueSearch, productSelling } = this.props
    const { startDateRevenue, endDateRevenue, total, monthNow } = this.state
    console.log("tổng", revenueSearch, productSelling.products)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Trang chủ</h2>
          </div>
        </header>
        {/* Dashboard Counts Section*/}
        <section className="dashboard-counts no-padding-bottom">
          <div className="container-fluid">
            <div className="row bg-white has-shadow">
              {/* Item */}
              <div className="col-xl-4 col-sm-6">
                <div className="item d-flex align-items-center">
                  <div className="icon bg-violet"><i className="icon-user" /></div>
                  <div className="title"><span>Khách<br />hàng</span>
                    <div className="progress">
                      <div role="progressbar" style={{ width: '100%', height: '4px' }} className="progress-bar bg-violet fix-processbar" />
                    </div>
                  </div>
                  <div className="number"><strong>{dashboard.numberOfCustomer}</strong></div>
                </div>
              </div>
              {/* Item */}
              <div className="col-xl-4 col-sm-6">
                <div className="item d-flex align-items-center">
                  <div className="icon bg-red"><i className="icon-padnote" /></div>
                  <div className="title"><span>Đơn<br />hàng mới</span>
                    <div className="progress">
                      <div role="progressbar" style={{ width: '100%', height: '4px' }} className="progress-bar bg-red fix-processbar" />
                    </div>
                  </div>
                  <div className="number"><strong>{dashboard.newOrders}</strong></div>
                </div>
              </div>
              {/* Item */}
              <div className="col-xl-4 col-sm-6">
                <div className="item d-flex align-items-center">
                  <div className="icon bg-green"><i className="icon-bill" /></div>
                  <div className="title"><span>Tổng<br />sản phẩm</span>
                    <div className="progress">
                      <div role="progressbar" style={{ width: '100%', height: '4px' }} className="progress-bar bg-green fix-processbar" />
                    </div>
                  </div>
                  <div className="number"><strong>{dashboard.totalProduct}</strong></div>
                </div>
              </div>
              {/* Item */}

            </div>
            <div className="row bg-white has-shadow">
              <div className="col col-sm-6">
                <div className="item d-flex align-items-center">
                  <div className="icon bg-orange"><i className="icon-check" /></div>
                  <div className="title"><span>Tổng <br />doanh thu tháng {monthNow.getMonth() + 1}</span>
                    <div className="progress">
                      <div role="progressbar" style={{ width: '100%', height: '4px' }} className="progress-bar bg-orange fix-processbar" />
                    </div>
                  </div>
                  {/* {1000.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} */}
                  <div className="number"><strong>
                    {dashboard && dashboard.revenue
                      ? dashboard.revenue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                      : 0}</strong></div>
                </div>
              </div>
            </div>

            <h3 style={{ paddingTop: 20 }}>Doanh thu theo thời gian</h3>
            <div className="row bg-white has-shadow">
              <div className="col col-sm-6">

                <form onSubmit={this.onFormSubmit}>
                  <div className='row'>
                    <div className="col-md-6">
                      <strong className='mr-2'>Từ</strong>
                      <DateTimePicker
                        onChange={(date) => this.handleChangeDate(date, 'startDateRevenue')}
                        value={startDateRevenue}
                        name='startDateRevenue'
                        format="dd/MM/y"
                      />
                    </div>
                    <div className="col-md-6">
                      <strong className='mr-2' >Đến</strong>
                      <DateTimePicker
                        onChange={(date) => this.handleChangeDate(date, 'endDateRevenue')}
                        value={endDateRevenue}
                        name='endDateRevenue'
                        format="dd/MM/y"
                      />
                    </div>

                  </div>
                  <div className='row justify-content-center'>
                    <button type='submit' className="btn btn-primary">Xem doanh thu</button>
                  </div>

                </form>
              </div>
              <div className="col col-sm-6">
                <div className="item d-flex align-items-center">
                  <div className="icon bg-orange"><i className="icon icon-bill"></i></div>
                  <div className="title"><span>Tổng <br />doanh thu</span>
                    <div className="progress">
                      <div role="progressbar" style={{ width: '100%', height: '4px' }} className="progress-bar bg-orange fix-processbar" />
                    </div>
                  </div>
                  {/* {1000.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} */}
                  <div className="number">

                    <strong>
                      {formatNumber(revenueSearch.revenue)}
                    </strong>
                  </div>
                </div>

              </div>
            </div>
            <h3 style={{ paddingTop: 20 }}>Sản phẩm bán trong thời gian</h3>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng đã bán</th>
                      {/* <th>Address</th> */}
                      <th>Ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSelling && productSelling.products ? 
                    
                    productSelling.products.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td style={{ textAlign: "center" }}>
                            <div className="fix-cart">
                              <img src={item && item.productImageSet ? item.productImageSet[0].image : null} className="fix-img" alt="not found" />
                            </div>
                          </td>
                        </tr>
                      )
                    }) 
                    : <tr>
                        <td></td>
                        <td><p style={{fontSize:"1.2rem"}}>Không có sản phẩm</p></td>
                        <td></td>
                        
                      </tr>}
                  </tbody>
                </table>
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
        </section>
        <MyFooter></MyFooter>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dashboard: state.dashboard,
    revenueSearch: state.revenue,
    productSelling: state.productsbestselling
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetch_dashboard: () => {
      dispatch(actFetchDashboardRequest())
    },
    fetch_revenue: (data) => {
      dispatch(actFetchRevenueRequest(data))
    },
    fetch_bestselling: (data, page) => {

      return dispatch(actFetchBestSellingProductRequest(data, page))
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
