import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { actFetchCategoriesRequest,actDeleteCategoryRequest } from '../../../redux/actions/category';
import MyFooter from '../../MyFooter/MyFooter'
import Paginator from 'react-js-paginator';

const MySwal = withReactContent(Swal)

let token;

class Category extends Component {
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
  fetch_reload_data(){
    this.props.fetch_categories()
    .catch(err => {
      console.log(err);  
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
  handleRemove = (id,name) => {
    MySwal.fire({
      title: `Xóa loại sản phẩm ${name} ?`,
      text: "Bạn chắc chắn muốn xóa loại sản phẩm này !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng',
      cancelButtonText: 'Thoát'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_category(id);
        Swal.fire(
          'Đã xóa!',
          `Loại sản phẩm ${name} của bạn đã được xóa.`,
          'success'
        )
      }
    })
  }


  render() {
    let { categories } = this.props;
    console.log(categories)
    const { searchText, total } = this.state;
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Loại sản phẩm</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Loại sản phẩm</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Dữ liệu loại sản phẩm</h3>
                    {/* <button  style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
                  </div>
                  <form 
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    {/* <div>
                      <i className="fa fa-search" aria-hidden="true"></i>
                      <input
                        name="searchText"
                        onChange={this.handleChange}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div> */}
                    <Link to="/categories/add" className="btn btn-primary" > Thêm mới</Link>
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th style={{ textAlign: "center" }}>Tên</th>
                            {/* <th>Hình ảnh</th> */}
                            <th style={{ textAlign: "center" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories && categories.length ? categories.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td style={{ textAlign: "center" }}>{item.categoryName}</td>
                                {/* <td style={{ textAlign: "center" }}>
                                    <div className="fix-cart2">
                                      <img src="./img/logo/icon.png" className="fix-img2" alt="avatar" />
                                    </div>                 
                                </td> */}
                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`categories/edit/${item.categoryId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.categoryId,item.categoryName)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                 
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
                  
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}
       
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_categories: () => {
      return dispatch(actFetchCategoriesRequest())
    },
    delete_category: (id) => {
      dispatch(actDeleteCategoryRequest(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)


