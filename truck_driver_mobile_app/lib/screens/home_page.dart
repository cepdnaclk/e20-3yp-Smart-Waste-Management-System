import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:truck_driver_mobile_app/models/TruckAssignmentRequest.dart';
import 'package:truck_driver_mobile_app/screens/truck_selection_page.dart';
import 'package:truck_driver_mobile_app/services/truck_service.dart';
import '../providers/user_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _routeFetched = false;
  bool _routeFinished = false;
  bool _isLoading = false;

  // Dummy bin data for now
  final List<Map<String, dynamic>> dummyBins = [
    {
      "binId": "BIN-001",
      "location": "Near Park",
      "glass": 95,
      "plastic": 88,
      "paper": 91,
      "collected": false,
    },
    {
      "binId": "BIN-002",
      "location": "Main Street",
      "glass": 92,
      "plastic": 90,
      "paper": 85,
      "collected": false,
    },
  ];

  void _getAssignedRoute() {
    setState(() {
      _routeFetched = true;
    });
  }

  void _markBinCollected(int index) {
    setState(() {
      dummyBins[index]["collected"] = true;
    });
  }

  void _finishRoute() {
    setState(() {
      _routeFinished = true;
    });
  }

Future<void> _handOverTruck() async {
  final userProvider = Provider.of<UserProvider>(context, listen: false);
  final String? registrationNumber = userProvider.truckId;

  if (registrationNumber == null || registrationNumber.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("No truck assigned to hand over.")),
    );
    return;
  }

  TruckAssignmentRequest request = TruckAssignmentRequest(
    registrationNumber: registrationNumber,
  );

  final success = await TruckService().handOverTruck(request);

  if (!mounted) return; // widget might have been disposed

  if (success) {
    userProvider.clearAssignedTruck();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Truck $registrationNumber handed over successfully.")),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Failed to hand over truck. Please try again.")),
    );
    return;  // Optional: Don't navigate if failure
  }

  await Future.delayed(const Duration(milliseconds: 800));

  if (!mounted) return;  // Double check before navigation

  Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (context) => const TruckSelectionPage()),
  );
}


  @override
  Widget build(BuildContext context) {
    final username = Provider.of<UserProvider>(context).username;
    final truckId = Provider.of<UserProvider>(context).truckId;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Collector Home"),
        backgroundColor: Colors.green[700],
      ),
      
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text("Welcome $username!", style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text("Assigned Truck: $truckId", style: const TextStyle(color: Colors.grey)),
                  const SizedBox(height: 24),

                  if (!_routeFetched)
                    ElevatedButton(
                      onPressed: _getAssignedRoute,
                      child: const Text("Get My Route"),
                    ),

                  if (_routeFetched) ...[
                    const SizedBox(height: 16),
                    const Text("Assigned Route Details", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),

                    const SizedBox(height: 8),
                    Container(
                      height: 200,
                      color: Colors.grey[300],
                      alignment: Alignment.center,
                      child: const Text("Map Placeholder (Google Maps)"),
                    ),

                    const SizedBox(height: 16),
                    const Text("Bins on Route", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),

                    for (int i = 0; i < dummyBins.length; i++)
                      Card(
                        elevation: 3,
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        child: ListTile(
                          title: Text("Bin ID: ${dummyBins[i]['binId']}"),
                          subtitle: Text("Location: ${dummyBins[i]['location']}"),
                          trailing: dummyBins[i]['collected']
                              ? const Icon(Icons.check_circle, color: Colors.green)
                              : ElevatedButton(
                                  onPressed: () => _markBinCollected(i),
                                  child: const Text("Mark as Collected"),
                                ),
                        ),
                      ),

                    const SizedBox(height: 24),
                    if (dummyBins.every((bin) => bin['collected']))
                      ElevatedButton(
                        onPressed: _routeFinished ? null : _finishRoute,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blueAccent,
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(50),
                        ),
                        child: const Text("Finish Route"),
                      ),

                    if (_routeFinished)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Text(
                          "Route marked as finished.",
                          style: TextStyle(color: Colors.green[700], fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        _handOverTruck();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red[600],
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: const Text("Hand Over Truck"),
                    ),
                  ]
                ],
              ),
            ),
    );
  }
}
