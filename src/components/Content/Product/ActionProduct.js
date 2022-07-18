import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { actAddProductRequest, actEditProductRequest } from '../../../redux/actions/product';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import Validator from '../../../utils/validator'
import { uploadImage } from '../../../utils/upload'
import Dropzone from 'react-dropzone';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import { is_empty } from '../../../utils/validations';
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
class ActionProduct extends Component {

  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      let data = this.state.filesImage
      data = data.concat(files)

      this.setState({
        filesImage: data
      })
    };

    this.state = {
      productName: '',
      quantity: 0,
      productImageSet: [],
      filesImage: [],
      discount: 0,
      unitPrice: 0,
      descriptionProduct: '',
      dataCategories: [],
      dataSupplieres: [],
      categoryId: 1,
      supplierId: 1,
      // hình để đưa ra giao diện
      redirectToProduct: false,
      loading: false,
      errors: {}
    };
    id = this.props.id
    const requiredWith = (value, field, state) => (!state[field] && !value) || !!value;
    const isLengthString = (value, field, state) => {
      let newvalue = 0;
      // typeof(value) === ''
      if (typeof (value) === 'string' && !is_empty(value)) {
        newvalue = parseInt(value)

      }
      if (typeof (value) === 'number' && !is_empty(value)) {
        newvalue = value

      }
      if (newvalue >= field.min) {
        return true
      }
      return false;

    }
    const isLengthImage = (value, field, state) =>{
     
      if(state.filesImage.length > 0 || state.productImageSet.length> 0 ){
        return true
      }
      if(value.length > field.min)
      {
        return true;
      }
      return false;
    }


    const rules = [
      {
        field: 'productName',
        method: 'isEmpty',
        validWhen: false,
        message: 'Vui lòng nhập tên sản phẩm',
      },
      {
        field: 'unitPrice',
        method: isLengthString,
        args: [{ min: 1 }],
        validWhen: true,
        message: 'Vui lòng nhập giá từ giá lớn hơn 0 ',
      },
      {
        field: 'discount',
        method: isLengthString,
        args: [{ min: 0 }],
        validWhen: true,
        message: 'Vui lòng nhập giá giảm từ 0',
      },
      {
        field: 'quantity',
        method: isLengthString,
        args: [{ min: 1 }],
        validWhen: true,
        message: 'Vui lòng nhập số lượng lớn hơn 0',
      },
      {
        field: 'filesImage',
        method: isLengthImage,
        args: [{ min: 0 }],
        validWhen: true,
        message: 'Vui lòng thêm ảnh',
      },
    ];
    this.validator = new Validator(rules);

  }


  async componentDidMount() {
    if (id) {
      const res = await callApi(`product/${id}`, 'GET');
      if (res && res.status === 200) {
        console.log("dữ liệu trả về", res.data)
        this.setState({
          productName: res.data.productName,
          quantity: res.data.quantity,
          productImageSet: res.data.productImageSet,
          discount: res.data.discount,
          unitPrice: res.data.unitPrice,
          descriptionProduct: res.data.descriptionProduct,
          categoryId: res.data.categoryFKDto.categoryId,
          supplierId: res.data.supplierFKDto.supplierId,

        })
      }
    }
    const resCategories = await callApi('category/all', 'GET');
    if (resCategories && resCategories.status === 200) {
      this.setState({
        dataCategories: resCategories.data
      })
    }
    console.log("dữ liệu trả về 2", resCategories.data)
    const resSupplieres = await callApi('supplier/all', 'GET');
    if (resSupplieres && resSupplieres.status === 200) {
      this.setState({
        dataSupplieres: resSupplieres.data
      })
    }

    console.log("dữ liệu trả về 3", resSupplieres.data)

  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleChangeSelecProducer = (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      supplierId: value
    })
  }
  handleChangeImage = (event) => {
    if (event.target.files[0]) {
      const img = event.target.files[0];
      this.setState(() => ({ img }));
    }
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
  }
  handleChangeEditor = (value) => {
    this.setState({ descriptionProduct: value })
  }
  removeImage = (id, isImage) => {
    let { productImageSet, filesImage } = this.state
    if (isImage) {
      productImageSet.splice(id, 1)
      this.setState({
        productImageSet
      })
    }
    else {


      filesImage.splice(id, 1)
     

      this.setState({
        filesImage
      })
    }

  }
  handleSubmit = async (event) => {
    event.preventDefault();
    await this.setState({
      errors: this.validator.validate(this.state),
    });

    const {
      productName,
      quantity,
      discount,
      unitPrice,
      descriptionProduct,
      categoryId,
      supplierId,
      filesImage,
      productImageSet,
      errors
    } = this.state;

    const newListImage = []
    if ((JSON.stringify(errors) === '{}' )) {
      
      if (productImageSet.length > 0) {
        productImageSet.map(item => {
          newListImage.push({ name: item.image })
        })
      }
      this.setState({
        loading: true
      })
      if (filesImage.length > 0)
        for (const file of filesImage) {
          const builder = await uploadImage(file);
          newListImage.push({ name: builder });
        }
      // up ảnh firebase

      const newProductName = productName === '' ? null : productName;
      const newQuantity = parseInt(quantity);
      const newDiscount = parseInt(discount);
      const newUnitPrice = parseInt(unitPrice);
      const newDescriptionProduct = descriptionProduct === '' ? 'không mô tả' : descriptionProduct;
      const newCategoryId = parseInt(categoryId);
      const newSupplierId = parseInt(supplierId);
      // const newImage = productImage === '' ? 'http://via.placeholder.com/300x200' : productImage;
      // console.log("image", newImage)
      const newProduct = {
        productName: newProductName,
        quantity: newQuantity,
        discount: newDiscount,
        unitPrice: newUnitPrice,
        descriptionProduct: newDescriptionProduct,
        categoryId: newCategoryId,
        supplierId: newSupplierId,
        productImage: newListImage
      }

      if (!id) {
        const res = await this.props.add_Product(newProduct);
        if(res && res.status == 200)
        {
          this.setState({
            loading: false,
            redirectToProduct: true
          })
        }
        this.setState({loading:false})
      }
      else {
        await this.props.edit_Product(id, newProduct);
        this.setState({
          loading: false,
          redirectToProduct: true
        })

      }
    }

  }
  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  render() {
    const { productName, quantity, productImageSet, filesImage, discount, unitPrice, descriptionProduct, dataSupplieres, categoryId, dataCategories, supplierId, loading, redirectToProduct, errors } = this.state;
    if (redirectToProduct) {
      return <Redirect to='/products'></Redirect>
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
            <h2 className="no-margin-bottom">Trang sản phẩm</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
            {
              !id ?
                <li className="breadcrumb-item active">thêm sản phẩm</li>
                : <li className="breadcrumb-item active"> Sửa sản phẩm</li>
            }

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
                    <h3 className="h4">Thông tin sản phẩm</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      {/* tên sản phẩm */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên sản phẩm</label>
                        <div className="col-sm-9">
                          <input
                            onChange={this.handleChange}
                            value={productName}
                            name="productName"
                            type="text"
                            className="form-control" />
                          {errors.productName && <div className="validation" style={{ display: 'block' }}>{errors.productName}</div>}
                        </div>

                      </div>
                      <div className="line" />
                      {/* giá, số lượng */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Giá</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={unitPrice}
                            name="unitPrice"
                            type="number"
                            className="form-control" />
                          {errors.unitPrice && <div className="validation" style={{ display: 'block' }}>{errors.unitPrice}</div>}

                        </div>
                        <label className="col-sm-3 form-control-label" style={{ textAlign: 'center' }}>Số lượng</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={quantity}
                            name="quantity"
                            type="number"
                            className="form-control" />
                          {errors.quantity && <div className="validation" style={{ display: 'block' }}>{errors.quantity}</div>}

                        </div>
                        <label className="col-sm-3 form-control-label" >Giảm giá</label>
                        <div className="col-sm-3">
                          <input
                            onChange={this.handleChange}
                            value={discount}
                            name="discount"
                            type="number"
                            className="form-control" />
                          {errors.discount && <div className="validation" style={{ display: 'block' }}>{errors.discount}</div>}
                        </div>
                      </div>


                      <div className="line" />
                      {/* mô tả */}
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Mô tả</label>
                        <div className="col-sm-9">
                          <ReactQuill
                            modules={this.modules}
                            formats={this.formats}
                            value={descriptionProduct}
                            onChange={this.handleChangeEditor}
                          />
                        </div>
                      </div>
                      <div className="line" />
                      {/* loại sản phẩm */}
                      <div className="form-group row">
                        <label
                          className="col-sm-3 form-control-label">
                          Loại sản phẩm
                        </label>
                        <div className="col-sm-9">
                          {dataCategories && dataCategories.length ?
                            dataCategories.map((item, index) => {
                              return (
                                <div key={item.categoryId}
                                  className="i-checks"
                                  style={{ display: 'inline-block', paddingRight: 35 }} >
                                  {
                                    item.categoryId === categoryId ?
                                      <input
                                        id={item.categoryId}
                                        name="categoryId"
                                        checked
                                        // value={categoryId}
                                        onChange={this.handleChange}
                                        type="radio"
                                        value={item.categoryId}
                                        className="radio-template" />
                                      :
                                      <input
                                        id={item.categoryId}
                                        name="categoryId"
                                        // value={categoryId}
                                        onChange={this.handleChange}
                                        type="radio"
                                        value={item.categoryId}
                                        className="radio-template" />
                                  }
                                  <label>{item.categoryName}</label>
                                </div>
                              )
                            })
                            : null
                          }
                        </div>
                      </div>
                      <div className="line" />
                      {/* nhà cung cấp */}
                      <div className="form-group row">
                        <label
                          className="col-sm-3 form-control-label">
                          Nhà cung cấp
                        </label>
                        <div className="col-sm-9">
                          <select className="form-control mb-3" name="supplierId" value={supplierId} onChange={this.handleChangeSelecProducer}>
                            {
                              dataSupplieres && dataSupplieres.length ? dataSupplieres.map((item, index) => {
                                return (
                                  <option key={item.supplierId} value={item.supplierId} >{item.supplierName}</option>
                                )
                              }) : null
                            }
                          </select>
                        </div>
                      </div>
                      <div className="line" />
                      {/* image */}
                      <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-3 form-control-label">Ảnh</label>
                        <div className="col-9 col-sm-9">
                          <Dropzone onDrop={this.onDrop}>
                            {({ getRootProps, getInputProps }) => (
                              <section style={{ border: '1px dotted' }}>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                  <input {...getInputProps()} />
                                  <h2 className='ml-3'>Chọn ảnh tại đây!!!</h2>
                                </div>
                                <aside>

                                  <div>
                                    {
                                      productImageSet && productImageSet.length > 0 ?
                                        productImageSet.map((itemImage, index) => {
                                          return (
                                            < span key={itemImage.imageId}>
                                              <div className='model m-3'>
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <button type="button"
                                                      onClick={() => this.removeImage(index, true)}
                                                      className="close_button" >
                                                      <span aria-hidden="true">&times;</span>
                                                    </button>
                                                  </div>
                                                  <img src={itemImage.image} style={{ height: 100, width: 100 }} alt="notfound" />
                                                </div>
                                              </div>
                                            </span>

                                          )
                                        })
                                        : null

                                    }
                                    {
                                      filesImage && filesImage.length > 0 ?
                                        filesImage.map((itemImage, index) => {

                                          return (
                                            < span key={index}>
                                              <div className='model m-3'>
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <button onClick={() => this.removeImage(index, false)}
                                                      type="button" className="close_button" >
                                                      <span aria-hidden="true">&times;</span>
                                                    </button>
                                                  </div>
                                                  <img src={URL.createObjectURL(itemImage)} style={{ height: 100, width: 100 }} alt="notfound" />
                                                </div>
                                              </div>
                                            </span>

                                          )
                                        })
                                        : null

                                    }
                                  </div>
                                </aside>
                              </section>
                            )}
                          </Dropzone>
                          {/* <div className="validation" style={{ display: 'block' }}>vui lòng chọn ảnh</div> */}
                          {
                            filesImage.length > 0 || productImageSet.length >0 ? null :
                            errors.filesImage || errors.productImageSet ? <div className="validation" style={{ display: 'block' }}>{errors.filesImage ||errors.productImageSet}</div> : null
                          }

                        </div>
                      </div>
                      {/* chức năng */}
                      <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                          <Link to='/products' type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
                          <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </section >
        {/* Page Footer*/}

      </div >
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add_Product: (newProduct) => {
      return dispatch(actAddProductRequest(newProduct))
    },
    edit_Product: (id, data) => {
      dispatch(actEditProductRequest(id, data))
    }
  }
}

export default connect(null, mapDispatchToProps)(ActionProduct)