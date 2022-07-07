import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchUsersRequest,actDeleteUserRequest } from '../../../redux/actions/user';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Paginator from 'react-js-paginator';

const MySwal = withReactContent(Swal)


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      currentPage: 1
    }
  }

  componentDidMount() {
    this.fetch_reload_data();
  }

  fetch_reload_data() {
    this.props.fetch_users().then(res => {
      this.setState({
        total: res.totalPage
      });
    }).catch(err => {
      console.log(err);
    })
  }
  pageChange(content) {
    const page = content;
    this.props.fetch_users(page);
    this.setState({
      currentPage: content
    })
    window.scrollTo(0, 0);
  }

  handleRemove = (id,name) => {
    console.log("id",id)
    MySwal.fire({
      title: 'Xóa?',
      text: `Bạn chắc chắn xóa tài khoản  ! ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có',
      cancelButtonText:'Không'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_user(id);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
   
  }

  // downloadExcel = () => {
  //   const key = 'users'
  //   exportExcel(key)
  // }

  render() {
    let { users } = this.props;
    const { searchText, total } = this.state;
    console.log("user nè",users)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Khách hàng</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">khách hàng</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Dữ liệu khách hàng</h3>
                    {/* <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
                  </div>
                  {/* <form onSubmit={(event) => this.handleSubmit(event)}
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
                            <th>STT</th>
                            <th>Email</th>
                            <th>Tên khách hàng</th>
                            <th style={{ textAlign: "center" }}>Tên đăng nhập</th>
                            <th style={{ textAlign: "center" }}>SĐT</th>
                            <th style={{ textAlign: "center" }}>Địa chỉ</th>
                            <th style={{ textAlign: "center" }}>Chức năng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users && users.length ? users.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.gmailCustomer}</td>
                                <td>{item.lastName}</td>
                                <td>{item.userCustomer}</td>
                                <td>{item.phoneNumberCustomer}</td>
                                <td>{item.address}</td>
                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/customers/edit/${item.customerId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.customerId,item.fullnameCustomer)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
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
    users: state.users
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_users: (page) => {
      return dispatch(actFetchUsersRequest(page))
    },
    delete_user: (id) => {
      dispatch(actDeleteUserRequest(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)