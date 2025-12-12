const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "cpp": 54,
        "c++":54,
        "java": 62,
        "javascript": 63
    };

    const id = language[lang.toLowerCase()];
    if (!id) throw new Error(`Invalid language: ${lang}`);
    return id;
}

// judge0 implementation
 const submitBatch =async (submissions)=>{
    
const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': 'd99565ededmshee96da456f0ac28p1dec75jsnf4b1c5bdd658',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data:{

   submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
console.error("error is "+error)
 throw new Error("Judge0 submission failed");
	}
}

 return await  fetchData();

 }

const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

const submitToken = async(resultToken)=>{
    const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'd99565ededmshee96da456f0ac28p1dec75jsnf4b1c5bdd658',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
console.error("error is :"+error)
	}
}


 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}
}


module.exports = {getLanguageById,submitBatch,submitToken};