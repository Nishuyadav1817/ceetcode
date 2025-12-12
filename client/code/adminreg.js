import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {registerAdmin} from './authSlice';
import { useEffect } from 'react';
import { NavLink } from 'react-router'; 


function NewAdmin(){

  const validator = z.object({
   FirstName: z.string().min(3, 'Minimum 3 characters required'),
    EmailId: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });
   const Dispatch=useDispatch();
   const Navigate=useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
   
  const {register, handleSubmit,formState: { errors },} = 
  useForm({ resolver: zodResolver(validator) });



  
const submit = (data) => {
    Dispatch(registerAdmin(data));
    alert("New admin registor")
  
  };


  
    if (loading) {
    return (
      <div className='spin'>
    <div className="spinner"></div>
    </div>
    )
  }


  
  return (
<div className='img'>
   <nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
           <button className='admin'><NavLink className='adm' to="/adminreg">Admin Panel</NavLink></button>
    </nav>
    
 
    <div className="form-container">
      <h2 className="formh1">Ceetcode</h2>

      <form onSubmit={handleSubmit(submit)}>
     
        <div className="form-group">
          <label>First Name</label>
          <input
            {...register('FirstName')}
            placeholder="Enter your name"
            type="text"
          />
          {errors.FirstName && (
            <span className="error">{errors.FirstName.message}</span>
          )}
        </div>

    
        <div className="form-group">
          <label>Email</label>
          <input
            {...register('EmailId')}
            placeholder="Enter your email"
            type="email"
          />
          {errors.EmailId && (
            <span className="error">{errors.EmailId.message}</span>
          )}
        </div>

     <div className="form-group">
          <label>Role</label>
          <input
            {...register('role')}
            placeholder="Enter your role"
            type="text"
          />
          {errors.role && (
            <span className="error">{errors.role.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            {...register('password')}
            placeholder="Enter your password"
            type="password"
          />
          {errors. password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

      
        <button className="btn" type="submit">
         Registor
        </button>
       
      </form>
      
    </div></div>
  );
}

export default NewAdmin;
