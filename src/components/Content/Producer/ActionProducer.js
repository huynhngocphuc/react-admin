import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { actAddProducerRequest, actEditProducerRequest } from '../../../redux/actions/producer';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { uploadImage } from '../../../utils/upload'
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';;

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
class ActionProducer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierName: '',
      supplierImage: '',
      redirectToProducer: false,
      img: null,
      loading: false,
      
    };
    id = this.props.id
  }
  async componentDidMount() {

    if (id) {
      const res = await callApi(`supplier/${id}`, 'GET', null);
      console.log("dữ liệu 1 supplier",res.data)
      this.setState({
        supplierName: res.data.supplierName,
        supplierImage: res.data.supplierImage
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

  handleChangeImage = (event) => {
    if (event.target.files[0]) {
      const img = event.target.files[0];
      this.setState(() => ({ img }));
    }
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const { supplierName } = this.state;
    let { img, supplierImage } = this.state;
    this.setState({
      loading: true
    })
    //upload image to firebase
    if (img !== null && img !== supplierImage) {
      supplierImage = await uploadImage(img);
    }
    const newSupplierName = supplierName == '' ? null : supplierName;
    const newImage= (supplierImage === '') ? null : supplierImage
    if (!id) {
      const newSupplier = { supplierName: newSupplierName,supplierImage:newImage }
      const res = await this.props.add_Producer(newSupplier);
      if(res && res.status == 201)
      {
        this.setState({
          supplierName: '',
          img :'',
          loading:false,
          redirectToProducer: true
        })
      }
      else{
        this.setState({
          loading:false,
         
        })
      }
     
    }
    else {
      const editSupplier = {
        supplierName: newSupplierName,
        supplierImage:newImage
      }

      console.log("dữ liệu sửa",editSupplier)
      await this.props.edit_Producer(id, editSupplier);
      console.log("Sửa sản phẩm", id)
      this.setState({
        loading:false,
        redirectToProducer: true
      })
    }


  }

  render() {
    const { supplierName, supplierImage, loading, redirectToProducer } = this.state;
    if (redirectToProducer) {
      return <Redirect to='/producers'></Redirect>
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
            <h2 className="no-margin-bottom">Trang Nhà cung cấp</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Nhà cung cấp</li>
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
                    <h3 className="h4">Thông tin nhà cung cấp</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Tên nhà cung cấp</label>
                        <div className="col-sm-9">
                          <input name="supplierName" onChange={this.handleChange} value={supplierName} type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="line" />
                      <div className="form-group row">
                        <label htmlFor="fileInput" className="col-sm-3 form-control-label">Hình Ảnh</label>
                        <div className="col-sm-9">
                          <input type="file" onChange={this.handleChangeImage} className="form-control-file" />
                          <div className="fix-cart">
                            <img src={supplierImage || 'http://via.placeholder.com/400x300'} id="output" className="fix-img" alt="avatar" />
                          </div>
                        </div>
                      </div>
                      <div className="line" />
                      <div className="form-group row">
                        <div className="col-sm-4 offset-sm-3">
                          <Link to = '/producers'type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Thoát</Link>
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
    add_Producer: (newProducer) => {
      return dispatch(actAddProducerRequest(newProducer))
    },
    edit_Producer: (id, data) => {
      dispatch(actEditProducerRequest(id, data))
    }

  }
}

export default connect(null, mapDispatchToProps)(ActionProducer)