
import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller'
import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';
toast.configure()


export const actLoginRequest = (user) => {
    
    return dispatch => {
        dispatch(actShowLoading())
        return new Promise((resolve, reject) => {
            callApi('auth/login', 'POST', user)
                .then(res => {
                    const token = res.data.token
                    const nameRole = res.data.userRole
                    localStorage.setItem('_auth', token);
                    dispatch(actLogin(token));
                    dispatch(actGetNameRole(nameRole));
                    resolve(res.data);
                    setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
                })
                .catch(err => {

                    reject(err);
                    setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
                });
        })

    }
}

export const actGetMeRequest = (token) => {
    return async dispatch => {
        const res = await callApi('admin', 'GET', null, token);
        if (res && res.status === 200) {
            dispatch(actGetMe(res.data));
        }
    };
}
export const actGetMe = (user) => {
    return {
        type: Types.GET_ME,
        user
    }
}

export const actLogin = (token) => {
    return {
        type: Types.LOGIN,
        token
    }
}
export const actGetNameRole = (role) => {
    
    return {
        type: Types.GET_NAMEROLE,
        role
    }
}

export const actTokenRequest = (token) => {
    return async dispatch => {
        dispatch(actToken(token));
    };
}
export const actToken = (token) => {
    return {
        type: Types.TOKEN_REDUX,
        token
    }
}