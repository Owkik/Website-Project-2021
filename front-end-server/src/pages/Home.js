import React from 'react';
import  { Redirect } from 'react-router-dom'
import "./Home.css"

class Home extends React.Component {

    render(){
        return(
            <div className="home">
                <h1>WELCOME TO PES-BUK!</h1><br/>
                <a href="http://localhost:3000/log-in">LOG IN</a>
                <a href="http://localhost:3000/sign-up">SIGN UP</a><br/>
                <h3>Already have an account? Log in and interact with your friends  |   Don't have an account? Sign up and be part of the community.</h3>
                <footer className="homefooter"></footer>
            </div>
        )
    }
}

export default Home;