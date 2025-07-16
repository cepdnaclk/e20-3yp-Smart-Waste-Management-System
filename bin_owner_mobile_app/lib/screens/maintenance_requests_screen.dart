// lib/screens/maintenance_requests_screen.dart
import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/theme/colors.dart';
import '../models/maintenance_request_model.dart';
import '../services/maintenance_service.dart';

class MaintenanceRequestsScreen extends StatefulWidget {
  const MaintenanceRequestsScreen({super.key});

  @override
  State<MaintenanceRequestsScreen> createState() =>
      _MaintenanceRequestsScreenState();
}

class _MaintenanceRequestsScreenState extends State<MaintenanceRequestsScreen> {
  List<MaintenanceRequest> _requests = [];
  bool _isLoading = true;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _loadRequests();
  }

  Future<void> _loadRequests() async {
    try {
      setState(() {
        _isLoading = true;
        _error = '';
      });

      final requests = await MaintenanceService.getMyRequests();
      setState(() {
        _requests = requests;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return Colors.orange;
      case 'IN_PROGRESS':
        return Colors.blue;
      case 'COMPLETED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      // appBar: AppBar(
      //   title: const Text('My Maintenance Requests'),
      //   backgroundColor: AppColors.primary,
      //   foregroundColor: Colors.white,
      //   actions: [
      //     IconButton(icon: const Icon(Icons.refresh), onPressed: _loadRequests),
      //   ],
      // ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _error.isNotEmpty
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Error: $_error',
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _loadRequests,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              )
              : _requests.isEmpty
              ? const Center(
                child: Text(
                  'No maintenance requests found',
                  style: TextStyle(color: Colors.white70),
                ),
              )
              : ListView.builder(
                itemCount: _requests.length,
                itemBuilder: (context, index) {
                  final request = _requests[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    color: Colors.grey[850],
                    child: ListTile(
                      title: Text(
                        '${request.requestType} - ${request.binId}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            request.description,
                            style: const TextStyle(color: Colors.white70),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Priority: ${request.priority}',
                            style: const TextStyle(color: Colors.white60),
                          ),
                          if (request.createdAt != null)
                            Text(
                              'Created: ${request.createdAt!.toLocal().toString().split(' ')[0]}',
                              style: const TextStyle(color: Colors.white60),
                            ),
                        ],
                      ),
                      trailing:
                          request.status != null
                              ? Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: _getStatusColor(request.status),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  request.status!.toUpperCase(),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              )
                              : null,
                    ),
                  );
                },
              ),
    );
  }
}
