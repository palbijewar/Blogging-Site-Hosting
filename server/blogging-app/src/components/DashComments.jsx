import { Table, Modal, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashComments() {
    const [comments, setComments] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/comments`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok) {
                    setComments(data.allComments);
                    setShowMore(data.allComments.length >= 9);
                }
            } catch (error) {
                console.error('Error fetching users:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser.is_admin) {
            fetchComments();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/comments?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setComments(prevComment => [...prevComment, ...data.allComments]);
                if(data.allComments.length < 9){
                setShowMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching more comments:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`http://localhost:3000/api/comments/delete/${commentIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setComments(prevComment => prevComment.filter(comment => comment._id !== commentIdToDelete));
            } else {
                console.error('Error deleting comment:', data.message);
            }
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser && currentUser.is_admin && (
                <>
                    {loading ? (
                        <p>Loading...</p>
                    ) : comments.length > 0 ? (
                        <>
                            <Table hoverable className='shadow-md'>
                                <Table.Head>
                                    <Table.HeadCell>Date Updated</Table.HeadCell>
                                    <Table.HeadCell>Comment Content</Table.HeadCell>
                                    <Table.HeadCell>Number of likes</Table.HeadCell>
                                    <Table.HeadCell>PostId</Table.HeadCell>
                                    <Table.HeadCell>UserId</Table.HeadCell>
                                    <Table.HeadCell>Delete</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {comments.map(comment => (
                                        <React.Fragment key={comment._id}>
                                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>
                                                   {comment.content}
                                                </Table.Cell>
                                                <Table.Cell>{comment.number_of_likes}</Table.Cell>
                                                <Table.Cell>
                                                    {comment.post_id}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {comment.user_id}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }}>Delete</span>
                                                </Table.Cell>
                                            </Table.Row>
                                        </React.Fragment>
                                    ))}
                                </Table.Body>
                            </Table>
                            {showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
                            )}
                        </>
                    ) : (
                        <p>No comments to show</p>
                    )}
                    <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 md-4 mx-auto' />
                                <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                                <div className='flex justify-center gap-4 '>
                                    <Button color='failure' onClick={handleDeleteComment}>Yes, I am sure</Button>
                                    <Button color='success' onClick={() => setShowModal(false)}>No, cancel</Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
}

export default DashComments;
