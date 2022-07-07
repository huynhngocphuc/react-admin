import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';

import { actShowLoading, actHiddenLoading } from './loading'
export const actFetchDashboardRequest = () => {
  return async dispatch => {
    dispatch(actShowLoading());
    const res = await callApi('statistic/general', 'GET', null);
    if (res && res.status === 200) {
      dispatch(actFetchDashboard(res.data));
    }
    setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
  };
}

export const actFetchDashboard = (data) => {
  return {
    type: Types.FETCH_DASHBOARD,
    data
  }
}

export const actFetchRevenueRequest = (data) => {
  return async dispatch => {
    dispatch(actShowLoading());
    const res = await callApi('statistic/revenue', 'POST', data);
    console.log("trả vể reveun", res.data)
    if (res && res.status === 200) {
      const revenue = { revenue: res.data }
      console.log(revenue)
      dispatch(actFetchRevenue(revenue));
    }
    setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
  };
}
export const actFetchRevenue = (data) => {
  return {
    type: Types.FETCH_REVENUE,
    data
  }
}
export const actFetchBestSellingProductRequest = (data, page) => {

  
  const newPage = page === null || page === undefined ? 1 : page;
  return dispatch => {
    return new Promise((resolve, reject) => {
      callApi(`statistic/bestsellingproducts?page=${newPage}`, 'POST', data)
        .then(res => {
          if (res && res.status === 200) {
            const products = Object.values(res.data.map)
            const dataNew = { currentPage: res.data.currentPage, totalPage: res.data.totalPage, products: products }
            console.log("chay ngon", dataNew)
            dispatch(actFetchBestSelling(dataNew));
            resolve(dataNew);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
          setTimeout(function () { dispatch(actHiddenLoading()) }, 200);
        });
    });
  };
  // return async dispatch => {
  //   // dispatch(actShowLoading());
  //   const res = await callApi('statistic/bestsellingproducts', 'POST', data);
  //   console.log("trả vể reveun", res.data)
  //   if (res && res.status === 200) {
  //     const products = Object.values(res.data.map)
  //     const dataNew = { currentPage: res.data.currentPage, totalPage: res.data.totalPage, products: products }
  //     console.log("chay ngon", dataNew)
  //     dispatch(actFetchBestSelling(dataNew));
  //   }
  //   // setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
  // };
}
export const actFetchBestSelling = (data) => {
  return {
    type: Types.FETCH_BESTSELLING,
    data
  }
}
