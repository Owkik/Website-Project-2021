import React from 'react';
import  { Redirect } from 'react-router-dom'
import './Profile.css'

class Profile extends React.Component { 
    constructor(props){
        super(props)

        this.state = {
            searched:[]
        }

        this.searchUser = this.searchUser.bind(this)
        this.sendFriendRequest = this.sendFriendRequest.bind(this)
    }
    componentDidMount = async () => {
        await this.searchUser()
    }

    searchUser = async () => {
        let { keyword } = this.props.match.params;
        let user = []
      
        if (keyword) {      //if keyword is detected, run search
          const sname = {
            search: keyword
          }
          let data = await fetch("http://localhost:3001/search-acc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sname)
          });
          let trueData = await data.json();
          user = trueData.user              //save the data to the user
        }
        this.setState({ searched:user });
      }

    sendFriendRequest = (userid) => {             //fetch of sending the friend request
      let temp = localStorage.getItem("objectId")     //store the current user's id
      const id = {
        request: userid,
        curUserId: temp
      }
      fetch("http://localhost:3001/add-friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(id)
          })
          .then(response => response.json())
          .then(body => {
            if(body.success) alert("friend request sent")
            else alert("friend request already sent or already friends")
          })
    }

    render(){
      let userid = localStorage.getItem("objectId")
      return(
            <div className="searchedUsers">
              <a href="http://localhost:3000/feed">GO BACK TO FEED</a><br/>
              <ol>
                {
                  this.state.searched.map((user, i) => {
                    return(
                      <div key={i} className="listOfUsers">
                        {i+1}.<br/>
                        Full Name: {user.fname} {user.lname}<br/>
                        Email: {user.email}<br/>
                        {userid !== user._id && (
                          <button onClick={() =>{this.sendFriendRequest(user._id)}}>Add friend</button>
                        )}
                      </div>
                    )
                  })
                }
              </ol>
            </div>
      )
    }
}

export default Profile;