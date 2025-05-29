// 

import React from 'react';
import { Truck, Pencil, Trash2, Plus } from 'lucide-react';
import "../styles/TruckManagement.css";

const TruckManagement = () => {
  return (
      <div className='truck-management'>
        <main className="page-content">
          <div className="page-header">
            <Truck size={24} />
            <h1 className="page-title">Truck Management</h1>
          </div>
          
          <div className="page-grid">   
            <section className="card">
              <div className="card-header">
                <h3 className="card__title">Active Fleet</h3>
                <button className="btn btn--primary">
                  <Plus size={18} />
                  Add Truck
                </button>
              </div>
              <div className="truck-list">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Truck ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TRK-001</td>
                      <td><span className="status-badge status-badge--active">On Route</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="text-blue-500">
                            <Pencil size={18} />
                          </button>
                          <button className="text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>TRK-002</td>
                      <td><span className="status-badge status-badge--active">On Route</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="text-blue-500">
                            <Pencil size={18} />
                          </button>
                          <button className="text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>TRK-003</td>
                      <td><span className="status-badge status-badge--active">On Route</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="text-blue-500">
                            <Pencil size={18} />
                          </button>
                          <button className="text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
};

export default TruckManagement;