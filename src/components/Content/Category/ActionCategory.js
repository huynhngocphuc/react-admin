import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { actAddCategoryRequest, actEditCategoryRequest } from '../../../redux/actions/category';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
let token;
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
class ActionCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      redirectToCategory: false,
      loading: false
    };
    id = this.props.id
  }

  async componentDidMount() {
   
    if (id) {
      const res = await callApi(`category/${id}`, 'GET', null);
      this.setState({
        categoryName: res.data.categoryName
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
    const { categoryName } = this.state;
    this.setState({
      loading: true
    })
    //upload image to firebase
    const newName = categoryName === '' ? null : categoryName;
    if (!id) {
      const newCategory = {
        categoryName: newName
      }
      await this.props.add_category(newCategory);
      this.setState({
        categoryName: '',
        loading: false
      })
    } else {
      const editCategory = {
        categoryName: newName,
      }
      await this.props.edit_category(id, editCategory);
      this.setState({
        loading: false,
        redirectToCategory: true
      })
    }
  }


  render() {
    const { categoryName, redirectToCategory, loading } = this.state;
    if (redirectToCategory) {
      return <Redirect to='/categories'></Redirect>
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
            <h2 className="no-margin-bottom">Trang loại sản phẩm</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
            <li className="breadcrumb-item active">Loại sản phẩm</li>
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
                    <h3 className="h4">Thông tin loại sản phẩm</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên loại sản phẩm</label>
                        <div className="col-sm-9">
                          <input name="categoryName" onChange={this.handleChange} value={categoryName} type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="line" />
                      <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                          <Link to='/categories' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
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
    add_category: (newCategory) => {
      dispatch(actAddCategoryRequest( newCategory))
    },
    edit_category: (id, data) => {
      dispatch(actEditCategoryRequest(id, data))
    }
  }
}
export default connect(null, mapDispatchToProps)(ActionCategory)