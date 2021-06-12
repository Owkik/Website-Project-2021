import React from 'react';
import  { Redirect } from 'react-router-dom'
import './FriendReq.css'


class FriendReq extends React.Component { 
    constructor(props){
        super(props)

        this.state = {
            userreqs: []
        }
        this.displayReqs = this.displayReqs.bind(this)
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this)
        this.rejectFriendRequest = this.rejectFriendRequest.bind(this)
    }

    componentDidMount = () => {
        this.displayReqs();
    }

    displayReqs = () => {                               //DISPLAY FRIEND REQUESTS
        let userid = localStorage.getItem("objectId")
        let input = {
            userid
        }
        fetch("http://localhost:3001/see-friend-reqs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
          })
          .then(response => response.json())
          .then(body => {
            if(body.success) {
                this.setState({userreqs: body.foundrequests})
            }
            else console.log("empty")
          })
          
    }

    acceptFriendRequest = (requestorId) => {                    //ACCEPT FRIEND REQUESTS
        let userid = localStorage.getItem("objectId")
        let input = {
            userid,                                 //pass user's id
            friendid: requestorId                   //pass the id of the requestor
        }
        fetch("http://localhost:3001/accept-friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
          })
          .then(response => response.json())
          .then(body => {
            if(body.success) {
                alert("The friend request has been accepted")
                window.location.reload();
            }
            else alert("The friend request CANNOT be accepted")
          })
    }

    rejectFriendRequest = (requestorId) => {                        //REJECT FRIEND REQUESTS
        let userid = localStorage.getItem("objectId")
        let input = {
            userid,                                             //pass current user's id
            friendid: requestorId                               //pass id of requestor
        }
        fetch("http://localhost:3001/delete-friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
          })
          .then(response => response.json())
          .then(body => {
            if(body.success) {
                alert("The friend request has been successfully declined")
                window.location.reload();
            }
            else alert("The friend request cannot declined")
          })
    }

    render(){
        console.log(this.state.userreqs)
        return (
            <div className="temp">
                <a href="http://localhost:3000/feed">GO BACK TO FEED</a><br/>
                <h3>FRIEND REQUESTS</h3>
              <ol>
                  {
                      this.state.userreqs.map((user,i) => {
                          return (
                              <div className="reqscontainer">
                                  FULL NAME: {user.fname} {user.lname}<br/>
                                  EMAIL: {user.email}<br/>
                                  <button onClick={() => {this.acceptFriendRequest(user._id)}}>accept</button>
                                  <button onClick={() => {this.rejectFriendRequest(user._id)}}>decline</button>
                              </div>
                          )
                      })
                  }
              </ol>
            </div>
        )
    }
}

export default FriendReq;