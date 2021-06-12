import React from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import FriendReq from './pages/FriendReq';
import { Component } from 'react';
import  { Redirect } from 'react-router-dom'

const checkAuth = () => {                     //check if a value is stored in the local storage. A value is stored when logging in and removed when logging out
  const userData = localStorage.getItem("objectId")
  if(!userData){
    alert("No user logged in")
    localStorage.clear();
    return false;
  }
  return true;
}

const AuthRoute = ({component: Component, ...rest}) => (        //forces the user to go to the login page when not logged in
  <Route {...rest} render={props => (
    checkAuth() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{pathname:'/log-in'}}/>
    )
  )}/>
)

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact = {true} path = "/" component={Home}/>
        <Route exact = {true} path = "/sign-up" component={SignUp}/>
        <Route exact = {true} path = "/log-in" component={LogIn}/>
        <AuthRoute exact = {true} path = "/feed" component={Feed}/>
        <AuthRoute exact = {true} path = "/profile/:keyword" component={Profile}/>
        <AuthRoute exact = {true} path = "/friendrequests" component={FriendReq}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
