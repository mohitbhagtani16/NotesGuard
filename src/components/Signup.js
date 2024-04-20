import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:""}) 
  let navigate = useNavigate();

  const handleSubmit=async (e)=>{
          e.preventDefault();
          
          const response = await fetch("http://127.0.0.1:5000/api/auth/createuser", {
              method: "POST", 
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({name:credentials.name, email:credentials.email,password:credentials.password})
            });
            const json=await response.json();
            console.log(json);
           if(json.success){
              //redirect
              localStorage.setItem('token',json.authToken);
              navigate("/");
              props.showAlert(" Account created Successfully","success" )
            }
          else{
            props.showAlert("Invalid Credentials","danger");
          }
}
  const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
  return (
    <div className="container mt-2 bgImage">
      <h2>Signup to NotesGuard..</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
    <label htmlFor="name">Name</label>
    <input type="text" className="form-control my-1" id="name" name="name" onChange={onChange} required aria-describedby="emailHelp"/>
  </div>
  <div className="form-group">
    <label htmlFor="email">Email address</label>
    <input type="email" className="form-control my-1" id="email" name="email" onChange={onChange} required aria-describedby="emailHelp"/>
  </div>
  <div className="form-group">
    <label htmlFor="password">Password</label>
    <input type="password" className="form-control my-1" name="password" id="password"onChange={onChange} required minLength={5}/>
  </div>
  <div className="form-group">
    <label htmlFor="cpassword">Confirm Password</label>
    <input type="password" className="form-control my-2" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required/>
  </div>
  
  <button type="submit" className="btn btn-primary my-2">Submit</button>
</form>
    </div>
  )
}

export default Signup
