import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import {Oath} from '../components';
'use client';

export default function SignUp() {
const [formData, setFormData] = useState({});
const [errorMessage, setErrorMessage] = useState(null);
const [loading, setLoading] = useState(false)
const navigate = useNavigate();
const baseUrl = import.meta.env.VITE_BASE_URL;

const handleChange = (e) => {
 setFormData({...formData, [e.target.id]:e.target.value.trim()});
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!formData.username || !formData.password || !formData.email){
return setErrorMessage('Please fill out all fields.')
  }
  try {
    setLoading(true)
    setErrorMessage(null)
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if(data.success === false){
      return setErrorMessage(data.message);
    }
    setLoading(false);
    if(res.ok){
      navigate('/signin')
    }
  } catch (error) {
    setErrorMessage(error.message);
    setLoading(false);
  }
}


  return (
    <div className='min-h-screen mt-10'>
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'  >
      {/* left  */}
      <div className='flex-1' >
      <Link
        to='/'
        className='font-bold dark:text-white text-4xl'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Pal's
        </span>
        Blog
      </Link>
      <p className='text-sm mt-5'>
        This a blogging site . You can sign up using your email or Google.
      </p>
      </div>
      <div className='flex-1'>
        {/* rigth */}
        <div className='flex flex-col gap-4' >
        <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
  <div className="mb-4">
    <Label value="Your username"/>
      <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
  </div>
  <div className="mb-4">
    <Label value="Your email"/>
      <TextInput type="email" placeholder="name@email.com" id="email" onChange={handleChange} />
  </div>
  <div className="mb-4">
    <Label value="Your password" />
      <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
  </div>
  <Button
  gradientDuoTone='purpleToPink'
  type='submit'
  disabled={loading}
  >
{
  loading ? (
    <>
    <Spinner size='sm'/>
    <span className='pl-3' >Loading...</span>
    </>
  ) : 'Sign Up'
}
  </Button>
  <Oath/>
  <div className='flex gap-2 text-sm mt-5' >
    <span> Have an account already ? </span>
    <Link to='/signin' className='text-blue-500' >
    Sign In
    </Link>
    {
      errorMessage && (
        <Alert
        className='mt-5' 
        color='failure'
        >
         {errorMessage}
        </Alert>
      ) 
    }
  </div>
</form>
        </div>
      </div>
      </div>
    </div>
  )
}
