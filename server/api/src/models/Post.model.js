import mongoose , { Schema , model } from 'mongoose';

const postSchema = new Schema({
    user_id : {
        type:String,
        required:true,
    },
    content : {
        type:String,
        required:true,
    },
    title : {
        type:String,
        required:true,
        unique:true,
    },
    image : {
        type:String,
        default:'https://th.bing.com/th/id/OIP.UfFEtByJjLDvm8g4Y2HcEQHaGC?rs=1&pid=ImgDetMain',
    },
    category : {
        type:String,
        default:'Uncatagorized',
    },
    slug : {
        type:String,
        required:true,
        unique:true,
    },
}, {timestamps:true} )

const posts = model("Posts", postSchema);

export default posts;