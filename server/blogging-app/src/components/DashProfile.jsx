import { TextInput, Button, Alert, Modal } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutUserSuccess } from '../redux/user/userSlice.js';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom'

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const filePickerRef =  useRef()
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null)
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserFailure, setUpdateUserFailure] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if(file){
    setImageFile(file)
    setImageFileUrl(URL.createObjectURL(file))
  }
};

useEffect(() => {
  if(imageFile){
    uploadImage();
  }
}, [imageFile])

const uploadImage = async () => {
 setImageFileUploading(true)
 const storage = getStorage(app);
 const fileName = new Date().getTime() + imageFile.name
 const storageRef = ref(storage, fileName)
 const uploadTask = uploadBytesResumable(storageRef, imageFile)
 uploadTask.on(
  'state_changed',
  (snapshot) => {
    const progress = 
    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    setImageFileUploadingProgress(progress.toFixed(0))
  },
  (error) => {
    setImageFileUploadingError('Could not upload image (file must be 2MB)!')
    setImageFileUploadingProgress(null)
    setImageFileUrl(null)
    setImageFileUploading(false)
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setImageFileUrl(downloadURL)
      setFormData({...formData, profile_picture: downloadURL })
      setImageFileUploading(false)
    })
  },
 )
}

const handleInputChange = (e) => {
  setFormData({...formData, [e.target.id] : e.target.value});
  
}

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setUpdateUserSuccess(null)
  setUpdateUserFailure(null)
  if(Object.keys(formData).length === 0){
    setUpdateUserFailure("No changes made")
    return;
  }
  if(imageFileUploading){
    setUpdateUserFailure("Please wait for image to upload")
    return
  }
  try {
    dispatch(updateStart());
    const res = await fetch(`${baseUrl}/api/users/${currentUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
    
    const data = await res.json();
    if(!res.ok){
      dispatch(updateFailure(data.message));
      setUpdateUserFailure(data.message)
    } else {
      dispatch(updateSuccess(data))
      setUpdateUserSuccess("User's profile updated successfully!")
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateUserFailure(error.message)
  }
}

const handleDeleteUser = async () => {
  setShowModal(false);
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`${baseUrl}/api/users/${currentUser._id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to delete user');
    }
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};

const handleSignout = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/users/signout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to sign out');
    } else {
      dispatch(signoutUserSuccess());
    }
  } catch (error) {
    console.error(error.message);
  }
};

  return (
    <div className='max-w-lg mx-auto p-3 w-full' >
     <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>
     <form onSubmit={handleFormSubmit} className='flex flex-col gap-4 '>
      <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
      <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()} >
  <img src={imageFileUrl || currentUser.profile_picture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress<100 && 'opacity-60' } `} />
  {imageFileUploadingProgress && (
    <div className="absolute inset-0 flex items-center justify-center">
      <CircularProgressbar
        value={imageFileUploadingProgress || 0}
        text={`${imageFileUploadingProgress}%`}
        strokeWidth={5}
        styles={{
          root: { width: '100%', height: '100%' },
          path: { stroke: `rgba(62, 152, 199, ${imageFileUploadingProgress / 100})` }
        }}
      />
    </div>
  )}
</div>
      {imageFileUploadingError &&  <Alert color='failure' >{}</Alert> }
      <TextInput 
      type='text' 
      id='username' 
      placeholder='username'
      defaultValue={currentUser.username}
      onChange={handleInputChange}
      />
      <TextInput 
      type='text' 
      id='email' 
      placeholder='email' 
      defaultValue={currentUser.email}
      onChange={handleInputChange}
      />
      <TextInput 
      type='text' 
      id='password' 
      placeholder='Password'
      onChange={handleInputChange}
      />
      <Button
      type='submit'
      gradientDuoTone='purpleToBlue'
      outline
      disabled={loading || imageFileUploading}
      >
        { loading ? 'Loading...' : 'Update' }
      </Button>
      {currentUser && currentUser.is_admin && (
  <Link to={'/create-post'}>
    <Button
      type='button'
      gradientDuoTone='purpleToPink'
      className='w-full'
    >
      Create a post
    </Button>
  </Link>
)}
     </form>
     <div className='text-red-500 flex justify-between mt-5' >
      <span onClick={()=>setShowModal(true)} className='cursor-pointer' >Delete Account</span>
      <span onClick={handleSignout} className='cursor-pointer' >Sign Out</span>
     </div>
     {
      updateUserSuccess && (
        <Alert color='success' className='mt-5' >
          {updateUserSuccess}
        </Alert>
      )
     }
      {
      updateUserFailure && (
        <Alert color='failure' className='mt-5' >
          {updateUserFailure}
        </Alert>
      )
     }
     {
      error && (
        <Alert color='failure' className='mt-5' >
          {error}
        </Alert>
      )
     }
     <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
      <Modal.Header/>
      <Modal.Body>
         <div className="text-center">
          <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 md-4 mx-auto' />
        <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400' >Are you sure you want to delete your account ?</h3>
        <div className='flex justify-center gap-4 ' >
          <Button
          color='failure' 
          onClick={handleDeleteUser} >Yes, I am sure
          </Button>
          <Button 
          color='success' 
          onClick={() => setShowModal(false)} >No, cancel
          </Button>
        </div>
         </div>
      </Modal.Body>
     </Modal>
    </div>
  )
}
