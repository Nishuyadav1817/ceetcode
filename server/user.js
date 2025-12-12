 const mongoose= require('mongoose');
 const {Schema}=mongoose;

 const UserSchema=new Schema({
       FirstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:30
       } ,
       LastName:{
        type:String,
       
        minLength:3,
        maxLength:30
       },

       EmailId:{
         type:String,
         required:true,
         unique:true,
         trim:true,
        lowercase:true,
        immutable:true
       },
       Age:{
        type:Number,
        max:60,
        min:12,
       
       },
       password:{
        type:String,
        required:true
      
       },
      
       
      
       role:{
        type:String,
        enum:["user","admin"],
        default:'user'
       },
       
    problemSolved: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "problem",
    default: []  
  }
      
       
    

});


 const User=mongoose.model("user",UserSchema);
 module.exports=User;





