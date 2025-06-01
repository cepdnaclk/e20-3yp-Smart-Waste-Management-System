// 


import { Pencil, Trash2, Plus, MapPin, Wrench, Truck } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const BinManagement = ({ activeTab, onAction }) => {

const [tab1Data, setTab1Data] = useState([]);
const [tab1Loading, setTab1Loading] = useState(true);
const [tab1Error, setTab1Error] = useState(null);

const [tab2Data, setTab2Data] = useState([]);
const [tab2Loading, setTab2Loading] = useState(true);
const [tab2Error, setTab2Error] = useState(null);

const token = localStorage.getItem('token');

useEffect(() => {
  fetch('/api/bins?status=AVAILABLE', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch bins');
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Ensure data is an array
      setTab1Data(Array.isArray(data.data) ? data.data : []);
      setTab1Loading(false);
    })
    .catch(error => {
      setTab1Error(error.message);
      setTab1Loading(false);
      setTab1Data([]); // Set to empty array on error
    });
}, [token]);

useEffect(() => {
  fetch('/api/bins?status=ASSIGNED', {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch maintenance');
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Ensure data is an array
      setTab2Data(Array.isArray(data.data) ? data.data : []);
      setTab2Loading(false);
    })
    .catch(error => {
      setTab2Error(error.message);
      setTab2Loading(false);
      setTab2Data([]); // Set to empty array on error
    });
}, [token]);

  // Sample bin data - in a real app, this would come from props or API
  const binData = {
  //   tab1: [ // All Bins
  //     { id: 'BIN-001', location: '123 Main St', fillLevel: 85, status: 'active', lastCollection: '2024-01-28' },
  //     { id: 'BIN-002', location: '456 Oak Ave', fillLevel: 45, status: 'active', lastCollection: '2024-01-27' },
  //     { id: 'BIN-003', location: '789 Pine Rd', fillLevel: 92, status: 'maintenance', lastCollection: '2024-01-25' },
  //     { id: 'BIN-004', location: '321 Elm St', fillLevel: 67, status: 'active', lastCollection: '2024-01-28' },
  //     { id: 'BIN-005', location: '654 Cedar Ln', fillLevel: 23, status: 'inactive', lastCollection: '2024-01-26' }
  //   ],
    tab2: [ // Maintenance
      { id: 'BIN-003', location: '789 Pine Rd', issue: 'Lid mechanism broken', priority: 'high', reportedDate: '2024-01-29' },
      { id: 'BIN-007', location: '147 Birch St', issue: 'Sensor malfunction', priority: 'medium', reportedDate: '2024-01-28' },
      { id: 'BIN-012', location: '258 Maple Dr', issue: 'Physical damage', priority: 'low', reportedDate: '2024-01-27' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-badge--success';
      case 'maintenance': return 'status-badge--warning';
      case 'inactive': return 'status-badge--danger';
      default: return 'status-badge--default';
    }
  };

  const getFillLevelColor = (level) => {
    if (level >= 90) return 'fill-level--danger';
    if (level >= 70) return 'fill-level--warning';
    return 'fill-level--success';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority--high';
      case 'medium': return 'priority--medium';
      case 'low': return 'priority--low';
      default: return 'priority--default';
    }
  };

  
      
