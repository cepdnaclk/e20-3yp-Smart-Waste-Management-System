// 

import React, { useState } from 'react';
import { Route, Plus, Pencil, Trash2, MapPin, Users, Truck, Clock, Navigation, CheckCircle, XCircle, X } from 'lucide-react';
import "../styles/RouteManagement.css";

// ===================================================================================
// NOTE: I've added a new modal component and the logic to control it.
// The original "Assignment Panel" has been removed in favor of this better window.
// ===================================================================================

const AssignmentModal = ({ route, trucks, onConfirm, onClose }) => {
    if (!route) return null;

    const [selectedTruckId, setSelectedTruckId] = useState(null);

    const availableTrucks = trucks.filter(truck => !truck.isAssigned && truck.status === 'available');

    const handleConfirm = () => {
        if (!selectedTruckId) {
            alert("Please select a truck to assign.");
            return;
        }
        const truck = trucks.find(t => t.id === selectedTruckId);
        onConfirm(route.id, truck.id, truck.driver);
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
                    <p className="modal-subtitle">Select an available truck from the list below. Only trucks that are 'available' and not already assigned are shown.</p>
                    <div className="modal-options-list">
                        {availableTrucks.length > 0 ? availableTrucks.map(truck => (
                            <div
                                key={truck.id}
                                className={`modal-option ${selectedTruckId === truck.id ? 'modal-option--selected' : ''}`}
                                onClick={() => setSelectedTruckId(truck.id)}
                            >
                                <div className="assignment-option-info">
                                    <strong>{truck.plateNumber}</strong> - {truck.driver}
                                    <br />
                                    <small>{truck.capacity} • {truck.currentLocation}</small>
                                </div>
                                {selectedTruckId === truck.id && <CheckCircle size={20} className="selection-checkmark" />}
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
    const [selectedRouteForModal, setSelectedRouteForModal] = useState(null);

    // Sample route data
    const [routeData, setRouteData] = useState([
        // ... your existing routeData ...
        { id: 'R-001', name: 'Downtown Circuit', startLocation: 'Main Depot', endLocation: 'Downtown Hub', distance: '25 km', estimatedTime: '45 min', stops: 8, priority: 'high', status: 'active', assignedTruck: 'TRK-001', assignedDriver: 'John Smith', isAssigned: true },
        { id: 'R-002', name: 'Suburban Loop', startLocation: 'North Depot', endLocation: 'Suburban Center', distance: '18 km', estimatedTime: '35 min', stops: 6, priority: 'medium', status: 'active', assignedTruck: 'TRK-002', assignedDriver: 'Sarah Johnson', isAssigned: true },
        { id: 'R-003', name: 'Industrial Zone', startLocation: 'South Depot', endLocation: 'Industrial Park', distance: '32 km', estimatedTime: '55 min', stops: 12, priority: 'high', status: 'inactive', assignedTruck: null, assignedDriver: null, isAssigned: false },
        { id: 'R-004', name: 'Commercial District', startLocation: 'East Depot', endLocation: 'Mall Complex', distance: '15 km', estimatedTime: '30 min', stops: 4, priority: 'low', status: 'active', assignedTruck: null, assignedDriver: null, isAssigned: false },
        { id: 'R-005', name: 'Airport Express', startLocation: 'Main Depot', endLocation: 'Airport Terminal', distance: '45 km', estimatedTime: '65 min', stops: 3, priority: 'high', status: 'maintenance', assignedTruck: null, assignedDriver: null, isAssigned: false }
    ]);

    // Sample truck data with drivers
    const [truckData, setTruckData] = useState([
        // ... your existing truckData ...
        { id: 'TRK-001', plateNumber: 'ABC-1234', driver: 'John Smith', status: 'available', currentLocation: 'Main Depot', capacity: '10 tons', isAssigned: true },
        { id: 'TRK-002', plateNumber: 'XYZ-5678', driver: 'Sarah Johnson', status: 'available', currentLocation: 'North Depot', capacity: '8 tons', isAssigned: true },
        { id: 'TRK-003', plateNumber: 'DEF-9012', driver: 'Mike Wilson', status: 'maintenance', currentLocation: 'Service Center', capacity: '12 tons', isAssigned: false },
        { id: 'TRK-004', plateNumber: 'GHI-3456', driver: 'Emily Davis', status: 'available', currentLocation: 'South Depot', capacity: '10 tons', isAssigned: false },
        { id: 'TRK-005', plateNumber: 'JKL-7890', driver: 'Robert Brown', status: 'available', currentLocation: 'Main Depot', capacity: '15 tons', isAssigned: false }
    ]);

    const getStatusColor = (status) => {
        // ... your existing getStatusColor function ...
        switch (status) {
            case 'active': return 'status-badge--success';
            case 'inactive': return 'status-badge--warning';
            case 'maintenance': return 'status-badge--danger';
            case 'available': return 'status-badge--success'; // Added for trucks
            default: return 'status-badge--default';
        }
    };

    const getPriorityColor = (priority) => {
        // ... your existing getPriorityColor function ...
        switch (priority) {
            case 'high': return 'priority--high';
            case 'medium': return 'priority--medium';
            case 'low': return 'priority--low';
            default: return 'priority--default';
        }
    };

    const handleAssignRoute = (routeId, truckId, driverId) => {
        // Update Route Data
        setRouteData(prevRoutes =>
            prevRoutes.map(route =>
                route.id === routeId
                    ? { ...route, assignedTruck: truckId, assignedDriver: driverId, isAssigned: true }
                    : route
            )
        );
        // Update Truck Data
        setTruckData(prevTrucks =>
            prevTrucks.map(truck =>
                truck.id === truckId
                    ? { ...truck, isAssigned: true }
                    : truck
            )
        );
        setSelectedRouteForModal(null); // Close the modal
    };

    const handleUnassignRoute = (routeId) => {
        // ... your existing handleUnassignRoute function ...
        // Note: You may also want to update the corresponding truck's isAssigned status here
    };

    // Routes Management Tab
    const renderRoutesTab = () => (
        // ... your existing renderRoutesTab function (no changes needed) ...
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

    // Route Assignment Tab
    const renderAssignmentTab = () => (
        <section className="">
            <div className="page-header">
                <Route size={24} />
                <h1 className="page-title">Route Assignment</h1>
            </div>
            <div className="card-header">
                <h3 className="card__title"></h3>
                <p className="card-subtitle">Assign available trucks to unassigned routes.</p>
            </div>
            <div className="card-content">
                <div className="assignment-container">
                    {/* Drivers and Trucks Section */}
                    <div className="assignment-section">
                        <h4 className="section-title">
                            <Users size={20} />
                            Drivers & Trucks Status
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
                            Available Routes to Assign
                        </h4>
                        <div className="available-routes">
                            {routeData.filter(route => !route.isAssigned && route.status !== 'maintenance').map(route => (
                                <div
                                    key={route.id}
                                    className="route-assignment-card"
                                    // CHANGE: On click, we now open the modal
                                    onClick={() => setSelectedRouteForModal(route)}
                                >
                                    <div className="route-header">
                                        <h5 className="route-name">{route.name}</h5>
                                        <span className={`priority-badge ${getPriorityColor(route.priority)}`}>
                                            {route.priority}
                                        </span>
                                    </div>
                                    <div className="route-details">
                                        {/* Simplified details for brevity, you can keep your original structure */}
                                        <div className="route-stat">
                                            <Navigation size={14} />
                                            <span>{route.distance}</span>
                                        </div>
                                        <div className="route-stat">
                                            <Clock size={14} />
                                            <span>{route.estimatedTime}</span>
                                        </div>
                                        <div className="route-stat">
                                            <MapPin size={14} />
                                            <span>{route.stops} stops</span>
                                        </div>
                                    </div>
                                    <div className="card-footer-action">
                                        <button className="btn btn--primary btn--small">
                                           Assign Truck
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* REMOVED: The old assignment panel is no longer needed. */}
            </div>
        </section>
    );

    // Map Tab
    const renderMapTab = () => (
        // ... your existing renderMapTab function (no changes needed) ...
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
            {/* ADDED: Render the modal when a route is selected */}
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