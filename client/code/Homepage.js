import { useEffect, useState } from 'react';
import axiosClient from './axiosClient';
import { useSelector,useDispatch } from 'react-redux';
import { NavLink } from 'react-router'; 
import {logoutUser } from './authSlice';
import { useNavigate } from 'react-router';
import { User } from "lucide-react";

function Homepage(){
     const dispatch = useDispatch();
    const navigate=useNavigate();
    const[problem,setproblem]=useState([]);
    const[solvedproblem,setsolvedproblem]=useState([]);
    const {user}=useSelector((state) => state.auth)
     const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
console.log(user)
    useEffect(()=>{
         
       const fetchproblem=async () => {
        try{
           console.log("Fetching problems...");
           const {data}=await axiosClient.get('/problem/getAllProblem');
           console.log("Data received:", data);
           setproblem(data);
        }catch(error){
             const err=error;
             console.log(err);
        }
       }

 const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/Allsubmitproblem');
        setsolvedproblem(data);
      } catch (error) {
       const err=error;
      }
    };


   fetchproblem();
    if (user) fetchSolvedProblems();


    },[])

    const handleLogout = () => {
      dispatch(logoutUser());
      setproblem([]); 

    };
  

  const filteredProblems = Array.isArray(problem)?
  problem.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
   
    return difficultyMatch && tagMatch ;
  }):[];
  

  return(
    
 
    <div className="hp-container">
      {/* Navbar */}
      <nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
        <ul className="hp-nav-links ">
         
         
          <li><NavLink to="/solved" className="hp-nav-item">Solved Problems</NavLink></li>
          {user ? (
         
            <li><button onClick={handleLogout} className="hp-logout-btn">Logout</button></li>
         
         
          ) : (
            <li><NavLink to="/login" className="hp-nav-item">Login</NavLink></li>
          )}
          
            <li > <User size={24} className="cursor-pointer " title="Admin" />  {user.firstName}</li>
        </ul>
      </nav>

      {/* Filters */}
      <div className="hp-filters">
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          className="hp-filter-select"
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          className="hp-filter-select"
        >
          <option value="all">All Tags</option>
          <option value="array">Array</option>
          <option value="string">String</option>
          <option value="graph">Graph</option>
          <option value="dp">Dynamic Programming</option>
        </select>

        
      </div>

      {/* Problems List */}
    <div className="hp-problem-list">
  {filteredProblems.length === 0 ? (
    <p className="hp-empty">No problems found!</p>
  ) : (
    filteredProblems.map((p) => {
      const isSolved = Array.isArray(solvedproblem)
        ? solvedproblem.some((sp) => sp._id === p._id)
        : false;

      return (
        <div
          key={p._id}
          className={`hp-problem-card ${
            isSolved ? 'hp-solved' : 'hp-unsolved'
          }`}
        >
          <h3>{p.title}</h3>
          <p>
            Difficulty: <strong>{p.difficulty}</strong>
          </p>
          <p>Tags: {Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}</p>
          <NavLink to={`/problem/${p._id}`} className="hp-view-btn">
            View Problem
          </NavLink>
        </div>
      );
    })
  )}
      </div>
      
    </div>

  )

  
}
export default Homepage;