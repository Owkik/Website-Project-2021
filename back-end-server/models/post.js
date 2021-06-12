const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const PostSchema = new mongoose.Schema({
    userid: { type: ObjectId, ref: "Post"},
    name: { type: String, required: true },
    timestamp: { type: Date, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model("Post", PostSchema);