import React, {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Sidebar} from 'flowbite-react'
import {HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi'
import { signoutUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const { currentUser } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
   if(tabFromUrl){
    setTab(tabFromUrl)
   }
  }, [location.search] )
  const handleSignout = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/signout`, {
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
   <Sidebar className='w-full md:w-56' >
    <Sidebar.Items>
<Sidebar.ItemGroup className='flex flex-col gap-1'>
  {
    currentUser && currentUser.is_admin && (
      <Link to='/dashboard?tab=dashboard'>
         <Sidebar.Item 
         active={tab==='dash' || !tab} 
         icon={HiChartPie} 
          as='div' >
        Dashboard
    </Sidebar.Item>
      </Link>
    )
  }
<Link to='/dashboard?tab=profile'>
    <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.is_admin ? 'Admin' : 'User'} labelColor='dark' as='div' >
        Profile
    </Sidebar.Item>
    </Link>
    {currentUser.is_admin && (
      <Link to='/dashboard?tab=posts'>
    <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} labelColor='dark' as='div' >
        Posts
    </Sidebar.Item>
    </Link>
    )}
     {currentUser.is_admin && (
      <>
      <Link to='/dashboard?tab=users'>
    <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} labelColor='dark' as='div' >
        Users
    </Sidebar.Item>
    </Link>
       <Link to='/dashboard?tab=comments'>
       <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} labelColor='dark' as='div' >
           Comments
       </Sidebar.Item>
       </Link>
       </>
    )}
    <Sidebar.Item onClick={handleSignout} active icon={HiArrowSmRight} className='cursor-pointer' >
        Sign Out
    </Sidebar.Item>
</Sidebar.ItemGroup>
    </Sidebar.Items>
   </Sidebar>
  )
}
