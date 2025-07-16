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
            <th>Username</th>
            <th>Role</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(user => user.role.role === roleFilter)
            .map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role.role.replace('ROLE_', '').replace('_', ' ')}</td>
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