// import 'package:flutter/material.dart';
// import 'package:bin_owner_mobile_app/theme/colors.dart';
// import 'package:provider/provider.dart';
// import '../models/maintenance_request_model.dart';
// import '../services/maintenance_service.dart';
// import '../providers/bin_provider.dart';

// class ProblemReportScreen extends StatefulWidget {
//   final String? binId; // Make it optional to get from provider

//   const ProblemReportScreen({super.key, this.binId});

//   @override
//   State<ProblemReportScreen> createState() => _ProblemReportScreenState();
// }

// class _ProblemReportScreenState extends State<ProblemReportScreen> {
//   final Map<String, bool> _issues = {
//     'Sorting malfunction': false,
//     'GPS not working': false,
//     'Bin level monitoring not working': false,
//     'Physical damage': false,
//     'Collection missed': false,
//     'Overflowing': false,
//   };

//   final TextEditingController _messageController = TextEditingController();
//   bool _isSubmitting = false;

//   // Form fields
//   String _requestType = 'REPAIR';
//   String _priority = 'MEDIUM';

//   final List<String> _requestTypes = [
//     'REPAIR',
//     'CLEANING',
//     'REPLACEMENT',
//     'OTHER',
//   ];
//   final List<String> _priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

//   @override
//   void dispose() {
//     _messageController.dispose();
//     super.dispose();
//   }

//   String? _getCurrentBinId() {
//     // Try to get binId from widget parameter or provider
//     if (widget.binId != null) return widget.binId;

//     final binProvider = Provider.of<BinProvider>(context, listen: false);
//     return binProvider.binId;
//   }

//   void _handleSubmit() async {
//     final selectedIssues =
//         _issues.entries
//             .where((entry) => entry.value)
//             .map((entry) => entry.key)
//             .toList();

//     final message = _messageController.text.trim();

//     if (selectedIssues.isEmpty && message.isEmpty) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//           content: Text('Please select an issue or write a message.'),
//           backgroundColor: Colors.orange,
//         ),
//       );
//       return;
//     }

//     final binId = _getCurrentBinId();
//     if (binId == null) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//           content: Text('No bin selected. Please select a bin first.'),
//           backgroundColor: Colors.red,
//         ),
//       );
//       return;
//     }

//     setState(() => _isSubmitting = true);

//     try {
//       // Create description combining selected issues and message
//       String description = '';
//       if (selectedIssues.isNotEmpty) {
//         description = 'Issues: ${selectedIssues.join(', ')}';
//       }
//       if (message.isNotEmpty) {
//         description +=
//             description.isEmpty ? message : '\n\nAdditional details: $message';
//       }

//       final request = MaintenanceRequest(
//         binId: binId,
//         requestType: _requestType,
//         description: description,
//         priority: _priority,
//         selectedIssues: selectedIssues,
//       );

//       final success = await MaintenanceService.submitMaintenanceRequest(
//         request,
//       );

//       if (success && mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(
//             content: Text('Maintenance request submitted successfully!'),
//             backgroundColor: Colors.green,
//           ),
//         );

//         // Clear form
//         setState(() {
//           _issues.updateAll((key, value) => false);
//           _messageController.clear();
//           _requestType = 'REPAIR';
//           _priority = 'MEDIUM';
//         });

//         // Navigate back or show success screen
//         Navigator.pop(context, true);
//       }
//     } catch (e) {
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text('Error: ${e.toString()}'),
//             backgroundColor: Colors.red,
//           ),
//         );
//       }
//     } finally {
//       if (mounted) {
//         setState(() => _isSubmitting = false);
//       }
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       // appBar: AppBar(
//       //   title: const Text('Report Maintenance Issue'),
//       //   backgroundColor: AppColors.primary,
//       //   foregroundColor: Colors.white,
//       // ),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(20),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Bin ID Display
//             Container(
//               padding: const EdgeInsets.all(16),
//               decoration: BoxDecoration(
//                 color: Colors.grey[850],
//                 borderRadius: BorderRadius.circular(8),
//               ),
//               child: Row(
//                 children: [
//                   const Icon(Icons.delete, color: Colors.green),
//                   const SizedBox(width: 12),
//                   Text(
//                     'Bin ID: ${_getCurrentBinId() ?? 'Not selected'}',
//                     style: const TextStyle(
//                       color: Colors.white,
//                       fontSize: 16,
//                       fontWeight: FontWeight.bold,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             const SizedBox(height: 20),

