import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Swal from 'sweetalert2';


const SignUp = () => {
    const {createUser}=use(AuthContext)

    const handleSignUp = e =>{
      e.preventDefault();
      const form=e.target;
      const formData=new  FormData(form);
      const {email,password,...restformdata} =Object.fromEntries(formData.entries())
      
    //   create user in the fire base
    createUser(email,password)
     .then((result) => {  
    console.log(result.user)
    const userProfile={
        email,
        ...restformdata,
        creationTime:result.user?.metadata?.creationTime,
        lastSignInTime:result.user?.metadata?.lastSignInTime
      }
      console.log(email,password,userProfile)



    // save profile info in the db
    fetch('https://coffee-store-server-mu-three.vercel.app/users',{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(userProfile)
    })
    .then(res=>res.json())
    .then(data=>{
       if(data.insertedId){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your account is created",
            showConfirmButton: false,
            timer: 1500
            });
       }
    })
  })
  .catch((error) => {
   console.log(error)
  });
    }
    return (
        
    <div className="card bg-base-100 mx-auto max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
         <h1 className="text-5xl font-bold">Sign Up now!</h1>
        <form onSubmit={ handleSignUp} className="fieldset">
          <label className="label">Name</label>
          <input type="text" name='name' className="input" placeholder="Your name" />
          <label className="label">Address</label>
          <input type="test" name='adderss' className="input" placeholder="Address" />
          <label className="label">Phone</label>
          <input type="test" name='phone' className="input" placeholder="Photo number" />
          <label className="label">Photo</label>
          <input type="text" name='photo' className="input" placeholder="photo url" />
          <label className="label">Email</label>
          <input type="email" name='email' className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" name='password' className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">SignUp</button>
        </form>
      </div>
    </div>
  
    );
};

export default SignUp;