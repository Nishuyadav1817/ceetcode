import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {loginUser} from './authSlice';
import { useEffect,useState } from 'react';
import { NavLink } from 'react-router'; 

function Login() {
 
  const validator = z.object({
   EmailId: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });
   const Dispatch=useDispatch();
   const navigate=useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [loginAttempted, setLoginAttempted] = useState(false); 


  const {register, handleSubmit,formState: { errors },} = 
  useForm({ resolver: zodResolver(validator) });
  
  const submit = (data) => {
    setLoginAttempted(true);
    Dispatch(loginUser(data));
 
  };
  
useEffect(() => {
  if (isAuthenticated) {
    alert('Login successful!');
    navigate('/');
  }
}, [isAuthenticated, navigate,error]);

 const clickme=()=>{
  navigate('/register')
 } 
 
  return (
       <div className='img'>
<nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
           <button className='admin'><NavLink className='adm' to="/adminreg">Admin</NavLink></button>
    </nav>
    
    <div className="form-container">
      <h2>Ceetcode</h2>

      <form onSubmit={handleSubmit(submit)}>
     
    <div className="form-group">
          <label>Email</label>
          <input
            {...register('EmailId')}
            placeholder="Enter your email"
            type="email"
          />
          {errors.EmailId && (
            <span className="error">{errors?.EmailId?.message}</span>
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
            <span className="error">{errors?.password?.message}</span>
          )}
        </div>
         {loginAttempted && error && (
            <div className="error-message" style={{ color: 'red', marginTop: '4px' }}>
              {error}
            </div>
          )}
      
     
        <button className="btn" type="submit">
            {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className='lobtn'>create new account?
          <button className='lobtnn' onClick={(clickme)}>register</button>
        </div>
    </div>
     </div>
  );
 
}

export default Login;