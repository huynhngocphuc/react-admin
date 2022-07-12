import React from 'react';
import Login from './components/Login/Login';
import UserPage from './pages/UserPage';
import DashboardPage from './pages/DashBoardPage'
import ProductPage from './pages/ProductPage';
import ActionProductPage from './pages/ActionProductPage';
import CategoryPage from './pages/CategoryPage';
import ProducerPage from './pages/ProducerPage';
import ActionProducerPage from './pages/ActionProducerPage';
import ActionCategoryPage from './pages/ActionCategoryPage';
import ActionOrderPage from './pages/ActionOrderPage';
import ActionUserPage from './pages/ActionUserPage';
import OrderPage from './pages/OrderPage';
import OrderStatus2Page from './pages/OrderStatus2Page';
import OrderStatus3Page from './pages/OrderStatus3Page';


const routes = [
    {
        path: '/',
        exact: true,
        main: () => <DashboardPage />
    },
    {
        path: '/login',
        exact: false,
        main: () => <Login />
    },
    {
        path: '/customers',
        exact: true,
        main: () => <UserPage/>
    },
    {
        path: '/customers/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionUserPage match={match} history={history} />
      },
    {
        path: '/orders/status1',
        exact: true,
        main: () => <OrderPage />
    },
    {
        path: '/orders/status2',
        exact: true,
        main: () => <OrderStatus2Page />
    },
    {
        path: '/orders/status3',
        exact: true,
        main: () => <OrderStatus3Page />
    },
    {
        path: '/orders/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionOrderPage match={match} history={history} />
    },
    {
        path: '/products',
        exact: true,
        main: ({ match }) => <ProductPage match={match} />
    },
    {
        path: '/products/add',
        exact: false,
        main: ({ history }) => <ActionProductPage history={history} />
    },
    {
        path: '/products/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionProductPage match={match} history={history} />
    },
    {
        path: '/categories',
        exact: true,
        main: () => <CategoryPage />
    },
    {
        path: '/categories/add',
        exact: false,
        main: ({ history }) => <ActionCategoryPage history={history} />
    },
    {
        path: '/categories/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionCategoryPage match={match} history={history} />
    },
    {
        path: '/producers',
        exact: true,
        main: () => <ProducerPage />
    },
    {
        path: '/producers/add',
        exact: false,
        main: ({ history }) => <ActionProducerPage history={history} />
    },
    {
        path: '/producers/edit/:id',
        exact: false,
        main: ({ match, history }) => <ActionProducerPage match={match} history={history} />
    }

]

export default routes;