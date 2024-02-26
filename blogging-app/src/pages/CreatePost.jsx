import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null)
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null)
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleUploadImage = async () => {
    try {
      if(!file){
        setImageFileUploadingError('Please select an image')
      }
      setImageFileUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName); 
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageFileUploadingProgress(progress.toFixed(0))
        },
        (error) => {
          setImageFileUploadingError('Image upload failed')
          setImageFileUploadingProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadingProgress(null)
            setImageFileUploadingError(null)
            setFormData({...formData, image: downloadURL })
          })
        },
        )
    } catch (error) {
      setImageFileUploadingError('Image upload failed')
      setImageFileUploadingProgress(null)
    }
  }
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${baseUrl}/api/posts/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      setPublishError(data.message);
    }
    if (res.ok) {
      setPublishError(null);
      console.log(`/posts/${data.slug}`);
      navigate(`/posts/${data.slug}`);
      setFormData({});
    }    
  } catch (error) {
    console.log(error.message)
  }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen' >
      <h1 className='text-center text-3xl my-7 font-semibold' >Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
       <TextInput type='text' placeholder='Title' required id=';title' className='flex-1' onChange={(e)=>setFormData({...formData, title: e.target.value})} />
       <Select
       onChange={(e)=>setFormData({...formData, category: e.target.value})}
       >
        <option value="uncategorized">Select a category</option>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="react">React.js</option>
        <option value="next">Next.js</option>
        <option value="node">Node.js</option>
       </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3' >
        <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
        <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageFileUploadingProgress} >
          {
            imageFileUploadingProgress ? (
            <div className='w-16 h-16'>
               <CircularProgressbar
               value={imageFileUploadingProgress || 0}
               text={`${imageFileUploadingProgress}%`}
              />
            </div>
              )  : ( 'Upload Image'
         )} 
        </Button>
        </div>
        {
          imageFileUploadingError && (
            <Alert color='failure'>
              {imageFileUploadingError}
            </Alert>
          )
        }
        {
          formData.image && (
            <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
            />
          )
        }
        <ReactQuill 
        theme='snow' 
        placeholder='Write something....' 
        className='h-72 mb-12' 
        required 
        onChange={
          (value)=>{
            setFormData({...formData, content: value})
          }
        }
        />
        <Button type='submit' gradientDuoTone='purpleToPink' >Publish</Button>
        {
          publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
        }
      </form>
    </div>
  )
}

export default CreatePost
