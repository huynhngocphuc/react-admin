import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startLoading, doneLoading } from '../../utils/loading'
import {actLoginRequest} from '../../redux/actions/auth'
toast.configure()

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = async event => {

        event.preventDefault();
        const { username, password } = this.state;
        
        if (password.length < 6 || password.length > 32) {
            return toast.error('Mật khẩu trên 6 ký tự!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
          }

        const user = {
            username,
            password
        }
        startLoading();
        await this.props.loginRequest(user);
        doneLoading();
    }
    render() {
        const { username, password } = this.state;
        const { auth } = this.props;
        if (auth !== null) {
            return <Redirect to="/"></Redirect>
          }
        return (
            <div className="page login-page">
                <div className="container d-flex align-items-center">
                    <div className="form-holder has-shadow">
                        <div className="row">
                            {/* Logo & Information Panel*/}
                            <div className="col-lg-6">
                                <div className="info d-flex align-items-center">
                                    <div className="content">
                                        <div className="logo">
                                            <img src="https://firebasestorage.googleapis.com/v0/b/react-uploadimage-5d9bf.appspot.com/o/icon.png?alt=media&token=1b5d60ec-a2f9-4425-ad2a-a634e8473828" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Form Panel    */}
                            <div className=" col-lg-6 bg-white">
                                <div className="form d-flex align-items-center">
                                    <div className="content">
                                        <form
                                            onSubmit={(event) => this.handleSubmit(event)}>
                                            <div className="form-group">
                                                <input
                                                    onChange={this.handleChange}
                                                    type="text" 
                                                    name="username"
                                                    value={username} className="input-material"
                                                    placeholder="Email" />
                                                
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    onChange={this.handleChange}
                                                    type="password"
                                                    name="password"
                                                    value={password}
                                                    className="input-material" placeholder="Password" />
                                                
                                            </div>
                                            <button className="btn btn-primary">Đăng nhập</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyrights text-center">
                    <p>Design by <a href="https://bootstrapious.com/p/admin-template" className="external">Huỳnh Phúc</a>
                    </p>
                </div>
            </div>
        )
    }
    
}
const mapStateToProps = (state) => {
    return {
      auth: state.auth
    }
  }
const mapDispatchToProps = (dispatch) => {
    return {
      loginRequest: (user) => {
        dispatch(actLoginRequest(user))
      }
    }
  }

  
export default connect(mapStateToProps,mapDispatchToProps)(Login)
  
