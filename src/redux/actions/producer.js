import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actShowLoading, actHiddenLoading } from './loading'

export const actFetchProducersRequest = () => {

  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi('supplier/all', 'GET', null)
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFetchProducers(res.data));
            resolve(res.data);
            setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
          setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
        });
    });
  };
};

export const actFetchProducers = (producers) => {
  return {
    type: Types.FETCH_PRODUCERS,
    producers
  }
}

export const actAddProducerRequest = (data) => {
  return async dispatch => {
    const res = await callApi('supplier', 'POST', data);
    if (res && res.status === 201) {
      toast.success('Thêm nhà cung cấp thành công')
      dispatch(actAddProducer(res.data));
    }
    return res
  }
}

export const actAddProducer = (data) => {
  return {
    type: Types.ADD_PRODUCER,
    data
  }
}

export const actDeleteProducerRequest = (id) => {
  return async dispatch => {
    await callApi(`supplier/delete/${id}`, 'PUT', null);
    dispatch(actDeleteProducer(id));
  }
}

export const actDeleteProducer = (id) => {
  return {
    type: Types.REMOVE_PRODUCER,
    id
  }
}

export const actEditProducerRequest = (id, data) => {
  return async dispatch => {
    const res = await callApi(`supplier/${id}`, 'PUT', data);
    if (res && res.status === 200) {
      toast.success('Sửa sản phẩm thành công')
      dispatch(actEditProducer(res.data));
    }
  }
}

export const actEditProducer = (data) => {
  return {
    type: Types.EDIT_PRODUCER,
    data
  }
}
