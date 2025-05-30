import React from 'react';
import { Pencil, Trash2, Plus, MapPin, Wrench } from 'lucide-react';

const BinManagement = ({ activeTab, onAction }) => {
  // Sample bin data - in a real app, this would come from props or API
  const binData = {
    tab1: [ // All Bins
      { id: 'BIN-001', location: '123 Main St', fillLevel: 85, status: 'active', lastCollection: '2024-01-28' },
      { id: 'BIN-002', location: '456 Oak Ave', fillLevel: 45, status: 'active', lastCollection: '2024-01-27' },
      { id: 'BIN-003', location: '789 Pine Rd', fillLevel: 92, status: 'maintenance', lastCollection: '2024-01-25' },
      { id: 'BIN-004', location: '321 Elm St', fillLevel: 67, status: 'active', lastCollection: '2024-01-28' },
      { id: 'BIN-005', location: '654 Cedar Ln', fillLevel: 23, status: 'inactive', lastCollection: '2024-01-26' }
    ],
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

  const renderAllBinsTab = () => (
    <section className="card">
      <div className="card-header">
        <h3 className="card__title">All Bins</h3>
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
              <th>Location</th>
              <th>Fill Level</th>
              <th>Status</th>
              <th>Last Collection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {binData.tab1.map(bin => (
              <tr key={bin.id}>
                <td className="font-medium">{bin.id}</td>
                <td>{bin.location}</td>
                <td>
                  <div className="fill-level-container">
                    <div className={`fill-level-bar ${getFillLevelColor(bin.fillLevel)}`}>
                      <div 
                        className="fill-level-progress" 
                        style={{ width: `${bin.fillLevel}%` }}
                      ></div>
                    </div>
                    <span className="fill-level-text">{bin.fillLevel}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(bin.status)}`}>
                    {bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                  </span>
                </td>
                <td>{bin.lastCollection}</td>
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
                      onClick={() => onAction('delete', bin)}
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

  const renderMaintenanceTab = () => (
    <section className="card">
      <div className="card-header">
        <h3 className="card__title">Maintenance Requests</h3>
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
    <section className="card">
      <div className="card-header">
        <h3 className="card__title">Bin Locations</h3>
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
        return renderMaintenanceTab();
      case 'tab3':
        return renderBinMapTab();
      default:
        return renderAllBinsTab();
    }
  };

  return (
    <div className="bin-management">
      <main className="page-content">
        <div className="page-header">
          <Trash2 size={24} />
          <h1 className="page-title">Bin Management</h1>
        </div>
        
        <div className="page-grid">   
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default BinManagement;