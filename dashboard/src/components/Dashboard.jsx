import {React,useState,useEffect} from 'react';
import CollectionDate from './dashboard/CollectionDate';
import AvailableTrucks from './dashboard/AvailableTrucks';
import MaintenanceRequests from './dashboard/MaintenanceRequests.jsx';
import TotalBins from './dashboard/Totalbins.jsx';
import History from './dashboard/History';
import '../styles/styles.css';
// import MyMap from '../components/dashboard/MyMap.jsx';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS globally

const Dashboard = () => {

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



  return (
    <main className="dashboard">
      <div className="dashboard__grid">
        <CollectionDate />
        <AvailableTrucks />
        <MaintenanceRequests />
        <TotalBins />
        <History />
      </div>
    </main>
  );
};

export default Dashboard;