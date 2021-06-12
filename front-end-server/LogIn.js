import React from 'react';
import "./LogIn.css"
import  { Redirect } from 'react-router-dom'
import Cookies from "universal-cookie";

class LogIn extends React.Component { 
    constructor(props){
        super(props)

        this.state = {
            email: "",
            password: "",
            isLoggedIn: false
        }
        
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    changeHandler(e){
        this.setState({[e.target.name]: e.target.value})        //e.target.name makes the setting of values dynamic depending on the name
    }

    handleSubmit(e){
        e.preventDefault();

        const credentials = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
        }

        // Send a POST request
        fetch("http://localhost:3001/find-acc",{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        
        .then(response => response.json())
        .then(body => {
            if (!body.success) { 
                alert("Failed to log in"); 
            }
            else {
                localStorage.setItem("userFName", body.userfname)       //user's firstname
                localStorage.setItem("userLName", body.userlname)       //user's lastname
                localStorage.setItem("objectId", body.id)               //user's id
            // successful log in. store the token as a cookie
                const cookies = new Cookies();
                cookies.set(
                    "authToken",
                    body.token,
                    {
                    path: "localhost:3001/",
                    age: 60*60,
                    sameSite: "lax"
                    });
                    this.setState({isLoggedIn: true})
                }
        })
    }

    render(){
        
        if(this.state.isLoggedIn) return <Redirect to='/feed'/>
        return(
            <div>
                <a href="http://localhost:3000/" className="goback">GO BACK TO HOMEPAGE</a><br/>
                <div className="login">
                    <form onSubmit={this.handleSubmit}>
                        <h1>LOG-IN</h1> <br/>
                        <input type="email" name="email" id="email" placeholder="Input Email" onChange={this.changeHandler}/>{this.state.notfound}<br/>
                        <input type="password" name="password" id="password" placeholder="Input Password" onChange={this.changeHandler}/>{this.state.incorrect}<br/>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default LogIn;