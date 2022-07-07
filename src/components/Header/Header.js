import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actToken, actGetNameRole } from '../../redux/actions/auth'
import { startLoading, doneLoading } from '../../utils/loading'


class Header extends Component {

    logOut = async () => {
        localStorage.removeItem('_auth');
        const token = null;
        startLoading();
        const setToken = this.props.setTokenRedux(token);
        const setRole = this.props.setTokenRoleRedux(token);
        await Promise.all([setToken, setRole])
        doneLoading();
    }
    render() {
        return (
            <header className="header">
                <nav className="navbar">
                    <div className="search-box">
                        <button className="dismiss"><i className="icon-close" /></button>
                        <form id="searchForm" action="#" role="search">
                            <input type="search" placeholder="What are you looking for..." className="form-control" />
                        </form>
                    </div>
                    <div className="container-fluid">
                        <div className="navbar-holder d-flex align-items-center justify-content-between">

                            <div className="navbar-header">
                                <Link to="/" className="navbar-brand d-none d-sm-inline-block">
                                    <div className="brand-text d-none d-lg-inline-block">
                                        <div style={{
                                            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/react-uploadimage-5d9bf.appspot.com/o/logo2.png?alt=media&token=ad0c8cf9-52d9-4f43-b0e9-489c7b498676)`,
                                            backgroundRepeat: 'no-repeat',
                                            width: '100px',
                                            height: '100px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '1px'
                                        }} />
                                    </div></Link>
                            </div>

                            <ul className="nav-menu list-unstyled d-flex flex-md-row align-items-md-center">

                                {/* <li className="nav-item dropdown"><a id="languages" rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link language dropdown-toggle"><img src="https://i.ibb.co/QrtCN5s/GB.png" alt="English" /><span className="d-none d-sm-inline-block">English</span></a>
                                    <ul aria-labelledby="languages" className="dropdown-menu">
                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                    <Link onClick={this.logOut}
                                        to="/login"
                                        className="nav-link logout">
                                        <span className="d-none d-sm-inline">Đăng xuất</span>
                                        <i className="fa fa-sign-out" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTokenRedux: (token) => {
            dispatch(actToken(token))
        },
        setTokenRoleRedux: (token) => {
            dispatch(actGetNameRole(token))
        }
    }
}

export default connect(null, mapDispatchToProps)(Header)
