import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { actShowLoading, actHiddenLoading } from './loading'

export const actFetchUsersRequest = (page) => {
  const newPage = page === null || page === undefined ? 1 : page;
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`customer/all?page=${newPage}`, 'GET')
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFetchUsers(res.data.listCustomer));
            resolve(res.data);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
          setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
        });
    });
  };
};

export const actFetchUsers = (users) => {
  return {
    type: Types.FETCH_USERS,
    users
  }
}

export const actDeleteUserRequest = (id) => {
  return async dispatch => {
    await callApi(`customer/delete/${id}`, 'PUT');
    dispatch(actDeleteUser(id));
  }
}

export const actDeleteUser = (id) => {
  return {
    type: Types.REMOVE_USER,
    id
  }
}
export const actEditUserRequest = (id, data) => {
  return async dispatch => {
    const res = await callApi(`customer/${id}`, 'PUT', data);
    if (res && res.status === 200) {
      await dispatch(actEditUser(res.data));
      toast.success('Sửa người dùng thành công')
    }
  }
}

export const actEditUser = (data) => {
  return {
    type: Types.EDIT_USER,
    data
  }
}

// export const actFindUsersRequest = (token, searchText) => {
//   return dispatch => {
//   dispatch(actShowLoading());
//   return new Promise((resolve, reject) => {
//     if (searchText !== undefined && searchText !== null && searchText !== '') {
//       callApi(`users?q=${searchText}`, 'GET', null, token)
//       .then(res => {
//         if (res && res.status === 200) {
//           dispatch(actFindUsers(res.data.results));
//           resolve(res.data);
//           setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         reject(err);
//         setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//       });
//     } else {
//       callApi('users', 'GET', null, token)
//       .then(res => {
//         if (res && res.status === 200) {
//           dispatch(actFindUsers(res.data.results));
//           resolve(res.data);
//           setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         reject(err);
//         setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//       });
//     }
//   });
// }
// }

// export const actFindUsers = (users) => {
//   return {
//     type: Types.FIND_USERS,
//     users
//   }
// }



// export const actAddUserRequest = (token, data) => {
//   return async dispatch => {
//     const res = await callApi('users', 'POST', data, token);
//     if (res && res.status === 200) {
//       toast.success('Add new User is success')
//       dispatch(actAddUser(res.data));
//     }
//   }
// }

// export const actAddUser = (data) => {
//   return {
//     type: Types.ADD_USER,
//     data
//   }
// }

// export const actGetUserRequest = (token, id) => {
//   return async dispatch => {
//     await callApi(`users/${id}`, 'GET', null, token);
//   };
// }

