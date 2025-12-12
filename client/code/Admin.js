import React, { useState,useEffect } from 'react';
import { Plus, Edit, Trash2,User, Home, RefreshCw, Zap } from 'lucide-react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';



function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);
   const {user}=useSelector((state) => state.auth)
   console.log(user)
 if(user.role!=="admin"){
  return(
    <div>
      <button className='not-adm-btn'><NavLink to="/register" className="not-adm-link" >register</NavLink></button>
    <img src='https://thumbs.dreamstime.com/b/no-emoticon-29087585.jpg' ></img>
    <h1 className='not-adm'>You are not admin</h1></div>
  )

 }

 

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/create'
    },
 
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/10',
      route: '/admin/delete'
    }
  ];

 

  return (

<div className='img'>
  <nav className="hp-navbar">
        <div className="hp-logo">
          <h2>Ceetcode</h2>
        </div>
        <div className='new-admin'>
       <p><NavLink className="new-admin1" to="/admin/register">New Admin</NavLink></p>
      <h3> 
        <User size={24} className="cursor-pointer " title="Admin" /> {user.firstName}</h3>
 </div>
    </nav>


   <div className="admin-page">
  <div className="admin-container">
    <div className="admin-header">
      <h1>Admin Panel</h1>
      <p>Manage coding problems on your platform</p>
    </div>

    <div className="admin-grid">
      {adminOptions.map((option) => {
        const IconComponent = option.icon;
        return (
          <div key={option.id} className="admin-card">
            <div className="admin-card-body">
              <div className={`admin-icon ${option.bgColor}`}>
                <IconComponent size={32} />
              </div>

              <h2 className="admin-title">{option.title}</h2>
              <p className="admin-description">{option.description}</p>

              <div className="card-actions">
                <NavLink to={option.route} className={`btn ${option.color} btn-wide`}>
                  {option.title}
                </NavLink>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
</div>
  );
}

export default Admin;