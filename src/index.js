import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import appReducers from './redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const store = createStore(appReducers, composeWithDevTools(
  applyMiddleware(thunk)
));

ReactDOM.render(
  <Provider store={store}>
    <App/>
    <ToastContainer
      position="top-right"
      autoClose={1700}
      pauseOnHover={false}
      pauseOnVisibilityChange={false}
      
    />
  </Provider>,
 
  document.getElementById('root')
);


