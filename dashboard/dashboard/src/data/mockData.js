
export const mockData = {
  userName: 'Admin User',
  nextCollectionDate: '3rd March 2025',
  nextCollectionTomorrow: true,
  availableTrucks: {
    idle: 2,
    onRoute: 3,
    needRepair: 1,
  },
  maintenanceRequests: {
    emergency: 2,
    binRepair: 1,
  },
  bins: {
    total: 15,
    active: 14,
    full: 2,
    empty: 12,
  },
  history: [
    { id: 1, action: 'Bin #102 reported full', time: '10 mins ago', user: 'Sensor' },
    { id: 2, action: 'Truck #3 started route A', time: '30 mins ago', user: 'System' },
    { id: 3, action: 'Maintenance scheduled for Truck #1', time: '1 hour ago', user: 'Admin' },
    { id: 4, action: 'New user "John Doe" added', time: '3 hours ago', user: 'Admin User' },
  ]
};

