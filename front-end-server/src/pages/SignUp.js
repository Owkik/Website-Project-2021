import React from 'react';
import "./SignUp.css"
import  { Redirect } from 'react-router-dom'

class SignUp extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            fname: "",
            lname: "",
            email: "",
            password: "",
            rpassword: "",
            isDisabled: true
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableRepeat = this.enableRepeat.bind(this);
    }


    validatePassword(str1){         //checks if pass has all required characters
        var isLower = false;
        var isUpper = false;
        var isNum = false;
        if(str1.length < 8) return false;       //checks length
        for(var i=0; i<str1.length; i++){
            if(str1.charAt(i) === str1.charAt(i).toUpperCase()) isUpper = true;      //checks if uppercase
            else if(str1.charAt(i) === str1.charAt(i).toLowerCase()) isLower = true;     //checks if lowercase
            if (str1.charAt(i) >= '0' && str1.charAt(i) <= '9') isNum = true;      //checkS if num  DI TO NAGANA
        }
        if(isLower && isUpper && isNum) return true;
        else return false;
    }

    checkMatching(str1,str2){           //check if matching
        for(var i=0; i<str1.length; i++){
            if(str1.charAt(i) !== str2.charAt(i)) return false;
        }
        return true;
    }

    handleSubmit(e){
        e.preventDefault();
        let nofname = "Required Field"
        let nolname = "Required Field"
        let check = "Passwords should be at least 8 characters, have at least 1 number, 1 lowercase letter, and 1 uppercase letter."
        let notmatch = "Passwords should match"
        let emailError = 'Invalid email'
        
        if(!this.state.fname) this.setState({nofname})      //no fname error
        else {
            nofname = "";
            this.setState({nofname})
        }
        if(!this.state.lname) this.setState({nolname})      //no lname error
        else {
            nolname = "";
            this.setState({nolname})
        }
        if (!this.state.email.includes("@")) this.setState({emailError});       //checks if valid email
        else {
            emailError = "";
            this.setState({emailError})
        }

        if(!this.validatePassword(this.state.password)) this.setState({check})      //validate if password is correct format
        else {
            check = "";
            this.setState({check})
        }
        if(!this.checkMatching(this.state.password,this.state.rpassword)) this.setState({notmatch})     //checks if matching
        else {                      //NOTE: Not matching will only appear in the browser if 1st password has input
            notmatch = "";
            this.setState({notmatch})
        }
        if(this.state.fname && this.state.lname && this.state.email.includes("@") && this.validatePassword(this.state.password) && this.checkMatching(this.state.password, this.state.rpassword)){
            fetch('http://localhost:3001/save-acc', {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname: this.state.fname,
                    lname: this.state.lname,
                    email: this.state.email,
                    password: this.state.password,
                })
            })
            console.log(this.state)
            this.setState({
                fname: "",
                lname: "",
                email: "",
                password: "",
                rpassword: ""
            })
            alert("Sign up successful!")
        }
      };
    enableRepeat(e){                //enables and disables the repeat password input
        if(this.state.password.length === 0) this.setState({isDisabled: true})
        else this.setState({isDisabled: false})
    }
    changeHandler(e){
        this.setState({[e.target.name]: e.target.value})        //e.target.name makes the setting of values dynamic depending on the name
    }
    render(){
        return(
            <div>
                <a href="http://localhost:3000/">GO BACK TO HOMEPAGE</a><br/>
                <form onSubmit={this.handleSubmit} className="signup">
                    <h1>SIGN-UP</h1>
                    <input type="text" name="fname" placeholder="Input First Name" value={this.state.fname} onChange={this.changeHandler} />&nbsp;{this.state.nofname}<br/>
                    <input type="text" name="lname" placeholder="Input Last Name" value={this.state.lname} onChange={this.changeHandler}/>&nbsp;{this.state.nolname}<br/>
                    <input type="email" name="email" placeholder="Input Email" value={this.state.email} onChange={this.changeHandler}/>&nbsp;{this.state.emailError}<br/>
                    <input type="password" name="password" placeholder="Input Password" value={this.state.password} onChange={this.changeHandler} onKeyDown={this.enableRepeat}/>&nbsp;{this.state.check}<br/>
                    <input type="password" name="rpassword" placeholder="Repeat password" disabled = {this.state.isDisabled} value={this.state.rpassword} onChange={this.changeHandler}/>&nbsp;{this.state.notmatch}<br/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default SignUp;