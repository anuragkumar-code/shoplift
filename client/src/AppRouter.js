import React from 'react';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import Login from './components/Auth/Login';
// import Dashboard from './components/Dashboard/Dashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" component={Login} />
        {/* <Route path="/dashboard" component={Dashboard} /> */}
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
