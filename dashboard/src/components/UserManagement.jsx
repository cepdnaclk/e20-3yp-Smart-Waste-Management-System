// import React, { use,useEffect } from 'react';
// import { Users, Edit, Trash2, Plus,Pencil } from 'lucide-react';

// const UserManagement = ({ activeTab, onAction }) => {

//   const [tab1Data, setTab1Data] = useState([]);
//   const [tab1Loading, setTab1Loading] = useState(true);
//   const [tab1Error, setTab1Error] = useState(null);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//         fetch('/api/admin/users', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         })
//           .then(response => {
//             if (!response.ok) throw new Error('Failed to fetch users');
//             return response.json();
//           })
//           .then(data => {
//             console.log(data);
//             // Ensure data is an array
//             setTab1Data(Array.isArray(data.data) ? data.data : []);
//             setTab1Loading(false);
//           })
//           .catch(error => {
//             setTab1Error(error.message);
//             setTab1Loading(false);
//             setTab1Data([]); // Set to empty array on error
//           });
//       }, [token]);

//   const renderCollectorsTab = () => {
//     return (
//       <section className="">
//       <div className="page-header">
//               <Users size={24} />
//               <h1 className="page-title">All Collectors</h1>
//       </div>   
//         <div className="card-header">
//         <div></div>       
//           <button 
//             className="btn btn--primary"
//             onClick={() => onAction('add', { type: 'collector' })}
//           >
//             <Plus size={16} />
//             Add Collector
//           </button>
//         </div>
//         <div className="table-wrapper">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>User Id</th>
//                 <th>Role</th>
//                 <th>Username</th>
//                 <th>Join date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
// {tab1Data
//   .filter(collector => collector.role.role === 'ROLE_COLLECTOR') // <- filter here
//   .map(collector => (                                       // <- then map
//     <tr key={collector.id}>
//       <td>Collector</td>
//       <td>{collector.username}</td>
//       <td>{collector.createdAt}</td>
//       <td>
//         <div className="action-buttons">
//           <button 
//             className="btn-icon btn-icon--primary"
//             onClick={() => onAction && onAction('edit', collector)}
//             title="Edit User"
//           >
//             <Pencil size={16} />
//           </button>
//           <button 
//             className="btn-icon btn-icon--danger"
//             onClick={() => onAction && onAction('delete', collector)}
//             title="Delete User"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </td>
//     </tr>
// ))}

//             </tbody>
//           </table>
//         </div>
//       </section>
//     );
//   };

//   const renderBinUsersTab = () => {
//     return (
//       <section className="">
//        <div className="page-header">
//               <Users size={24} />
//               <h1 className="page-title">All Bin Users</h1>
//       </div>  
//         <div className="card-header">
//           <h3 className="card__title"></h3>
//           <button 
//             className="btn btn--primary"
//             onClick={() => onAction('add', { type: 'binUser' })}
//           >
//             <Plus size={16} />
//             Add Bin User
//           </button>
//         </div>
//                 <div className="table-wrapper">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>User Id</th>
//                 <th>Role</th>
//                 <th>Username</th>
//                 <th>Join date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
// {tab1Data
//   .filter(collector => collector.role.role === 'ROLE_BIN_USER') // <- filter here
//   .map(collector => (                                       // <- then map
//     <tr key={collector.id}>
//       <td>Bin User</td>
//       <td>{collector.username}</td>
//       <td>{collector.createdAt}</td>
//       <td>
//         <div className="action-buttons">
//           <button 
//             className="btn-icon btn-icon--primary"
//             onClick={() => onAction && onAction('edit', collector)}
//             title="Edit User"
//           >
//             <Pencil size={16} />
//           </button>
//           <button 
//             className="btn-icon btn-icon--danger"
//             onClick={() => onAction && onAction('delete', collector)}
//             title="Delete User"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </td>
//     </tr>
// ))}

//             </tbody>
//           </table>
//         </div>
//       </section>
//     );
//   };

