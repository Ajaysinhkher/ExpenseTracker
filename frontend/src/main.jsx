import { createRoot } from 'react-dom/client'
import './index.css'

import {createBrowserRouter,RouterProvider} from "react-router";
import { Provider } from 'react-redux'
import store from './app/store.js'
import Login from './components/auth/Login.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    Component:Login,    
  },

  {
    Component:Layout,
    children:[
      {  
          path:"dashboard",
          Component: Dashboard              
      },      
  ],
  }

]);

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
