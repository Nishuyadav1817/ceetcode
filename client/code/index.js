import react from "react";
import ReactDOM from "react-dom/client"
import Registor from "./Register";
import Login from "./Login";
import { BrowserRouter } from "react-router";
import {Routes, Route,Navigate } from "react-router";
import { useDispatch, useSelector,Provider } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import Homepage from "./Homepage"
import Solved from "./solved";
import Problem from "./problem"
import Adminreg from "./adminlogin";
import Admin from "./Admin";
import Createproblem from "./createprob";
import NewAdmin from "./adminreg";
import Probdel from "./probdel";

function Index(){

const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

   
  return(
   
    <BrowserRouter>
    <Routes>
    <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to='/register'></Navigate>}></Route>
    <Route path="/register" element={isAuthenticated?<Navigate to='/'></Navigate>:<Registor></Registor>}> </Route>
    <Route path="/login"   element={ isAuthenticated?<Navigate to='/'></Navigate>:<Login></Login>}></Route>
     <Route path="/solved" element={<Solved />} />
    <Route path="/adminreg" element={<Adminreg />}></Route>
    <Route path="/admin" element={<Admin/>} />
    <Route path="/admin/delete" element={<Probdel/>}></Route>
    <Route path="/admin/register" element={<NewAdmin></NewAdmin>}></Route>
    <Route path="/admin/create" element={<Createproblem/>}></Route>
    <Route path="/problem/:problemId" element={<Problem />} />
    </Routes>
    </BrowserRouter>
   
  )
  
}

export default Index;
