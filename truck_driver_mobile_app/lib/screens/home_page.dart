import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:truck_driver_mobile_app/models/Truck.dart';
import 'package:truck_driver_mobile_app/providers/user_provider.dart';
import 'package:truck_driver_mobile_app/screens/bin_level_page.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Truck? selectedTruck;
  Set<Marker> _binMarkers = {};
  late GoogleMapController _controller;
  Set<Polyline> _polylines = {};
  int _polylineIdCounter = 1;

  String routeStatus = "Assigned"; // Possible values: Assigned, Active, Completed

  final CameraPosition _initialPosition = const CameraPosition(
    target: LatLng(7.2523, 80.5929),
    zoom: 10,
  );

  final List<Truck> dummyTrucks = [
    Truck(id: "Truck 1", registrationNumber: 'LZ-1234', status: 'available'),
    Truck(id: "Truck 2", registrationNumber: 'LZ-5678', status: 'available'),
    Truck(id: "Truck 3", registrationNumber: 'LY-9101', status: 'available'),
  ];

  List<Map<String, dynamic>> dummyBins = [
    {
      'id': 'bin1',
      'position': LatLng(7.2558, 80.5941),
      'location': 'Engineering Faculty',
      'collected': false,
    },
    {
      'id': 'bin2',
      'position': LatLng(7.2575, 80.5982),
      'location': 'Arts Theatre',
      'collected': false,
    },
    {
      'id': 'bin3',
      'position': LatLng(7.2587, 80.5920),
      'location': 'Sarasavi Uyana',
      'collected': false,
    },
    {
      'id': 'bin4',
      'position': LatLng(7.2562, 80.5900),
      'location': 'Gymnasium',
      'collected': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadBinMarkers();
  }

  void _loadBinMarkers() {
    final markers = dummyBins.map((bin) {
      return Marker(
        markerId: MarkerId(bin['id']),
        position: bin['position'],
        infoWindow: InfoWindow(title: bin['location']),
        icon: BitmapDescriptor.defaultMarkerWithHue(
            bin['collected'] ? BitmapDescriptor.hueGreen : BitmapDescriptor.hueRed),
      );
    }).toSet();

    setState(() {
      _binMarkers = markers;
    });
  }

  List<LatLng> _decodePolyline(String encoded) {
    List<LatLng> polyline = [];
    int index = 0, len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      polyline.add(LatLng(lat / 1E5, lng / 1E5));
    }

    return polyline;
  }

  Future<void> _getOptimizedRoute(Position truckPosition) async {
    final apiKey = dotenv.env['GOOGLE_MAPS_API_KEY']!;
    final origin = '${truckPosition.latitude},${truckPosition.longitude}';
    final waypoints = dummyBins.map((bin) {
      final pos = bin['position'] as LatLng;
      return '${pos.latitude},${pos.longitude}';
    }).join('|');

    final url = Uri.parse(
      'https://maps.googleapis.com/maps/api/directions/json?origin=$origin&destination=$origin&waypoints=optimize:true|$waypoints&key=$apiKey',
    );

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['routes'] == null || data['routes'].isEmpty) {
        print("No routes found");
        return;
      }

      final points = data['routes'][0]['overview_polyline']['points'];
      final polylineCoordinates = _decodePolyline(points);

      setState(() {
        _polylines = {
          Polyline(
            polylineId: PolylineId("route_${_polylineIdCounter++}"),
            color: Colors.blue,
            width: 5,
            points: polylineCoordinates,
          ),
        };
      });
    } else {
      print("Failed to load directions: ${response.body}");
    }
  }

  void _startRoute() async {
    final position = await Geolocator.getCurrentPosition();
    await _getOptimizedRoute(position);
    setState(() => routeStatus = "Active");
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Route Started")),
    );
  }

  void _markBinCollected(String id) {
    setState(() {
      final bin = dummyBins.firstWhere((b) => b['id'] == id);
      bin['collected'] = true;
    });

    _loadBinMarkers(); // Refresh marker colors

    if (dummyBins.every((b) => b['collected'] == true)) {
      setState(() => routeStatus = "Completed");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("All bins collected! Route completed.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final username = Provider.of<UserProvider>(context).username ?? "User";
    final assignedTruckId = Provider.of<UserProvider>(context).truckId;
    final assignedTruck = assignedTruckId == null
        ? null
        : dummyTrucks.firstWhere(
            (t) => t.id == assignedTruckId,
            orElse: () => Truck(id: '', registrationNumber: '', status: ''),
          );

    return Scaffold(
      appBar: AppBar(
        title: const Text("Truck Driver Dashboard"),
        backgroundColor: Colors.green[700],
      ),
      drawer: const MyNavigationDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Welcome $username!",
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            if (assignedTruck != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Truck: ${assignedTruck.registrationNumber}",
                      style: const TextStyle(fontSize: 18)),
                  Text("Route Status: $routeStatus",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: routeStatus == "Completed"
                            ? Colors.green
                            : routeStatus == "Active"
                                ? Colors.blue
                                : Colors.orange,
                      )),
                ],
              ),
            const SizedBox(height: 20),

            SizedBox(
              height: 280,
              child: GoogleMap(
                initialCameraPosition: _initialPosition,
                onMapCreated: (controller) => _controller = controller,
                myLocationEnabled: true,
                markers: _binMarkers,
                polylines: _polylines,
              ),
            ),

            const SizedBox(height: 20),

            if (routeStatus == "Assigned")
              ElevatedButton.icon(
                onPressed: _startRoute,
                icon: const Icon(Icons.play_arrow),
                label: const Text("Start Route"),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: Colors.green[700],
                ),
              ),

            if (routeStatus == "Active") ...[
              const SizedBox(height: 20),
              const Text("Bins to Collect:",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              const SizedBox(height: 10),
              ...dummyBins.map((bin) => Card(
                    child: ListTile(
                      title: Text(bin['location']),
                      subtitle: Text("ID: ${bin['id']}"),
                      trailing: bin['collected']
                          ? const Icon(Icons.check_circle, color: Colors.green)
                          : ElevatedButton(
                              onPressed: () => _markBinCollected(bin['id']),
                              child: const Text("Mark Collected"),
                            ),
                    ),
                  )),
            ],

            if (routeStatus == "Completed") ...[
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Route closed")),
                  );
                },
                icon: const Icon(Icons.check),
                label: const Text("Finish Route"),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: Colors.grey[800],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