//   const renderAdminUsersTab = () => {
//     return (
//       <section className="">
//          <div className="page-header">
//               <Users size={24} />
//               <h1 className="page-title">All Admin Users</h1>
//       </div>  
//         <div className="card-header">
//           <h3 className="card__title"></h3>
//           <button 
//             className="btn btn--primary"
//             onClick={() => onAction('add', { type: 'admin' })}
//           >
//             <Plus size={16} />
//             Add Admin User
//           </button>
//         </div>
//                <div className="table-wrapper">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>User Id</th>
//                 <th>Role</th>
//                 <th>Username</th>
//                 <th>Join date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
// {tab1Data
//   .filter(collector => collector.role.role === 'ROLE_ADMIN') // <- filter here
//   .map(collector => (                                       // <- then map
//     <tr key={collector.id}>
//       <td>Admin user</td>
//       <td>{collector.username}</td>
//       <td>{collector.createdAt}</td>
//       <td>
//         <div className="action-buttons">
//           <button 
//             className="btn-icon btn-icon--primary"
//             onClick={() => onAction && onAction('edit', collector)}
//             title="Edit User"
//           >
//             <Pencil size={16} />
//           </button>
//           <button 
//             className="btn-icon btn-icon--danger"
//             onClick={() => onAction && onAction('delete', collector)}
//             title="Delete User"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </td>
//     </tr>
// ))}

//             </tbody>
//           </table>
//         </div>
//       </section>
//     );
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'tab1':
//         return renderCollectorsTab();
//       case 'tab2':
//         return renderBinUsersTab();
//       case 'tab3':
//         return renderAdminUsersTab();
//       default:
//         return renderCollectorsTab();
//     }
//   };

//   return (
//     <main className="page-content">
      
//       <div className="page-grid">
//         {renderTabContent()}
//       </div>
//     </main>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect } from 'react';
import { Users, Trash2, Plus, Pencil } from 'lucide-react';

const UserTable = ({ title, users, roleFilter, onAction, addUserType }) => (
  <section>
    <div className="page-header">
      <Users size={24} />
      <h1 className="page-title">{title}</h1>
    </div>

    <div className="card-header">
      <div></div> {/* For spacing */}
      <button
        className="btn btn--primary"
        onClick={() => onAction('add', { type: addUserType })}
      >
        <Plus size={16} />
        Add {addUserType.charAt(0).toUpperCase() + addUserType.slice(1)}
      </button>
    </div>

    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>User Id</th>
            <th>Role</th>
            <th>Username</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.role.role === roleFilter)
            .map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.role.role.replace('ROLE_', '').replace('_', ' ')}</td>
                <td>{user.username}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-icon--primary"
                      onClick={() => onAction('edit', user)}
                      title="Edit User"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon--danger"
                      onClick={() => onAction('delete', user)}
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </section>
);

const UserManagement = ({ activeTab, onAction = () => {} }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err.message);
        setUsers([]); // Clear users on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (isLoading) {
    return <main className="page-content">Loading users...</main>;
  }

  if (error) {
    return <main className="page-content">Error: {error}</main>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <UserTable title="All Collectors" users={users} roleFilter="ROLE_COLLECTOR" onAction={onAction} addUserType="Collector" />;
      case 'tab2':
        return <UserTable title="All Bin Users" users={users} roleFilter="ROLE_BIN_OWNER" onAction={onAction} addUserType="Bin User" />;
      case 'tab3':
        return <UserTable title="All Admin Users" users={users} roleFilter="ROLE_ADMIN" onAction={onAction} addUserType="Admin User" />;
      default:
        return <UserTable title="All Collectors" users={users} roleFilter="ROLE_COLLECTOR" onAction={onAction} addUserType="Collector" />;
    }
  };

  return (
    <main className="page-content">
      <div className="page-grid">{renderTabContent()}</div>
    </main>
  );
};

export default UserManagement;