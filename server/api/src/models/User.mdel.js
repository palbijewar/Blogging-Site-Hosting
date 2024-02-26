import mongoose , { Schema , model } from 'mongoose';

const userSchema = new Schema({
    username : {
        type:String,
        required:true,
        unique:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true,
    },
    profile_picture : {
        type : String,
        default : "https://th.bing.com/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgAAAA?rs=1&pid=ImgDetMain"
    },
    is_admin : {
        type:Boolean,
        default:false,
    },
}, {timestamps:true} )

const users = model("Users", userSchema);

export default users;