const deleteById = async (id) => {
    try {
      const response = await fetch(`/api/bins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item with ID: ${id}`);
      }

      console.log(`Item with ID ${id} deleted successfully.`);

      // Optionally refresh the data list or update state:
      // refreshData();  // You might call your refresh function here
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  
  const renderAllBinsTab = () => {
    if (tab1Loading) {
      return (
        <section className="">
          <div className="page-header">
            <Truck size={24} />
            <h1 className="page-title">All Bins</h1>
          </div>
          <div className="card-content">
            <p>Loading bins...</p>
          </div>
        </section>
      );
    }

    if (tab1Error) {
      return (
        <section className="">
          <div className="page-header">
            <Truck size={24} />
            <h1 className="page-title">All Bins</h1>
          </div>
          <div className="card-content">
            <p>Error loading bins: {tab1Error}</p>
          </div>
        </section>
      );
    }

    return (
      <section className="">
        <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">All Bins</h1>
        </div>
        <div className="card-header">
          <h3 className="card__title"></h3>
          <button 
            className="btn btn--primary"
            onClick={() => onAction('add')}
          >
            <Plus size={18} />
            Add Bin
          </button>
        </div>
        <div className="card-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tab1Data.map(bin => (
                <tr key={bin.binId}>
                  <td className="font-medium">{bin.binId}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(bin.status)}`}>
                      {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-icon--danger"
                        onClick={() => deleteById(bin.binId)}
                        title="Delete Bin"
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
  
  const renderAllActiveBinsTab = () => {
    if (tab2Loading) {
      return (
        <section className="">
          <div className="page-header">
            <Truck size={24} />
            <h1 className="page-title">All Active Bins</h1>
          </div>
          <div className="card-content">
            <p>Loading active bins...</p>
          </div>
        </section>
      );
    }

    if (tab2Error) {
      return (
        <section className="">
          <div className="page-header">
            <Truck size={24} />
            <h1 className="page-title">All Active Bins</h1>
          </div>
          <div className="card-content">
            <p>Error loading active bins: {tab2Error}</p>
          </div>
        </section>
      );
    }

    return (
      <section className="">
        <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">All Active Bins</h1>
        </div>
        <div className="card-header">
          <h3 className="card__title"></h3>
          <button 
            className="btn btn--primary"
            onClick={() => onAction('add')}
          >
            <Plus size={18} />
            Add Bin
          </button>
        </div>
        <div className="card-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Owner</th>
                <th>Fill Level</th>
                <th>Status</th>
                <th>Assigned Date</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tab2Data.map(bin => (
                <tr key={bin.binId}>
                  <td className="font-medium">{bin.binId}</td>
                  <td>{bin.owner || 'N/A'}</td>
                  <td>
                    {bin.fillLevel ? (
                      <div className="fill-level-container">
                        <div className={`fill-level-bar ${getFillLevelColor(bin.fillLevel)}`}>
                          <div 
                            className="fill-level-progress" 
                            style={{ width: `${bin.fillLevel}%` }}
                          ></div>
                        </div>
                        <span className="fill-level-text">{bin.fillLevel}%</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(bin.status)}`}>
                      {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                    </span>
                  </td>
                  <td>{bin.assignedDate}</td>
                  <td>{bin.location}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-icon--primary"
                        onClick={() => onAction('edit', bin)}
                        title="Edit Bin"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-icon--danger"
                        onClick={() => deleteById(bin.binId)}
                        title="Delete Bin"
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
  
  const renderMaintenanceTab = () => (
    <section className="">
    <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">Maintenance Requests</h1>
    </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <button 
          className="btn btn--primary"
          onClick={() => onAction('add')}
        >
          <Wrench size={18} />
          New Request
        </button>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bin ID</th>
              <th>Location</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Reported Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {binData.tab2.map(maintenance => (
              <tr key={maintenance.id}>
                <td className="font-medium">{maintenance.id}</td>
                <td>{maintenance.location}</td>
                <td>{maintenance.issue}</td>
                <td>
                  <span className={`priority-badge ${getPriorityColor(maintenance.priority)}`}>
                    {maintenance.priority.charAt(0).toUpperCase() + maintenance.priority.slice(1)}
                  </span>
                </td>
                <td>{maintenance.reportedDate}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-icon--primary"
                      onClick={() => onAction('edit', maintenance)}
                      title="Edit Request"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-icon--success"
                      onClick={() => onAction('complete', maintenance)}
                      title="Mark Complete"
                    >
                      <Wrench size={16} />
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

  const renderBinMapTab = () => (
    <section className="">
    <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">Bin Locations</h1>
    </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <button 
          className="btn btn--secondary"
          onClick={() => onAction('refresh')}
        >
          <MapPin size={18} />
          Refresh Map
        </button>
      </div>
      <div className="card-content">
        <div className="map-placeholder">
          <MapPin size={48} className="map-icon" />
          <h4>Interactive Bin Map</h4>
          <p>Map integration would be implemented here showing all bin locations with status indicators.</p>
          <div className="map-stats">
            <div className="map-stat">
              <span className="map-stat-number">12</span>
              <span className="map-stat-label">Total Bins</span>
            </div>
            <div className="map-stat">
              <span className="map-stat-number">3</span>
              <span className="map-stat-label">Need Attention</span>
            </div>
            <div className="map-stat">
              <span className="map-stat-number">2</span>
              <span className="map-stat-label">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return renderAllBinsTab();
      case 'tab2':
        return renderAllActiveBinsTab();
      case 'tab3':
        return renderMaintenanceTab();
      case 'tab4':
        return renderBinMapTab();
      default:
        return renderAllBinsTab();
    }
  };

  return (
    <div className="bin-management">
      <main className="page-content">
        <div className="page-grid">   
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default BinManagement;