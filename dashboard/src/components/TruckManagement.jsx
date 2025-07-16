import React, { useEffect, useState } from 'react';
import { Truck, Pencil, Trash2, Plus, MapPin } from 'lucide-react';
import "../styles/TruckManagement.css";

const TruckManagement = ({ activeTab, onAction }) => {
  const [tab1Data, setTab1Data] = useState([]);
  const [tab1Loading, setTab1Loading] = useState(true);
  const [tab1Error, setTab1Error] = useState(null);

  const [tab2Data, setTab2Data] = useState([]);
  const [tab2Loading, setTab2Loading] = useState(true);
  const [tab2Error, setTab2Error] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch available trucks (No changes needed here)
  useEffect(() => {
    fetch('/api/admin/trucks?status=AVAILABLE', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch trucks');
        return response.json();
      })
      .then(data => {
        setTab1Data(Array.isArray(data.data) ? data.data : []);
        setTab1Loading(false);
      })
      .catch(error => {
        setTab1Error(error.message);
        setTab1Loading(false);
        setTab1Data([]);
      });
  }, [token]); // Added token as a dependency

 // Fetch in-service trucks
  useEffect(() => {
    fetch('/api/collector/trucks?status=IN_SERVICE', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch trucks');
        return response.json();
      })
      .then(data => {
        const rawData = Array.isArray(data.data) ? data.data : [];
        
        // De-duplicate the data using the unique truckId.
        const uniqueAssignments = Array.from(
          new Map(rawData.map(item => [item.truck.truckId, item])).values()
        );

        setTab2Data(uniqueAssignments);
        setTab2Loading(false);
      })
      .catch(error => {
        setTab2Error(error.message);
        setTab2Loading(false);
        setTab2Data([]);
      });
  }, [token]); // Added token as a dependency

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) { // Use toLowerCase for case-insensitivity
      case 'available': return 'status-badge--success';
      case 'in_service': return 'status-badge--primary';
      case 'maintenance': return 'status-badge--warning';
      case 'inactive': return 'status-badge--danger';
      default: return 'status-badge--default';
    }
  };

  const renderTruckInventoryTab = () => (
    <section>
      <div className="page-header">
        <Truck size={24} />
        <h1 className="page-title">Truck Inventory</h1>
      </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <button className="btn btn--primary" onClick={() => onAction('add')}>
          <Plus size={18} /> Add Truck
        </button>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Capacity(kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tab1Data.map(truck => (
                <tr key={truck.truckId}>
                  <td className="font-medium">{truck.truckId}</td>
                  <td className="font-medium">{truck.registrationNumber}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(truck.status)}`}>
                      {truck.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td>{truck.capacityKg}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-icon--primary"
                        onClick={() => onAction('edit', truck)}
                        title="Edit Truck"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon--info"
                        onClick={() => onAction('assign', truck)}
                        title="Assign Route"
                      >
                        <MapPin size={16} />
                      </button>
                      <button
                        className="btn-icon btn-icon--danger"
                        onClick={() => onAction('delete', truck)}
                        title="Delete Truck"
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

  const renderOnRouteTab = () => (
    <section>
      <div className="page-header">
        <Truck size={24} />
        <h1 className="page-title">On Route Trucks</h1>
      </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>Plate Number</th>
              <th>Driver</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Assigned Date</th>
              <th>Route</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tab2Data.map((assignment) => (
              // FIX: Use a stable and unique key from the data itself.
              // Since a truck can only have one assignment at a time, its ID is unique here.
              <tr key={assignment.truck.truckId}>
                <td className="font-medium">{assignment.truck.truckId}</td>
                <td className="font-medium">{assignment.truck.registrationNumber}</td>
                <td>{assignment.collector.name}</td>
                <td>{assignment.truck.capacityKg}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(assignment.truck.status)}`}>
                    {/* Nicer formatting for statuses like IN_SERVICE */}
                    {assignment.truck.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                {/* Assuming assignedDate is a string. For better formatting, consider using new Date().toLocaleDateString() */}
                <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                <td>Route</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-icon--info"
                      onClick={() => onAction('track', assignment.truck)}
                      title="Track Truck"
                    >
                      <MapPin size={16} />
                    </button>
                    <button
                      className="btn-icon btn-icon--success"
                      onClick={() => onAction('complete', assignment.truck)}
                      title="Mark Route Complete"
                    >
                      <Truck size={16} />
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return renderTruckInventoryTab();
      case 'tab2':
        return renderOnRouteTab();
      default:
        return renderTruckInventoryTab();
    }
  };

  return (
    <div className="truck-management">
      <main className="page-content">
        <div className="page-grid">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default TruckManagement;