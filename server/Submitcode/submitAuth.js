const Express=require("express")
const SubmitRouter=Express.Router();
const Submit=require("./submitschema");
const userVerify=require("../Middlewere/usermidlewere");
const Problem = require("../Questions/probshema");
const {getLanguageById,submitBatch,submitToken} = require("../Questions/proValidator");

//submit by id
SubmitRouter.post("/submitproblem/:id",userVerify,async (req,res)=>{
console.log("console")
        try{

 
          const userId=req.user._id;
            console.log("submit api hit2")
          if(!userId){
            return res.send("user id is missing or not found")
          }

          const problemId=req.params.id;
           
          if(!problemId){
            return res.send("Problem id is missing or not found")
          }

          const{code,language}=req.body;
            
        if(!code){
            return res.send("code is missing")
        }
        if(!language){
            return res.send("language name is missing")
        }

       const problem=await Problem.findById(problemId);

       const submitcode=await Submit.create({
           userId,problemId,code,language,
           status:'pending',
           testCasesTotal: problem.hiddenTestCases ? problem.hiddenTestCases.length : 0

       })
       // work of juge0

        
           const languageId = getLanguageById(language);
       
           const submissions = problem.hiddenTestCases.map((testcase)=>({
               source_code:code,
               language_id: languageId,
               stdin: testcase.input,
               expected_output: testcase.output
           }));
    
       
           const submitResult = await submitBatch(submissions);
           
           const resultToken = submitResult.map((value)=> value.token);
         
           const testResult = await submitToken(resultToken);
         let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

  
    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = 'error'
            errorMessage = test.stderr
          }
          else{
            status = 'wrong'
            errorMessage = test.stderr
          }
        }
    }
   submitcode.status   = status;
   submitcode.testCasesPassed = testCasesPassed;
   submitcode.errorMessage = errorMessage;
   submitcode.runtime = runtime;
   submitcode.memory = memory;

    await submitcode.save();
    
     if(!req.user.problemSolved.includes(problemId)){
        req.user.problemSolved.push(problemId);
        await req.user.save();
     }
    
      res.send("code submitted successfully");


        }catch(err){
            res.send("user submit error :"+err)
        }
})

// run code
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
SubmitRouter.post("/run/:id" , userVerify, async (req, res)=>{
           console.log("first hit here ")
      console.log("first hit here");
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).send("User ID missing");

    const problemId = req.params.id;
    if (!problemId) return res.status(400).send("Problem ID missing");

    const { code, language } = req.body;
    if (!code) return res.status(400).send("Code is missing");
    if (!language) return res.status(400).send("Language is missing");

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    if (!Array.isArray(problem.hiddenTestCases)) {
      return res.status(400).send("No hidden test cases found for this problem");
    }

    const languageId = getLanguageById(language);
    if (!languageId) return res.status(400).send("Unsupported language");

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    await sleep(2000);
    const testResult = await submitToken(resultToken);

   const result = Array.isArray(testResult) ? testResult[0] : testResult;

res.status(200).json({
  message: result.status?.description,
  expected_output: result.expected_output,
  actual_output: result.stdout
});

  } catch (error) {
  console.error("Run error:", error); // Keep this
  res.status(500).json({
    success: false,
    error: error.message,
    stack: error.stack, // 👈 add this temporarily to see where it fails
  });
}
});


module.exports=SubmitRouter;
