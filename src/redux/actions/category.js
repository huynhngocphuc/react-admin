import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';


export const actFetchCategoriesRequest = () => {

  return async dispatch => {
    const res = await callApi('category/all', 'GET', null);
    if (res && res.status === 200) {
      console.log(res.data)
      dispatch(actFetchCategories(res.data));
    }
    return res
  }
    // return dispatch => {
    //     dispatch(actShowLoading());
    //     return new Promise((resolve, reject) => {
    //         callApi('category/all', 'GET', null)
    //             .then(res => {
    //                 if (res && res.status === 200) {
    //                     console.log("Loaisp", res.data)
    //                     dispatch(actFetchCategories(res.data));
    //                     resolve(res.data);
    //                     setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 reject(err);
    //                 setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
    //             });
    //     });
    // };
};

export const actFetchCategories = categories => {
    return {
        type: Types.FETCH_CATEGORIES,
        categories
    }
}


export const actAddCategoryRequest = (data) => {
    return async dispatch => {
      const res = await callApi('category', 'POST', data);
      if (res && res.status === 201) {
        toast.success('Thêm loại sản phẩm thành công')
        dispatch(actAddCategory(res.data));
      }
    }
  }
  
  export const actAddCategory = (data) => {
    return {
      type: Types.ADD_CATEGORY,
      data
    }
  }

export const actDeleteCategoryRequest = (id) => {
    return async dispatch => {
        await callApi(`category/delete/${id}`, 'PUT', null);
        dispatch(actDeleteCategory(id));
    }
}

export const actDeleteCategory = (id) => {
    return {
        type: Types.REMOVE_CATEGORY,
        id
    }
}


export const actEditCategoryRequest = (id, data) => {
    return async dispatch => {
      const res = await callApi(`category/${id}`, 'PUT', data);
      if (res && res.status === 200) {
        toast.success('Sửa sản phẩm thành công')
        dispatch(actEditCategory(res.data));
      }
    }
  }
  
  export const actEditCategory = (data) => {
    return {
      type: Types.EDIT_CATEGORY,
      data
    }
  }