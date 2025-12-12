const Validator= require('validator');

let ValidatorUser=(data)=>{
    const maindatoryField=["FirstName","EmailId","password"];
    const Isallowed=maindatoryField.every((k) => Object.keys(data).includes(k));

    if(!Isallowed){
        throw new Error("Some field missing");
    }
   if(!Validator.isEmail(data.EmailId)){
    throw new Error("Email id is not valid")
   }
}
module.exports=ValidatorUser;
