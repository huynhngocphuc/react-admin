import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actGetProductOfKeyRequest, actGetProductOfCatagoryRequest } from '../../../redux/actions/product';
import { actFetchCategoriesRequest } from '../../../redux/actions/category';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from '../../MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import { is_empty } from '../../../utils/validations';
const MySwal = withReactContent(Swal)

let token;


class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      category: "All",
      dataCategory: []
    }
  }
  async componentDidMount() {
    const { currentPage } = this.state
    const res = await this.props.fetch_products(currentPage);
    const resCatagory = await this.props.fetch_catagory();
    if (res && res.status === 200) {
      this.setState({
        total: res.data.totalPage,
        currentPage: res.data.currentPage
      })
    }
    if (resCatagory && resCatagory.status == 200) {
      this.setState({
        dataCategory: resCatagory.data
      })
    }

  }
  async pageChange(content) {
    const { searchText, category,currentPage } = this.state
    const page = content;
    if (category == "All") {
      if (is_empty(searchText)) {
        this.props.fetch_products(page);
        this.setState({
          currentPage: content
        })
      }
      else {
        const res = await this.props.find_products(searchText, page)
        if (res && res.status == 200) {

          this.setState({
            currentPage: res.data.currentPage,
            total: res.data.totalPage,
          })
        }
      }
    }
    else {
      const res = await this.props.find_products_by_catagory(category,page)
      if (res && res.status == 200) {
        this.setState(
          {
            currentPage: res.data.currentPage,
            total: res.data.totalPage
          }
        )
      }

    }

    window.scrollTo(0, 0);

  }
  handleRemove = (id, name) => {
    MySwal.fire({
      title: `Xóa sản phẩm ${name} ?`,
      text: "Bạn chắc chắn muốn xóa sản phẩm này !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        await this.props.delete_product(id, token);
        Swal.fire(
          'Đã xóa!',
          'Sản phẩm của bạn đã được xóa.',
          'success'
        )
      }
    })
  }
  handleChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSearchCategory = async event => {
    const { catagory, currentPage, total } = this.state
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      category: value
    });
    
    if (value == "All") {
      
      const resdata = await this.props.fetch_products("1");
      if (resdata && resdata.status === 200) {
        this.setState({
          total: resdata.data.totalPage,
          currentPage: resdata.data.currentPage
        })
      }
    }
    else {
      const res = await this.props.find_products_by_catagory(value)
      if (res && res.status == 200) {
        
        this.setState(
          {
            currentPage: res.data.currentPage,
            total: res.data.totalPage
          }
        )
      }
    }

  }

  handleSearch = async (event) => {
    event.preventDefault();
    const { searchText } = this.state;
    const res = await this.props.find_products(searchText)
    if (res && res.status == 200) {
      this.setState({
        currentPage: res.data.currentPage,
        total: res.data.totalPage,
      })
    }
  }

  render() {
    let { products } = this.props;
    const { searchText, total, dataCategory, category, currentPage } = this.state;
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Products</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">trang chủ</Link></li>
            <li className="breadcrumb-item active">Sản Phẩm</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  {/* <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Xuất data sản phẩm</h3>
                    <button style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                      style={{ fontSize: 18, color: '#1d7044' }}> Excel</i></button>
                  </div> */}

                  <form
                    className="form-inline md-form form-sm mt-0 justify-content-between"
                    style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}
                    onSubmit={(event) => this.handleSearch(event)}
                  >
                    <div className="col-sm-">

                      {
                        dataCategory && dataCategory.length > 0 ?

                          <select className="form-control" name="category" value={category} onChange={this.handleSearchCategory}>
                            <option value="All" >All</option>
                            {

                              dataCategory.map(item => {
                                return (
                                  <option key={item.categoryId} value={item.categoryName} >{item.categoryName}</option>
                                )
                              })
                            }

                          </select>
                          :
                          <select className="form-control" name="supplierId" />


                      }
                    </div>
                    <div className='d-flex'>
                      <div>
                        <button style={{ border: 0, background: 'white' }}> <i className="fa fa-search" aria-hidden="true"></i></button>
                        <input
                          name="searchText"
                          onChange={this.handleChange}
                          className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                          aria-label="Tìm kiếm" />
                      </div>
                      <Link to='/products/add' className="btn btn-primary" >Thêm mới</Link>
                    </div>

                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Tên sản phẩm</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            {/* <th>Properties</th> */}
                            <th style={{ textAlign: "center" }}>Ảnh</th>
                            <th style={{ textAlign: "center" }}>Chức năng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products && products.length ? products.map((item, index) => {
                            return (
                              <tr key={index}>

                                <td>{item.productName}</td>
                                <td><p className="text-truncate" style={{ width: 300 }}>{item.descriptionProduct}</p></td>
                                <td>{item.unitPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                <td>{item.quantity}</td>
                                {/* <td>{item.properties}</td> */}
                                <td style={{ textAlign: "center" }}>
                                  <div className="fix-cart">
                                    <img src={item && item.productImageSet ? item.productImageSet[0].image : null} className="fix-img" alt="not found" />
                                  </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/products/edit/${item.productId}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span
                                      onClick={() => this.handleRemove(item.productId, item.productName)}
                                      title='Delete'
                                      className="fix-action">
                                      <Link to="#">
                                        <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i>
                                      </Link></span>
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
        <MyFooter></MyFooter>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products: (page) => {
      return dispatch(actFetchProductsRequest(page))
    },
    fetch_catagory: () => {
      return dispatch(actFetchCategoriesRequest())
    },
    find_products_by_catagory: (catagory, page) => {
      return dispatch(actGetProductOfCatagoryRequest(catagory, page))
    },
    find_products: (searchText, page) => {
      return dispatch(actGetProductOfKeyRequest(searchText, page))
    },
    delete_product: (id) => {
      dispatch(actDeleteProductRequest(id))
    }

  }
}




export default connect(mapStateToProps, mapDispatchToProps)(Product)