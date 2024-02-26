import { Table, Modal, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

function DashUsers() {
    const [users, setUsers] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/users`, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok && data && data.totalUsersWithoutPasswords) {
                    setUsers(data.totalUsersWithoutPasswords);
                    setShowMore(data.totalUsersWithoutPasswords.length >= 9);
                }
            } catch (error) {
                console.error('Error fetching users:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser.is_admin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/users?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok && data && data.totalUsersWithoutPasswords) {
                setUsers(prevUsers => [...prevUsers, ...data.totalUsersWithoutPasswords]);
                setShowMore(data.totalUsersWithoutPasswords.length >= 9);
            }
        } catch (error) {
            console.error('Error fetching more users:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`http://localhost:3000/api/users/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
            } else {
                console.error('Error deleting user:', data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser && currentUser.is_admin && (
                <>
                    {loading ? (
                        <p>Loading...</p>
                    ) : users.length > 0 ? (
                        <>
                            <Table hoverable className='shadow-md'>
                                <Table.Head>
                                    <Table.HeadCell>Date Created</Table.HeadCell>
                                    <Table.HeadCell>User image</Table.HeadCell>
                                    <Table.HeadCell>Username</Table.HeadCell>
                                    <Table.HeadCell>Admin</Table.HeadCell>
                                    <Table.HeadCell>Delete</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {users.map(user => (
                                        <React.Fragment key={user._id}>
                                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>
                                                    <img src={user.profile_picture} alt={user.username} className='w-10 h-10 object-cover rounded-full bg-gray-500' />
                                                </Table.Cell>
                                                <Table.Cell>{user.username}</Table.Cell>
                                                <Table.Cell>
                                                    {user.is_admin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }}>Delete</span>
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
                        <p>No users to show</p>
                    )}
                    <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 md-4 mx-auto' />
                                <h3 className='mb-5 text-md text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                                <div className='flex justify-center gap-4 '>
                                    <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
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

export default DashUsers;
