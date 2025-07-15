import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:truck_driver_mobile_app/models/TruckAssignmentRequest.dart';
import 'package:truck_driver_mobile_app/models/AssignedRoute.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';
import 'package:truck_driver_mobile_app/screens/truck_selection_page.dart';
import 'package:truck_driver_mobile_app/services/route_service.dart';
import 'package:truck_driver_mobile_app/services/truck_service.dart';
import 'package:truck_driver_mobile_app/widgets/custom_google_map.dart';
import '../providers/user_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // All your original state and logic are unchanged
  AssignedRoute? _route;
  bool _isLoading = false;
  bool _routeStarted = false;
  bool _routeFinished = false;

  void _showSnackBar(String message, {bool isError = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(color: Colors.white)),
        backgroundColor: isError ? Colors.red : Colors.lightGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // All your logic methods (_getAssignedRoute, _markAsCollected, etc.) remain identical
  Future<void> _getAssignedRoute() async {
    setState(() => _isLoading = true);
    try {
      final token =
          await Provider.of<UserProvider>(context, listen: false).getToken();
      if (token == null) {
        _showSnackBar("Token not found. Please log in again.", isError: true);
        return;
      }
      final route = await RouteService().getAssignedRoute(token);
      setState(() {
        _route = route;
        _routeStarted = false;
        _routeFinished = false;
      });
    } catch (e) {
      _showSnackBar("Failed to get route: $e", isError: true);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _startRoute() async {
    if (_route == null) return;
    setState(() => _isLoading = true);
    final token =
        await Provider.of<UserProvider>(context, listen: false).getToken();
    if (token == null || token.isEmpty) {
      _showSnackBar("No token found. Please login again.", isError: true);
      setState(() => _isLoading = false);
      return;
    }
    try {
      final success = await RouteService().startRoute(token, _route!.routeId);
      if (success) {
        setState(() => _routeStarted = true);
        _showSnackBar("Route started successfully!");
      }
    } catch (e) {
      _showSnackBar("Start route failed: $e", isError: true);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsCollected(int stopId) async {
    final token =
        await Provider.of<UserProvider>(context, listen: false).getToken();
    if (token == null) {
      _showSnackBar("No token found. Please login again.", isError: true);
      return;
    }
    final binStop = _route?.stops.firstWhere((stop) => stop.id == stopId);
    if (binStop == null) {
      _showSnackBar("Bin stop not found.", isError: true);
      return;
    }
    try {
      final success = await RouteService()
          .markBinCollected(token, _route!.routeId, binStop.binId);
      if (success) {
        setState(() {
          _route!.stops.removeWhere((stop) => stop.id == stopId);
          _showSnackBar("Bin ${binStop.binId} marked as collected.");
        });
      }
    } catch (e) {
      _showSnackBar("Failed to mark bin: $e", isError: true);
    }
  }

  Future<void> _finishRoute() async {
    final token =
        await Provider.of<UserProvider>(context, listen: false).getToken();
    if (token == null) {
      _showSnackBar("No token found. Please login again.", isError: true);
      return;
    }
    try {
      final success = await RouteService().stopRoute(token, _route!.routeId);
      if (success) {
        setState(() => _routeFinished = true);
        _showSnackBar("Route finished successfully");
      }
    } catch (e) {
      _showSnackBar("Failed to finish route: $e", isError: true);
    }
  }

  Future<void> _handOverTruck() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final String? registrationNumber = userProvider.truckId;
    if (registrationNumber == null) {
      _showSnackBar("No truck assigned to hand over.", isError: true);
      return;
    }
    final success = await TruckService().handOverTruck(
      TruckAssignmentRequest(registrationNumber: registrationNumber),
    );
    if (success) {
      userProvider.clearAssignedTruck();
      _showSnackBar("Truck $registrationNumber handed over.");
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const TruckSelectionPage()),
        );
      }
    } else {
      _showSnackBar("Failed to hand over truck.", isError: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final username = Provider.of<UserProvider>(context).username;
    final truckId = Provider.of<UserProvider>(context).truckId;

    // --- Button Styles Defined Using Your Login Page's Color Scheme ---
    final ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
      backgroundColor: Colors.lightGreen,
      foregroundColor: Colors.white,
      minimumSize: const Size.fromHeight(50),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    );

    // Using an OutlinedButton for secondary actions to create visual hierarchy
    final ButtonStyle secondaryButtonStyle = OutlinedButton.styleFrom(
      side: const BorderSide(color: Colors.lightGreen, width: 2),
      foregroundColor: Colors.lightGreen,
      minimumSize: const Size.fromHeight(50),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    );

    return Scaffold(
      backgroundColor: Colors.black, // Matching LoginPage background
      drawer: const MyNavigationDrawer(),
      appBar: AppBar(
        title: const Text("Home", style: TextStyle(color: Colors.white)),
        backgroundColor:
            const Color(0xFF1C1C1C), // A slightly off-black for depth
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Colors.lightGreen))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // --- WELCOME CARD STYLED FOR DARK THEME ---
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2C2C2C), // From your bottom sheet
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        Text("Welcome $username!",
                            style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white)),
                        const SizedBox(height: 8),
                        Text("Assigned Truck: $truckId",
                            style: const TextStyle(
                                fontSize: 16, color: Colors.white70)),
                        const SizedBox(height: 20),
                        if (_route == null)
                          ElevatedButton.icon(
                            icon: const Icon(Icons.route_outlined),
                            onPressed: _getAssignedRoute,
                            label: const Text("Get My Route"),
                            style: primaryButtonStyle,
                          ),
                      ],
                    ),
                  ),

                  if (_route != null) ...[
                    const SizedBox(height: 24),
                    const Text("Assigned Route Details",
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white)),
                    const SizedBox(height: 16),
                    if (!_routeStarted)
                      OutlinedButton.icon(
                        // Using secondary style
                        icon: const Icon(Icons.play_circle_outline),
                        onPressed: _startRoute,
                        style: secondaryButtonStyle,
                        label: const Text("Start Route"),
                      ),
                    if (_routeStarted)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: SizedBox(
                          height: 300,
                          child: CustomGoogleMap(
                            binStops: _route?.stops ?? [],
                            onMarkerTap: (stopId) {
                              print("Tapped marker for stop $stopId");
                            },
                          ),
                        ),
                      ),
                    const SizedBox(height: 24),
                    const Text("Bins on Route",
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white)),
                    const SizedBox(height: 12),
                    // --- BIN LIST STYLED FOR DARK THEME ---
                    for (final bin in _route!.stops)
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2C2C2C),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline,
                                color: Colors.lightGreen.shade300, size: 28),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("Bin ID: ${bin.binId}",
                                      style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                          fontSize: 16,
                                          color: Colors.white)),
                                  Text(
                                      "Location: (${bin.latitude.toStringAsFixed(3)}, ${bin.longitude.toStringAsFixed(3)})",
                                      style: const TextStyle(
                                          color: Colors.white70)),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            // Tertiary action, less emphasis
                            TextButton(
                              onPressed: () => _markAsCollected(bin.id),
                              child: const Text("Collect",
                                  style: TextStyle(
                                      color: Colors.lightGreen,
                                      fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 24),
                    // --- FINISH/COMPLETED SECTION STYLED FOR DARK THEME ---
                    if (_route!.stops.isEmpty && !_routeFinished)
                      OutlinedButton.icon(
                        // Using secondary style
                        icon: const Icon(Icons.flag),
                        onPressed: _finishRoute,
                        style: secondaryButtonStyle,
                        label: const Text("Finish Route"),
                      ),
                    if (_routeFinished)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: Colors.green
                                .withOpacity(0.1), // From your success overlay
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: Colors.green.withOpacity(0.3))),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.check_circle_outline,
                                color: Colors.green, size: 28),
                            SizedBox(width: 12),
                            Text("Route Completed!",
                                style: TextStyle(
                                    color: Colors.green,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18)),
                          ],
                        ),
                      ),
                    const SizedBox(height: 24),
                    // --- HANDOVER BUTTON STYLED FOR DARK THEME ---
                    ElevatedButton.icon(
                      icon: const Icon(Icons.logout_outlined),
                      onPressed: _handOverTruck,
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            Colors.red, // Matching your error button
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(50),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        textStyle: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      label: const Text("Hand Over Truck"),
                    ),
                  ]
                ],
              ),
            ),
    );
  }
}
