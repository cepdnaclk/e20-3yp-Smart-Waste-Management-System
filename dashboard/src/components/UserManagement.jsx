import React from 'react';
import { Users, Edit, Trash2, Plus,Pencil } from 'lucide-react';

const UserManagement = ({ activeTab, onAction }) => {
  // Sample data for different user types
  const collectorsData = [
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', phone: '+1-555-0101', status: 'Active', joinDate: '2023-01-15', assignedRoute: 'Downtown' },
    { id: 2, name: 'Maria Garcia', email: 'maria.garcia@company.com', phone: '+1-555-0102', status: 'Active', joinDate: '2023-02-20', assignedRoute: 'North District' },
    { id: 3, name: 'David Chen', email: 'david.chen@company.com', phone: '+1-555-0103', status: 'Inactive', joinDate: '2022-11-10', assignedRoute: 'South District' },
    { id: 4, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', phone: '+1-555-0104', status: 'Active', joinDate: '2023-03-05', assignedRoute: 'East Zone' }
  ];

  const binUsersData = [
    { id: 1, name: 'ABC Restaurant', email: 'contact@abcrestaurant.com', phone: '+1-555-0201', status: 'Active', joinDate: '2023-01-10', binCount: 3, address: '123 Main St' },
    { id: 2, name: 'Green Mart', email: 'info@greenmart.com', phone: '+1-555-0202', status: 'Active', joinDate: '2023-02-15', binCount: 5, address: '456 Oak Ave' },
    { id: 3, name: 'City Hospital', email: 'waste@cityhospital.org', phone: '+1-555-0203', status: 'Active', joinDate: '2022-12-01', binCount: 8, address: '789 Health Blvd' },
    { id: 4, name: 'Metro School', email: 'admin@metroschool.edu', phone: '+1-555-0204', status: 'Inactive', binCount: 2, address: '321 Education Dr' }
  ];

  const adminUsersData = [
    { id: 1, name: 'Admin Smith', email: 'admin.smith@company.com', phone: '+1-555-0301', status: 'Active', joinDate: '2022-06-01', role: 'Super Admin', lastLogin: '2025-05-30' },
    { id: 2, name: 'Manager Jones', email: 'manager.jones@company.com', phone: '+1-555-0302', status: 'Active', joinDate: '2022-08-15', role: 'Manager', lastLogin: '2025-05-29' },
    { id: 3, name: 'Supervisor Wilson', email: 'supervisor.wilson@company.com', phone: '+1-555-0303', status: 'Active', joinDate: '2023-01-20', role: 'Supervisor', lastLogin: '2025-05-28' }
  ];

  const renderCollectorsTab = () => {
    return (
      <section className="">
      <div className="page-header">
              <Users size={24} />
              <h1 className="page-title">All Collectors</h1>
      </div>   
        <div className="card-header">
        <div></div>       
          <button 
            className="btn btn--primary"
            onClick={() => onAction('add', { type: 'collector' })}
          >
            <Plus size={16} />
            Add Collector
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Assigned Route</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collectorsData.map(collector => (
                <tr key={collector.id}>
                  <td>{collector.name}</td>
                  <td>{collector.email}</td>
                  <td>{collector.phone}</td>
                  <td>
                    <span className={`status ${collector.status === 'Active' ? 'status--active' : 'status--inactive'}`}>
                      {collector.status}
                    </span>
                  </td>
                  <td>{collector.joinDate}</td>
                  <td>{collector.assignedRoute}</td>
                  <td>
                         <div className="action-buttons">
                    <button 
                      className="btn-icon btn-icon--primary"
                      onClick={() => onAction && onAction('edit', route)}
                      title="Edit Route"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-icon--danger"
                      onClick={() => onAction && onAction('delete', route)}
                      title="Delete Route"
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
  };

  const renderBinUsersTab = () => {
    return (
      <section className="">
       <div className="page-header">
              <Users size={24} />
              <h1 className="page-title">All Bin Users</h1>
      </div>  
        <div className="card-header">
          <h3 className="card__title"></h3>
          <button 
            className="btn btn--primary"
            onClick={() => onAction('add', { type: 'binUser' })}
          >
            <Plus size={16} />
            Add Bin User
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Bin Count</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {binUsersData.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`status ${user.status === 'Active' ? 'status--active' : 'status--inactive'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>{user.binCount}</td>
                  <td>{user.address}</td>
                  <td>
                         <div className="action-buttons">
                    <button 
                      className="btn-icon btn-icon--primary"
                      onClick={() => onAction && onAction('edit', route)}
                      title="Edit Route"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-icon--danger"
                      onClick={() => onAction && onAction('delete', route)}
                      title="Delete Route"
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
  };

  const renderAdminUsersTab = () => {
    return (
      <section className="">
         <div className="page-header">
              <Users size={24} />
              <h1 className="page-title">All Admin Users</h1>
      </div>  
        <div className="card-header">
          <h3 className="card__title"></h3>
          <button 
            className="btn btn--primary"
            onClick={() => onAction('add', { type: 'admin' })}
          >
            <Plus size={16} />
            Add Admin User
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsersData.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.phone}</td>
                  <td>
                    <span className={`status ${admin.status === 'Active' ? 'status--active' : 'status--inactive'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td>{admin.joinDate}</td>
                  <td>{admin.role}</td>
                  <td>{admin.lastLogin}</td>
                  <td>
                          <div className="action-buttons">
                    <button 
                      className="btn-icon btn-icon--primary"
                      onClick={() => onAction && onAction('edit', route)}
                      title="Edit Route"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-icon--danger"
                      onClick={() => onAction && onAction('delete', route)}
                      title="Delete Route"
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
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return renderCollectorsTab();
      case 'tab2':
        return renderBinUsersTab();
      case 'tab3':
        return renderAdminUsersTab();
      default:
        return renderCollectorsTab();
    }
  };

  return (
    <main className="page-content">
      
      <div className="page-grid">
        {renderTabContent()}
      </div>
    </main>
  );
};

export default UserManagement;