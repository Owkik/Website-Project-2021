const controller = require('./controller');

module.exports = (app) => {
    app.post('/find-acc', controller.findAcc)
    app.post('/save-acc', controller.saveAcc)
    app.post('/search-acc', controller.searchAcc)
    app.post('/add-friend', controller.addFriend)
    app.post('/see-friend-reqs', controller.seeFriendReqs)
    app.post('/accept-friend', controller.acceptFriend)
    app.post('/delete-friend', controller.rejectFriend)
    app.post('/get-post', controller.getPost)
    app.post('/display-post', controller.displayPost)
    app.post('/delete-post', controller.deletePost)
    app.post('/edit-post', controller.editPost)
    app.post('/display-friends', controller.displayFriends)
}