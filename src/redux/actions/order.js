import * as Types from "../../constants/ActionType";
import callApi from "../../utils/apiCaller";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { actShowLoading, actHiddenLoading } from './loading'

export const actFetchOrdersRequest = (status, page) => {
  const newPage = page === null || page === undefined || page <= 0 ? 1 : page;
  const statusOrder = status == null|| status === undefined ? "chưa duyệt" : status;
  const dataguidi = {statusOrder}
  console.log("tranghientai",page)
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`orders?page=${newPage}`, "POST", dataguidi)
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFetchOrders(res.data.listOrders));
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

export const actApproveOrdersRequest = (id,status,page) =>{
  const newPage = page === null || page === undefined || page <= 0 ? 1 : page;
  const ordersId = {ordersId:id}
  const data = {"list":[ordersId]}
  console.log("dữ liệu gửi đi",data)
  return async dispatch => {
    const res = await callApi(`orders/approval?page=${newPage}`, 'PUT', data);
    if (res && res.status === 200) {
      toast.success('duyệt đơn hàng thành công')
      dispatch(actFetchOrders(res.data.listOrders));
    }
  }
}

export const actDeliveredOrderRequest = (id,status,page) =>{
  const newPage = page === null || page === undefined || page <= 0 ? 1 : page;
  const ordersId = {ordersId:id}
  const data = {"list":[ordersId]}
  console.log("dữ liệu gửi đi",data)
  return async dispatch => {
    const res = await callApi(`orders/delivered?page=${newPage}`, 'PUT', data);
    if (res && res.status === 200) {
      toast.success('Giao hàng thành công')
      dispatch(actFetchOrdersRequest(status,page));
    }
  }
}

export const actDeleteOrderRequest = (id) => {
  return async dispatch => {
    await callApi(`orders/cancel/${id}`, "PUT");
    dispatch(actDeleteOrder(id));
  };
};

export const actDeleteOrder = id => {
  return {
    type: Types.REMOVE_ORDER,
    id
  };
};

export const actFetchOrders = orders => {
  return {
    type: Types.FETCH_ORDERS,
    orders
  };
};




// export const actFindOrdersRequest = (token, searchText) => {
//   return dispatch => {
//   dispatch(actShowLoading());
//   return new Promise((resolve, reject) => {
//     if (searchText !== undefined && searchText !== null && searchText !== '') {
//       callApi(`orders?q=${searchText}`, "GET", null, token)
//       .then(res => {
//         if (res && res.status === 200) {
//           dispatch(actFindOrders(res.data.results));
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
//       callApi("orders", "GET", null, token)
//       .then(res => {
//         if (res && res.status === 200) {
//           dispatch(actFindOrders(res.data.results));
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

// export const actFindOrders = orders => {
//   return {
//     type: Types.FIND_ORDERS,
//     orders
//   };
// };



// export const actAddOrderRequest = (token, data) => {
//   return async dispatch => {
//     const res = await callApi("orders", "POST", data, token);
//     if (res && res.status === 200) {
//       toast.success("Add new order is success");
//       dispatch(actAddOrder(res.data));
//     }
//   };
// };

// export const actAddOrder = data => {
//   return {
//     type: Types.ADD_ORDER,
//     data
//   };
// };

// export const actGetOrderRequest = (token, id) => {
//   return async dispatch => {
//     await callApi(`orders/${id}`, "GET", null, token);
//   };
// };

// export const actEditOrderRequest = (token, id, data) => {
//   return async dispatch => {
//     const res = await callApi(`orders/${id}`, "PUT", data, token);
//     if (res && res.status === 200) {
//       toast.success("Edit order is success");
//       dispatch(actEditOrder(res.data));
//     }
//   };
// };


