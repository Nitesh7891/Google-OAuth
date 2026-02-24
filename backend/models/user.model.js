import {mongoose,Schema} from 'mongoose';


const UserScehma=new Schema({
    email:{
  type:String,
  default:null
    },
     password:{
    type:String,
    default:null
   },
    name:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    }
});

export const User=mongoose.model('User',UserScehma);