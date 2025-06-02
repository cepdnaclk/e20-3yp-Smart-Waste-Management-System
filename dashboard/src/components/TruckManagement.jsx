import React, { useEffect ,useState} from 'react';
import { Truck, Pencil, Trash2, Plus, Wrench, MapPin, Fuel, Clock } from 'lucide-react';
import "../styles/TruckManagement.css";

const TruckManagement = ({ activeTab, onAction }) => {
  // Sample truck data - in a real app, this would come from props or API

  const [tab1Data, setTab1Data] = useState([]);
  const [tab1Loading, setTab1Loading] = useState(true);
  const [tab1Error, setTab1Error] = useState(null);

  const [tab2Data, setTab2Data] = useState([]);
  const [tab2Loading, setTab2Loading] = useState(true);
  const [tab2Error, setTab2Error] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [binId, setBinId] = useState(''); // For bin ID input
  const token = localStorage.getItem('token');

  // Fetch available bins (tab1)
  useEffect(() => {
    fetch('/api/admin/trucks', {
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
    fetch('/api/collector/trucks', {
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
        setTab2Data(Array.isArray(data.data) ? data.data : []);
        setTab2Loading(false);
      })
      .catch(error => {
        setTab2Error(error.message);
        setTab2Loading(false);
        setTab2Data([]); // Set to empty array on error
      });
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'status-badge--success';
      case 'maintenance': return 'status-badge--warning';
      case 'inactive': return 'status-badge--danger';
      default: return 'status-badge--default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'progress--success';
    if (progress >= 50) return 'progress--warning';
    return 'progress--info';
  };

  const getFuelLevelColor = (level) => {
    if (level >= 70) return 'fuel-level--success';
    if (level >= 30) return 'fuel-level--warning';
    return 'fuel-level--danger';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority--high';
      case 'medium': return 'priority--medium';
      case 'low': return 'priority--low';
      default: return 'priority--default';
    }
  };

  const renderTruckInventoryTab = () => (
    <section className="">
    <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">Truck Inventory</h1>
        </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <button 
          className="btn btn--primary"
          onClick={() => onAction('add')}
        >
          <Plus size={18} />
          Add Truck
        </button>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Last Maintenance</th>
              <th>Capacity(kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tab1Data
            .filter((truck) => truck.status === 'AVAILABLE')
            .map(truck => (
              <tr key={truck.truckId}>
                <td className="font-medium">{truck.truckId}</td>
                <td className="font-medium">{truck.registrationNumber}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(truck.status)}`}>
                    {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                  </span>
                </td>
                <td>{truck.lastMaintenance}</td>
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
    <section className="">
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
              <th>Assigned date</th>
              <th>Route</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tab2Data.map(assignment => (
              <tr key={assignment.truck.truckId}>
                <td className="font-medium">{assignment.truck.truckId}</td>
                <td className="font-medium">{assignment.truck.registrationNumber}</td>
                <td>{assignment.collector.name}</td>
                <td>{assignment.truck.capacityKg}</td>
                {/* <td>
                  <div className="progress-container">
                    <div className={`progress-bar ${getProgressColor(truck.progress)}`}>
                      <div 
                        className="progress-fill" 
                        style={{ width: `${truck.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{truck.progress}%</span>
                  </div>
                </td> */}
                 <td>
                  <span className={`status-badge ${getStatusColor(assignment.truck.status)}`}>
                    {assignment.truck.status.charAt(0).toUpperCase() + assignment.truck.status.slice(1)}
                  </span>
                </td>
                <td>{assignment.assignedDate}</td>
                <td>Route</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-icon--info"
                      onClick={() => onAction('track', truck)}
                      title="Track Truck"
                    >
                      <MapPin size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-icon--success"
                      onClick={() => onAction('complete', truck)}
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