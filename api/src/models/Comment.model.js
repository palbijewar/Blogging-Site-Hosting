import mongoose , { Schema , model } from 'mongoose';

const commentSchema = new Schema({
    content : {
        type:String,
        required:true,
    },
    post_id : {
        type:String,
        required:true,
    },
    user_id : {
        type:String,
        required:true,
    },
    likes : {
        type:Array,
        default:[]
    },
    number_of_likes : {
        type:Number,
        default:0
    },
}, {timestamps:true} )

const comments = model("Comments", commentSchema);

export default comments;