import React, { useState } from 'react';
import { Route, Plus, Pencil, Trash2, MapPin, Users, Truck, Clock, Navigation, CheckCircle, XCircle } from 'lucide-react';
import "../styles/RouteManagement.css";

const RouteManagement = ({ activeTab,onAction }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [assignments, setAssignments] = useState({});

  // Sample route data
  const [routeData, setRouteData] = useState([
    {
      id: 'R-001',
      name: 'Downtown Circuit',
      startLocation: 'Main Depot',
      endLocation: 'Downtown Hub',
      distance: '25 km',
      estimatedTime: '45 min',
      stops: 8,
      priority: 'high',
      status: 'active',
      assignedTruck: 'TRK-001',
      assignedDriver: 'John Smith',
      isAssigned: true
    },
    {
      id: 'R-002',
      name: 'Suburban Loop',
      startLocation: 'North Depot',
      endLocation: 'Suburban Center',
      distance: '18 km',
      estimatedTime: '35 min',
      stops: 6,
      priority: 'medium',
      status: 'active',
      assignedTruck: 'TRK-002',
      assignedDriver: 'Sarah Johnson',
      isAssigned: true
    },
    {
      id: 'R-003',
      name: 'Industrial Zone',
      startLocation: 'South Depot',
      endLocation: 'Industrial Park',
      distance: '32 km',
      estimatedTime: '55 min',
      stops: 12,
      priority: 'high',
      status: 'inactive',
      assignedTruck: null,
      assignedDriver: null,
      isAssigned: false
    },
    {
      id: 'R-004',
      name: 'Commercial District',
      startLocation: 'East Depot',
      endLocation: 'Mall Complex',
      distance: '15 km',
      estimatedTime: '30 min',
      stops: 4,
      priority: 'low',
      status: 'active',
      assignedTruck: null,
      assignedDriver: null,
      isAssigned: false
    },
    {
      id: 'R-005',
      name: 'Airport Express',
      startLocation: 'Main Depot',
      endLocation: 'Airport Terminal',
      distance: '45 km',
      estimatedTime: '65 min',
      stops: 3,
      priority: 'high',
      status: 'maintenance',
      assignedTruck: null,
      assignedDriver: null,
      isAssigned: false
    }
  ]);

  // Sample truck data with drivers
  const truckData = [
    {
      id: 'TRK-001',
      plateNumber: 'ABC-1234',
      driver: 'John Smith',
      status: 'available',
      currentLocation: 'Main Depot',
      capacity: '10 tons',
      isAssigned: true
    },
    {
      id: 'TRK-002',
      plateNumber: 'XYZ-5678',
      driver: 'Sarah Johnson',
      status: 'available',
      currentLocation: 'North Depot',
      capacity: '8 tons',
      isAssigned: true
    },
    {
      id: 'TRK-003',
      plateNumber: 'DEF-9012',
      driver: 'Mike Wilson',
      status: 'maintenance',
      currentLocation: 'Service Center',
      capacity: '12 tons',
      isAssigned: false
    },
    {
      id: 'TRK-004',
      plateNumber: 'GHI-3456',
      driver: 'Emily Davis',
      status: 'available',
      currentLocation: 'South Depot',
      capacity: '10 tons',
      isAssigned: false
    },
    {
      id: 'TRK-005',
      plateNumber: 'JKL-7890',
      driver: 'Robert Brown',
      status: 'available',
      currentLocation: 'Main Depot',
      capacity: '15 tons',
      isAssigned: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-badge--success';
      case 'inactive': return 'status-badge--warning';
      case 'maintenance': return 'status-badge--danger';
      default: return 'status-badge--default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority--high';
      case 'medium': return 'priority--medium';
      case 'low': return 'priority--low';
      default: return 'priority--default';
    }
  };

  const handleAssignRoute = (routeId, truckId, driverId) => {
    setRouteData(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId 
          ? { ...route, assignedTruck: truckId, assignedDriver: driverId, isAssigned: true }
          : route
      )
    );
    setSelectedRoute(null);
  };

  const handleUnassignRoute = (routeId) => {
    setRouteData(prevRoutes => 
      prevRoutes.map(route => 
        route.id === routeId 
          ? { ...route, assignedTruck: null, assignedDriver: null, isAssigned: false }
          : route
      )
    );
  };

  // Routes Management Tab
  const renderRoutesTab = () => (
    <section className="">
     <div className="page-header">
          <Route size={24} />
          <h1 className="page-title">Routes Management</h1>
        </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <button 
          className="btn btn--primary"
          onClick={() => onAction && onAction('add')}
        >
          <Plus size={18} />
          Add Route
        </button>
      </div>
      <div className="card-content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Route Name</th>
              <th>Start - End</th>
              <th>Distance</th>
              <th>Stops</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routeData.map(route => (
              <tr key={route.id}>
                <td className="font-medium">{route.id}</td>
                <td className="font-medium">{route.name}</td>
                <td>
                  <div className="location-info">
                    <MapPin size={14} />
                    <span>{route.startLocation} → {route.endLocation}</span>
                  </div>
                </td>
                <td>{route.distance}</td>
                <td>{route.stops}</td>
                <td>
                  <span className={`priority-badge ${getPriorityColor(route.priority)}`}>
                    {route.priority.charAt(0).toUpperCase() + route.priority.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(route.status)}`}>
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="assignment-status">
                    {route.isAssigned ? (
                      <div className="assignment-info">
                        <CheckCircle size={16} className="assignment-icon assignment-icon--assigned" />
                        <span className="assignment-text assignment-text--assigned">Assigned</span>
                      </div>
                    ) : (
                      <div className="assignment-info">
                        <XCircle size={16} className="assignment-icon assignment-icon--unassigned" />
                        <span className="assignment-text assignment-text--unassigned">Unassigned</span>
                      </div>
                    )}
                  </div>
                </td>
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

  // Route Assignment Tab
  const renderAssignmentTab = () => (
    <section className="">
     <div className="page-header">
          <Route size={24} />
          <h1 className="page-title">Route Assignment</h1>
        </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <p className="card-subtitle">Assign drivers and trucks to routes</p>
      </div>
      <div className="card-content">
        <div className="assignment-container">
          {/* Drivers and Trucks Section */}
          <div className="assignment-section">
            <h4 className="section-title">
              <Users size={20} />
              Drivers & Trucks
            </h4>
            <div className="driver-truck-grid">
              {truckData.map(truck => (
                <div key={truck.id} className={`driver-truck-card ${truck.isAssigned ? 'driver-truck-card--assigned' : ''}`}>
                  <div className="driver-truck-header">
                    <div className="truck-info">
                      <h5 className="truck-plate">{truck.plateNumber}</h5>
                      <span className="truck-id">{truck.id}</span>
                    </div>
                    <span className={`status-badge ${getStatusColor(truck.status)}`}>
                      {truck.status}
                    </span>
                  </div>
                  <div className="driver-details">
                    <div className="driver-info">
                      <Users size={16} />
                      <span>{truck.driver}</span>
                    </div>
                    <div className="truck-details">
                      <Truck size={16} />
                      <span>{truck.capacity}</span>
                    </div>
                    <div className="location-info">
                      <MapPin size={16} />
                      <span>{truck.currentLocation}</span>
                    </div>
                  </div>
                  {truck.isAssigned && (
                    <div className="assignment-badge">
                      <CheckCircle size={14} />
                      <span>Currently Assigned</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Available Routes Section */}
          <div className="assignment-section">
            <h4 className="section-title">
              <Route size={20} />
              Available Routes
            </h4>
            <div className="available-routes">
              {routeData.filter(route => !route.isAssigned && route.status !== 'maintenance').map(route => (
                <div 
                  key={route.id} 
                  className={`route-assignment-card ${selectedRoute?.id === route.id ? 'route-assignment-card--selected' : ''}`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="route-header">
                    <h5 className="route-name">{route.name}</h5>
                    <span className={`priority-badge ${getPriorityColor(route.priority)}`}>
                      {route.priority}
                    </span>
                  </div>
                  <div className="route-details">
                    <div className="route-info">
                      <MapPin size={14} />
                      <span>{route.startLocation} → {route.endLocation}</span>
                    </div>
                    <div className="route-stats">
                      <div className="route-stat">
                        <Clock size={14} />
                        <span>{route.estimatedTime}</span>
                      </div>
                      <div className="route-stat">
                        <span>{route.distance}</span>
                      </div>
                      <div className="route-stat">
                        <span>{route.stops} stops</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Action Panel */}
        {selectedRoute && (
          <div className="assignment-panel">
            <div className="assignment-panel-header">
              <h4>Assign Route: {selectedRoute.name}</h4>
              <button 
                className="btn btn--secondary btn--small"
                onClick={() => setSelectedRoute(null)}
              >
                Cancel
              </button>
            </div>
            <div className="assignment-options">
              {truckData.filter(truck => !truck.isAssigned && truck.status === 'available').map(truck => (
                <div key={truck.id} className="assignment-option">
                  <div className="assignment-option-info">
                    <strong>{truck.plateNumber}</strong> - {truck.driver}
                    <br />
                    <small>{truck.capacity} • {truck.currentLocation}</small>
                  </div>
                  <button 
                    className="btn btn--success btn--small"
                    onClick={() => handleAssignRoute(selectedRoute.id, truck.id, truck.driver)}
                  >
                    <CheckCircle size={16} />
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  // Map Tab
  const renderMapTab = () => (
    <section className="">
    <div className="page-header">
          <Route size={24} />
          <h1 className="page-title">Route Map</h1>
        </div>
      <div className="card-header">
        <h3 className="card__title"></h3>
        <p className="card-subtitle">Visual representation of all routes and their status</p>
      </div>
      <div className="card-content">
        <div className="map-container">
          <div className="map-placeholder">
            <Navigation size={48} />
            <h4>Interactive Route Map</h4>
            <p>Map integration would be implemented here</p>
            <button className="btn btn--primary">
              Load Map View
            </button>
          </div>
        </div>
        
        <div className="map-legend">
          <h4 className="legend-title">Route Legend</h4>
          <div className="legend-grid">
            {routeData.map(route => (
              <div key={route.id} className="legend-item">
                <div className={`legend-color legend-color--${route.priority}`}></div>
                <div className="legend-info">
                  <strong>{route.name}</strong>
                  <span>{route.distance} • {route.stops} stops</span>
                  <div className="legend-status">
                    <span className={`status-badge ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                    {route.isAssigned ? (
                      <span className="assignment-text assignment-text--assigned">Assigned</span>
                    ) : (
                      <span className="assignment-text assignment-text--unassigned">Unassigned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tab1':
        return renderRoutesTab();
      case 'tab2':
        return renderAssignmentTab();
      case 'tab3':
        return renderMapTab();
      default:
        return renderRoutesTab();
    }
  };

  return (
    <div className="route-management">
      <main className="page-content">
       <div>   
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default RouteManagement;