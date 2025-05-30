import React from 'react';
import { Truck, Pencil, Trash2, Plus, Wrench, MapPin, Fuel, Clock } from 'lucide-react';
import "../styles/TruckManagement.css";

const TruckManagement = ({ activeTab, onAction }) => {
  // Sample truck data - in a real app, this would come from props or API

  const truckData = {
    tab1: [ // Truck Inventory (All Trucks)
      { 
        id: 'TRK-001', 
        plateNumber: 'ABC-1234', 
        driver: 'John Smith', 
        status: 'available', 
        currentLocation: 'Main Depot',
        fuelLevel: 75,
        lastMaintenance: '2024-01-15',
        capacity: '10 tons',
        mileage: 45230
      },
      { 
        id: 'TRK-002', 
        plateNumber: 'XYZ-5678', 
        driver: 'Sarah Johnson', 
        status: 'available', 
        currentLocation: 'North Depot',
        fuelLevel: 45,
        lastMaintenance: '2024-01-20',
        capacity: '8 tons',
        mileage: 32150
      },
      { 
        id: 'TRK-003', 
        plateNumber: 'DEF-9012', 
        driver: 'Mike Wilson', 
        status: 'maintenance', 
        currentLocation: 'Service Center',
        fuelLevel: 30,
        lastMaintenance: '2024-01-10',
        capacity: '12 tons',
        mileage: 67890
      },
      { 
        id: 'TRK-004', 
        plateNumber: 'GHI-3456', 
        driver: 'Emily Davis', 
        status: 'available', 
        currentLocation: 'South Depot',
        fuelLevel: 90,
        lastMaintenance: '2024-01-25',
        capacity: '10 tons',
        mileage: 28765
      },
      { 
        id: 'TRK-005', 
        plateNumber: 'JKL-7890', 
        driver: 'Robert Brown', 
        status: 'inactive', 
        currentLocation: 'Main Depot',
        fuelLevel: 60,
        lastMaintenance: '2024-01-12',
        capacity: '15 tons',
        mileage: 89234
      }
    ],
    tab2: [ // On Route Trucks
      { 
        id: 'TRK-006', 
        plateNumber: 'MNO-1234',
        driver: 'Lisa Garcia',
        route: 'Route A - Downtown', 
        progress: 65,
        estimatedArrival: '14:30',
        currentLocation: '456 Oak Avenue',
        fuelLevel: 55,
        capacity: '10 tons',
        startTime: '08:00'
      },
      { 
        id: 'TRK-007', 
        plateNumber: 'PQR-5678',
        driver: 'David Lee',
        route: 'Route B - Industrial Zone', 
        progress: 30,
        estimatedArrival: '16:15',
        currentLocation: '789 Pine Street',
        fuelLevel: 70,
        capacity: '12 tons',
        startTime: '09:15'
      },
      { 
        id: 'TRK-008', 
        plateNumber: 'STU-9012',
        driver: 'Maria Rodriguez',
        route: 'Route C - Residential Area', 
        progress: 85,
        estimatedArrival: '13:45',
        currentLocation: '321 Elm Street',
        fuelLevel: 40,
        capacity: '8 tons',
        startTime: '07:30'
      }
    ]
  };

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
      <div className="card-header">
        <h3 className="card__title">Truck Inventory</h3>
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
              <th>Driver</th>
              <th>Status</th>
              <th>Current Location</th>
              <th>Fuel Level</th>
              <th>Last Maintenance</th>
              <th>Capacity</th>
              <th>Mileage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {truckData.tab1.map(truck => (
              <tr key={truck.id}>
                <td className="font-medium">{truck.id}</td>
                <td className="font-medium">{truck.plateNumber}</td>
                <td>{truck.driver}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(truck.status)}`}>
                    {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin size={14} />
                    <span>{truck.currentLocation}</span>
                  </div>
                </td>
                <td>
                  <div className="fuel-level-container">
                    <div className={`fuel-level-bar ${getFuelLevelColor(truck.fuelLevel)}`}>
                      <div 
                        className="fuel-level-progress" 
                        style={{ width: `${truck.fuelLevel}%` }}
                      ></div>
                    </div>
                    <span className="fuel-level-text">{truck.fuelLevel}%</span>
                  </div>
                </td>
                <td>{truck.lastMaintenance}</td>
                <td>{truck.capacity}</td>
                <td>{truck.mileage.toLocaleString()} km</td>
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
      <div className="card-header">
        <h3 className="card__title">On Route Trucks</h3>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Truck ID</th>
              <th>Plate Number</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Progress</th>
              <th>Current Location</th>
              <th>Fuel Level</th>
              <th>Est. Arrival</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {truckData.tab2.map(truck => (
              <tr key={truck.id}>
                <td className="font-medium">{truck.id}</td>
                <td className="font-medium">{truck.plateNumber}</td>
                <td>{truck.driver}</td>
                <td>{truck.route}</td>
                <td>
                  <div className="progress-container">
                    <div className={`progress-bar ${getProgressColor(truck.progress)}`}>
                      <div 
                        className="progress-fill" 
                        style={{ width: `${truck.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{truck.progress}%</span>
                  </div>
                </td>
                <td>
                  <div className="location-info">
                    <MapPin size={14} />
                    <span>{truck.currentLocation}</span>
                  </div>
                </td>
                <td>
                  <div className="fuel-level-container">
                    <div className={`fuel-level-bar ${getFuelLevelColor(truck.fuelLevel)}`}>
                      <div 
                        className="fuel-level-progress" 
                        style={{ width: `${truck.fuelLevel}%` }}
                      ></div>
                    </div>
                    <span className="fuel-level-text">{truck.fuelLevel}%</span>
                  </div>
                </td>
                <td>
                  <div className="time-info">
                    <Clock size={14} />
                    <span>{truck.estimatedArrival}</span>
                  </div>
                </td>
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
        <div className="page-header">
          <Truck size={24} />
          <h1 className="page-title">Truck Management</h1>
        </div>
        
        <div className="page-grid">   
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default TruckManagement;