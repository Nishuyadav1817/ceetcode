import { useEffect, useState } from 'react';
import axiosClient from './axiosClient'
import { User } from "lucide-react";
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router'; 


const AdminDelete = () => {
   const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const {user}=useSelector((state) => state.auth)
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      await axiosClient.delete(`/problem/deleteproblem/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (err) {
      setError("Failed to delete problem");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
<nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
        <div className='new-admin'>
         <button className='admin'><NavLink className='adm' to="/adminreg">Admin Panel</NavLink></button>
          <h3> <User size={24} className="cursor-pointer " title="Admin" />  {user.firstName}</h3>
   </div>
    </nav>
   
    <div className="container">
      <div className="header">
        <h1>Delete Problems</h1>
      </div>

      <div className="table-wrapper">
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id}>
                <td>{index + 1}</td>
                <td>{problem.title}</td>
                <td>
                  <span
                    className={`difficulty ${
                      problem.difficulty.toLowerCase()
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>
                <td>
                  <span className="tag">{problem.tags}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> </div>
  );
};

export default AdminDelete;