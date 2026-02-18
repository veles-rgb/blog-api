// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { API_BASE_URL } from '../config/api';

// import { FaRegUserCircle, FaClock } from 'react-icons/fa';
// import { MdEmail } from 'react-icons/md';

export default function AllUsers() {
  //   const [users, setUsers] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [errorMsg, setErrorMsg] = useState(null);

  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (!token) return;
  //     if (!user.isAdmin) {
  //       navigate('/');
  //     }

  //     async function fetchUsers() {
  //       try {
  //         setIsLoading(true);

  //         const res = await fetch(`${API_BASE_URL}/api/users`, {
  //           method: 'GET',
  //           headers: { Authorization: `Bearer ${token}` },
  //         });

  //         if (!res.ok) {
  //           throw new Error(`Something went wrong. ${res.status}`);
  //         }

  //         const results = await res.json();

  //         setUsers(results.users || []);
  //         setErrorMsg(null);
  //       } catch (error) {
  //         setErrorMsg(error.message);
  //         setUsers([]);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     fetchUsers();
  //   }, [user?.isAdmin, navigate]);

  //   if (isLoading)
  //     return (
  //       <div
  //         style={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}
  //       >
  //         Loading...
  //       </div>
  //     );

  //   if (users.length < 1)
  //     return (
  //       <div
  //         style={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}
  //       >
  //         No users yet.
  //       </div>
  //     );

  //   return (
  //     <main>
  //       <h1>All Users</h1>
  //       <h2>This feature's development has been paused.</h2>
  //       {errorMsg && <p>{errorMsg}</p>}
  //       <div
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'column',
  //           gap: '0.5rem',
  //           margin: '1rem',
  //         }}
  //       >
  //         {users.map((user) => {
  //           return (
  //             <div
  //               style={{
  //                 border: '1px solid var(--primary)',
  //                 borderRadius: '1rem',
  //                 padding: '1rem',
  //               }}
  //             >
  //               <div
  //                 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
  //               >
  //                 <FaRegUserCircle /> {user.username}
  //               </div>
  //               <div
  //                 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
  //               >
  //                 <MdEmail /> {user.email}
  //               </div>
  //               <div>ID: {user.id}</div>
  //               <div
  //                 style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
  //               >
  //                 <FaClock />
  //                 {new Date(user.createdAt).toISOString().split('T')[0] +
  //                   ' ' +
  //                   new Date(user.createdAt).toLocaleTimeString('en-US', {
  //                     hour: '2-digit',
  //                     minute: '2-digit',
  //                     hour12: true,
  //                   })}
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </main>
  //   );

  return (
    <main>
      <h1>This feature's development has been paused.</h1>
      <p>
        The goal of this page was to display all users with CRUD actions for
        moderation.
      </p>
    </main>
  );
}
