import React, { useEffect, useState } from 'react';
import { Route, Plus, Pencil, Trash2, MapPin, Users, Truck, Clock, Navigation, CheckCircle, XCircle, X } from 'lucide-react';
import "../styles/RouteManagement.css";
import Maps from './dashboard/Maps';

// ===================================================================================
// NOTE: I've added a new modal component and the logic to control it.
// The original "Assignment Panel" has been removed in favor of this better window.
// ===================================================================================

const AssignmentModal = ({ route, trucks, onConfirm, onClose }) => {
    if (!route) return null;

    const [selectedTruckId, setSelectedTruckId] = useState(null);
    
    // Filter for trucks that are not under maintenance or already assigned
    const availableTrucks = trucks.filter(truck => truck.truck.status === 'IN_SERVICE' && !truck.isAssigned);

    const handleConfirm = () => {
        if (!selectedTruckId) {
            alert("Please select a truck to assign.");
            return;
        }
        const truck = trucks.find(t => t.truck.truckId === selectedTruckId);
        // Pass the entire truck object or specific parts as needed
        onConfirm(route.id, truck.truck.truckId, truck.collector.username);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-header">
                    <h4>Assign Truck to: <span className="modal-route-name">{route.name}</span></h4>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <p className="modal-subtitle">Select an available truck from the list below. Only 'available' and unassigned trucks are shown.</p>
                    <div className="modal-options-list">
                        {availableTrucks.length > 0 ? availableTrucks.map(truckItem => (
                            <div
                                key={truckItem.truck.truckId}
                                className={`modal-option ${selectedTruckId === truckItem.truck.truckId ? 'modal-option--selected' : ''}`}
                                onClick={() => setSelectedTruckId(truckItem.truck.truckId)}
                            >
                                <div className="assignment-option-info">
                                    <strong>{truckItem.truck.registrationNumber}</strong> - {truckItem.collector.name}
                                    <br />
                                    <small>{truckItem.truck.capacityKg}Kg Capacity</small>
                                </div>
                                {selectedTruckId === truckItem.truck.truckId && <CheckCircle size={20} className="selection-checkmark" />}
                            </div>
                        )) : (
                           <p className="modal-empty-state">No available trucks to assign.</p>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn--secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn--success"
                        onClick={handleConfirm}
                        disabled={!selectedTruckId}
                    >
                        <CheckCircle size={16} />
                        Confirm Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};


const RouteManagement = ({ activeTab, onAction }) => {
    // --- HOOKS MOVED HERE ---
    const [truckData, setTruckData] = useState([]);
    const [error, setError] = useState(null); // Initialize error as null
    const [selectedRouteForModal, setSelectedRouteForModal] = useState(null);
    const token = localStorage.getItem('token'); // Assuming you get the token like this

    // --- FETCH LOGIC MOVED HERE ---
    useEffect(() => {
        fetch('/api/collector/trucks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch truck data');
            return response.json();
        })
        .then(data => {
            console.log("Fetched Truck Data:", data);
            // Add an 'isAssigned' property to each truck for local state management
            const trucksWithAssignment = Array.isArray(data.data) 
                ? data.data.map(t => ({ ...t, isAssigned: false })) 
                : [];
            setTruckData(trucksWithAssignment);
        })
        .catch(error => {
            setError(error.message);
            setTruckData([]);
            console.error("Fetch Error:", error);
        });
    }, []); // Dependency array includes token

    const [routeData, setRouteData] = useState([
        // Your sample route data...
        { id: 'R-001', name: 'Downtown Circuit', startLocation: 'Main Depot', endLocation: 'Downtown Hub', distance: '25 km', estimatedTime: '45 min', stops: 8, priority: 'high', status: 'active', assignedTruck: 'TRK-001', assignedDriver: 'John Smith', isAssigned: true },
        { id: 'R-002', name: 'Suburban Loop', startLocation: 'North Depot', endLocation: 'Suburban Center', distance: '18 km', estimatedTime: '35 min', stops: 6, priority: 'medium', status: 'active', assignedTruck: 'TRK-002', assignedDriver: 'Sarah Johnson', isAssigned: true },
        { id: 'R-003', name: 'Industrial Zone', startLocation: 'South Depot', endLocation: 'Industrial Park', distance: '32 km', estimatedTime: '55 min', stops: 12, priority: 'high', status: 'inactive', assignedTruck: null, assignedDriver: null, isAssigned: false },
        { id: 'R-004', name: 'Commercial District', startLocation: 'East Depot', endLocation: 'Mall Complex', distance: '15 km', estimatedTime: '30 min', stops: 4, priority: 'low', status: 'active', assignedTruck: null, assignedDriver: null, isAssigned: false },
        { id: 'R-005', name: 'Airport Express', startLocation: 'Main Depot', endLocation: 'Airport Terminal', distance: '45 km', estimatedTime: '65 min', stops: 3, priority: 'high', status: 'maintenance', assignedTruck: null, assignedDriver: null, isAssigned: false }
    ]);

    // Note: The static truckData state is removed, as we now fetch it.

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'status-badge--success';
            case 'inactive': return 'status-badge--warning';
            case 'maintenance': return 'status-badge--danger';
            case 'available': return 'status-badge--success';
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

    const handleAssignRoute = (routeId, truckId, driverName) => {
        // Update Route Data
        setRouteData(prevRoutes =>
            prevRoutes.map(route =>
                route.id === routeId
                    ? { ...route, assignedTruck: truckId, assignedDriver: driverName, isAssigned: true }
                    : route
            )
        );
        // Update Truck Data
        setTruckData(prevTrucks =>
            prevTrucks.map(truck =>
                truck.truck.truckId === truckId
                    ? { ...truck, isAssigned: true }
                    : truck
            )
        );
        setSelectedRouteForModal(null); // Close the modal
    };
    
    // ... (Your other functions like handleUnassignRoute)

    // Your render functions (renderRoutesTab, renderAssignmentTab, etc.) remain here
    // Make sure to handle the new `truckData` structure in `renderAssignmentTab`
    // Example fix for `renderAssignmentTab`:
    const renderAssignmentTab = () => (
        <section className="">
            <div className="page-header">
                <Users size={24} />
                <h1 className="page-title">Route Assignment</h1>
            </div>
            <div className="card-content">
                <div className="assignment-container">
                    <div className="assignment-section">
                        <h4 className="section-title"><Truck size={20} /> Drivers & Trucks Status</h4>
                        <div className="driver-truck-grid">
                            {error && <p className="error-message">Error: {error}</p>}
                            {truckData.map(truckItem => (
                                <div key={truckItem.truck.truckId} className={`driver-truck-card ${truckItem.isAssigned ? 'driver-truck-card--assigned' : ''}`}>
                                    <div className="driver-truck-header">
                                        <div className="truck-info">
                                            <h5 className="truck-plate">{truckItem.truck.registrationNumber}</h5>
                                            <span className="truck-id">{truckItem.truck.truckId}</span>
                                        </div>
                                        <span className={`status-badge ${getStatusColor(truckItem.truck.status)}`}>
                                            {truckItem.truck.status}
                                        </span>
                                    </div>
                                    <div className="driver-details">
                                        <div className="driver-info">
                                            <Users size={16} />
                                            <span>{truckItem.collector.name}</span>
                                        </div>
                                        <div className="truck-details">
                                            <Truck size={16} />
                                            <span>{truckItem.truck.capacityKg} Kg</span>
                                        </div>
                                    </div>
                                    {truckItem.isAssigned && (
                                        <div className="assignment-badge">
                                            <CheckCircle size={14} />
                                            <span>Currently Assigned</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="assignment-section">
                        <h4 className="section-title"><Route size={20} /> Available Routes to Assign</h4>
                        <div className="available-routes">
                            {routeData.filter(route => !route.isAssigned && route.status !== 'maintenance').map(route => (
                                <div
                                    key={route.id}
                                    className="route-assignment-card"
                                    onClick={() => setSelectedRouteForModal(route)}
                                >
                                    <div className="route-header">
                                        <h5 className="route-name">{route.name}</h5>
                                        <span className={`priority-badge ${getPriorityColor(route.priority)}`}>
                                            {route.priority}
                                        </span>
                                    </div>
                                    <div className="route-details">
                                        <div className="route-stat"><Navigation size={14} /><span>{route.distance}</span></div>
                                        <div className="route-stat"><Clock size={14} /><span>{route.estimatedTime}</span></div>
                                        <div className="route-stat"><MapPin size={14} /><span>{route.stops} stops</span></div>
                                    </div>
                                    <div className="card-footer-action">
                                        <button className="btn btn--primary btn--small">Assign Truck</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderRoutesTab = () => (
    // ... your renderRoutesTab JSX
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
                      <th>Distance</th>
                      <th>Stops</th>
                      <th>Status</th>
                      <th>Assignment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeData.map(route => (
                      <tr key={route.id}>
                        <td className="font-medium">{route.id}</td>
                        <td>{route.distance}</td>
                        <td>{route.stops}</td>
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

    const renderMapTab = () => (
    // ... your renderMapTab JSX
         <section>
        <div className="page-header">
          <Route size={24} />
          <h1 className="page-title">Route Map</h1>
        </div>
    
        <div className="card">
          <div className="card-content">
            <div className="map-placeholder">
              <Maps />
              <button className="btn btn-primary">Load Map</button>
            </div>
          </div>
        </div>
      </section>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'tab1': return renderRoutesTab();
            case 'tab2': return renderAssignmentTab();
            case 'tab3': return renderMapTab();
            default: return renderRoutesTab();
        }
    };

    return (
        <div className="route-management">
            <main className="page-content">
                <div>
                    {renderTabContent()}
                </div>
            </main>
            <AssignmentModal
                route={selectedRouteForModal}
                trucks={truckData}
                onClose={() => setSelectedRouteForModal(null)}
                onConfirm={handleAssignRoute}
            />
        </div>
    );
};

export default RouteManagement;