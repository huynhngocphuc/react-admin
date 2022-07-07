import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProducersRequest,actDeleteProducerRequest} from '../../../redux/actions/producer';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Paginator from 'react-js-paginator';
const MySwal = withReactContent(Swal)



class Producer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      currentPage: 1
    }
  }

  componentDidMount() {
    this.fetch_reload_data(); //recive data from return promise dispatch
  }
  fetch_reload_data() {

    this.props.fetch_producers()
      .catch(err => {
        console.log(err);
      })
  }
  handleRemove = (id,name) => {
    MySwal.fire({
      title: `Xóa nhà cung cấp ${name} ?`,
      text: "Bạn chắc chắn muốn xóa nhà cung cấp này !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_producer(id);
        Swal.fire(
          'Đã xóa!',
          `Nhà cung cấp ${name} của bạn đã được xóa.`,
          'success'
        )
      }
    })
  }
  render() {
    let { producers } = this.props;
    const { searchText, total } = this.state;
    console.log("dữ liệu nhà cung cấp",producers)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Nhà cung cấp</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Nhà cung cấp</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Dữ liệu nhà cung cấp</h3>
                    {/* <button style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                      style={{ fontSize: 18, color: '#1d7044' }}> Excel</i></button> */}
                  </div>
                  <form
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    {/* <div>
                      <button style={{ border: 0, background: 'white' }}><i className="fa fa-search" aria-hidden="true"></i></button>
                      <input name="searchText"
                        onChange={this.handleChange}

                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div> */}
                    <Link to="/producers/add" className="btn btn-primary" > Thêm mới</Link>
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Hình ảnh</th>
                            <th style={{ textAlign: "center" }}>Chức năng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {producers && producers.length ? producers.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.supplierName}</td>
                                <td style={{ textAlign: "center" }}>
                                  <div className="fix-cart">
                                    <img src={item && item.supplierImage ?item.supplierImage:null} className="fix-img" alt="not found" />
                                  </div>
                                </td>

                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`producers/edit/${item.supplierId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span
                                      onClick={() => this.handleRemove(item.supplierId,item.supplierName)}
                                      title='Delete'
                                      className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
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
                      pageSize={10}
                      totalElements={total}
                      onPageChangeCallback={(e) => { this.pageChange(e) }}
                    />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>

      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    producers: state.producers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_producers: () => {
      return dispatch(actFetchProducersRequest())
    },
    delete_producer: (id, token) => {
      dispatch(actDeleteProducerRequest(id, token))
    }

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Producer)