import { useState,useEffect } from "react";
import axiosClient from './axiosClient';
import { User } from "lucide-react";
import { useDispatch,useSelector } from 'react-redux';
import {logoutUser } from './authSlice';
import { NavLink, useNavigate } from 'react-router';

function Solved(){

    const[solvedproblem, setproblem]=useState([]);
     const {user}=useSelector((state) => state.auth)
   const dispatch = useDispatch();
     const navigate=useNavigate();
   const fetchSolvedProblems=async () =>{
        try {
        const { data } = await axiosClient.get('/problem/Allsubmitproblem');
        console.log("Fetched solved problems:", data);
       setproblem(Array.isArray(data) ? data : []);
      } catch (error) {
       const err=error;
      }
   }
useEffect(() =>{
    fetchSolvedProblems()
},[]);

    const handleLogout = () => {
      dispatch(logoutUser());
      setproblem([]); 
      navigate("/login")
    };

return(
    <div>
   
      {/* Navbar */}
      <nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
    
        <ul className="hp-nav-links">
        <p ><NavLink className="All-prob" to="/">All Problem</NavLink></p>
         <li><button onClick={handleLogout} className="hp-logout-btn">Logout</button></li>
           <li > <User size={24} className="cursor-pointer " title="Admin" />  {user.firstName}</li>
         </ul>
      </nav>
 <div className="sp-container">
      <h2 className="sp-title">Solved Problems</h2>

      {solvedproblem.length === 0 ? (
        <p className="sp-empty">No solved problems found!</p>
      ) : (
        <div className="sp-problem-list">
          {solvedproblem.map((p) => (
            <div key={p._id} className="sp-problem-card">
              <h3>{p.title}</h3>
              <p>Difficulty: <strong>{p.difficulty}</strong></p>
              <p>Tags: {Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}</p>
            </div>
          ))}
        </div>
      )}
    </div></div>
)
}

export default Solved;