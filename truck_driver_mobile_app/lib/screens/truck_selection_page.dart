import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/Truck.dart';
import '../services/truck_service.dart';
import '../providers/user_provider.dart';
import 'home_page.dart';

class TruckSelectionPage extends StatefulWidget {
  const TruckSelectionPage({Key? key}) : super(key: key);

  @override
  State<TruckSelectionPage> createState() => _TruckSelectionPageState();
}

class _TruckSelectionPageState extends State<TruckSelectionPage> {
  final TruckService _truckService = TruckService();

  List<Truck> _availableTrucks = [];
  Truck? _selectedTruck;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchTrucks();
  }

  Future<void> _fetchTrucks() async {
    setState(() => _isLoading = true);

    try {
      final trucks = await _truckService.getAllTrucks();
      setState(() => _availableTrucks = trucks);
    } catch (e) {
      _showErrorSnackBar('Failed to load trucks. Please check your connection.');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _assignTruck() async {
    if (_selectedTruck == null) return;

    setState(() => _isLoading = true);

    try {
      final success = await _truckService.assignTruck(_selectedTruck!.registrationNumber);
      if (success) {
        Provider.of<UserProvider>(context, listen: false)
            .assignTruck(_selectedTruck!.registrationNumber);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${_selectedTruck!.registrationNumber} assigned')),
        );

        await Future.delayed(const Duration(milliseconds: 800));

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomePage()),
        );
      } else {
        _showErrorSnackBar('Truck assignment failed. Please try again.');
      }
    } catch (e) {
      _showErrorSnackBar('Server error: ${e.toString()}');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Your Truck'),
        centerTitle: true,
        backgroundColor: Colors.green[700],
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: _isLoading && _availableTrucks.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : _availableTrucks.isEmpty
                    ? const Center(child: Text("No available trucks found."))
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Card(
                            elevation: 3,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  const Text(
                                    'Choose your truck:',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 10),
                                  DropdownButtonFormField<Truck>(
                                    isExpanded: true,
                                    decoration: InputDecoration(
                                      border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(10)),
                                      contentPadding:
                                          const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 14),
                                    ),
                                    hint: const Text('Select available truck'),
                                    value: _selectedTruck,
                                    items: _availableTrucks
                                        .map((truck) => DropdownMenuItem(
                                              value: truck,
                                              child: Text(
                                                  '${truck.registrationNumber} (${truck.status})'),
                                            ))
                                        .toList(),
                                    onChanged: (truck) {
                                      setState(() => _selectedTruck = truck);
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: _selectedTruck != null && !_isLoading
                                ? _assignTruck
                                : null,
                            icon: const Icon(Icons.assignment),
                            label: const Text("Assign Truck"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green[700],
                              foregroundColor: Colors.white,
                              minimumSize: const Size.fromHeight(50),
                            ),
                          ),
                        ],
                      ),
          ),
          if (_isLoading && _availableTrucks.isNotEmpty)
            Container(
              color: Colors.black.withValues(alpha: 0.3),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }
}
