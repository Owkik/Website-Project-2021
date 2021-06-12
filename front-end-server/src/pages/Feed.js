import React from 'react';
import  { Redirect } from 'react-router-dom'
import Cookies from "universal-cookie";
import './Feed.css'
import watch from './images/watch.png'
import home from './images/home.png'
import market from './images/market.png'
import group from './images/group.png'
import game from './images/gaming.png'
import fblogo from './images/fblogo.png'
import pfp from './images/pfp.png'
import plus from './images/plus.png'
import mess from './images/mess.png'
import notif from './images/notif.png'
import more from './images/more.png'
import Popup from 'reactjs-popup';

class Feed extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            search: "",
            searchedvalue:[],
            found: false,
            post:"",
            allPost: [],
            edit:"",
            allFriends: []
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.logout = this.logout.bind(this);
        this.getPost = this.getPost.bind(this);
        this.displayPost = this.displayPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.editPost = this.editPost.bind(this);
    }

    componentDidMount(){
        this.displayPost();
        this.displayFriends();
    }

    changeHandler(e){
        this.setState({[e.target.name]: e.target.value})        //e.target.name makes the setting of values dynamic depending on the name
    }
    handleSearch(e){
        e.preventDefault();
        const sname = {
            search: document.getElementById("searchname").value
        }
        fetch("http://localhost:3001/search-acc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sname)
        })
        .then(response => response.json())
        .then(body => {
            if (!body.success) console.log("not found")
            else {
                console.log("found")
                this.setState({searchedvalue: body})
                this.setState({found: true})
            }  
        })
    }

    logout(e) {
        e.preventDefault();
        localStorage.clear();               //remove stored values on local storage

        const cookies = new Cookies();
        cookies.remove("authToken");            //remove token
    }

    getPost() {                             //get the post
        let name1 = localStorage.getItem("userFName")
        let name2 = localStorage.getItem("userLName")
        let fullname = name1+" "+name2
        let id = localStorage.getItem("objectId")
        fetch("http://localhost:3001/get-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: id,
                name: fullname,
                timestamp: Date(),
                content: this.state.post
            })
        })
    }

    displayPost(){                          //display the post
        let id = localStorage.getItem("objectId")
        fetch("http://localhost:3001/display-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userid: id })
        })
        .then(response => response.json())
          .then(body => {
            if(body.success) {
                console.log(body.allPosts)
                this.setState({allPost: body.allPosts})
            }
            else console.log("empty")
          })
    }

    deletePost(postUserId, idPost){                       //delete the post
        let userid = localStorage.getItem("objectId")
        fetch("http://localhost:3001/delete-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postUserId: postUserId,
                user: userid,
                idpost: idPost
            })
        })
        .then(response => response.json())
        .then(body => {
            if(body.success){
                alert("Deleted a post")
                window.location.reload();
            }
            else alert("Cannot delete post")
        })
    }

    editPost(postUserId, idPost){                       //edit post
        let userid = localStorage.getItem("objectId")
        fetch("http://localhost:3001/edit-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postUserId: postUserId,
                user: userid,
                idpost: idPost,
                newContent: this.state.edit
            })
        })
        .then(response => response.json())
        .then(body => {
            if(body.success){
                alert("Your post has been edited and saved")
                window.location.reload();
            }
            else alert("Post is not yours and cannot be edited")
        })
    }

    displayFriends(){                          //display all the friends
        let id = localStorage.getItem("objectId")
        fetch("http://localhost:3001/display-friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userid: id })
        })
        .then(response => response.json())
          .then(body => {
            if(body.success) {
                this.setState({allFriends: body.allFriends})
            }
            else console.log("empty")
          })
    }

    render(){
        let userfname = localStorage.getItem("userFName")           //get the firstname of the logged in user
        let userlname = localStorage.getItem("userLName")           //get the lastname of the logged in user
        let fullname = userfname+" "+userlname
        if(this.state.found) {
            let keyword = `/profile/${document.getElementById("searchname").value}`
            return <Redirect to={keyword}/>
        }
        
        return(
        <div className="feed">
            <header className="Header">
                <nav className="left">
                    <img src={fblogo} alt="facebook logo" className="fblogo"/>
                    <input type="search" className="searchbox" placeholder="Search Facebook" id="searchname" onChange={this.changeHandler}/>
                    <button type="submit" className="submitsearch" onClick={this.handleSearch}>Search</button>
                </nav>
                
                <nav className="mid">
                    <a href="http://localhost:3000/feed" className="mid1"><img src={home} alt="facebook logo" className="homeicon"/></a>
                    <a href="http://localhost:3000/feed" className="mid2"><img src={watch} alt="facebook logo" className="watchicon"/></a>
                    <a href="http://localhost:3000/feed" className="mid3"><img src={market} alt="facebook logo" className="marketicon"/></a>
                    <a href="http://localhost:3000/feed" className="mid4"><img src={group} alt="facebook logo" className="groupicon"/></a>
                    <a href="http://localhost:3000/feed" className="mid5"><img src={game} alt="facebook logo" className="gameicon"/></a>
                </nav>

                <nav className="right">
                    <a href="http://localhost:3000/feed" className="right1"><img src={pfp} alt="facebook logo" className="pfp"/>{userfname} {userlname}</a>
                    <a href="http://localhost:3000/friendrequests" className="rightbtn"><img src={plus} alt="facebook logo" className="r"/></a>
                    <a href="http://localhost:3000/feed" className="rightbtn"><img src={mess} alt="facebook logo" className="r"/></a>
                    <a href="http://localhost:3000/feed" className="rightbtn"><img src={notif} alt="facebook logo" className="r"/></a>
                    <a href="http://localhost:3000/" className="rightbtn"><img src={more} alt="facebook logo" className="r" onClick={this.logout}/>Logout</a>
                </nav>
            </header>
            <main>
                <section>
                    <form className="post">
                        <img src={pfp} alt="facebook logo" className="pfp"/>
                        <input type="text" className="getpost" name="post" placeholder="What's on your mind?" onChange={this.changeHandler}/>
                        <button type="text" onClick={this.getPost}>Post</button>
                    </form>
                    <div className="mainbuttons">
                        <button type="button" className="postbtn">Live Video</button>
                        <button type="button" className="postbtn">Photo/Video</button>
                        <button type="button" className="postbtn">Feeling/Activity</button>
                    </div>
                </section>
                <article>
                    <ol>
                        {
                            this.state.allPost.map((post, i) => {
                                return (
                                    <div className="postcontainer">
                                        <div className="editanddel">
                                        <Popup trigger={<button >Edit</button>}><div>
                                            <input type="text" name="edit" placeholder="Input new content" onChange={this.changeHandler}/>
                                            <button onClick={() => {this.editPost(post.userid, post._id)}}>Save</button></div></Popup>
                                        <button onClick={() => {this.deletePost(post.userid, post._id)}}>Delete</button><br/>
                                        </div>
                                        <img src={pfp} alt="facebook logo" class="pfp"/>{post.name}<br/>
                                        Time: {post.timestamp}<br/>
                                        {post.content}<br/>
                                        <div className="mainbuttons">
                                            <button type="button" className="postbtn">Like</button>
                                            <button type="button" className="postbtn">Comment</button>
                                            <button type="button" className="postbtn">Share</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ol>
                </article>
            </main>
            
            <aside className="leftblock">
                <div className="leftblock1">
                    <a href="http://localhost:3000/feed">{fullname}</a><br/>
                    <a href="http://localhost:3000/feed">COVID-19 Information Center</a><br/>
                    <a href="http://localhost:3000/feed">Friends</a><br/>
                    <a href="http://localhost:3000/feed">Groups</a><br/>
                    <a href="http://localhost:3000/feed">Marketplace</a><br/>
                    <a href="http://localhost:3000/feed">Watch</a><br/>
                </div>
            </aside>

            <aside className="rightblock">
                <div className="ads">
                    FRIENDS:
                    <ol>
                        {
                            this.state.allFriends.map((friend,i) => {
                                return(
                                    <div>
                                        {i+1}. {friend} - Offline
                                    </div>
                                )
                            })
                        }
                    </ol>
                </div>
            </aside>
        </div>
        )
    }
}

export default Feed;