//             // Request Type Dropdown
//             const Text(
//               'Request Type:',
//               style: TextStyle(
//                 fontSize: 16,
//                 color: Colors.white70,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 10),
//             DropdownButtonFormField<String>(
//               value: _requestType,
//               dropdownColor: Colors.grey[850],
//               style: const TextStyle(color: Colors.white),
//               decoration: InputDecoration(
//                 filled: true,
//                 fillColor: Colors.grey[850],
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//               ),
//               items:
//                   _requestTypes
//                       .map(
//                         (type) =>
//                             DropdownMenuItem(value: type, child: Text(type)),
//                       )
//                       .toList(),
//               onChanged: (value) => setState(() => _requestType = value!),
//             ),
//             const SizedBox(height: 20),

//             // Priority Dropdown
//             const Text(
//               'Priority:',
//               style: TextStyle(
//                 fontSize: 16,
//                 color: Colors.white70,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 10),
//             DropdownButtonFormField<String>(
//               value: _priority,
//               dropdownColor: Colors.grey[850],
//               style: const TextStyle(color: Colors.white),
//               decoration: InputDecoration(
//                 filled: true,
//                 fillColor: Colors.grey[850],
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//               ),
//               items:
//                   _priorities
//                       .map(
//                         (priority) => DropdownMenuItem(
//                           value: priority,
//                           child: Text(priority),
//                         ),
//                       )
//                       .toList(),
//               onChanged: (value) => setState(() => _priority = value!),
//             ),
//             const SizedBox(height: 20),

//             // Issues Checkboxes
//             const Text(
//               'Select issues with your bin:',
//               style: TextStyle(
//                 fontSize: 16,
//                 color: Colors.white70,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 10),
//             Container(
//               decoration: BoxDecoration(
//                 color: Colors.grey[850],
//                 borderRadius: BorderRadius.circular(8),
//               ),
//               child: Column(
//                 children:
//                     _issues.entries.map((entry) {
//                       return CheckboxListTile(
//                         title: Text(
//                           entry.key,
//                           style: const TextStyle(color: Colors.white),
//                         ),
//                         value: entry.value,
//                         onChanged: (bool? value) {
//                           setState(() {
//                             _issues[entry.key] = value ?? false;
//                           });
//                         },
//                         activeColor: Colors.green,
//                         checkColor: Colors.black,
//                         controlAffinity: ListTileControlAffinity.leading,
//                       );
//                     }).toList(),
//               ),
//             ),
//             const SizedBox(height: 20),

//             // Description Field
//             const Text(
//               'Additional details:',
//               style: TextStyle(
//                 fontSize: 16,
//                 color: Colors.white70,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 10),
//             TextField(
//               controller: _messageController,
//               maxLines: 4,
//               style: const TextStyle(color: Colors.white),
//               decoration: InputDecoration(
//                 hintText:
//                     'Describe any other issue or provide additional details...',
//                 hintStyle: const TextStyle(color: Colors.white60),
//                 filled: true,
//                 fillColor: Colors.grey[850],
//                 border: OutlineInputBorder(
//                   borderRadius: BorderRadius.circular(8),
//                 ),
//               ),
//             ),
//             const SizedBox(height: 30),

//             // Submit Button
//             SizedBox(
//               width: double.infinity,
//               child: ElevatedButton(
//                 onPressed: _isSubmitting ? null : _handleSubmit,
//                 style: ElevatedButton.styleFrom(
//                   padding: const EdgeInsets.symmetric(vertical: 16),
//                   backgroundColor: Colors.green,
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(10),
//                   ),
//                 ),
//                 child:
//                     _isSubmitting
//                         ? const CircularProgressIndicator(color: Colors.black)
//                         : const Text(
//                           'Submit Maintenance Request',
//                           style: TextStyle(
//                             fontSize: 16,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// lib/screens/problem_report_screen.dart
import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/theme/colors.dart';
import 'package:provider/provider.dart';
import '../models/maintenance_request_model.dart';
import '../models/bin.dart';
import '../services/maintenance_service.dart';
import '../services/bin_service.dart';
import '../providers/bin_provider.dart';
import '../providers/auth_provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ProblemReportScreen extends StatefulWidget {
  final String? binId; // Keep optional for backward compatibility

  const ProblemReportScreen({super.key, this.binId});

  @override
  State<ProblemReportScreen> createState() => _ProblemReportScreenState();
}

