// lib/models/maintenance_request_model.dart
class MaintenanceRequest {
  final String? id;
  final String binId;
  final String requestType;
  final String description;
  final String priority;
  final String? status;
  final DateTime? createdAt;
  final List<String>? selectedIssues; // Add this for your checkbox issues

  MaintenanceRequest({
    this.id,
    required this.binId,
    required this.requestType,
    required this.description,
    required this.priority,
    this.status,
    this.createdAt,
    this.selectedIssues,
  });

  factory MaintenanceRequest.fromJson(Map<String, dynamic> json) {
    return MaintenanceRequest(
      id: json['id'],
      binId: json['binId'],
      requestType: json['requestType'],
      description: json['description'],
      priority: json['priority'],
      status: json['status'],
      createdAt:
          json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      selectedIssues:
          json['selectedIssues'] != null
              ? List<String>.from(json['selectedIssues'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'binId': binId,
      'requestType': requestType,
      'description': description,
      'priority': priority,
      if (selectedIssues != null) 'selectedIssues': selectedIssues,
    };
  }
}
