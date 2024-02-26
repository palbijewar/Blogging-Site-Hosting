import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${comment.user_id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment.user_id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/comments/edit/${comment._id}`,{
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editedContent,
          }),
    });
    if(res.ok){
        setIsEditing(false);
        onEdit(comment, editedContent);
    }
  } catch (error) {
    console.log(error.message);
  }
  }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img  
          className='w-10 h-10 rounded-full bg-gray-200' 
          src={user.profile_picture} 
          alt={user.username} 
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? user.username : 'Anonymous User'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
            <>
         <Textarea
         className='mb-2'
         value={editedContent}
         onChange={(e)=>setEditedContent(e.target.value)}
         />
         <div className='flex justify-end gap-2 text-xs'>
         <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
            </Button>
            <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
         </div>
         </>
        ) : (
            <>
            <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}          
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.number_of_likes > 0 && comment.number_of_likes + " " + (comment.number_of_likes === 1 ? "like" : "likes")}
              </p>
              {
                currentUser && (currentUser._id === comment.user_id || currentUser.is_admin) && (
                  <>
                    <button
                    type='button'
                    onClick={handleEdit}
                    className='text-gray-400 hover:text-blue-500'
                  >
                        Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                      </>
                )
              }
            </div>
            </>
        )}
     
      </div>
    </div>
  );
}
