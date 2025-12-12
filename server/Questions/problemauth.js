const Express=require("express")
const mongoose =require("mongoose") 
const problem=require('./probshema');
const {getLanguageById,submitBatch,submitToken} = require("./proValidator");
const ProblemRouter=Express.Router();
const AdminVerify=require('../Middlewere/Adminmidlewere')
const Userverify=require("../Middlewere/usermidlewere");
const User=require('../user');



//create problem // Admin work
ProblemRouter.post("/createproblem",AdminVerify,async (req,res) =>{
       console.log("problem create")

   const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body
 
 
    try{
   if (!Array.isArray(referenceSolution)) {
      return res.status(400).send("referenceSolution must be an array");
    }
    if (!Array.isArray(visibleTestCases)) {
      return res.status(400).send("visibleTestCases must be an array");
    }

     for(const {language,completeCode} of referenceSolution){
console.log("problem create1")
console.log(language)
    const languageId = getLanguageById(language);

    console.log(languageId)
    if(!languageId){
      return res.send("language id not valid")
    }
      if (!Array.isArray(visibleTestCases)) {
    return res.status(400).send("visibleTestCases must be an array");
}   
       
       console.log("problem create2")
      const submissions = visibleTestCases.map((testcase) => ({
  source_code: completeCode,
  language_id: languageId,
  stdin:Array.isArray(testcase.input) ? `[${testcase.input.join(",")}]` : testcase.input,
  expected_output: String(testcase.output).trim()
}));




console.log("problem create6")
console.log("🧾 Submissions payload:", JSON.stringify(submissions, null, 2));
     const submitResult = await submitBatch(submissions);
     if(!submitResult){
    return  res.send("submit result faild")
     }
console.log("problem create7")
      const resultToken = submitResult.map((value)=> value.token);
     if(resultToken.length === 0){
    return res.send("result token error")
}

console.log("problem create8")
      const testResult = await submitToken(resultToken);
      if(!testResult){
       return res.send("test result faild")
      }

console.log("problem create3")
         for(const test of testResult){
        if(test.status_id !=3){
           console.log("Failed Test:", test);
         return res.status(400).send("Error Occured is here");
        }
       }

}
console.log("problem create4")

    const userProblem =  await problem.create({
        ...req.body,
        problemCreator: req.user._id
      });
      console.log("problem create5")
  res.status(201).send("Problem Saved Successfully");

} catch(err){
        res.status(400).send("Error: "+err);

    }
})

// update problem by id // Admin work

ProblemRouter.put("/updateproblem/:id" ,AdminVerify,async (req,res) =>{
     
     const {id}=req.params;
  

   const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body

    try{

    if(!id){
      throw new Error("Enter your problem id")
     }



   const DsaProblem= await problem.findById(id);
      if(!DsaProblem){
        throw new Error("Problem not found");
   }
    for(const {language,completeCode} of referenceSolution){

     const languageId = getLanguageById(language);
                
     const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
     const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((value)=> value.token);

      const testResult = await submitToken(resultToken);


         for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }



    }
   const NewProblem=await problem.findByIdAndUpdate(id,{...req.body}, {runValidators:true, new:true})
   res.send("Problem update successfully")
    }
    catch(err){
        res.send("invalid error in update :" +err)
    }
})

// Delete Problem by id   // Admin work

ProblemRouter.delete("/deleteproblem/:id",AdminVerify,async (req,res) =>{
        
      const {id}=req.params
      try{
            
           if(!id){
          return res.send("id not find")
           }
         const Dsaproblem=await problem.findByIdAndDelete(id)
         if(!Dsaproblem){
           return res.send("problem not deleted")
         }
          res.send("Problem delete successfully")

        

      }catch(err){
        res.send("Invalid error"+err)
      }

})

// get problem id  problemSolved

ProblemRouter.get("/getproblem/:id" ,Userverify, async (req,res) =>{
  
       const {id}=req.params;

       try{
        if(!id){
          return res.send("Id not found")
        }

      const DsaProblem=await problem.findById(id);
      if(!DsaProblem){
      return res.send("problem not find")
      }
   
     
   return res.status(200).send({ problem: DsaProblem });


       }
       catch(err){
        res.send('Invalid error'+err)
       }
})

// get all problem problemSolved

ProblemRouter.get("/getAllProblem" , Userverify, async (req,res)=>{

      try{
         const Dsaproblem=await problem.find({}).select('_id title difficulty tags');
         if(!Dsaproblem){
          return res.send("Problem not found")
         }
         if(Dsaproblem.length==0 && !Dsaproblem){
         return res.status(200).json([]);     
        }
       
        return res.status(200).json(Dsaproblem);
        console.log(Dsaproblem);
      } catch(error){
         console.error("Error fetching problems:", error);
         res.status(500).send("Internal Server Error");
      }
})

// get problem solved by user

ProblemRouter.get("/Allsubmitproblem",Userverify, async (req, res) =>{

     try{
   
          const{_id}=req.user;
          if(!_id){
            return res.send("Id not found")
          }
         
      


      const Subprob=await User.findById(_id).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      })
  
      if (!Subprob) {
      console.log("User not found:", _id);
      return res.status(404).send("User not found");
    }

    
     
      res.send(Subprob.problemSolved);    

     } catch(Error){
      res.send("incalid request : " + Error)
     }

})

ProblemRouter.get("/submithistory/:id",Userverify, async (req,res) =>{
  try{
     console.log("hii response")
     console.log("req.user:", req.user);
    const userId = req.user._id;
    console.log("req.user:", req.user._id);
    const problemId = req.params.id;
    console.log("req.user:", req.params.id);

   const ans = await Submission.find({userId,problemId});
  
  if(ans.length==0)
    res.status(200).send("No Submission is persent");

  res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}
)

module.exports=ProblemRouter;