class _ProblemReportScreenState extends State<ProblemReportScreen> {
  // Existing form fields
  final Map<String, bool> _issues = {
    'Sorting malfunction': false,
    'GPS not working': false,
    'Bin level monitoring not working': false,
    'Physical damage': false,
    'Collection missed': false,
    'Overflowing': false,
  };

  final TextEditingController _messageController = TextEditingController();
  bool _isSubmitting = false;
  String _requestType = 'REPAIR';
  String _priority = 'MEDIUM';

  // Bin selection fields
  List<Bin> _availableBins = [];
  String? _selectedBinId;
  bool _loadingBins = false;
  String _binError = '';

  final List<String> _requestTypes = [
    'REPAIR',
    'CLEANING',
    'REPLACEMENT',
    'OTHER',
  ];
  final List<String> _priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  @override
  void initState() {
    super.initState();
    _selectedBinId = widget.binId; // Use passed binId if available
    _loadAvailableBins();
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  // Load all bins for the current user
  Future<void> _loadAvailableBins() async {
    setState(() {
      _loadingBins = true;
      _binError = '';
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final token = await const FlutterSecureStorage().read(key: 'auth_token');

      if (token == null) {
        throw Exception('Authentication token not found');
      }

      final binService = BinService();
      final bins = await binService.fetchBins(
        baseURL: 'http://10.30.7.90:8080/api',
        token: token,
      );

      setState(() {
        _availableBins = bins;
        _loadingBins = false;

        // If no binId was passed and we have bins, select the first one
        if (widget.binId == null && bins.isNotEmpty) {
          _selectedBinId = bins.first.binId;
        }
      });
    } catch (e) {
      setState(() {
        _binError = 'Failed to load bins: $e';
        _loadingBins = false;
      });
    }
  }

  void _handleSubmit() async {
    final selectedIssues =
        _issues.entries
            .where((entry) => entry.value)
            .map((entry) => entry.key)
            .toList();

    final message = _messageController.text.trim();

    if (selectedIssues.isEmpty && message.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an issue or write a message.'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    if (_selectedBinId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a bin first.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      // Create description combining selected issues and message
      String description = '';
      if (selectedIssues.isNotEmpty) {
        description = 'Issues: ${selectedIssues.join(', ')}';
      }
      if (message.isNotEmpty) {
        description +=
            description.isEmpty ? message : '\n\nAdditional details: $message';
      }

      final request = MaintenanceRequest(
        binId: _selectedBinId!,
        requestType: _requestType,
        description: description,
        priority: _priority,
        selectedIssues: selectedIssues,
      );

      final success = await MaintenanceService.submitMaintenanceRequest(
        request,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Maintenance request submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );

        // Clear form
        setState(() {
          _issues.updateAll((key, value) => false);
          _messageController.clear();
          _requestType = 'REPAIR';
          _priority = 'MEDIUM';
        });

        Navigator.pushReplacementNamed(context, '/maintenance-requests');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      // appBar: AppBar(
      //   title: const Text('Report Maintenance Issue'),
      //   backgroundColor: AppColors.primary,
      //   foregroundColor: Colors.white,
      //   actions: [
      //     IconButton(
      //       icon: const Icon(Icons.refresh),
      //       onPressed: _loadAvailableBins,
      //       tooltip: 'Refresh bins',
      //     ),
      //   ],
      // ),
      body: SafeArea(
        // ✅ Add SafeArea to prevent overflow
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16), // ✅ Reduced padding
          child: ConstrainedBox(
            // ✅ Add constraints
            constraints: BoxConstraints(
              minHeight:
                  MediaQuery.of(context).size.height - kToolbarHeight - 32,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Bin Selection Section
                _buildBinSelectionSection(),
                const SizedBox(height: 16), // ✅ Reduced spacing
                // Only show form if a bin is selected
                if (_selectedBinId != null) ...[
                  // Request Type Dropdown
                  _buildRequestTypeSection(),
                  const SizedBox(height: 16), // ✅ Reduced spacing
                  // Priority Dropdown
                  _buildPrioritySection(),
                  const SizedBox(height: 16), // ✅ Reduced spacing
                  // Issues Checkboxes
                  _buildIssuesSection(),
                  const SizedBox(height: 16), // ✅ Reduced spacing
                  // Description Field
                  _buildDescriptionSection(),
                  const SizedBox(height: 20), // ✅ Reduced spacing
                  // Submit Button
                  _buildSubmitButton(),
                  const SizedBox(height: 16), // ✅ Add bottom spacing
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBinSelectionSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _selectedBinId != null ? Colors.green : Colors.orange,
          width: 2,
        ),
      ),
      child: IntrinsicHeight(
        // ✅ Add this to fix layout constraints
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Icon(
                  Icons.delete,
                  color: _selectedBinId != null ? Colors.green : Colors.orange,
                ),
                const SizedBox(width: 12),
                const Text(
                  'Select Bin',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (_loadingBins) ...[
                  const SizedBox(width: 12),
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),

            if (_binError.isNotEmpty) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error, color: Colors.red, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _binError,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],

            if (_availableBins.isNotEmpty) ...[
              // ✅ Use proper constraints without SizedBox
              DropdownButtonFormField<String>(
                value: _selectedBinId,
                dropdownColor: Colors.grey[800],
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Choose a bin to report issues for',
                  hintStyle: const TextStyle(color: Colors.white60),
                  filled: true,
                  fillColor: Colors.grey[800],
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 16,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
                items:
                    _availableBins.map((bin) {
                      return DropdownMenuItem<String>(
                        value: bin.binId,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              Container(
                                width: 12,
                                height: 12,
                                decoration: BoxDecoration(
                                  color: _getBinStatusColor(bin),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Bin ${bin.binId}',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    'Status: ${_getBinStatusText(bin)}',
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedBinId = value;
                  });
                },
              ),
            ] else if (!_loadingBins && _binError.isEmpty) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info, color: Colors.orange, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'No bins available. Please add a bin first.',
                      style: TextStyle(color: Colors.white70),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getBinStatusColor(Bin bin) {
    final maxLevel = [
      bin.plasticLevel,
      bin.paperLevel,
      bin.glassLevel,
    ].reduce((a, b) => a > b ? a : b);
    if (maxLevel >= 90) return Colors.red;
    if (maxLevel >= 70) return Colors.orange;
    if (maxLevel >= 50) return Colors.yellow;
    return Colors.green;
  }

  String _getBinStatusText(Bin bin) {
    final maxLevel = [
      bin.plasticLevel,
      bin.paperLevel,
      bin.glassLevel,
    ].reduce((a, b) => a > b ? a : b);
    if (maxLevel >= 90) return 'Almost Full';
    if (maxLevel >= 70) return 'Getting Full';
    if (maxLevel >= 50) return 'Half Full';
    return 'Good';
  }

  Widget _buildRequestTypeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Request Type:',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          value: _requestType,
          dropdownColor: Colors.grey[850],
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey[850],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
          items:
              _requestTypes
                  .map(
                    (type) => DropdownMenuItem(value: type, child: Text(type)),
                  )
                  .toList(),
          onChanged: (value) => setState(() => _requestType = value!),
        ),
      ],
    );
  }

  Widget _buildPrioritySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Priority:',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          value: _priority,
          dropdownColor: Colors.grey[850],
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey[850],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
          items:
              _priorities
                  .map(
                    (priority) => DropdownMenuItem(
                      value: priority,
                      child: Text(priority),
                    ),
                  )
                  .toList(),
          onChanged: (value) => setState(() => _priority = value!),
        ),
      ],
    );
  }

  Widget _buildIssuesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select issues with your bin:',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: Colors.grey[850],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children:
                _issues.entries.map((entry) {
                  return CheckboxListTile(
                    title: Text(
                      entry.key,
                      style: const TextStyle(color: Colors.white),
                    ),
                    value: entry.value,
                    onChanged: (bool? value) {
                      setState(() {
                        _issues[entry.key] = value ?? false;
                      });
                    },
                    activeColor: Colors.green,
                    checkColor: Colors.black,
                    controlAffinity: ListTileControlAffinity.leading,
                  );
                }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDescriptionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Additional details:',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _messageController,
          maxLines: 4,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText:
                'Describe any other issue or provide additional details...',
            hintStyle: const TextStyle(color: Colors.white60),
            filled: true,
            fillColor: Colors.grey[850],
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _isSubmitting ? null : _handleSubmit,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          backgroundColor: Colors.green,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child:
            _isSubmitting
                ? const CircularProgressIndicator(color: Colors.black)
                : const Text(
                  'Submit Maintenance Request',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
      ),
    );
  }
}
